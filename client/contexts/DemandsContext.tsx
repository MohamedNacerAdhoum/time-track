import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import api from '@/lib/api';
import { useAuthStore } from './UserContext';

// Types
export interface EmployeeData {
  id: string;
  user: string; // User ID
  name: string;
  email: string;
  role_name: string;
  imageUrl: string | null;
}

export interface DemandResponse {
  id: string;
  employee: EmployeeData;
  body: string;
  attachment_url: string | null;
  responded_at: string;
  demand: string; // Demand ID
}

export interface DemandAttachment {
  id: string;
  file: string;
  name: string;
  uploaded_at: string;
}

export interface DemandData {
  id: string;
  subject: string;
  body: string;
  created_at: string;
  state: 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED' | 'CANCELLED';
  demand_type: 'STANDARD' | 'LEAVE' | 'PERMISSION' | string;
  sender: EmployeeData;
  receivers: EmployeeData[];
  leave_demand: {
    id: string;
    leave_type: 'MULTIDAY' | 'SINGLEDAY';
    start_date?: string;
    end_date?: string;
    date?: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
  } | null;
  permission_demand: {
    id: string;
    date: string;
    start_time: string;
    end_time: string;
    reason: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
  } | null;
  response: DemandResponse | null;
  attachment: DemandAttachment | null;
}

interface CreateDemandPayload {
  demand_type: 'LEAVE' | 'PERMISSION';
  subject: string;
  body: string;
  attachment?: {
    file: string;
    name: string;
  };
  receivers?: string[];
  leave_demand?: {
    leave_type: 'MULTIDAY' | 'SINGLEDAY';
    multiday?: {
      start_date: string;
      end_date: string;
    };
    singleday?: {
      date: string;
    };
  };
  permission_demand?: {
    date: string;
    start_time: string;
    end_time: string;
    reason: string;
  };
}

interface CreateDemandResponsePayload {
  demand_id: string;
  body: string;
}

interface DemandsState {
  // State
  demands: DemandData[];
  userDemands: DemandData[];
  currentDemand: DemandData | null;
  loading: boolean;
  error: string | null;
  initialized: boolean;

  // Actions - API Calls
  fetchAllDemands: () => Promise<DemandData[]>;
  fetchUserDemands: (userId?: string) => Promise<DemandData[]>;
  fetchDemand: (demandId: string) => Promise<DemandData | null>;
  fetchDemandSilently: (demandId: string) => Promise<DemandData | null>;
  createDemand: (demandData: CreateDemandPayload) => Promise<DemandData | null>;
  createDemandResponse: (payload: CreateDemandResponsePayload) => Promise<boolean>;
  deleteDemands: (demandIds: string[]) => Promise<boolean>;
  getDemandResponse: (responseId: string) => Promise<DemandResponse | null>;
  approveDemand: (demandId: string) => Promise<boolean>;
  rejectDemand: (demandId: string) => Promise<boolean>;

