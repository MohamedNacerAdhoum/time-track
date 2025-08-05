import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import api, { setTokenGetter } from '@/lib/api';
import { toast } from '@/components/ui/use-toast';

// Types
export interface UserData {
  id: string;
  email: string;
  is_admin: boolean;
  token?: string;
  // Optional fields that might be populated later
  name?: string;
  imageUrl?: string | null;
  age?: number;
  role?: string;
  role_name?: string;
  location?: string;
  experience?: number;
  hours?: number;
  balance?: number;
  joined?: string;
  status?: string | null;
}

interface AuthState {
  // State
  user: UserData | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  isAdmin: boolean;
  initialized: boolean;
  
  // Actions
  login: (email: string, password: string) => Promise<UserData | null>;
  logout: () => void;
  changePassword: (currentPassword: string, newPassword: string, confirmPassword?: string) => Promise<boolean>;
  fetchUserData: () => Promise<UserData | null>;
  setUser: (user: UserData | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
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
export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null,
        isAdmin: false,
        initialized: false,

        // Authentication actions
        login: async (email, password) => {
          console.log('[UserContext] Attempting login');
          set({ loading: true, error: null });
          
          try {
            const { data } = await api.post('/auth/login/', { email, password });

            // Create user data with fallbacks
            const userData: UserData = {
              email: data.user?.email || email,
              id: data.user?.id || '',
              name: data.user?.name || email.split('@')[0],
              is_admin: data.is_admin || false,
              token: data.token,
              role_name: data.user?.role_name || (data.is_admin ? 'Admin' : 'User'),
              ...data.user
            };

            // Update the API client with the new token
            api.defaults.headers.common['Authorization'] = `Token ${data.token}`;
            setTokenGetter(() => data.token);

            set({
              user: userData,
              isAuthenticated: true,
              isAdmin: data.is_admin || false,
              loading: false,
              error: null,
              initialized: true
            });

            return userData;
          } catch (error) {
            const errorMessage = extractError(error);
            set({ 
              error: errorMessage, 
              loading: false,
              initialized: true
            });
            return null;
          }
        },

        logout: () => {
          // Clear the token from the API client
          delete api.defaults.headers.common['Authorization'];
          setTokenGetter(undefined);
          
          // Reset the store state
          set({
            user: null,
            isAuthenticated: false,
            isAdmin: false,
            loading: false,
            error: null,
            initialized: true
          });
        },

        changePassword: async (currentPassword, newPassword, confirmPassword) => {
          console.log('[UserContext] Attempting to change password');
          set({ loading: true, error: null });
          
          try {
            const payload = {
              current_password: currentPassword,
              new_password1: newPassword,
              new_password2: confirmPassword || newPassword
            };

            await api.post('/auth/change_password/', payload);
            set({ loading: false });
            return true;
          } catch (error) {
            const errorMessage = extractError(error);
            set({ error: errorMessage, loading: false });
            return false;
          }
        },

        // User data actions
        fetchUserData: async () => {
          const token = get().user?.token;
          if (!token) {
            console.log('[UserContext] No token available, skipping fetchUserData');
            return null;
          }

          console.log('[UserContext] Fetching user data');
          set({ loading: true, error: null });
          
          try {
            const { data } = await api.get('/members/get_member/');
            
            const userData: UserData = {
              ...data,
              // Preserve the token
              token: get().user?.token
            };

            set({
              user: userData,
              isAuthenticated: true,
              isAdmin: data.is_admin || false,
              loading: false,
              error: null,
              initialized: true
            });

            return userData;
          } catch (error) {
            const errorMessage = extractError(error);
            set({ 
              error: errorMessage, 
              loading: false,
              initialized: true
            });
            return null;
          }
        },

        // State management
        setUser: (user) => set({ 
          user,
          isAuthenticated: !!user,
          isAdmin: user?.is_admin || false
        }),
        setLoading: (loading) => set({ loading }),
        setError: (error) => set({ error }),
        clearError: () => set({ error: null }),
        reset: () => set({
          user: null,
          isAuthenticated: false,
          isAdmin: false,
          loading: false,
          error: null,
          initialized: true
        }),
      }),
      {
        name: 'auth-storage',
        partialize: (state) => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
          isAdmin: state.isAdmin
        }),
        onRehydrateStorage: () => (state) => {
          // Set the authorization header if we have a token when rehydrating
          if (state?.user?.token) {
            api.defaults.headers.common['Authorization'] = `Token ${state.user.token}`;
            setTokenGetter(() => state?.user?.token);
          }
        }
      }
    )
  )
);

// Initialization
const initializeAuth = async () => {
  const { isAuthenticated, fetchUserData } = useAuthStore.getState();

  // If we have a token but no user data, try to fetch the user
  if (isAuthenticated && !useAuthStore.getState().user) {
    try {
      await fetchUserData();
    } catch (error) {
      console.error('Failed to fetch user data on initialization:', error);
      useAuthStore.getState().logout();
    }
  }
};

// Run initialization
initializeAuth();

// Set up API token getter after store is created
const { getState } = useAuthStore;
setTokenGetter(() => getState().user?.token);

// For backward compatibility
export const useUser = () => {
  const { user, isAuthenticated, loading, error, fetchUserData, isAdmin } = useAuthStore();

  return {
    user,
        isAuthenticated,
        loading,
        error,
        fetchUserData,
        refreshData: fetchUserData,
        isAdmin
    };
};
