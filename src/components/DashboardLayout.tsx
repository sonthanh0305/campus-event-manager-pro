
import React, { ReactNode, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  CalendarDays,
  Building2,
  Users,
  UserSquare2,
  BookOpen,
  Settings,
  LogOut,
  GraduationCap,
  Building,
  LibraryBig,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import { ThemeSwitcher } from './ThemeSwitcher';
import { NotificationBell } from './NotificationBell';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useMediaQuery } from '@/hooks/use-mobile';

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  roles?: string[];
}

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout, hasRole } = useAuth();
  const location = useLocation();
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  const adminNavItems: NavItem[] = [
    {
      href: '/dashboard',
      label: 'Tổng quan',
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      href: '/dashboard/events',
      label: 'Sự kiện',
      icon: <CalendarDays className="h-5 w-5" />,
      roles: ['ADMIN_HE_THONG', 'CB_TO_CHUC_SU_KIEN', 'BGH_DUYET_SK_TRUONG'],
    },
    {
      href: '/dashboard/facilities',
      label: 'Cơ sở vật chất',
      icon: <Building className="h-5 w-5" />,
      roles: ['ADMIN_HE_THONG', 'QUAN_LY_CSVC'],
    },
    {
      href: '/dashboard/department',
      label: 'Khoa',
      icon: <Building2 className="h-5 w-5" />,
      roles: ['ADMIN_HE_THONG', 'TRUONG_KHOA'],
    },
    {
      href: '/dashboard/clubs',
      label: 'Câu lạc bộ',
      icon: <LibraryBig className="h-5 w-5" />,
      roles: ['ADMIN_HE_THONG', 'TRUONG_CLB'],
    },
    {
      href: '/dashboard/union',
      label: 'Đoàn thanh niên',
      icon: <Users className="h-5 w-5" />,
      roles: ['ADMIN_HE_THONG', 'BI_THU_DOAN'],
    },
  ];

  const userManagementItems: NavItem[] = [
    {
      href: '/users',
      label: 'Quản lý người dùng',
      icon: <UserSquare2 className="h-5 w-5" />,
      roles: ['ADMIN_HE_THONG'],
    },
    {
      href: '/users/students',
      label: 'Sinh viên',
      icon: <BookOpen className="h-5 w-5" />,
      roles: ['ADMIN_HE_THONG', 'TRUONG_KHOA', 'TRUONG_CLB', 'BI_THU_DOAN'],
    },
    {
      href: '/users/lecturers',
      label: 'Giảng viên',
      icon: <GraduationCap className="h-5 w-5" />,
      roles: ['ADMIN_HE_THONG', 'TRUONG_KHOA'],
    },
    {
      href: '/users/roles',
      label: 'Vai trò',
      icon: <Settings className="h-5 w-5" />,
      roles: ['ADMIN_HE_THONG'],
    },
  ];

  const filteredAdminNavItems = adminNavItems.filter(item => {
    if (!item.roles) return true;
    return item.roles.some(role => hasRole(role as any));
  });

  const filteredUserManagementItems = userManagementItems.filter(item => {
    if (!item.roles) return true;
    return item.roles.some(role => hasRole(role as any));
  });

  const renderNavLinks = (items: NavItem[]) => (
    <ul className="space-y-1">
      {items.map((item) => (
        <li key={item.href}>
          <Link
            to={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-primary dark:text-gray-400 dark:hover:text-primary",
              location.pathname === item.href &&
                "bg-primary/10 text-primary font-medium"
            )}
          >
            {item.icon}
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
  );

  const sidebarContent = (
    <div className="flex h-full flex-col gap-2">
      <div className="px-3 py-2">
        <Link
          to="/"
          className="flex items-center gap-2 font-semibold text-lg"
        >
          <Building className="h-6 w-6 text-primary" />
          <span>Quản lý Trường học</span>
        </Link>
      </div>
      <div className="px-3 py-4">
        <div className="mb-4">
          <h3 className="px-4 text-xs font-medium uppercase text-gray-400">
            Quản trị
          </h3>
          {renderNavLinks(filteredAdminNavItems)}
        </div>
        {filteredUserManagementItems.length > 0 && (
          <div className="mb-4">
            <h3 className="px-4 text-xs font-medium uppercase text-gray-400">
              Quản lý người dùng
            </h3>
            {renderNavLinks(filteredUserManagementItems)}
          </div>
        )}
      </div>
      <div className="mt-auto px-3 py-2">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-gray-500 dark:text-gray-400"
          onClick={logout}
        >
          <LogOut className="h-5 w-5" />
          Đăng xuất
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar for desktop */}
      {!isMobile && (
        <aside className="hidden md:flex h-screen w-64 flex-col border-r bg-background">
          {sidebarContent}
        </aside>
      )}

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 items-center border-b px-4 md:px-6">
          <div className="flex items-center gap-4">
            {isMobile && (
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-72">
                  {sidebarContent}
                </SheetContent>
              </Sheet>
            )}
            <h1 className="text-lg font-medium">
              {location.pathname === "/dashboard"
                ? "Tổng quan"
                : location.pathname.split("/").pop()?.charAt(0).toUpperCase() +
                  location.pathname.split("/").pop()?.slice(1)}
            </h1>
          </div>
          <div className="ml-auto flex items-center gap-4">
            <NotificationBell />
            <ThemeSwitcher />
            <Link to="/profile" className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <img
                  src={user?.avatarUrl || "https://api.dicebear.com/7.x/initials/svg?seed=User"}
                  alt="avatar"
                  className="h-8 w-8 rounded-full"
                />
                <div className="hidden md:block">
                  <p className="text-sm font-medium">{user?.name || "User"}</p>
                  <p className="text-xs text-gray-500">{user?.roles[0] || "User"}</p>
                </div>
              </div>
            </Link>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
