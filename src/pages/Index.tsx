
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import MainNavigation from '@/components/MainNavigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { PTITLogo } from '@/assets/logo';
import { motion } from 'framer-motion';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  Calendar,
  CalendarPlus,
  Users,
  Building,
  FileText,
  CheckCircle,
  CalendarX,
  Clock,
  ArrowRight,
  User,
  Settings,
  Home,
  Layers
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// Mock data for recent events
const recentEvents = [
  {
    id: '1',
    title: 'Hội nghị Khoa học Công nghệ 2023',
    date: '2023-11-15T08:00:00',
    location: 'Hội trường A',
    status: 'approved',
    hostUnit: 'Khoa Công nghệ Thông tin',
  },
  {
    id: '2',
    title: 'Workshop Kỹ năng mềm cho sinh viên',
    date: '2023-11-20T13:30:00',
    location: 'Phòng hội thảo B2-01',
    status: 'pending',
    hostUnit: 'Phòng Công tác Sinh viên',
  },
  {
    id: '3',
    title: 'Cuộc thi Lập trình IoT 2023',
    date: '2023-12-01T08:00:00',
    location: 'Khu vực thực hành',
    status: 'approved',
    hostUnit: 'CLB IT',
  },
];

// Mock data for pending approvals
const pendingApprovals = [
  {
    id: '1',
    title: 'Hội thảo Công nghệ AI trong Giáo dục',
    type: 'event',
    date: '2023-11-01T09:15:00',
    requester: 'Trần Minh Tuấn',
    unit: 'Khoa Công nghệ Thông tin',
  },
  {
    id: '2',
    title: 'Workshop Kỹ năng Lãnh đạo cho Sinh viên',
    type: 'event',
    date: '2023-11-05T10:30:00',
    requester: 'Nguyễn Hoàng Anh',
    unit: 'Phòng Công tác Sinh viên',
  },
  {
    id: '3',
    title: 'Yêu cầu đổi sang phòng lớn hơn cho Hội nghị Khoa học',
    type: 'room_change',
    date: '2023-11-05T10:23:45',
    requester: 'Nguyễn Văn A',
    unit: 'Khoa Công nghệ Thông tin',
  },
];

