
import React, { createContext, useContext, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { UserRole, hasPermission } from '@/lib/roles';

interface RoleContextType {
  hasAccess: (action: 'view' | 'create' | 'edit' | 'delete' | 'approve', resource: string) => boolean;
  hasRole: (role: UserRole) => boolean;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const RoleProvider = ({ children }: { children: ReactNode }) => {
  const { user, hasRole } = useAuth();

  const hasAccess = (action: 'view' | 'create' | 'edit' | 'delete' | 'approve', resource: string): boolean => {
    if (!user) return false;
    return user.roles.some(role => hasPermission(role, action, resource));
  };

  return (
    <RoleContext.Provider value={{ hasAccess, hasRole }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = (): RoleContextType => {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
};
