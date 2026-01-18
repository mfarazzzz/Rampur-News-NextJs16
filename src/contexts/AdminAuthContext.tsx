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
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        let message = `Login failed (${response.status})`;
        try {
          const data = await response.json();
          if (data?.error && typeof data.error === 'string') {
            message = data.error;
          }
        } catch {
          // ignore
        }

        if (response.status === 401) {
          return false;
        }
        throw new Error(message);
      }

      const data = await response.json();
      const session = {
        user: data.user as AdminUser,
        expiresAt: Date.now() + 24 * 60 * 60 * 1000,
      };
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
      }
      setUser(data.user as AdminUser);
      return true;
    } catch {
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    fetch('/api/admin/logout', { method: 'POST' }).catch(() => {});
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