// Helper function to format date
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('vi-VN', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

// Helper function to get status badge
const getStatusBadge = (status: string) => {
  switch(status) {
    case 'approved':
      return <Badge className="bg-green-500">Đã duyệt</Badge>;
    case 'pending':
      return <Badge className="bg-yellow-500">Chờ duyệt</Badge>;
    case 'rejected':
      return <Badge variant="destructive">Đã từ chối</Badge>;
    case 'cancelled':
      return <Badge variant="outline" className="border-red-500 text-red-500">Đã hủy</Badge>;
    case 'completed':
      return <Badge className="bg-blue-500">Đã hoàn thành</Badge>;
    default:
      return <Badge variant="outline">Không xác định</Badge>;
  }
};

// Function to get welcome message based on user type and roles
const getWelcomeMessage = (user: any, isAuthenticated: boolean) => {
  if (!isAuthenticated) {
    return 'Chào mừng đến với Hệ thống Quản lý Sự kiện';
  }

  if (user?.roles.includes('ADMIN_HE_THONG')) {
    return 'Chào mừng Quản trị viên Hệ thống';
  }
  
  if (user?.roles.includes('BGH_DUYET_SK_TRUONG')) {
    return 'Chào mừng Ban Giám hiệu';
  }
  
  if (user?.roles.includes('CB_TO_CHUC_SU_KIEN')) {
    return 'Chào mừng Cán bộ Tổ chức Sự kiện';
  }
  
  if (user?.roles.includes('QUAN_LY_CSVC')) {
    return 'Chào mừng Quản lý Cơ sở Vật chất';
  }
  
  if (user?.roles.includes('TRUONG_KHOA')) {
    return 'Chào mừng Trưởng Khoa';
  }
  
  if (user?.roles.includes('TRUONG_CLB')) {
    return 'Chào mừng Trưởng Câu lạc bộ';
  }
  
  if (user?.userType === 'SINH_VIEN') {
    return 'Chào mừng Sinh viên';
  }
  
  if (user?.userType === 'GIANG_VIEN') {
    return 'Chào mừng Giảng viên';
  }
  
  return `Chào mừng, ${user?.name}`;
};

const Index = () => {
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  
  const renderUserDashboard = () => {
    if (!isAuthenticated) {
      return (
        <div className="container py-12">
          <motion.div 
            className="mx-auto max-w-4xl text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-6 flex justify-center">
              <PTITLogo size={80} className="text-primary" />
            </div>
            
            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Chào mừng đến với Hệ thống Quản lý Sự kiện
            </h1>
            
            <p className="mb-8 text-xl text-muted-foreground">
              Hệ thống giúp quản lý sự kiện, phòng ốc và các hoạt động của Học viện Công nghệ Bưu chính Viễn thông TPHCM với phân quyền theo vai trò.
            </p>
            
            <motion.div 
              className="flex justify-center gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Link to="/login">
                <Button size="lg" className="min-w-[150px]">
                  Đăng nhập
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      );
    }
    
    return (
      <div className="container py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center mb-4">
            <div className="mr-auto">
              <h1 className="text-3xl font-bold tracking-tight">Bảng điều khiển</h1>
              <p className="text-muted-foreground">
                {getWelcomeMessage(user, isAuthenticated)}
              </p>
            </div>
            
            {user?.roles.includes('CB_TO_CHUC_SU_KIEN') && (
              <Link to="/events/new">
                <Button className="flex gap-2">
                  <CalendarPlus className="h-4 w-4" />
                  <span>Tạo sự kiện mới</span>
                </Button>
              </Link>
            )}
          </div>
          
          {renderUserContent()}
        </motion.div>
      </div>
    );
  };
  
  const renderUserContent = () => {
    return (
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid grid-cols-3 w-full max-w-md">
          <TabsTrigger value="overview">Tổng quan</TabsTrigger>
          <TabsTrigger value="upcoming">Sắp diễn ra</TabsTrigger>
          <TabsTrigger value="actions">Thao tác nhanh</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Stats cards */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Sự kiện đang chờ xử lý
                </CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
                <p className="text-xs text-muted-foreground">
                  +2 từ tuần trước
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Sự kiện sắp diễn ra
                </CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8</div>
                <p className="text-xs text-muted-foreground">
                  +3 trong tháng này
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Yêu cầu phòng chờ duyệt
                </CardTitle>
                <Building className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4</div>
                <p className="text-xs text-muted-foreground">
                  -1 so với tuần trước
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Phòng đang sử dụng
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">
                  +2 từ hôm qua
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-7 gap-6">
            <Card className="col-span-full md:col-span-4">
              <CardHeader>
                <CardTitle>Sự kiện gần đây</CardTitle>
                <CardDescription>
                  Danh sách các sự kiện gần đây và trạng thái
                </CardDescription>
              </CardHeader>
              <CardContent className="px-2">
                <ul className="divide-y">
                  {recentEvents.map((event) => (
                    <li key={event.id} className="py-3 px-2 hover:bg-muted/50 rounded-md">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{event.title}</h3>
                          <div className="text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>{formatDate(event.date)}</span>
                            </div>
                            <div className="flex items-center gap-1 mt-1">
                              <Building className="h-3 w-3" />
                              <span>{event.location}</span>
                            </div>
                            <div className="mt-1">{event.hostUnit}</div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          {getStatusBadge(event.status)}
                          <Link to={`/events/${event.id}`} className="text-xs text-blue-500 hover:underline">
                            Chi tiết
                          </Link>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="border-t pt-3">
                <Link to="/events" className="text-sm text-blue-500 hover:underline flex items-center">
                  Xem tất cả sự kiện
                  <ArrowRight className="h-3 w-3 ml-1" />
                </Link>
              </CardFooter>
            </Card>
            
            <Card className="col-span-full md:col-span-3">
              <CardHeader>
                <CardTitle>Chờ duyệt</CardTitle>
                <CardDescription>
                  Yêu cầu đang chờ bạn duyệt
                </CardDescription>
              </CardHeader>
              <CardContent className="px-2">
                <ul className="divide-y">
                  {user?.roles.includes('BGH_DUYET_SK_TRUONG') || user?.roles.includes('QUAN_LY_CSVC') ? (
                    pendingApprovals.map((item) => (
                      <li key={item.id} className="py-3 px-2 hover:bg-muted/50 rounded-md">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{item.title}</h3>
                            <div className="text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                <span>{formatDate(item.date)}</span>
                              </div>
                              <div className="flex items-center gap-1 mt-1">
                                <User className="h-3 w-3" />
                                <span>{item.requester}</span>
                              </div>
                              <div className="mt-1">{item.unit}</div>
                            </div>
                          </div>
                          <div>
                            <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
                              {item.type === 'event' ? 'Sự kiện' : 'Đổi phòng'}
                            </Badge>
                          </div>
                        </div>
                      </li>
                    ))
                  ) : (
                    <div className="py-6 text-center text-muted-foreground">
                      Không có yêu cầu nào đang chờ bạn duyệt
                    </div>
                  )}
                </ul>
              </CardContent>
              <CardFooter className="border-t pt-3">
                {user?.roles.includes('BGH_DUYET_SK_TRUONG') && (
                  <Link to="/events/approve" className="text-sm text-blue-500 hover:underline flex items-center">
                    Đi đến trang duyệt sự kiện
                    <ArrowRight className="h-3 w-3 ml-1" />
                  </Link>
                )}
                {user?.roles.includes('QUAN_LY_CSVC') && (
                  <Link to="/facilities/room-requests" className="text-sm text-blue-500 hover:underline flex items-center">
                    Đi đến trang duyệt yêu cầu mượn phòng
                    <ArrowRight className="h-3 w-3 ml-1" />
                  </Link>
                )}
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="upcoming" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Sự kiện sắp diễn ra</CardTitle>
              <CardDescription>
                Các sự kiện sẽ diễn ra trong thời gian tới
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentEvents.slice(0, 2).map((event) => (
                  <div key={event.id} className="flex items-start gap-4 p-4 border rounded-md">
                    <div className="bg-primary/20 p-3 rounded-md">
                      <Calendar className="h-8 w-8 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-medium">{event.title}</h3>
                      <div className="text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{formatDate(event.date)}</span>
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          <Building className="h-3 w-3" />
                          <span>{event.location}</span>
                        </div>
                        <div className="mt-1">{event.hostUnit}</div>
                      </div>
                    </div>
                    <div className="ml-auto">
                      {getStatusBadge(event.status)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Link to="/events" className="text-sm text-blue-500 hover:underline flex items-center">
                Xem tất cả sự kiện
                <ArrowRight className="h-3 w-3 ml-1" />
              </Link>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="actions" className="space-y-6">
          <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {/* Quick actions based on user role */}
            {user?.roles.includes('ADMIN_HE_THONG') && (
              <>
                <Link to="/users">
                  <Card className="hover:border-primary hover:shadow-md transition-all h-full">
                    <CardHeader className="p-4 pb-0 space-y-0">
                      <CardTitle className="text-sm font-medium flex items-center">
                        <Users className="h-4 w-4 mr-2 text-primary" />
                        Quản lý người dùng
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-2">
                      <p className="text-xs text-muted-foreground">
                        Quản lý tài khoản và phân quyền người dùng
                      </p>
                    </CardContent>
                  </Card>
                </Link>
                
                <Link to="/units">
                  <Card className="hover:border-primary hover:shadow-md transition-all h-full">
                    <CardHeader className="p-4 pb-0 space-y-0">
                      <CardTitle className="text-sm font-medium flex items-center">
                        <Layers className="h-4 w-4 mr-2 text-primary" />
                        Quản lý đơn vị
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-2">
                      <p className="text-xs text-muted-foreground">
                        Quản lý thông tin các đơn vị trong trường
                      </p>
                    </CardContent>
                  </Card>
                </Link>
                
                <Link to="/settings">
                  <Card className="hover:border-primary hover:shadow-md transition-all h-full">
                    <CardHeader className="p-4 pb-0 space-y-0">
                      <CardTitle className="text-sm font-medium flex items-center">
                        <Settings className="h-4 w-4 mr-2 text-primary" />
                        Cài đặt hệ thống
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-2">
                      <p className="text-xs text-muted-foreground">
                        Cấu hình và thiết lập thông số hệ thống
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              </>
            )}
            
            {user?.roles.includes('CB_TO_CHUC_SU_KIEN') && (
              <>
                <Link to="/events/new">
                  <Card className="hover:border-primary hover:shadow-md transition-all h-full">
                    <CardHeader className="p-4 pb-0 space-y-0">
                      <CardTitle className="text-sm font-medium flex items-center">
                        <CalendarPlus className="h-4 w-4 mr-2 text-primary" />
                        Tạo sự kiện mới
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-2">
                      <p className="text-xs text-muted-foreground">
                        Tạo yêu cầu tổ chức sự kiện mới
                      </p>
                    </CardContent>
                  </Card>
                </Link>
                
                <Link to="/events">
                  <Card className="hover:border-primary hover:shadow-md transition-all h-full">
                    <CardHeader className="p-4 pb-0 space-y-0">
                      <CardTitle className="text-sm font-medium flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-primary" />
                        Quản lý sự kiện
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-2">
                      <p className="text-xs text-muted-foreground">
                        Xem và quản lý các sự kiện đã tạo
                      </p>
                    </CardContent>
                  </Card>
                </Link>
                
                <Link to="/events/cancel-requests">
                  <Card className="hover:border-primary hover:shadow-md transition-all h-full">
                    <CardHeader className="p-4 pb-0 space-y-0">
                      <CardTitle className="text-sm font-medium flex items-center">
                        <CalendarX className="h-4 w-4 mr-2 text-primary" />
                        Yêu cầu hủy sự kiện
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-2">
                      <p className="text-xs text-muted-foreground">
                        Quản lý các yêu cầu hủy sự kiện
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              </>
            )}
            
            {user?.roles.includes('QUAN_LY_CSVC') && (
              <>
                <Link to="/facilities/room-requests">
                  <Card className="hover:border-primary hover:shadow-md transition-all h-full">
                    <CardHeader className="p-4 pb-0 space-y-0">
                      <CardTitle className="text-sm font-medium flex items-center">
                        <FileText className="h-4 w-4 mr-2 text-primary" />
                        Yêu cầu mượn phòng
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-2">
                      <p className="text-xs text-muted-foreground">
                        Quản lý và xếp phòng cho các yêu cầu
                      </p>
                    </CardContent>
                  </Card>
                </Link>
                
                <Link to="/facilities/rooms">
                  <Card className="hover:border-primary hover:shadow-md transition-all h-full">
                    <CardHeader className="p-4 pb-0 space-y-0">
                      <CardTitle className="text-sm font-medium flex items-center">
                        <Building className="h-4 w-4 mr-2 text-primary" />
                        Quản lý phòng
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-2">
                      <p className="text-xs text-muted-foreground">
                        Quản lý thông tin phòng và thiết bị
                      </p>
                    </CardContent>
                  </Card>
                </Link>
                
                <Link to="/facilities/room-change-requests">
                  <Card className="hover:border-primary hover:shadow-md transition-all h-full">
                    <CardHeader className="p-4 pb-0 space-y-0">
                      <CardTitle className="text-sm font-medium flex items-center">
                        <ArrowRight className="h-4 w-4 mr-2 text-primary" />
                        Yêu cầu đổi phòng
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-2">
                      <p className="text-xs text-muted-foreground">
                        Xử lý các yêu cầu đổi phòng
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              </>
            )}
            
            {user?.roles.includes('BGH_DUYET_SK_TRUONG') && (
              <>
                <Link to="/events/approve">
                  <Card className="hover:border-primary hover:shadow-md transition-all h-full">
                    <CardHeader className="p-4 pb-0 space-y-0">
                      <CardTitle className="text-sm font-medium flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2 text-primary" />
                        Duyệt sự kiện
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-2">
                      <p className="text-xs text-muted-foreground">
                        Phê duyệt yêu cầu tổ chức sự kiện
                      </p>
                    </CardContent>
                  </Card>
                </Link>
                
                <Link to="/events/cancel-requests">
                  <Card className="hover:border-primary hover:shadow-md transition-all h-full">
                    <CardHeader className="p-4 pb-0 space-y-0">
                      <CardTitle className="text-sm font-medium flex items-center">
                        <CalendarX className="h-4 w-4 mr-2 text-primary" />
                        Yêu cầu hủy sự kiện
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-2">
                      <p className="text-xs text-muted-foreground">
                        Phê duyệt các yêu cầu hủy sự kiện
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              </>
            )}
            
            {/* Common for all users */}
            <Link to="/profile">
              <Card className="hover:border-secondary hover:shadow-md transition-all h-full">
                <CardHeader className="p-4 pb-0 space-y-0">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <User className="h-4 w-4 mr-2 text-secondary" />
                    Hồ sơ cá nhân
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-2">
                  <p className="text-xs text-muted-foreground">
                    Xem và cập nhật thông tin cá nhân
                  </p>
                </CardContent>
              </Card>
            </Link>
            
            <Link to="/events">
              <Card className="hover:border-secondary hover:shadow-md transition-all h-full">
                <CardHeader className="p-4 pb-0 space-y-0">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-secondary" />
                    Xem lịch sự kiện
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-2">
                  <p className="text-xs text-muted-foreground">
                    Xem lịch các sự kiện sắp diễn ra
                  </p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </TabsContent>
      </Tabs>
    );
  };

  return (
    <div className="flex min-h-screen flex-col">
      <MainNavigation />
      
      <main className="flex-1 bg-gradient-to-b from-background to-muted">
        {renderUserDashboard()}
      </main>

      {/* Footer */}
      <footer className="bg-muted py-6 border-t">
        <div className="container">
          <div className="flex flex-col items-center justify-center text-center">
            <PTITLogo size={40} />
            <p className="mt-4 text-sm text-muted-foreground">
              © {new Date().getFullYear()} Học viện Công nghệ Bưu chính Viễn thông TPHCM.<br/>
              Hệ thống quản lý sự kiện phát triển bởi Khoa CNTT.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
