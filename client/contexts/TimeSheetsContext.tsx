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
  hours_worked: string;
  note: string | null;
  last_modified: string;
}

interface TimeSheetsState {
  // State
  timeSheets: TimeSheet[];
  todayTimeSheet: TimeSheet | null;
  employeesStatus: any[];
  loading: boolean;
  error: string | null;
  initialized: boolean;
  
  // Actions
  fetchTodayTimeSheet: () => Promise<TimeSheet | null>;
  fetchUserTimeSheets: () => Promise<TimeSheet[]>;
  fetchEmployeesStatus: () => Promise<any[]>;
  createTimeSheet: (data: Partial<TimeSheet>) => Promise<TimeSheet | null>;
  updateTimeSheet: (id: string, data: Partial<TimeSheet>) => Promise<TimeSheet | null>;
  deleteTimeSheet: (id: string) => Promise<boolean>;
  reset: () => void;
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
}

// Helper function to extract error message from API response
const extractError = (error: any): string => {
  if (!error?.response?.data) return error.message || 'An unknown error occurred';
  
  const { data } = error.response;
  if (data.detail) return data.detail;
  if (data.non_field_errors) return data.non_field_errors[0];
  return 'An error occurred with your request';
};

// Create the store with devtools and persistence
const useTimeSheetsStore = create<TimeSheetsState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        timeSheets: [],
        todayTimeSheet: null,
        employeesStatus: [],
        loading: false,
        error: null,
        initialized: false,

        // Actions
        fetchTodayTimeSheet: async () => {
          const token = useAuthStore.getState().user?.token;
          if (!token) {
            console.log('[TimeSheetsContext] No token available, skipping fetchTodayTimeSheet');
            return null;
          }

          console.log('[TimeSheetsContext] Fetching today timesheet');
          set({ loading: true, error: null });
          
          try {
            const { data } = await api.get('/time_sheets/get_today_time_sheet/');
            set({ todayTimeSheet: data });
            return data;
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

        fetchUserTimeSheets: async () => {
          const token = useAuthStore.getState().user?.token;
          if (!token) return [];

          set({ loading: true, error: null });
          
          try {
            const { data } = await api.get('/time_sheets/get_user_time_sheets/');
            set({ 
              timeSheets: data,
              initialized: true 
            });
            return data;
          } catch (err) {
            const errorMessage = extractError(err);
            set({ error: errorMessage });
            return [];
          } finally {
            set({ loading: false });
          }
        },

        fetchEmployeesStatus: async () => {
          const token = useAuthStore.getState().user?.token;
          if (!token) return [];

          set({ loading: true, error: null });
          
          try {
            const { data } = await api.get('/time_sheets/get_employees_status/');
            set({ employeesStatus: data });
            return data;
          } catch (err) {
            const errorMessage = extractError(err);
            set({ error: errorMessage });
            return [];
          } finally {
            set({ loading: false });
          }
        },

        fetchAllTimeSheets: async (startDate, endDate) => {
          const token = useAuthStore.getState().user?.token;
          if (!token) {
            console.log('[TimeSheetsContext] No token available, skipping fetchAllTimeSheets');
            return [];
          }

          console.log(`[TimeSheetsContext] Fetching all timesheets from ${startDate} to ${endDate}`);
          set({ loading: true, error: null });
          
          try {
            const { data } = await api.get('/time_sheets/get_user_time_sheets/');
            set({ 
              timeSheets: data,
              initialized: true 
            });
            return data;
          } catch (err) {
            const errorMessage = extractError(err);
            set({ error: errorMessage });
            return [];
          } finally {
            set({ loading: false });
          }
        },

        createTimeSheet: async (timeSheetData) => {
          const token = useAuthStore.getState().user?.token;
          if (!token) {
            console.log('[TimeSheetsContext] No token available, skipping createTimeSheet');
            return null;
          }

          console.log('[TimeSheetsContext] Creating new timesheet');
          set({ loading: true, error: null });
          
          try {
            const { data } = await api.post('/time_sheets/create_time_sheet/', timeSheetData);
            set((state) => ({
              timeSheets: [...state.timeSheets, data],
              todayTimeSheet: data,
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

        updateTimeSheet: async (id, timeSheetData) => {
          const token = useAuthStore.getState().user?.token;
          if (!token) {
            console.log('[TimeSheetsContext] No token available, skipping updateTimeSheet');
            return null;
          }

          console.log(`[TimeSheetsContext] Updating timesheet ${id}`);
          set({ loading: true, error: null });
          
          try {
            const { data } = await api.put(`/time_sheets/update_time_sheet/${id}/`, timeSheetData);
            set((state) => ({
              timeSheets: state.timeSheets.map((ts) => (ts.id === id ? data : ts)),
              todayTimeSheet: state.todayTimeSheet?.id === id ? data : state.todayTimeSheet,
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

        deleteTimeSheet: async (id) => {
          const token = useAuthStore.getState().user?.token;
          if (!token) {
            console.log('[TimeSheetsContext] No token available, skipping deleteTimeSheet');
            return false;
          }

          console.log(`[TimeSheetsContext] Deleting timesheet ${id}`);
          set({ loading: true, error: null });
          
          try {
            await api.delete(`/time_sheets/delete_time_sheet/${id}/`);
            set((state) => ({
              timeSheets: state.timeSheets.filter((ts) => ts.id !== id),
              todayTimeSheet: state.todayTimeSheet?.id === id ? null : state.todayTimeSheet,
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

        setError: (error) => set({ error }),
        setLoading: (loading) => set({ loading }),
        
        reset: () => {
          set({
            timeSheets: [],
            todayTimeSheet: null,
            employeesStatus: [],
            loading: false,
            error: null,
            initialized: false,
          });
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

// Export the store and hook
export { useTimeSheetsStore };

export const useTimeSheets = () => {
  return useTimeSheetsStore();
};
