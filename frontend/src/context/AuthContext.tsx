// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  setAuthenticated: (value: boolean) => void;
  user?: { email: string; roles: string[]; permissions: string[] } | null;
  setUser: (user: AuthContextType['user']) => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  setAuthenticated: () => {},
  user: null,
  setUser: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState<AuthContextType['user']>(null);

  useEffect(() => {
    const checkAuth = () => setAuthenticated(!!localStorage.getItem('accessToken'));
    checkAuth();
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  useEffect(() => {
    async function refetchUser() {
      if (isAuthenticated && !user) {
        try {
          const { fetchMe } = await import('../api/auth');
          const me = await fetchMe();
          setUser(me);
        } catch {}
      }
    }
    refetchUser();
  }, [isAuthenticated, user]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setAuthenticated, user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  return useContext(AuthContext);
}
