
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
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
  School, 
  Calendar, 
  Users, 
  Settings, 
  Home, 
  Building,
  Briefcase
} from 'lucide-react';

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
        title: 'Tài khoản',
        href: '/users/accounts',
        allowedRoles: ['ADMIN_HE_THONG'],
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

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex">
          <Link to="/" className="flex items-center space-x-2">
            <School className="h-6 w-6" />
            <span className="hidden font-bold sm:inline-block">
              HỆ THỐNG QUẢN LÝ SỰ KIỆN
            </span>
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
                        className={navigationMenuTriggerStyle()}
                        active={location.pathname === item.href}
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
                    location.pathname.startsWith(item.href) ? 'bg-accent text-accent-foreground' : ''
                  )}>
                    {item.icon}
                    <span>{item.title}</span>
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
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

        {/* User menu */}
        <div className="ml-auto flex items-center space-x-2">
          {isAuthenticated ? (
            <Menubar>
              <MenubarMenu>
                <MenubarTrigger className="space-x-2 font-medium">
                  <User className="h-4 w-4" />
                  <span className="max-w-[150px] truncate">{user?.name}</span>
                </MenubarTrigger>
                <MenubarContent>
                  <MenubarItem className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    <span>Hồ sơ cá nhân</span>
                  </MenubarItem>
                  
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
                  <MenubarItem className="flex items-center text-red-500" onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Đăng xuất</span>
                  </MenubarItem>
                </MenubarContent>
              </MenubarMenu>
            </Menubar>
          ) : (
            <Link to="/login" className={cn(navigationMenuTriggerStyle(), "bg-primary text-primary-foreground hover:bg-primary/90")}>
              Đăng nhập
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default MainNavigation;
