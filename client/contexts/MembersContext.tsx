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
  leave_balance: string;
  payrate: string;
  currency: string;
  joined: string;
  status: string | null;
  is_admin: boolean;
  is_staff: boolean;
  is_superuser: boolean;
}

// Types for API responses
interface RoleData {
  id: string;
  name: string;
  permissions: string[];
}

interface AddMemberPayload {
  email: string;
  name: string;
  role: string;
  // Add other required fields for member creation
}

interface MembersState {
  // State
  currentUser: MemberData | null;
  members: MemberData[];
  roles: RoleData[];
  loading: boolean;
  error: string | null;
  initialized: boolean;

  // Actions - API Calls
  fetchCurrentUser: (force?: boolean) => Promise<MemberData | null>;
  fetchAllMembers: () => Promise<MemberData[]>;
  fetchAllRoles: () => Promise<RoleData[]>;
  addMember: (memberData: AddMemberPayload) => Promise<MemberData | null>;

  // State Setters
  setCurrentUser: (user: MemberData | null) => void;
  setMembers: (members: MemberData[]) => void;
  setRoles: (roles: RoleData[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

// Helper function to extract error message from API response
const extractError = (error: any): string => {
  if (!error) return 'No error object provided';

  // Log the full error for debugging
  console.error('[MembersContext] Extracting error from:', error);

  if (!error.response) {
    return error.message || 'Network error: Could not connect to the server';
  }

  const { status, data } = error.response;

  // Handle different error formats
  if (data) {
    if (data.detail) return data.detail;
    if (data.non_field_errors) return Array.isArray(data.non_field_errors) ? data.non_field_errors[0] : data.non_field_errors;
    if (data.email) return Array.isArray(data.email) ? data.email[0] : data.email;
    if (data.password) return Array.isArray(data.password) ? data.password[0] : data.password;

    // Handle validation errors
    const fieldErrors = Object.entries(data)
      .filter(([_, value]) => value && Array.isArray(value))
      .map(([key, value]) => `${key}: ${value[0]}`)
      .join('; ');

    if (fieldErrors) return fieldErrors;

    // If we have data but couldn't extract a specific message
    return typeof data === 'string' ? data : JSON.stringify(data);
  }

  // Fallback status-based messages
  if (status === 401) return 'Unauthorized: Please log in again';
  if (status === 403) return 'Forbidden: You do not have permission to perform this action';
  if (status === 404) return 'Resource not found';
  if (status >= 500) return `Server error (${status}): Please try again later`;

  return `Request failed with status ${status}`;
};

// Create the store with devtools and persistence
export const useMembersStore = create<MembersState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        currentUser: null,
        members: [],
        roles: [],
        loading: false,
        error: null,
        initialized: false,

        // Actions
        fetchCurrentUser: async (force = false) => {
          const authUser = useAuthStore.getState().user;
          if (!authUser?.token) {
            console.log('[MembersContext] No authenticated user, skipping fetchCurrentUser');
            return null;
          }

          // If we already have the current user data and it matches the auth user, return it
          const { currentUser } = get();
          if (!force && currentUser?.id === authUser.id) {
            console.log('[MembersContext] Using cached current user data');
            return currentUser;
          }

          console.log('[MembersContext] Fetching member data for user:', authUser.id);
          set({ loading: true, error: null });

          try {
            console.log('[MembersContext] Sending request to /members/get_member/');
            const response = await api.get('/members/get_member/');
            console.log('[MembersContext] Current member response:', {
              status: response.status,
              data: response.data,
              headers: response.headers
            });

            // Merge auth user data with member data
            const memberData = {
              ...response.data,
              // Ensure we have the most up-to-date user info from auth
              id: authUser.id,
              email: authUser.email,
              name: authUser.name,
              is_admin: authUser.is_admin,
              // Keep other member-specific properties
              ...(response.data.user || {}),
              // Remove nested user object
              user: undefined
            };

            console.log('[MembersContext] Merged member data:', memberData);
            set({
              currentUser: memberData,
              initialized: true
            });
            return memberData;
          } catch (error: any) {
            console.error('[MembersContext] Error fetching current user:', {
              status: error.response?.status,
              data: error.response?.data,
              message: error.message,
              config: error.config
            });
            const errorMessage = extractError(error);
            set({ error: errorMessage });
            return null;
          } finally {
            set({ loading: false });
          }
        },

        fetchAllMembers: async () => {
          const token = useAuthStore.getState().user?.token;
          if (!token) {
            console.log('[MembersContext] No token available, skipping fetchAllMembers');
            return [];
          }

          console.log('[MembersContext] Fetching all members');
          set({ loading: true, error: null });

          try {
            console.log('[MembersContext] Sending request to /members/get_all_members/');
            const response = await api.get('/members/get_all_members/');
            console.log('[MembersContext] All members response:', {
              status: response.status,
              data: response.data,
              count: response.data?.length || 0,
              headers: response.headers
            });

            // Process each member to flatten the user data structure
            const processedMembers = Array.isArray(response.data)
              ? response.data.map(member => ({
                ...member,
                // Move nested user properties to root level
                id: member.user?.id || member.id,
                email: member.user?.email || '',
                name: member.user?.name || '',
                is_admin: member.user?.is_superuser || false,
                // Keep other existing properties
                ...member.user,
                // Remove the nested user object to avoid duplication
                user: undefined
              }))
              : [];

            set({
              members: processedMembers,
              initialized: true
            });
            return processedMembers;
          } catch (error: any) {
            console.error('[MembersContext] Error fetching all members:', {
              status: error.response?.status,
              data: error.response?.data,
              message: error.message,
              config: error.config
            });
            const errorMessage = extractError(error);
            set({ error: errorMessage });
            return [];
          } finally {
            set({ loading: false });
          }
        },

        setCurrentUser: (user) => set({ currentUser: user }),
        setMembers: (members) => set({ members }),
        setRoles: (roles) => set({ roles }),
        setLoading: (loading) => set({ loading }),
        setError: (error) => set({ error }),

        // Role Management
        fetchAllRoles: async () => {
          const token = useAuthStore.getState().user?.token;
          if (!token) {
            console.log('[MembersContext] No token available, skipping fetchAllRoles');
            return [];
          }

          console.log('[MembersContext] Fetching all roles');
          set({ loading: true, error: null });

          try {
            const response = await api.get('/members/get_all_roles/');
            console.log('[MembersContext] All roles response:', {
              status: response.status,
              count: response.data?.length || 0,
              data: response.data
            });

            set({
              roles: response.data || [],
              initialized: true
            });
            return response.data || [];
          } catch (error: any) {
            console.error('[MembersContext] Error fetching roles:', {
              status: error.response?.status,
              data: error.response?.data,
              message: error.message
            });
            set({ error: extractError(error) });
            return [];
          } finally {
            set({ loading: false });
          }
        },

        // Add new member
        addMember: async (memberData) => {
          const token = useAuthStore.getState().user?.token;
          if (!token) {
            console.log('[MembersContext] No token available, cannot add member');
            return null;
          }

          console.log('[MembersContext] Adding new member:', memberData);
          set({ loading: true, error: null });

          try {
            const response = await api.post('/members/add_member/', memberData);
            console.log('[MembersContext] Add member response:', {
              status: response.status,
              data: response.data
            });

            // Refresh the members list
            const { fetchAllMembers } = get();
            await fetchAllMembers();

            return response.data;
          } catch (error: any) {
            console.error('[MembersContext] Error adding member:', {
              status: error.response?.status,
              data: error.response?.data,
              message: error.message
            });
            set({ error: extractError(error) });
            return null;
          } finally {
            set({ loading: false });
          }
        },

        // Reset state
        reset: () => {
          set({
            currentUser: null,
            members: [],
            roles: [],
            loading: false,
            error: null,
            initialized: false,
          });
        },
      }),
      {
        name: 'members-storage',
        partialize: (state) => ({
          members: state.members,
          currentUser: state.currentUser
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
    // State
    currentUser: store.currentUser,
    members: store.members,
    roles: store.roles,
    loading: store.loading,
    error: store.error,

    // API Calls
    fetchCurrentUser: store.fetchCurrentUser,
    fetchAllMembers: store.fetchAllMembers,
    fetchAllRoles: store.fetchAllRoles,
    addMember: store.addMember,

    // State Setters
    setCurrentUser: store.setCurrentUser,
    setMembers: store.setMembers,
    setRoles: store.setRoles,
    setLoading: store.setLoading,
    setError: store.setError,

    // Initialization
    initialized: store.initialized,
  };
};
