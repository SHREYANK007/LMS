'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadUser = () => {
      const currentUser = api.getCurrentUser();
      setUser(currentUser);
      setLoading(false);
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