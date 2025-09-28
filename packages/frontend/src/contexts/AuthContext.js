'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAccountDeactivated, setIsAccountDeactivated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = api.getCurrentUser();
        console.log('AuthContext - currentUser from localStorage:', currentUser);
        setUser(currentUser);

        // If user exists and has a token, fetch fresh profile data
        if (currentUser && localStorage.getItem('token')) {
          try {
            console.log('AuthContext - fetching user profile...');
            const response = await api.fetchUserProfile();
            console.log('AuthContext - fetchUserProfile response:', response);
            if (response.success && response.user) {
              setUser(response.user);
            }
          } catch (error) {
            console.error('Failed to fetch user profile:', error);
            // Handle account deactivation
            if (error.code === 'ACCOUNT_DEACTIVATED') {
              setIsAccountDeactivated(true);
            }
            // Even if fetch fails, keep the user from localStorage
            // so the app doesn't get stuck in loading state
          }
        }
      } catch (error) {
        console.error('Error in loadUser:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (email, password) => {
    console.log('AuthContext: Login attempt for:', email);
    try {
      const response = await api.login(email, password);
      console.log('AuthContext: Login response:', response);

      if (response.user) {
        setUser(response.user);

        // Redirect based on role
        switch (response.user.role) {
          case 'ADMIN':
            console.log('Redirecting to admin dashboard');
            router.push('/admin');
            break;
          case 'TUTOR':
            console.log('Redirecting to tutor dashboard');
            router.push('/tutor');
            break;
          case 'STUDENT':
            console.log('Redirecting to student dashboard');
            router.push('/student');
            break;
          default:
            router.push('/');
        }

        return { success: true };
      } else {
        console.error('No user data in response');
        return { success: false, error: 'Invalid response from server' };
      }
    } catch (error) {
      console.error('AuthContext: Login error:', error);
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    api.logout();
    setUser(null);
    router.push('/auth/login');
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'ADMIN',
    isTutor: user?.role === 'TUTOR',
    isStudent: user?.role === 'STUDENT',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};