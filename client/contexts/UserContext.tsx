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
    if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        if (error.response.status === 404) {
            return `The requested resource was not found. Please check the URL and try again.`;
        }

        return error.response.data?.detail ||
            error.response.data?.message ||
            error.response.statusText ||
            `An error occurred (${error.response.status})`;
    } else if (error.request) {
        // The request was made but no response was received
        return 'No response from server. Please check your internet connection.';
    }
    // Something happened in setting up the request that triggered an Error
    return error.message || 'An unknown error occurred';
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
                        let response;
                        try {
                            response = await api.post('/auth/login/', { email, password });
                        } catch (error: any) {
                            // Handle 404 from backend which could mean either email not found or wrong password
                            if (error.response?.status === 404) {
                                throw new Error('Invalid email or password. Please try again.');
                            }
                            throw error; // Re-throw other errors
                        }

                        const { data } = response;

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
                    try {
                        // Define payload type with optional password_confirm
                        type PasswordChangePayload = {
                            old_password: string;
                            password: string;
                            password2?: string;
                        };

                        const payload: PasswordChangePayload = {
                            old_password: currentPassword,
                            password: newPassword
                        };

                        // Add password confirmation if provided
                        if (confirmPassword) {
                            payload.password2 = confirmPassword;
                        }

                        await api.post('/auth/change_password/', payload);

                        // Show success toast
                        toast({
                            title: 'Success',
                            description: 'Your password has been changed successfully.',
                            variant: 'default',
                        });

                        return true;
                    } catch (error: any) {
                        console.error('Password change error:', error);

                        let errorMessage = 'Failed to change password';
                        if (error.response?.data) {
                            // Handle different types of error responses
                            if (typeof error.response.data === 'object' && error.response.data !== null) {
                                // If the server returns an object with error details
                                errorMessage = Object.entries(error.response.data)
                                    .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(' ') : value}`)
                                    .join('\n');
                            } else if (typeof error.response.data === 'string') {
                                errorMessage = error.response.data;
                            }
                        } else if (error.message) {
                            errorMessage = error.message;
                        }

                        // Show error toast
                        toast({
                            title: 'Error',
                            description: errorMessage,
                            variant: 'destructive',
                        });

                        // Re-throw the error to be handled by the caller if needed
                        throw new Error(errorMessage);
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
