import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import api from '@/lib/api';
import { useAuthStore } from './UserContext';

// Types
export interface MemberData {
  id: string;
  name: string;
  email: string;
  imageUrl: string | null;
  age: number;
  role: string;
  role_name: string;
  location: string;
  experience: number;
  hours: number;
  balance: number;
  joined: string;
  status: string | null;
}

interface MembersState {
  // State
  currentUser: MemberData | null;
  members: MemberData[];
  loading: boolean;
  error: string | null;
  initialized: boolean;
  
  // Actions
  fetchCurrentUser: () => Promise<MemberData | null>;
  fetchAllMembers: () => Promise<MemberData[]>;
  setCurrentUser: (user: MemberData | null) => void;
  setMembers: (members: MemberData[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

// Helper function to extract error message from API response
const extractError = (error: any): string => {
  if (!error?.response?.data) return error.message || 'An unknown error occurred';
  
  const { data } = error.response;
  if (data.detail) return data.detail;
  if (data.non_field_errors) return data.non_field_errors[0];
  if (data.email) return data.email[0];
  if (data.password) return data.password[0];
  return 'An error occurred with your request';
};

// Create the store with devtools and persistence
export const useMembersStore = create<MembersState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        currentUser: null,
        members: [],
        loading: false,
        error: null,
        initialized: false,

        // Actions
        fetchCurrentUser: async () => {
          const token = useAuthStore.getState().user?.token;
          if (!token) {
            console.log('[MembersContext] No token available, skipping fetchCurrentUser');
            return null;
          }

          console.log('[MembersContext] Fetching current user data');
          set({ loading: true, error: null });
          
          try {
            const { data } = await api.get('/members/get_member/');
            set({ 
              currentUser: data,
              initialized: true 
            });
            return data;
          } catch (err) {
            const errorMessage = extractError(err);
            set({ error: errorMessage });
            return null;
          } finally {
            set({ loading: false });
          }
        },

        fetchAllMembers: async () => {
          const token = useAuthStore.getState().user?.token;
          if (!token) return [];

          set({ loading: true, error: null });
          
          try {
            const { data } = await api.get('/members/get_all_members/');
            set({ 
              members: data,
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

        setCurrentUser: (user) => set({ currentUser: user }),
        setMembers: (members) => set({ members }),
        setLoading: (loading) => set({ loading }),
        setError: (error) => set({ error }),
        
        reset: () => {
          set({
            currentUser: null,
            members: [],
            loading: false,
            error: null,
            initialized: false,
          });
        },
      }),
      {
        name: 'members-storage',
        partialize: (state) => ({
          currentUser: state.currentUser,
          members: state.members,
        }),
      }
    )
  )
);

// Preload current user on load
useMembersStore.getState().fetchCurrentUser();

// Hook for component usage
export const useMembers = () => {
  const store = useMembersStore();
  return {
    currentUser: store.currentUser,
    members: store.members,
    loading: store.loading,
    error: store.error,
    fetchCurrentUser: store.fetchCurrentUser,
    fetchAllMembers: store.fetchAllMembers,
    setCurrentUser: store.setCurrentUser,
    setMembers: store.setMembers,
    setLoading: store.setLoading,
    setError: store.setError,
  };
};
