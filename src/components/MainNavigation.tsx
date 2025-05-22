
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  NavigationMenu, 
  NavigationMenuContent, 
  NavigationMenuItem, 
  NavigationMenuLink, 
  NavigationMenuList, 
  NavigationMenuTrigger,
  navigationMenuTriggerStyle
} from '@/components/ui/navigation-menu';
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from '@/components/ui/menubar';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { UserRole, hasPermission } from '@/lib/roles';
import { 
  User, 
  LogOut, 
  Calendar, 
  Users, 
  Settings, 
  Home, 
  Building,
  Briefcase,
  BarChart3,
  School
} from 'lucide-react';
import { ThemeSwitcher } from './ThemeSwitcher';
import { NotificationBell } from './NotificationBell';
import { PTITLogo } from '@/assets/logo';

// Interface for navigation items
interface NavItem {
  title: string;
  href: string;
  icon?: React.ReactNode;
  requiresAuth?: boolean;
  allowedRoles?: UserRole[];
  requiresPermission?: {
    action: 'view' | 'create' | 'edit' | 'delete' | 'approve';
    resource: string;
  };
  children?: NavItem[];
}

// Define navigation structure based on roles and permissions
const navigationItems: NavItem[] = [
  {
    title: 'Trang chủ',
    href: '/',
    icon: <Home className="mr-2 h-4 w-4" />,
  },
  {
    title: 'Sự kiện',
    href: '/events',
    icon: <Calendar className="mr-2 h-4 w-4" />,
    requiresAuth: true,
    requiresPermission: {
      action: 'view',
      resource: 'SuKien',
    },
    children: [
      {
        title: 'Tất cả sự kiện',
        href: '/events',
        requiresPermission: {
          action: 'view',
          resource: 'SuKien',
        },
      },
      {
        title: 'Tạo sự kiện mới',
        href: '/events/new',
        requiresPermission: {
          action: 'create',
          resource: 'SuKien',
        },
      },
      {
        title: 'Duyệt sự kiện',
        href: '/events/approve',
        requiresPermission: {
          action: 'approve',
          resource: 'SuKien',
        },
      },
      {
        title: 'Yêu cầu hủy sự kiện',
        href: '/events/cancel-requests',
        requiresPermission: {
          action: 'view',
          resource: 'YeuCauHuySK',
        },
      },
    ],
  },
  {
    title: 'Phòng & Thiết bị',
    href: '/facilities',
    icon: <Building className="mr-2 h-4 w-4" />,
    requiresAuth: true,
    requiresPermission: {
      action: 'view',
      resource: 'Phong',
    },
    children: [
      {
        title: 'Tất cả phòng',
        href: '/facilities/rooms',
        requiresPermission: {
          action: 'view',
          resource: 'Phong',
        },
      },
      {
        title: 'Quản lý thiết bị',
        href: '/facilities/equipment',
        requiresPermission: {
          action: 'view',
          resource: 'TrangThietBi',
        },
      },
      {
        title: 'Yêu cầu mượn phòng',
        href: '/facilities/room-requests',
        requiresPermission: {
          action: 'view',
          resource: 'YeuCauMuonPhong',
        },
      },
      {
        title: 'Yêu cầu đổi phòng',
        href: '/facilities/room-change-requests',
        requiresPermission: {
          action: 'view',
          resource: 'YeuCauDoiPhong',
        },
      },
    ],
  },
  {
    title: 'Thống kê',
    href: '/dashboard',
    icon: <BarChart3 className="mr-2 h-4 w-4" />,
    requiresAuth: true,
    children: [
      {
        title: 'Tổng quan',
        href: '/dashboard',
        allowedRoles: ['ADMIN_HE_THONG', 'BGH_DUYET_SK_TRUONG', 'CB_TO_CHUC_SU_KIEN'],
      },
      {
        title: 'Thống kê sự kiện',
        href: '/dashboard/events',
        requiresPermission: {
          action: 'view',
          resource: 'ThongKeSuKien',
        },
      },
      {
        title: 'Thống kê phòng & thiết bị',
        href: '/dashboard/facilities',
        requiresPermission: {
          action: 'view',
          resource: 'ThongKePhong',
        },
      },
      {
        title: 'Thống kê khoa',
        href: '/dashboard/department',
        requiresPermission: {
          action: 'view',
          resource: 'ThongKeKhoa',
        },
      },
      {
        title: 'Thống kê CLB',
        href: '/dashboard/clubs',
        requiresPermission: {
          action: 'view',
          resource: 'ThongKeCLB',
        },
      },
      {
        title: 'Thống kê đoàn',
        href: '/dashboard/union',
        requiresPermission: {
          action: 'view',
          resource: 'ThongKeDoan',
        },
      },
    ],
  },
  {
    title: 'Người dùng',
    href: '/users',
    icon: <Users className="mr-2 h-4 w-4" />,
    requiresAuth: true,
    allowedRoles: ['ADMIN_HE_THONG'],
    children: [
      {
        title: 'Tất cả người dùng',
        href: '/users',
        allowedRoles: ['ADMIN_HE_THONG'],
      },
      {
        title: 'Sinh viên',
        href: '/users/students',
        allowedRoles: ['ADMIN_HE_THONG', 'TRUONG_KHOA', 'BI_THU_DOAN', 'TRUONG_CLB'],
      },
      {
        title: 'Giảng viên',
        href: '/users/lecturers',
        allowedRoles: ['ADMIN_HE_THONG', 'TRUONG_KHOA'],
      },
      {
        title: 'Phân quyền',
        href: '/users/roles',
        allowedRoles: ['ADMIN_HE_THONG'],
      },
    ],
  },
  {
    title: 'Đơn vị',
    href: '/units',
    icon: <Briefcase className="mr-2 h-4 w-4" />,
    requiresAuth: true,
    requiresPermission: {
      action: 'view',
      resource: 'DonVi',
    },
    children: [
      {
        title: 'Tất cả đơn vị',
        href: '/units',
        requiresPermission: {
          action: 'view',
          resource: 'DonVi',
        },
      },
      {
        title: 'Khoa',
        href: '/units/departments',
        allowedRoles: ['ADMIN_HE_THONG', 'TRUONG_KHOA'],
      },
      {
        title: 'Câu lạc bộ',
        href: '/units/clubs',
        allowedRoles: ['ADMIN_HE_THONG', 'TRUONG_CLB'],
      },
      {
        title: 'Đoàn',
        href: '/units/union',
        allowedRoles: ['ADMIN_HE_THONG', 'BI_THU_DOAN'],
      },
      {
        title: 'Ngành học',
        href: '/units/majors',
        allowedRoles: ['ADMIN_HE_THONG', 'TRUONG_KHOA'],
      },
      {
        title: 'Lớp học',
        href: '/units/classes',
        allowedRoles: ['ADMIN_HE_THONG', 'TRUONG_KHOA'],
      },
    ],
  },
  {
    title: 'Cài đặt hệ thống',
    href: '/settings',
    icon: <Settings className="mr-2 h-4 w-4" />,
    requiresAuth: true,
    allowedRoles: ['ADMIN_HE_THONG'],
  },
];

