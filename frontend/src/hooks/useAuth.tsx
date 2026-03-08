import { useState, createContext, useContext, type ReactNode } from 'react';
import type { User, UserRole } from '@/types';
import { dummyUsers } from '@/data/dummyData';

interface AuthContextType {
  user: User;
  setRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>(dummyUsers[0]);

  const setRole = (role: UserRole) => {
    const found = dummyUsers.find(u => u.role === role);
    if (found) setUser(found);
  };

  return (
    <AuthContext.Provider value={{ user, setRole }}>
      {children}
    </AuthContext.Provider>
  );
};
