import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import api from '@/lib/api';
import { useAuthStore } from './UserContext';

// Types
export interface TimeSheet {
  id: string;
  employee: string;
  employee_name: string;
  employee_image: string | null;
  date: string;
  clock_in: string;
  clock_out: string | null;
  break_start: string | null;
  break_end: string | null;
  status: 'IN' | 'OUT' | 'IN BREAK';
  last_modified: string;
  note: string;
}

interface EmployeeStatusResponse {
  IN: number;
  'IN BREAK': number;
  OUT: number;
  TOTAL: number;
  RECENT: TimeSheet[];
  ABSENT: number;
}

interface TodayTimeSheetResponse {
  time_sheet: TimeSheet | null;
  states: {
    clock_in: 'DONE' | 'UNSOLVED';
    break: 'DONE' | 'UNSOLVED';
    clock_out: 'DONE' | 'UNSOLVED';
  };
}

interface TimeSheetsListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: TimeSheet[];
}

interface TimeSheetFilters {
  start_date?: string;
  end_date?: string;
  employee_id?: string;
}

interface TimeSheetsState {
  timeSheets: TimeSheet[];
  todayTimeSheet: TodayTimeSheetResponse | null;
  employeesStatus: EmployeeStatusResponse | null;
  allUsersTimeSheets: TimeSheetsListResponse | null;
  loading: boolean;
  error: string | null;
  initialized: boolean;

  clockIn: (note?: string) => Promise<TimeSheet | null>;
  startBreak: (note?: string) => Promise<TimeSheet | null>;
  endBreak: (note?: string) => Promise<TimeSheet | null>;
  clockOut: (note?: string) => Promise<TimeSheet | null>;
  fetchTodayTimeSheet: () => Promise<TodayTimeSheetResponse | null>;
  fetchUserTimeSheets: (filters?: TimeSheetFilters) => Promise<TimeSheet[]>;
  fetchAllUsersTodayTimeSheets: () => Promise<TimeSheet[]>;
  fetchAllUsersTimeSheets: (filters?: Omit<TimeSheetFilters, 'employee_id'>) => Promise<TimeSheetsListResponse | null>;
  fetchDayTimeSheet: (date: string) => Promise<TimeSheet | null>;
  fetchEmployeesStatus: () => Promise<EmployeeStatusResponse | null>;
  deleteTimeSheet: (id: string) => Promise<boolean>;
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
  reset: () => void;
}

// Helper function to extract error message with detailed logging
const extractError = (error: any): string => {
  if (!error) return 'An unknown error occurred';

  console.error('[TimeSheetsContext] Error details:', {
    message: error.message,
    status: error.response?.status,
    statusText: error.response?.statusText,
    data: error.response?.data,
    config: {
      url: error.config?.url,
      method: error.config?.method,
      data: error.config?.data,
    }
  });

  if (error.response?.data?.detail) {
    return error.response.data.detail;
  }
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.response?.data) {
    return typeof error.response.data === 'string'
      ? error.response.data
      : JSON.stringify(error.response.data);
  }
  if (error.message) {
    return error.message;
  }
  return 'An error occurred with your request';
};

