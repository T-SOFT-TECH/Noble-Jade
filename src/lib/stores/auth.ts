import { writable, derived, get } from 'svelte/store';
import { pb } from '$lib/pocketbase';
import { browser } from '$app/environment';
import type { RecordModel } from 'pocketbase';

// User type extending PocketBase's RecordModel
export interface User extends RecordModel {
    email: string;
    name: string;
    avatar?: string;
    phone?: string;
    role?: 'customer' | 'staff' | 'admin';
}

// Auth state interface
interface AuthState {
    isAuthenticated: boolean;
    user: User | null;
    isLoading: boolean;
}

// Create the auth store
function createAuthStore() {
    const { subscribe, set, update } = writable<AuthState>({
        isAuthenticated: false,
        user: null,
        isLoading: true
    });

    return {
        subscribe,

        // Initialize auth from PocketBase's stored auth
        init() {
            if (browser) {
                // Load auth from localStorage via PocketBase
                const isValid = pb.authStore.isValid;
                const model = pb.authStore.model as User | null;

                set({
                    isAuthenticated: isValid,
                    user: model,
                    isLoading: false
                });

                // Listen for auth state changes
                pb.authStore.onChange((token, model) => {
                    set({
                        isAuthenticated: pb.authStore.isValid,
                        user: model as User | null,
                        isLoading: false
                    });
                });
            } else {
                set({ isAuthenticated: false, user: null, isLoading: false });
            }
        },

        // Login with email and password
        async login(email: string, password: string) {
            update(state => ({ ...state, isLoading: true }));
            try {
                const authData = await pb.collection('users').authWithPassword(email, password);
                set({
                    isAuthenticated: true,
                    user: authData.record as User,
                    isLoading: false
                });
                return { success: true };
            } catch (error: any) {
                update(state => ({ ...state, isLoading: false }));
                return {
                    success: false,
                    error: error.message || 'Login failed. Please check your credentials.'
                };
            }
        },

        // Register new user
        async register(data: { email: string; password: string; passwordConfirm: string; name: string }) {
            update(state => ({ ...state, isLoading: true }));
            try {
                // Create the user
                await pb.collection('users').create({
                    ...data,
                    role: 'customer' // Default role
                });

                // Auto-login after registration
                const authData = await pb.collection('users').authWithPassword(data.email, data.password);

                set({
                    isAuthenticated: true,
                    user: authData.record as User,
                    isLoading: false
                });
                return { success: true };
            } catch (error: any) {
                update(state => ({ ...state, isLoading: false }));
                // Parse PocketBase validation errors
                let errorMessage = 'Registration failed.';
                if (error.data?.data) {
                    const errors = Object.entries(error.data.data)
                        .map(([field, err]: [string, any]) => `${field}: ${err.message}`)
                        .join(', ');
                    errorMessage = errors;
                } else if (error.message) {
                    errorMessage = error.message;
                }
                return { success: false, error: errorMessage };
            }
        },

        // Logout
        logout() {
            pb.authStore.clear();
            set({
                isAuthenticated: false,
                user: null,
                isLoading: false
            });
        },

        // Update user profile
        async updateProfile(data: Partial<User>) {
            const currentUser = get({ subscribe }).user;
            if (!currentUser) return { success: false, error: 'Not authenticated' };

            try {
                const updated = await pb.collection('users').update(currentUser.id, data);
                update(state => ({
                    ...state,
                    user: updated as User
                }));
                return { success: true };
            } catch (error: any) {
                return { success: false, error: error.message || 'Update failed' };
            }
        }
    };
}

// Export the auth store
export const auth = createAuthStore();

// Derived stores for convenience
export const isAuthenticated = derived(auth, $auth => $auth.isAuthenticated);
export const currentUser = derived(auth, $auth => $auth.user);
export const isLoading = derived(auth, $auth => $auth.isLoading);
