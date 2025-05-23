import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { Logo } from "@/assets/logo";
import {
  CalendarDays,
  ChevronDown,
  LogOut,
  Menu,
  User,
  Building2,
  Users,
  LayoutDashboard,
  Settings,
  BookOpen,
  CalendarCheck,
  MessageCircle,
  Megaphone,
} from "lucide-react";
import { NotificationBell } from "./NotificationBell";
import { useMediaQuery } from "@/hooks/use-mobile";
import { useIsMobile } from "@/hooks/use-mobile";

const MainNavigation = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  const MenuItem = ({ to, label, icon: Icon, active }: { to: string; label: string; icon: React.ElementType; active: boolean }) => {
    return (
      <Link
        to={to}
        className={cn(
          "flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors",
          active
            ? "bg-primary/10 text-primary font-medium"
            : "hover:bg-muted"
        )}
        onClick={() => setIsOpen(false)}
      >
        <Icon className="h-4 w-4" />
        <span>{label}</span>
      </Link>
    );
  };

  // Navigation links grouped by categories
  const navigationLinks = [
    {
      title: "Trang chủ",
      to: "/",
      icon: LayoutDashboard,
      active: isActive("/"),
    },
    {
      title: "Quản lý sự kiện",
      to: "/events",
      icon: CalendarDays,
      active: isActive("/events"),
    },
    {
      title: "Quản lý cơ sở vật chất",
      to: "/facilities",
      icon: Building2,
      active: isActive("/facilities"),
    },
    {
      title: "Quản lý người dùng",
      to: "/users",
      icon: Users,
      active: isActive("/users"),
    },
    {
      title: "Quản lý đơn vị",
      to: "/units",
      icon: Building2,
      active: isActive("/units"),
    },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="flex items-center gap-1 mr-4">
          <Link to="/" className="flex items-center gap-2">
            <Logo className="h-6 w-6" />
            <span className="font-bold text-xl hidden md:inline-block">
              PTIT Events
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        {!isMobile && (
          <NavigationMenu className="hidden md:flex flex-1 justify-start">
            <NavigationMenuList>
              <NavigationMenuItem>
                {/* Fix: Remove legacyBehavior and passHref props */}
                <Link to="/">
                  <NavigationMenuLink
                    className={cn(
                      navigationMenuTriggerStyle(),
                      isActive("/") && "bg-accent text-accent-foreground"
                    )}
                  >
                    Trang chủ
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger
                  className={cn(
                    isActive("/events") && "bg-accent text-accent-foreground"
                  )}
                >
                  Sự kiện
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    <div>
                      <h4 className="text-sm font-medium leading-none mb-3">
                        Xem sự kiện
                      </h4>
                      <div className="grid gap-1">
                        <Link
                          to="/events"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground"
                        >
                          <div className="text-sm font-medium leading-none">
                            Tất cả sự kiện
                          </div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Danh sách tất cả sự kiện trong hệ thống
                          </p>
                        </Link>
                        <Link
                          to="/dashboard/events"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground"
                        >
                          <div className="text-sm font-medium leading-none">
                            Thống kê sự kiện
                          </div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Xem thống kê tổng quan về các sự kiện
                          </p>
                        </Link>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium leading-none mb-3">
                        Quản lý
                      </h4>
                      <div className="grid gap-1">
                        <Link
                          to="/events/new"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground"
                        >
                          <div className="text-sm font-medium leading-none">
                            Tạo sự kiện mới
                          </div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Tạo một sự kiện mới và quản lý thông tin
                          </p>
                        </Link>
                        <Link
                          to="/events/approve"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground"
                        >
                          <div className="text-sm font-medium leading-none">
                            Phê duyệt sự kiện
                          </div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Duyệt các sự kiện đang chờ phê duyệt
                          </p>
                        </Link>
                        <Link
                          to="/events/cancel-requests"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground"
                        >
                          <div className="text-sm font-medium leading-none">
                            Yêu cầu hủy sự kiện
                          </div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Quản lý các yêu cầu hủy sự kiện
                          </p>
                        </Link>
                      </div>
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger
                  className={cn(
                    isActive("/facilities") &&
                      "bg-accent text-accent-foreground"
                  )}
                >
                  Cơ sở vật chất
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    <div>
                      <h4 className="text-sm font-medium leading-none mb-3">
                        Quản lý phòng
                      </h4>
                      <div className="grid gap-1">
                        <Link
                          to="/facilities/rooms"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground"
                        >
                          <div className="text-sm font-medium leading-none">
                            Danh sách phòng
                          </div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Quản lý tất cả các phòng trong trường
                          </p>
                        </Link>
                        <Link
                          to="/dashboard/facilities"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground"
                        >
                          <div className="text-sm font-medium leading-none">
                            Thống kê sử dụng
                          </div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Xem thống kê việc sử dụng phòng và thiết bị
                          </p>
                        </Link>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium leading-none mb-3">
                        Yêu cầu mượn & đổi
                      </h4>
                      <div className="grid gap-1">
                        <Link
                          to="/facilities/room-requests"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground"
                        >
                          <div className="text-sm font-medium leading-none">
                            Yêu cầu mượn phòng
                          </div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Quản lý các yêu cầu mượn phòng cho sự kiện
                          </p>
                        </Link>
                        <Link
                          to="/facilities/room-change-requests"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground"
                        >
                          <div className="text-sm font-medium leading-none">
                            Yêu cầu đổi phòng
                          </div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Xử lý các yêu cầu đổi phòng từ người tổ chức
                          </p>
                        </Link>
                        <Link
                          to="/facilities/equipment"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground"
                        >
                          <div className="text-sm font-medium leading-none">
                            Trang thiết bị
                          </div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Quản lý các trang thiết bị trong trường
                          </p>
                        </Link>
                      </div>
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger
                  className={cn(
                    (isActive("/units") || isActive("/users")) &&
                      "bg-accent text-accent-foreground"
                  )}
                >
                  Quản lý
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    <div>
                      <h4 className="text-sm font-medium leading-none mb-3">
                        Quản lý đơn vị
                      </h4>
                      <div className="grid gap-1">
                        <Link
                          to="/units/departments"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground"
                        >
                          <div className="text-sm font-medium leading-none">
                            Khoa
                          </div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Quản lý thông tin các khoa
                          </p>
                        </Link>
                        <Link
                          to="/units/clubs"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground"
                        >
                          <div className="text-sm font-medium leading-none">
                            Câu lạc bộ
                          </div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Quản lý thông tin các câu lạc bộ
                          </p>
                        </Link>
                        <Link
                          to="/units/union"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground"
                        >
                          <div className="text-sm font-medium leading-none">
                            Đoàn thanh niên
                          </div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Quản lý cơ cấu đoàn thanh niên
                          </p>
                        </Link>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium leading-none mb-3">
                        Quản lý người dùng
                      </h4>
                      <div className="grid gap-1">
                        <Link
                          to="/users/students"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground"
                        >
                          <div className="text-sm font-medium leading-none">
                            Sinh viên
                          </div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Quản lý thông tin sinh viên
                          </p>
                        </Link>
                        <Link
                          to="/users/lecturers"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground"
                        >
                          <div className="text-sm font-medium leading-none">
                            Giảng viên
                          </div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Quản lý thông tin giảng viên
                          </p>
                        </Link>
                        <Link
                          to="/users/roles"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground"
                        >
                          <div className="text-sm font-medium leading-none">
                            Phân quyền
                          </div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Quản lý vai trò và phân quyền
                          </p>
                        </Link>
                      </div>
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        )}

        {/* Mobile menu trigger */}
        {isMobile && (
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] sm:w-[350px]">
              <div className="flex items-center gap-2 mb-6">
                <Logo className="h-6 w-6" />
                <span className="font-bold text-lg">PTIT Events</span>
              </div>
              <div className="flex flex-col gap-1 mt-4">
                {navigationLinks.map((link) => (
                  <MenuItem
                    key={link.to}
                    to={link.to}
                    label={link.title}
                    icon={link.icon}
                    active={link.active}
                  />
                ))}
              </div>
              <div className="absolute bottom-4 left-4 right-4">
                {user ? (
                  <div className="border rounded-md p-3 flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatarUrl} alt={user.name} />
                        <AvatarFallback>{user.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{user.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {user.email}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      className="w-full mt-2"
                      onClick={() => {
                        logout();
                        setIsOpen(false);
                      }}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Đăng xuất
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Link to="/login" className="w-full" onClick={() => setIsOpen(false)}>
                      <Button className="w-full">Đăng nhập</Button>
                    </Link>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        )}

        <div className="flex items-center ml-auto gap-4">
          <ThemeSwitcher />
          <NotificationBell />

          {/* User Menu (Desktop) */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full md:flex hidden"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatarUrl} alt={user.name} />
                    <AvatarFallback>{user.name[0]}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user.name}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <Link to="/profile">
                  <DropdownMenuItem className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Thông tin cá nhân</span>
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuItem onClick={() => logout()}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Đăng xuất</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/login" className="hidden md:block">
              <Button>Đăng nhập</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default MainNavigation;
