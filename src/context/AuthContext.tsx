import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserRole, UserType } from '@/lib/roles';
import { toast } from '@/components/ui/sonner';

interface User {
  id: string;
  name: string;
  email: string;
  userType: UserType;
  roles: UserRole[];
  donViId?: string;
  avatarUrl?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  logout: () => void;
  hasRole: (role: UserRole) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demonstration
const MOCK_USERS: Record<string, User> = {
  'admin@example.com': {
    id: '1',
    name: 'Admin Hệ Thống',
    email: 'admin@example.com',
    userType: 'NHAN_VIEN',
    roles: ['ADMIN_HE_THONG'],
    avatarUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=Admin%20H%E1%BB%87%20Th%E1%BB%91ng&backgroundColor=1e88e5'
  },
  'event@example.com': {
    id: '2',
    name: 'Cán Bộ Tổ Chức',
    email: 'event@example.com',
    userType: 'NHAN_VIEN',
    roles: ['CB_TO_CHUC_SU_KIEN'],
    donViId: '1',
    avatarUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=C%C3%A1n%20B%E1%BB%99%20T%E1%BB%95%20Ch%E1%BB%A9c&backgroundColor=1e88e5'
  },
  'facility@example.com': {
    id: '3',
    name: 'Quản Lý CSVC',
    email: 'facility@example.com',
    userType: 'NHAN_VIEN',
    roles: ['QUAN_LY_CSVC'],
    avatarUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=Qu%E1%BA%A3n%20L%C3%BD%20CSVC&backgroundColor=1e88e5'
  },
  'dean@example.com': {
    id: '4',
    name: 'Trưởng Khoa CNTT',
    email: 'dean@example.com',
    userType: 'GIANG_VIEN',
    roles: ['TRUONG_KHOA'],
    donViId: '2',
    avatarUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=Tr%C6%B0%E1%BB%9Fng%20Khoa%20CNTT&backgroundColor=1e88e5'
  },
  'principal@example.com': {
    id: '5',
    name: 'Ban Giám Hiệu',
    email: 'principal@example.com',
    userType: 'GIANG_VIEN',
    roles: ['BGH_DUYET_SK_TRUONG'],
    avatarUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=Ban%20Gi%C3%A1m%20Hi%E1%BB%87u&backgroundColor=1e88e5'
  },
  'club@example.com': {
    id: '6',
    name: 'Trưởng CLB IT',
    email: 'club@example.com',
    userType: 'SINH_VIEN',
    roles: ['TRUONG_CLB'],
    donViId: '3',
    avatarUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=Tr%C6%B0%E1%BB%9Fng%20CLB%20IT&backgroundColor=1e88e5'
  },
  'union@example.com': {
    id: '9',
    name: 'Bí Thư Đoàn PTIT',
    email: 'union@example.com',
    userType: 'SINH_VIEN',
    roles: ['BI_THU_DOAN'],
    donViId: '4',
    avatarUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=B%C3%AD%20Th%C6%B0%20%C4%90o%C3%A0n&backgroundColor=1e88e5'
  },
  'student@example.com': {
    id: '7',
    name: 'Sinh Viên',
    email: 'student@example.com',
    userType: 'SINH_VIEN',
    roles: ['SINH_VIEN'],
    avatarUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=Sinh%20Vi%C3%AAn&backgroundColor=1e88e5'
  },
  'lecturer@example.com': {
    id: '8',
    name: 'Giảng Viên',
    email: 'lecturer@example.com',
    userType: 'GIANG_VIEN',
    roles: ['GIANG_VIEN'],
    donViId: '2',
    avatarUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=Gi%E1%BA%A3ng%20Vi%C3%AAn&backgroundColor=1e88e5'
  },
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in (from localStorage in this demo)
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('currentUser');
      }
    }
    
    setLoading(false);
  }, []);

  const login = async (credentials: { email: string; password: string }) => {
    setLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser = MOCK_USERS[credentials.email.toLowerCase()];
      
      if (!mockUser) {
        throw new Error('Tài khoản không tồn tại.');
      }
      
      // In a real app, you would validate password here
      
      // Store user in localStorage (for demo purposes only)
      localStorage.setItem('currentUser', JSON.stringify(mockUser));
      setUser(mockUser);
      toast.success(`Chào mừng ${mockUser.name}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Đăng nhập thất bại.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('currentUser');
    setUser(null);
    toast.success('Đăng xuất thành công');
  };

  const hasRole = (role: UserRole): boolean => {
    return user?.roles.includes(role) || false;
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, loading, login, logout, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};