// Create the store
const useTimeSheetsStore = create<TimeSheetsState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        timeSheets: [],
        todayTimeSheet: null,
        employeesStatus: null,
        allUsersTimeSheets: null,
        loading: false,
        error: null,
        initialized: false,

        // Utility methods
        setError: (error) => set({ error }),
        setLoading: (loading) => set({ loading }),
        reset: () => {
          console.log('[TimeSheetsContext] Resetting store state');
          return set({
            timeSheets: [],
            todayTimeSheet: null,
            employeesStatus: null,
            allUsersTimeSheets: null,
            loading: false,
            error: null,
            initialized: false,
          });
        },

        // Time Tracking Actions
        clockIn: async (note = '') => {
          const token = useAuthStore.getState().user?.token;
          if (!token) {
            const errorMsg = 'No authentication token found';
            set({ error: errorMsg, loading: false });
            return null;
          }

          set({ loading: true, error: null });
          try {
            const response = await api.post<TimeSheet>('/time_sheets/clock_in/', { note }, {
              headers: { Authorization: `Bearer ${token}` },
            });
            const data = response.data;
            set((state) => ({
              timeSheets: [data, ...state.timeSheets],
              todayTimeSheet: { time_sheet: data, states: { clock_in: 'DONE', break: 'UNSOLVED', clock_out: 'UNSOLVED' } },
            }));
            return data;
          } catch (err) {
            const errorMessage = extractError(err);
            set({ error: errorMessage });
            return null;
          } finally {
            set({ loading: false });
          }
        },

        startBreak: async (note = '') => {
          const token = useAuthStore.getState().user?.token;
          if (!token) {
            const errorMsg = 'No authentication token found';
            set({ error: errorMsg, loading: false });
            return null;
          }

          set({ loading: true, error: null });
          try {
            const { data } = await api.post<TimeSheet>('/time_sheets/start_break/', { note }, {
              headers: { Authorization: `Bearer ${token}` },
            });
            set((state) => ({
              timeSheets: state.timeSheets.map((ts) => (ts.id === data.id ? data : ts)),
              todayTimeSheet: { time_sheet: data, states: { ...state.todayTimeSheet?.states, break: 'DONE' } },
            }));
            return data;
          } catch (err) {
            const errorMessage = extractError(err);
            set({ error: errorMessage });
            return null;
          } finally {
            set({ loading: false });
          }
        },

        endBreak: async (note = '') => {
          const token = useAuthStore.getState().user?.token;
          if (!token) {
            const errorMsg = 'No authentication token found';
            set({ error: errorMsg, loading: false });
            return null;
          }

          set({ loading: true, error: null });
          try {
            const { data } = await api.post<TimeSheet>('/time_sheets/end_break/', { note }, {
              headers: { Authorization: `Bearer ${token}` },
            });
            set((state) => ({
              timeSheets: state.timeSheets.map((ts) => (ts.id === data.id ? data : ts)),
              todayTimeSheet: { time_sheet: data, states: { ...state.todayTimeSheet?.states, break: 'DONE' } },
            }));
            return data;
          } catch (err) {
            const errorMessage = extractError(err);
            set({ error: errorMessage });
            return null;
          } finally {
            set({ loading: false });
          }
        },

        clockOut: async (note = '') => {
          const token = useAuthStore.getState().user?.token;
          if (!token) {
            const errorMsg = 'No authentication token found';
            set({ error: errorMsg, loading: false });
            return null;
          }

          set({ loading: true, error: null });
          try {
            const { data } = await api.post<TimeSheet>('/time_sheets/clock_out/', { note }, {
              headers: { Authorization: `Bearer ${token}` },
            });
            set((state) => ({
              timeSheets: state.timeSheets.map((ts) => (ts.id === data.id ? data : ts)),
              todayTimeSheet: { time_sheet: data, states: { ...state.todayTimeSheet?.states, clock_out: 'DONE' } },
            }));
            return data;
          } catch (err) {
            const errorMessage = extractError(err);
            set({ error: errorMessage });
            return null;
          } finally {
            set({ loading: false });
          }
        },

        // TimeSheet Queries
        fetchTodayTimeSheet: async () => {
          const token = useAuthStore.getState().user?.token;
          if (!token) {
            const errorMsg = 'No authentication token found';
            set({ error: errorMsg, loading: false });
            return null;
          }

          set({ loading: true, error: null });
          try {
            const response = await api.get<TodayTimeSheetResponse>('/time_sheets/get_today_time_sheet/', {
              headers: { Authorization: `Bearer ${token}` },
            });

            set({ todayTimeSheet: response.data });
            return response.data;
          } catch (err: any) {
            if (err.response?.status === 404) {
              set({ todayTimeSheet: null });
              return null;
            }
            const errorMessage = extractError(err);
            set({ error: errorMessage });
            return null;
          } finally {
            set({ loading: false });
          }
        },

        fetchUserTimeSheets: async (filters: TimeSheetFilters = {}) => {
          console.log('[TimeSheetsContext] fetchUserTimeSheets called with filters:', filters);
          const token = useAuthStore.getState().user?.token;
          if (!token) {
            const errorMsg = 'No authentication token found';
            console.error('[TimeSheetsContext]', errorMsg);
            set({ error: errorMsg, loading: false });
            return [];
          }

          set({ loading: true, error: null });
          try {
            console.log('[TimeSheetsContext] Fetching user timesheets from API...');
            const response = await api.get<TimeSheet[]>('/time_sheets/get_user_time_sheets/', {
              params: filters,
              headers: { Authorization: `Bearer ${token}` },
            });
            // The API returns the array directly, not wrapped in a results object
            const data = Array.isArray(response.data) ? response.data : [];
            console.log('[TimeSheetsContext] User timesheets response:', {
              status: response.status,
              count: data.length,
              sample: data[0] || 'No data'
            });
            set({ timeSheets: data });
            return data;
          } catch (err) {
            const errorMessage = extractError(err);
            set({ error: errorMessage });
            return [];
          } finally {
            set({ loading: false });
          }
        },

        fetchAllUsersTodayTimeSheets: async () => {
          const token = useAuthStore.getState().user?.token;
          if (!token) {
            const errorMsg = 'No authentication token found';
            set({ error: errorMsg, loading: false });
            return [];
          }

          set({ loading: true, error: null });
          try {
            const response = await api.get<TimeSheet[]>('/time_sheets/get_all_users_today_time_sheets/', {
              headers: { Authorization: `Bearer ${token}` },
            });
            // The API returns the array directly, not wrapped in a results object
            const data = Array.isArray(response.data) ? response.data : [];
            console.log('Fetched today\'s timesheets:', data);
            return data;
          } catch (err) {
            const errorMessage = extractError(err);
            console.error('Error fetching today\'s timesheets:', errorMessage);
            set({ error: errorMessage });
            return [];
          } finally {
            set({ loading: false });
          }
        },

        fetchAllUsersTimeSheets: async (filters: Omit<TimeSheetFilters, 'employee_id'> = {}) => {
          const token = useAuthStore.getState().user?.token;
          if (!token) {
            const errorMsg = 'No authentication token found';
            set({ error: errorMsg, loading: false });
            return null;
          }

          set({ loading: true, error: null });
          try {
            const response = await api.get<TimeSheetsListResponse>('/time_sheets/get_all_users_time_sheets/', {
              params: filters,
              headers: { Authorization: `Bearer ${token}` },
            });
            const data = response.data;
            set({ allUsersTimeSheets: data });
            return data;
          } catch (err) {
            const errorMessage = extractError(err);
            set({ error: errorMessage });
            return null;
          } finally {
            set({ loading: false });
          }
        },

        fetchDayTimeSheet: async (date: string) => {
          const token = useAuthStore.getState().user?.token;
          if (!token) {
            const errorMsg = 'No authentication token found';
            set({ error: errorMsg, loading: false });
            return null;
          }

          set({ loading: true, error: null });
          try {
            const response = await api.get<TimeSheet>(`/time_sheets/get_day_time_sheet/${date}/`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            return response.data;
          } catch (err: any) {
            if (err.response?.status === 404) {
              return null;
            }
            const errorMessage = extractError(err);
            set({ error: errorMessage });
            return null;
          } finally {
            set({ loading: false });
          }
        },

        fetchEmployeesStatus: async () => {
          const token = useAuthStore.getState().user?.token;
          if (!token) {
            const errorMsg = 'No authentication token found';
            set({ error: errorMsg, loading: false });
            return null;
          }

          set({ loading: true, error: null });
          try {
            const response = await api.get<EmployeeStatusResponse>('/time_sheets/get_employees_status/', {
              headers: { Authorization: `Bearer ${token}` },
            });
            const data = response.data;
            set({ employeesStatus: data });
            return data;
          } catch (err) {
            const errorMessage = extractError(err);
            set({ error: errorMessage });
            return null;
          } finally {
            set({ loading: false });
          }
        },

        deleteTimeSheet: async (id: string) => {
          const token = useAuthStore.getState().user?.token;
          if (!token) {
            const errorMsg = 'No authentication token found';
            set({ error: errorMsg, loading: false });
            return false;
          }

          set({ loading: true, error: null });
          try {
            await api.delete(`/time_sheets/delete_time_sheet/${id}/`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            set((state) => ({
              timeSheets: state.timeSheets.filter((ts) => ts.id !== id),
              todayTimeSheet: state.todayTimeSheet?.time_sheet?.id === id ? null : state.todayTimeSheet,
            }));
            return true;
          } catch (err) {
            const errorMessage = extractError(err);
            set({ error: errorMessage });
            return false;
          } finally {
            set({ loading: false });
          }
        },


      }),
      {
        name: 'timesheets-storage',
        partialize: (state) => ({
          todayTimeSheet: state.todayTimeSheet,
          timeSheets: state.timeSheets,
          employeesStatus: state.employeesStatus,
        }),
      }
    )
  )
);

// Custom hook to access the store
export const useTimeSheets = () => {
  return useTimeSheetsStore();
};