  // State Setters
  setDemands: (demands: DemandData[]) => void;
  setUserDemands: (demands: DemandData[]) => void;
  setCurrentDemand: (demand: DemandData | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

// Helper function to extract error message from API response
const extractError = (error: any): string => {
  if (!error) return 'No error object provided';
  console.error('[DemandsContext] Extracting error from:', error);

  if (!error.response) {
    return error.message || 'Network error: Could not connect to the server';
  }

  const { status, data } = error.response;

  if (data) {
    if (data.detail) return data.detail;
    if (data.non_field_errors) return Array.isArray(data.non_field_errors) ? data.non_field_errors[0] : data.non_field_errors;
    if (typeof data === 'string') return data;
    return JSON.stringify(data);
  }

  // Fallback status-based messages
  if (status === 401) return 'Unauthorized: Please log in again';
  if (status === 403) return 'Forbidden: You do not have permission to perform this action';
  if (status === 404) return 'Demand not found';
  if (status >= 500) return `Server error (${status}): Please try again later`;

  return `Request failed with status ${status}`;
};

// Create the store with devtools and persistence
export const useDemandsStore = create<DemandsState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        demands: [],
        userDemands: [],
        currentDemand: null,
        loading: false,
        error: null,
        initialized: false,

        // Actions
        fetchAllDemands: async () => {
          const token = useAuthStore.getState().user?.token;
          if (!token) {
            console.log('[DemandsContext] No token available, skipping fetchAllDemands');
            return [];
          }

          set({ loading: true, error: null });

          try {
            const response = await api.get('/demands/get_all_demands/');
            const demands = response.data || [];
            set({ demands, initialized: true });
            return demands;
          } catch (error: any) {
            console.error('[DemandsContext] Error fetching all demands:', error);
            const errorMessage = extractError(error);
            set({ error: errorMessage });
            return [];
          } finally {
            set({ loading: false });
          }
        },

        fetchUserDemands: async (userId) => {
          const token = useAuthStore.getState().user?.token;
          if (!token) {
            console.log('[DemandsContext] No token available, skipping fetchUserDemands');
            return [];
          }

          set({ loading: true, error: null });

          try {
            const response = await api.get('/demands/get_all_user_demands/');
            const userDemands = response.data || [];
            set({ userDemands, initialized: true });
            return userDemands;
          } catch (error: any) {
            console.error('[DemandsContext] Error fetching user demands:', error);
            const errorMessage = extractError(error);
            set({ error: errorMessage });
            return [];
          } finally {
            set({ loading: false });
          }
        },

        fetchDemand: async (demandId) => {
          const token = useAuthStore.getState().user?.token;
          if (!token) {
            console.log('[DemandsContext] No token available, skipping fetchDemand');
            return null;
          }

          set({ loading: true, error: null });

          try {
            const response = await api.get(`/demands/get_demand/${demandId}/`);
            const demand = response.data;
            set({ currentDemand: demand, initialized: true });
            return demand;
          } catch (error: any) {
            console.error(`[DemandsContext] Error fetching demand ${demandId}:`, error);
            const errorMessage = extractError(error);
            set({ error: errorMessage });
            return null;
          } finally {
            set({ loading: false });
          }
        },

        fetchDemandSilently: async (demandId) => {
          const token = useAuthStore.getState().user?.token;
          if (!token) {
            console.log('[DemandsContext] No token available, skipping fetchDemandSilently');
            return null;
          }

          try {
            const response = await api.get(`/demands/get_demand/${demandId}/`);
            const demand = response.data;
            // Update currentDemand without triggering loading state
            set(state => ({ currentDemand: demand, initialized: true }));
            return demand;
          } catch (error: any) {
            console.error(`[DemandsContext] Error silently fetching demand ${demandId}:`, error);
            return null;
          }
        },

        createDemand: async (demandData) => {
          const token = useAuthStore.getState().user?.token;
          if (!token) {
            console.log('[DemandsContext] No token available, cannot create demand');
            return null;
          }

          set({ loading: true, error: null });

          try {
            const response = await api.post('/demands/make_demand/', demandData);
            const newDemand = response.data;

            // Update user demands list
            const { userDemands } = get();
            set({ userDemands: [newDemand, ...userDemands] });

            return newDemand;
          } catch (error: any) {
            console.error('[DemandsContext] Error creating demand:', error);
            const errorMessage = extractError(error);
            set({ error: errorMessage });
            return null;
          } finally {
            set({ loading: false });
          }
        },

        createDemandResponse: async ({ demand_id, body }) => {
          const token = useAuthStore.getState().user?.token;
          if (!token) {
            console.log('[DemandsContext] No token available, cannot create demand response');
            return false;
          }

          set({ loading: true, error: null });

          try {
            await api.post('/demands/make_demand_response/', { demand_id, body });

            // Refresh the current demand to get the response
            await get().fetchDemand(demand_id);

            return true;
          } catch (error: any) {
            console.error('[DemandsContext] Error creating demand response:', error);
            const errorMessage = extractError(error);
            set({ error: errorMessage });
            return false;
          } finally {
            set({ loading: false });
          }
        },

        getDemandResponse: async (responseId: string) => {
          const token = useAuthStore.getState().user?.token;
          if (!token) {
            console.log('[DemandsContext] No token available, cannot fetch demand response');
            return null;
          }

          set({ loading: true, error: null });

          try {
            const response = await api.get(`/demands/get_demand_response/${responseId}/`);
            return response.data;
          } catch (error: any) {
            console.error('[DemandsContext] Error fetching demand response:', error);
            const errorMessage = extractError(error);
            set({ error: errorMessage });
            return null;
          } finally {
            set({ loading: false });
          }
        },

        deleteDemands: async (demandIds) => {
          const token = useAuthStore.getState().user?.token;
          if (!token) {
            console.log('[DemandsContext] No token available, cannot delete demands');
            return false;
          }

          set({ loading: true, error: null });

          try {
            await api.delete('/demands/delete_demands/', { data: { demand_ids: demandIds } });

            // Update state to remove deleted demands
            const { demands, userDemands } = get();
            const demandIdsSet = new Set(demandIds);

            set({
              demands: demands.filter(d => !demandIdsSet.has(d.id)),
              userDemands: userDemands.filter(d => !demandIdsSet.has(d.id)),
              currentDemand: null
            });

            return true;
          } catch (error: any) {
            console.error('[DemandsContext] Error deleting demands:', error);
            const errorMessage = extractError(error);
            set({ error: errorMessage });
            return false;
          } finally {
            set({ loading: false });
          }
        },

        approveDemand: async (demandId) => {
          const token = useAuthStore.getState().user?.token;
          if (!token) {
            console.log('[DemandsContext] No token available, cannot approve demand');
            return false;
          }

          set({ loading: true, error: null });

          try {
            await api.post('/demands/approve_demand/', { demand_id: demandId });

            // Update the demand status in the state
            const { demands, userDemands, currentDemand } = get();
            const updateStatus = (d: DemandData): DemandData =>
              d.id === demandId ? { ...d, state: 'APPROVED' as const } : d;

            set({
              demands: demands.map(updateStatus) as DemandData[],
              userDemands: userDemands.map(updateStatus) as DemandData[],
              currentDemand: currentDemand?.id === demandId
                ? { ...currentDemand, state: 'APPROVED' as const }
                : currentDemand
            });

            return true;
          } catch (error: any) {
            console.error(`[DemandsContext] Error approving demand ${demandId}:`, error);
            const errorMessage = extractError(error);
            set({ error: errorMessage });
            return false;
          } finally {
            set({ loading: false });
          }
        },

        rejectDemand: async (demandId) => {
          const token = useAuthStore.getState().user?.token;
          if (!token) {
            console.log('[DemandsContext] No token available, cannot reject demand');
            return false;
          }

          set({ loading: true, error: null });

          try {
            await api.post('/demands/reject_demand/', { demand_id: demandId });

            // Update the demand status in the state
            const { demands, userDemands, currentDemand } = get();
            const updateStatus = (d: DemandData): DemandData =>
              d.id === demandId ? { ...d, state: 'REJECTED' as const } : d;

            set({
              demands: demands.map(updateStatus) as DemandData[],
              userDemands: userDemands.map(updateStatus) as DemandData[],
              currentDemand: currentDemand?.id === demandId
                ? { ...currentDemand, state: 'REJECTED' as const }
                : currentDemand
            });

            return true;
          } catch (error: any) {
            console.error(`[DemandsContext] Error rejecting demand ${demandId}:`, error);
            const errorMessage = extractError(error);
            set({ error: errorMessage });
            return false;
          } finally {
            set({ loading: false });
          }
        },

        // State Setters
        setDemands: (demands) => set({ demands }),
        setUserDemands: (userDemands) => set({ userDemands }),
        setCurrentDemand: (currentDemand) => set({ currentDemand }),
        setLoading: (loading) => set({ loading }),
        setError: (error) => set({ error }),

        // Reset state
        reset: () => {
          set({
            demands: [],
            userDemands: [],
            currentDemand: null,
            loading: false,
            error: null,
            initialized: false,
          });
        },
      }),
      {
        name: 'demands-storage',
        partialize: (state) => ({
          demands: state.demands,
          userDemands: state.userDemands,
          currentDemand: state.currentDemand,
        }),
      }
    )
  )
);

// Hook for component usage
export const useDemands = () => {
  const store = useDemandsStore();
  return {
    // State
    demands: store.demands,
    userDemands: store.userDemands,
    currentDemand: store.currentDemand,
    loading: store.loading,
    error: store.error,
    initialized: store.initialized,

    // API Calls
    fetchAllDemands: store.fetchAllDemands,
    fetchUserDemands: store.fetchUserDemands,
    fetchDemand: store.fetchDemand,
    fetchDemandSilently: store.fetchDemandSilently,
    createDemand: store.createDemand,
    createDemandResponse: store.createDemandResponse,
    getDemandResponse: store.getDemandResponse,
    deleteDemands: store.deleteDemands,
    approveDemand: store.approveDemand,
    rejectDemand: store.rejectDemand,

    // State Setters
    setDemands: store.setDemands,
    setUserDemands: store.setUserDemands,
    setCurrentDemand: store.setCurrentDemand,
    setLoading: store.setLoading,
    setError: store.setError,
  };
};

export default useDemands;
