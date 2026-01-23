// Simple admin auth context using localStorage (demo purposes only)
import React, { createContext, useContext, useState, useCallback } from 'react';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'author';
}

interface AdminAuthContextType {
  user: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

const STORAGE_KEY = 'admin_auth';

// Demo credentials (for development only - replace with proper auth in production)
const DEMO_USERS = [
  {
    id: 'admin-1',
    email: 'admin@rampurnews.com',
    password: 'admin123',
    name: 'Admin User',
    role: 'admin' as const,
  },
  {
    id: 'editor-1',
    email: 'editor@rampurnews.com',
    password: 'editor123',
    name: 'Editor User',
    role: 'editor' as const,
  },
];

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(() => {
    if (typeof window === 'undefined') {
      return null;
    }
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        return null;
      }
      const parsed = JSON.parse(stored);
      if (parsed.user && parsed.expiresAt > Date.now()) {
        return parsed.user as AdminUser;
      }
      localStorage.removeItem(STORAGE_KEY);
      return null;
    } catch (error) {
      console.error('Error loading auth state:', error);
      return null;
    }
  });
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const inputEmail = email.trim().toLowerCase();
      const inputPassword = password.trim();
      
      const matchedUser = DEMO_USERS.find(
        u => u.email.toLowerCase() === inputEmail && u.password === inputPassword
      );
      
      if (!matchedUser) {
        return false;
      }
      
      const adminUser: AdminUser = {
        id: matchedUser.id,
        name: matchedUser.name,
        email: matchedUser.email,
        role: matchedUser.role,
      };
      
      const session = {
        user: adminUser,
        expiresAt: Date.now() + 24 * 60 * 60 * 1000,
      };
      
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
      }
      setUser(adminUser);
      return true;
    } catch {
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  }, []);

  return (
    <AdminAuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      logout,
    }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = (): AdminAuthContextType => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within AdminAuthProvider');
  }
  return context;
};

export default AdminAuthContext;
