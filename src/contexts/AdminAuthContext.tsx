// Simple admin auth context using localStorage (demo purposes only)
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

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

// Demo credentials (in production, this would be a real auth system)
const DEMO_USERS: Record<string, { password: string; user: AdminUser }> = {
  'admin@rampurnews.com': {
    password: 'admin123',
    user: { id: '1', name: 'Admin', email: 'admin@rampurnews.com', role: 'admin' },
  },
  'editor@rampurnews.com': {
    password: 'editor123',
    user: { id: '2', name: 'संपादक', email: 'editor@rampurnews.com', role: 'editor' },
  },
};

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.user && parsed.expiresAt > Date.now()) {
          setUser(parsed.user);
        } else {
          localStorage.removeItem(STORAGE_KEY);
        }
      }
    } catch (error) {
      console.error('Error loading auth state:', error);
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const demoUser = DEMO_USERS[email.toLowerCase()];
    if (demoUser && demoUser.password === password) {
      const session = {
        user: demoUser.user,
        expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
      setUser(demoUser.user);
      return true;
    }
    return false;
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
