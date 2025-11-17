import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      setAuth: (userData, token) => {
        localStorage.setItem('token', token);
        set({ 
          user: userData, 
          token, 
          isAuthenticated: true 
        });
      },

      clearAuth: () => {
        localStorage.removeItem('token');
        set({ 
          user: null, 
          token: null, 
          isAuthenticated: false 
        });
      },

      updateUser: (userData) => set({ user: userData }),

      // Initialize from localStorage on mount
      initAuth: () => {
        const token = localStorage.getItem('token');
        const storedAuth = localStorage.getItem('auth-storage');
        if (token && storedAuth) {
          try {
            const { state } = JSON.parse(storedAuth);
            if (state?.user && state?.token) {
              set({ 
                user: state.user, 
                token: state.token, 
                isAuthenticated: true 
              });
            }
          } catch (error) {
            console.error('Error initializing auth:', error);
          }
        }
      },

      hasRole: (role) => {
        const { user } = get();
        return user?.roles?.includes(role);
      },

      hasAnyRole: (roles) => {
        const { user } = get();
        return roles?.some(role => user?.roles?.includes(role));
      },

      getRole: () => {
        const { user } = get();
        return user?.roles?.[0] || null;
      }
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        user: state.user, 
        token: state.token,
        isAuthenticated: state.isAuthenticated 
      })
    }
  )
);

// Initialize auth on load
if (typeof window !== 'undefined') {
  useAuthStore.getState().initAuth();
}

export default useAuthStore;