const MainNavigation: React.FC = () => {
  const { user, isAuthenticated, logout, hasRole } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  // Filter navigation items based on user permissions
  const filteredNavItems = navigationItems.filter(item => {
    // Public routes accessible to all
    if (!item.requiresAuth) return true;
    
    // Route requires authentication
    if (!isAuthenticated) return false;
    
    // Check for specific allowed roles
    if (item.allowedRoles && item.allowedRoles.length > 0) {
      if (!item.allowedRoles.some(role => hasRole(role))) return false;
    }
    
    // Check for specific permissions
    if (item.requiresPermission && user?.roles) {
      const { action, resource } = item.requiresPermission;
      const hasRequiredPermission = user.roles.some(role => 
        hasPermission(role, action, resource)
      );
      if (!hasRequiredPermission) return false;
    }
    
    return true;
  });

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-red-600 text-white backdrop-blur">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex">
          <Link to="/" className="flex items-center space-x-2">
            <PTITLogo size={36} />
          </Link>
        </div>

        <NavigationMenu className="max-w-full flex-1">
          <NavigationMenuList className="flex-wrap">
            {filteredNavItems.map((item, index) => {
              // Skip items with no children
              if (!item.children || item.children.length === 0) {
                return (
                  <NavigationMenuItem key={index}>
                    <Link to={item.href}>
                      <NavigationMenuLink 
                        className={cn(
                          navigationMenuTriggerStyle(),
                          "text-white hover:bg-red-700 hover:text-white",
                          location.pathname === item.href ? "bg-red-700 text-white" : ""
                        )}
                      >
                        {item.icon}
                        <span>{item.title}</span>
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                );
              }

              // Filter children items based on permissions
              const filteredChildren = item.children.filter(child => {
                if (child.allowedRoles && !child.allowedRoles.some(role => hasRole(role))) {
                  return false;
                }
                
                if (child.requiresPermission && user?.roles) {
                  const { action, resource } = child.requiresPermission;
                  return user.roles.some(role => hasPermission(role, action, resource));
                }
                
                return true;
              });

              if (filteredChildren.length === 0) return null;

              return (
                <NavigationMenuItem key={index}>
                  <NavigationMenuTrigger className={cn(
                    "text-white hover:bg-red-700 hover:text-white",
                    location.pathname.startsWith(item.href) ? "bg-red-700 text-white" : ""
                  )}>
                    {item.icon}
                    <span>{item.title}</span>
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] bg-white">
                      {filteredChildren.map((child, childIndex) => (
                        <li key={childIndex}>
                          <Link to={child.href} className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                            <div className="text-sm font-medium leading-none">{child.title}</div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              );
            })}
          </NavigationMenuList>
        </NavigationMenu>

        {/* Theme & Notifications */}
        <div className="flex items-center space-x-1 mr-2">
          <ThemeSwitcher />
          {isAuthenticated && <NotificationBell />}
        </div>

        {/* User menu */}
        <div className="ml-auto flex items-center space-x-2">
          {isAuthenticated ? (
            <Menubar className="border-red-400">
              <MenubarMenu>
                <MenubarTrigger className="space-x-2 font-medium text-white hover:bg-red-700 focus:bg-red-700">
                  <User className="h-4 w-4" />
                  <span className="max-w-[150px] truncate">{user?.name}</span>
                </MenubarTrigger>
                <MenubarContent>
                  <Link to="/profile">
                    <MenubarItem className="flex items-center cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>Hồ sơ cá nhân</span>
                    </MenubarItem>
                  </Link>
                  
                  {user?.userType === 'NHAN_VIEN' && (
                    <MenubarItem>Nhân viên</MenubarItem>
                  )}
                  {user?.userType === 'GIANG_VIEN' && (
                    <MenubarItem>Giảng viên</MenubarItem>
                  )}
                  {user?.userType === 'SINH_VIEN' && (
                    <MenubarItem>Sinh viên</MenubarItem>
                  )}
                  
                  <MenubarSeparator />
                  <MenubarItem className="flex items-center text-red-500 cursor-pointer" onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Đăng xuất</span>
                  </MenubarItem>
                </MenubarContent>
              </MenubarMenu>
            </Menubar>
          ) : (
            <Link to="/login" className={cn(navigationMenuTriggerStyle(), "bg-white text-red-600 hover:bg-gray-100")}>
              Đăng nhập
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default MainNavigation;
