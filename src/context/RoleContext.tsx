
import React, { createContext, useContext, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { UserRole, hasPermission } from '@/lib/roles';

interface RoleContextType {
  hasAccess: (action: 'view' | 'create' | 'edit' | 'delete' | 'approve', resource: string) => boolean;
  hasRole: (role: UserRole) => boolean;
  isEventOrganizer: () => boolean;
  isFacilityManager: () => boolean;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const RoleProvider = ({ children }: { children: ReactNode }) => {
  const { user, hasRole } = useAuth();

  const hasAccess = (action: 'view' | 'create' | 'edit' | 'delete' | 'approve', resource: string): boolean => {
    if (!user) return false;
    return user.roles.some(role => hasPermission(role, action, resource));
  };

  const isEventOrganizer = (): boolean => {
    if (!user) return false;
    return user.roles.includes('CB_TO_CHUC_SU_KIEN') || user.roles.includes('ADMIN_HE_THONG');
  };

  const isFacilityManager = (): boolean => {
    if (!user) return false;
    return user.roles.includes('QUAN_LY_CSVC') || user.roles.includes('ADMIN_HE_THONG');
  };

  return (
    <RoleContext.Provider value={{ hasAccess, hasRole, isEventOrganizer, isFacilityManager }}>
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
