'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Admin {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AdminAuthContextType {
  admin: Admin | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<Admin>) => Promise<boolean>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const isAuthenticated = !!admin;

  // Check if admin is already logged in on app start
  useEffect(() => {
    const checkAuth = () => {
      const savedAdmin = localStorage.getItem('admin-auth');
      if (savedAdmin) {
        try {
          const adminData = JSON.parse(savedAdmin);
          setAdmin(adminData);
        } catch (error) {
          localStorage.removeItem('admin-auth');
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // For demo purposes, using hardcoded credentials
      // In production, this should call your authentication API
      if (email === 'admin@bagrusarees.com' && password === 'admin123') {
        const adminData: Admin = {
          id: '1',
          email: 'admin@bagrusarees.com',
          name: 'Admin User',
          role: 'super_admin'
        };
        
        setAdmin(adminData);
        localStorage.setItem('admin-auth', JSON.stringify(adminData));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    setAdmin(null);
    localStorage.removeItem('admin-auth');
    router.push('/admin/login');
  };

  const updateProfile = async (data: Partial<Admin>): Promise<boolean> => {
    try {
      if (!admin) return false;
      
      const updatedAdmin = { ...admin, ...data };
      setAdmin(updatedAdmin);
      localStorage.setItem('admin-auth', JSON.stringify(updatedAdmin));
      return true;
    } catch (error) {
      console.error('Profile update error:', error);
      return false;
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    try {
      // In production, verify current password and update in backend
      // For demo, just return success
      return true;
    } catch (error) {
      console.error('Password change error:', error);
      return false;
    }
  };

  const value: AdminAuthContextType = {
    admin,
    isAuthenticated,
    isLoading,
    login,
    logout,
    updateProfile,
    changePassword,
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}
