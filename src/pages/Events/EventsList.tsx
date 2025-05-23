import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import MainNavigation from '@/components/MainNavigation';
import { useAuth } from '@/context/AuthContext';
import { useRole } from '@/context/RoleContext';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from '@/components/ui/table';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  CalendarPlus, 
  FileText, 
  Search, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Calendar,
  Users,
  MapPin,
  CalendarDays,
  GraduationCap,
  Award,
  Music2,
  Box,
  UserPlus
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { UserRole, canViewEvent } from '@/lib/roles';
import { useIsMobile } from '@/hooks/use-mobile';

// Mock data for events
const mockEvents = [
  {
    id: '1',
    title: 'Hội nghị Khoa học Công nghệ 2023',
    type: 'seminar',
    startDate: '2023-11-15T08:00:00',
    endDate: '2023-11-15T17:00:00',
    location: 'Hội trường A',
    status: 'approved',
    isPublic: true,
    hostUnit: 'Khoa Công nghệ Thông tin',
    hostUnitId: '2',
    participants: 150,
    description: 'Hội nghị chia sẻ các kết quả nghiên cứu mới nhất trong lĩnh vực CNTT và ứng dụng thực tiễn.',
    imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1170',
    hasRoom: true
  },
  {
    id: '2',
    title: 'Workshop Kỹ năng mềm cho sinh viên',
    type: 'training',
    startDate: '2023-11-20T13:30:00',
    endDate: '2023-11-20T17:00:00',
    location: 'Phòng hội thảo B2-01',
    status: 'pending',
    isPublic: true,
    hostUnit: 'Phòng Công tác Sinh viên',
    hostUnitId: '5',
    participants: 80,
    description: 'Chuỗi workshop trang bị kỹ năng giao tiếp, làm việc nhóm và quản lý thời gian hiệu quả.',
    imageUrl: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=1170',
    hasRoom: false
  },
  {
    id: '3',
    title: 'Cuộc thi Lập trình IoT 2023',
    type: 'competition',
    startDate: '2023-12-01T08:00:00',
    endDate: '2023-12-02T17:00:00',
    location: 'Khu vực thực hành',
    status: 'approved',
    isPublic: true,
    hostUnit: 'CLB IT',
    hostUnitId: '3',
    participants: 200,
    description: 'Cuộc thi lập trình với các ứng dụng IoT thực tế, tạo cơ hội cho sinh viên thể hiện khả năng sáng tạo.',
    imageUrl: 'https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?q=80&w=1170',
    hasRoom: true
  },
  {
    id: '4',
    title: 'Họp Hội đồng Khoa học',
    type: 'meeting',
    startDate: '2023-11-10T14:00:00',
    endDate: '2023-11-10T16:30:00',
    location: 'Phòng họp A3-01',
    status: 'cancelled',
    isPublic: false,
    hostUnit: 'Ban Giám hiệu',
    hostUnitId: '1',
    participants: 25,
    description: 'Cuộc họp định kỳ của Hội đồng Khoa học để thảo luận về các đề tài nghiên cứu mới.',
    imageUrl: '',
    hasRoom: true
  },
  {
    id: '5',
    title: 'Đêm nhạc Chào tân sinh viên',
    type: 'culture',
    startDate: '2023-10-25T18:30:00',
    endDate: '2023-10-25T21:30:00',
    location: 'Sân vận động',
    status: 'completed',
    isPublic: true,
    hostUnit: 'Đoàn Thanh niên',
    hostUnitId: '4',
    participants: 500,
    description: 'Chương trình văn nghệ chào đón tân sinh viên với nhiều tiết mục đặc sắc từ các CLB văn nghệ.',
    imageUrl: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=1170',
    hasRoom: true
  },
  {
    id: '6',
    title: 'Hội thảo công nghệ AI trong giáo dục',
    type: 'seminar',
    startDate: '2023-12-15T09:00:00',
    endDate: '2023-12-15T16:00:00',
    location: 'Hội trường B',
    status: 'approved',
    isPublic: true,
    hostUnit: 'Khoa CNTT',
    hostUnitId: '2',
    participants: 120,
    description: 'Hội thảo thảo luận về cách ứng dụng AI trong việc cải thiện phương pháp giảng dạy và học tập.',
    imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=1170',
    hasRoom: true
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

const formatShortDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('vi-VN', { 
    day: '2-digit', 
    month: '2-digit'
  }).format(date);
};

const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('vi-VN', { 
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

// Helper function to get event type display
const getEventTypeDisplay = (type: string) => {
  switch(type) {
    case 'meeting':
      return 'Họp / Hội nghị';
    case 'seminar':
      return 'Hội thảo / Tọa đàm';
    case 'competition':
      return 'Cuộc thi';
    case 'training':
      return 'Đào tạo / Workshop';
    case 'culture':
      return 'Văn hóa / Nghệ thuật';
    default:
      return 'Khác';
  }
};

// Helper function to get event type icon
const getEventTypeIcon = (type: string) => {
  switch(type) {
    case 'meeting':
      return <Users className="h-5 w-5 text-blue-500" />;
    case 'seminar':
      return <FileText className="h-5 w-5 text-indigo-500" />;
    case 'competition':
      return <Award className="h-5 w-5 text-yellow-500" />;
    case 'training':
      return <GraduationCap className="h-5 w-5 text-green-500" />;
    case 'culture':
      return <Music2 className="h-5 w-5 text-purple-500" />;
    default:
      return <Calendar className="h-5 w-5 text-gray-500" />;
  }
};

const EventsList = () => {
  const { user } = useAuth();
  const { hasAccess } = useRole();
  const isMobile = useIsMobile();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [showEventDetails, setShowEventDetails] = useState(false);
  
  // Check if the user is authorized to see events for their unit
  const userCanManageUnitEvents = user && (
    user.roles.includes('TRUONG_KHOA') || 
    user.roles.includes('TRUONG_CLB') || 
    user.roles.includes('BI_THU_DOAN')
  );
  
  // Filter events based on search term, filters, and permissions
  const filteredEvents = mockEvents.filter(event => {
    // Permission check
    if (!user) return event.isPublic && event.status === 'approved';
    
    // Admin role users can see all events
    let canView = user.roles.some(role => 
      canViewEvent(role, event.status, event.isPublic)
    );

    // Additionally, unit leaders can see events related to their units even if not public
    if (!canView && userCanManageUnitEvents && user.donViId === event.hostUnitId) {
      canView = true;
    }
    
    if (!canView) return false;
    
    // Search term filter
    const matchesSearch = 
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.hostUnit.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase());
      
    // Type filter
    const matchesType = filterType === 'all' || event.type === filterType;
    
    // Status filter
    const matchesStatus = filterStatus === 'all' || event.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  // Function to open event details dialog
  const openEventDetails = (event: any) => {
    setSelectedEvent(event);
    setShowEventDetails(true);
  };

  // Check if user can manage participants for a specific event
  const canManageParticipants = (event: any) => {
    if (!user || !event) return false;
    if (!userCanManageUnitEvents) return false;
    
    // User can only manage participants for events related to their unit and that have rooms assigned
    return user.donViId === event.hostUnitId && 
           event.hasRoom && 
           ['approved', 'completed'].includes(event.status);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <MainNavigation />
      
      <main className="flex-1 container py-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Quản lý sự kiện</h1>
              <p className="text-muted-foreground">Danh sách các sự kiện và trạng thái xử lý</p>
            </div>
            <div className="flex gap-2">
              {hasAccess('create', 'SuKien') && (
                <Link to="/events/new">
                  <Button className="flex gap-2">
                    <CalendarPlus className="h-4 w-4" />
                    <span>Tạo sự kiện mới</span>
                  </Button>
                </Link>
              )}
            </div>
          </div>

          <Tabs defaultValue="all" className="space-y-4">
            <div className="flex justify-between overflow-x-auto">
              <TabsList>
                <TabsTrigger value="all">Tất cả</TabsTrigger>
                {userCanManageUnitEvents && <TabsTrigger value="myunit">Đơn vị của tôi</TabsTrigger>}
                <TabsTrigger value="upcoming">Sắp diễn ra</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="all" className="space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Tất cả sự kiện</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Tìm kiếm theo tên hoặc đơn vị..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <div className="flex gap-4 flex-col sm:flex-row">
                      <Select value={filterType} onValueChange={setFilterType}>
                        <SelectTrigger className="w-full sm:w-[180px]">
                          <SelectValue placeholder="Loại sự kiện" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Tất cả loại</SelectItem>
                          <SelectItem value="meeting">Họp / Hội nghị</SelectItem>
                          <SelectItem value="seminar">Hội thảo / Tọa đàm</SelectItem>
                          <SelectItem value="competition">Cuộc thi</SelectItem>
                          <SelectItem value="training">Đào tạo / Workshop</SelectItem>
                          <SelectItem value="culture">Văn hóa / Nghệ thuật</SelectItem>
                          <SelectItem value="other">Khác</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select value={filterStatus} onValueChange={setFilterStatus}>
                        <SelectTrigger className="w-full sm:w-[180px]">
                          <SelectValue placeholder="Trạng thái" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Tất cả trạng thái</SelectItem>
                          <SelectItem value="pending">Chờ duyệt</SelectItem>
                          <SelectItem value="approved">Đã duyệt</SelectItem>
                          <SelectItem value="rejected">Bị từ chối</SelectItem>
                          <SelectItem value="cancelled">Đã hủy</SelectItem>
                          <SelectItem value="completed">Đã hoàn thành</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <Tabs defaultValue={isMobile ? "cards" : "table"}>
                    <TabsList className="mb-4">
                      <TabsTrigger value="cards">Hiển thị thẻ</TabsTrigger>
                      <TabsTrigger value="table">Hiển thị bảng</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="cards">
                      {filteredEvents.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {filteredEvents.map((event) => (
                            <Card key={event.id} className="overflow-hidden transition-all hover:shadow-md">
                              <div className="aspect-video bg-muted relative">
                                {event.imageUrl ? (
                                  <img 
                                    src={event.imageUrl} 
                                    alt={event.title} 
                                    className="object-cover w-full h-full"
                                  />
                                ) : (
                                  <div className="flex items-center justify-center h-full bg-gray-100 dark:bg-gray-800">
                                    <Calendar className="h-12 w-12 text-gray-400" />
                                  </div>
                                )}
                                <div className="absolute top-2 right-2">
                                  {getStatusBadge(event.status)}
                                </div>
                                {!event.isPublic && (
                                  <div className="absolute top-2 left-2">
                                    <Badge variant="outline" className="bg-black bg-opacity-50 text-white">
                                      Riêng tư
                                    </Badge>
                                  </div>
                                )}
                              </div>
                              
                              <CardHeader className="p-4 pb-2">
                                <div className="flex items-start justify-between">
                                  <CardTitle className="text-lg line-clamp-2">{event.title}</CardTitle>
                                </div>
                                <CardDescription>
                                  {getEventTypeDisplay(event.type)}
                                </CardDescription>
                              </CardHeader>
                              
                              <CardContent className="p-4 pt-0 space-y-2">
                                <div className="flex items-center text-sm text-muted-foreground">
                                  <CalendarDays className="mr-1 h-4 w-4" />
                                  <span>
                                    {formatShortDate(event.startDate)} • {formatTime(event.startDate)}
                                  </span>
                                </div>
                                
                                <div className="flex items-center text-sm text-muted-foreground">
                                  <MapPin className="mr-1 h-4 w-4" />
                                  <span>{event.location}</span>
                                </div>
                                
                                <div className="flex items-center text-sm text-muted-foreground">
                                  <Users className="mr-1 h-4 w-4" />
                                  <span>{event.hostUnit}</span>
                                </div>
                              </CardContent>
                              
                              <CardFooter className="p-4 pt-0 flex gap-2">
                                <Button 
                                  variant="outline"
                                  className="flex-1"
                                  onClick={() => openEventDetails(event)}
                                >
                                  Chi tiết
                                </Button>
                                
                                {canManageParticipants(event) && (
                                  <Link to={`/events/${event.id}/participants`} className="flex-1">
                                    <Button className="w-full">
                                      <UserPlus className="h-4 w-4 mr-1" /> 
                                      Mời người tham gia
                                    </Button>
                                  </Link>
                                )}
                              </CardFooter>
                            </Card>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-10 text-muted-foreground">
                          Không có sự kiện nào phù hợp với tiêu chí tìm kiếm
                        </div>
                      )}
                    </TabsContent>
                    
                    <TabsContent value="table">
                      <div className="rounded-md border overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-[300px]">Tên sự kiện</TableHead>
                              <TableHead>Loại</TableHead>
                              <TableHead>Thời gian</TableHead>
                              <TableHead>Đơn vị tổ chức</TableHead>
                              <TableHead className="text-center">Dự kiến</TableHead>
                              <TableHead className="text-center">Trạng thái</TableHead>
                              <TableHead className="text-right">Thao tác</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {filteredEvents.length > 0 ? (
                              filteredEvents.map((event) => (
                                <TableRow key={event.id}>
                                  <TableCell className="font-medium">
                                    {event.title}
                                    {!event.isPublic && (
                                      <Badge variant="outline" className="ml-2 text-xs">Riêng tư</Badge>
                                    )}
                                  </TableCell>
                                  <TableCell>{getEventTypeDisplay(event.type)}</TableCell>
                                  <TableCell>
                                    <div className="flex flex-col">
                                      <span className="text-sm">Bắt đầu: {formatDate(event.startDate)}</span>
                                      <span className="text-sm">Kết thúc: {formatDate(event.endDate)}</span>
                                    </div>
                                  </TableCell>
                                  <TableCell>{event.hostUnit}</TableCell>
                                  <TableCell className="text-center">{event.participants} người</TableCell>
                                  <TableCell className="text-center">{getStatusBadge(event.status)}</TableCell>
                                  <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                      <Button 
                                        variant="outline" 
                                        size="sm"
                                        onClick={() => openEventDetails(event)}
                                      >
                                        <FileText className="h-4 w-4 mr-1" />
                                        Chi tiết
                                      </Button>
                                      
                                      {canManageParticipants(event) && (
                                        <Link to={`/events/${event.id}/participants`}>
                                          <Button size="sm">
                                            <UserPlus className="h-4 w-4 mr-1" /> 
                                            Mời
                                          </Button>
                                        </Link>
                                      )}
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ))
                            ) : (
                              <TableRow>
                                <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                                  Không có sự kiện nào phù hợp với tiêu chí tìm kiếm
                                </TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </TabsContent>
            
            {userCanManageUnitEvents && (
              <TabsContent value="myunit" className="space-y-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle>Sự kiện của đơn vị</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {filteredEvents
                      .filter(event => event.hostUnitId === user?.donViId)
                      .length > 0 ? (
                      <div className="rounded-md border overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Tên sự kiện</TableHead>
                              <TableHead>Thời gian</TableHead>
                              <TableHead>Địa điểm</TableHead>
                              <TableHead className="text-center">Trạng thái</TableHead>
                              <TableHead className="text-right">Thao tác</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {filteredEvents
                              .filter(event => event.hostUnitId === user?.donViId)
                              .map((event) => (
                                <TableRow key={event.id}>
                                  <TableCell className="font-medium">{event.title}</TableCell>
                                  <TableCell>
                                    <div className="flex flex-col">
                                      <span className="text-sm">{formatDate(event.startDate)}</span>
                                      <span className="text-sm text-muted-foreground">đến {formatDate(event.endDate)}</span>
                                    </div>
                                  </TableCell>
                                  <TableCell>{event.location || 'Chưa xác định'}</TableCell>
                                  <TableCell className="text-center">{getStatusBadge(event.status)}</TableCell>
                                  <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                      <Button 
                                        variant="outline" 
                                        size="sm"
                                        onClick={() => openEventDetails(event)}
                                      >
                                        Chi tiết
                                      </Button>
                                      
                                      {canManageParticipants(event) && (
                                        <Link to={`/events/${event.id}/participants`}>
                                          <Button size="sm">
                                            <UserPlus className="h-4 w-4 mr-1" /> 
                                            Mời người tham gia
                                          </Button>
                                        </Link>
                                      )}
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ))}
                          </TableBody>
                        </Table>
                      </div>
                    ) : (
                      <div className="text-center py-10 text-muted-foreground">
                        Không có sự kiện nào thuộc đơn vị của bạn
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            )}
            
            <TabsContent value="upcoming" className="space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Sự kiện sắp diễn ra</CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Filter for upcoming events (those in the future) */}
                  {filteredEvents
                    .filter(event => new Date(event.startDate) > new Date())
                    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
                    .slice(0, 5)
                    .length > 0 ? (
                    <div className="space-y-4">
                      {filteredEvents
                        .filter(event => new Date(event.startDate) > new Date())
                        .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
                        .slice(0, 5)
                        .map((event) => (
                          <Card key={event.id} className="overflow-hidden">
                            <div className="flex flex-col md:flex-row">
                              <div className="md:w-1/4 p-4 flex items-center justify-center bg-muted">
                                <div className="text-center">
                                  <div className="text-3xl font-bold">
                                    {new Date(event.startDate).getDate()}
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    Tháng {new Date(event.startDate).getMonth() + 1}
                                  </div>
                                  <div className="text-sm mt-2">
                                    {formatTime(event.startDate)}
                                  </div>
                                </div>
                              </div>
                              <div className="md:w-3/4 p-4">
                                <div className="flex flex-col h-full justify-between">
                                  <div>
                                    <h3 className="text-lg font-medium mb-2">{event.title}</h3>
                                    <div className="flex items-center text-sm text-muted-foreground mb-1">
                                      <MapPin className="mr-1 h-4 w-4" />
                                      <span>{event.location}</span>
                                    </div>
                                    <div className="flex items-center text-sm text-muted-foreground">
                                      <Users className="mr-1 h-4 w-4" />
                                      <span>{event.hostUnit}</span>
                                    </div>
                                  </div>
                                  <div className="flex justify-end gap-2 mt-4">
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      onClick={() => openEventDetails(event)}
                                    >
                                      Chi tiết
                                    </Button>
                                    
                                    {canManageParticipants(event) && (
                                      <Link to={`/events/${event.id}/participants`}>
                                        <Button size="sm">
                                          <UserPlus className="h-4 w-4 mr-1" /> 
                                          Mời người tham gia
                                        </Button>
                                      </Link>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Card>
                        ))}
                    </div>
                  ) : (
                    <div className="text-center py-10 text-muted-foreground">
                      Không có sự kiện nào sắp diễn ra
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>
      
      {/* Event Details Dialog */}
      {selectedEvent && (
        <Dialog open={showEventDetails} onOpenChange={setShowEventDetails}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle className="text-xl">{selectedEvent.title}</DialogTitle>
              <DialogDescription>
                {getEventTypeDisplay(selectedEvent.type)} • {selectedEvent.hostUnit}
              </DialogDescription>
            </DialogHeader>
            {selectedEvent.imageUrl && (
              <div className="aspect-video w-full overflow-hidden rounded-md">
                <img 
                  src={selectedEvent.imageUrl} 
                  alt={selectedEvent.title} 
                  className="object-cover w-full h-full"
                />
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium">Thời gian</h3>
                <p className="text-sm text-muted-foreground">
                  Bắt đầu: {formatDate(selectedEvent.startDate)}
                </p>
                <p className="text-sm text-muted-foreground">
                  Kết thúc: {formatDate(selectedEvent.endDate)}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium">Địa điểm</h3>
                <p className="text-sm text-muted-foreground">{selectedEvent.location}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium">Đơn vị tổ chức</h3>
                <p className="text-sm text-muted-foreground">{selectedEvent.hostUnit}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium">Số người tham gia</h3>
                <p className="text-sm text-muted-foreground">{selectedEvent.participants} người</p>
              </div>
              <div className="col-span-1 md:col-span-2">
                <h3 className="text-sm font-medium">Trạng thái</h3>
                <div className="mt-1">{getStatusBadge(selectedEvent.status)}</div>
              </div>
              <div className="col-span-1 md:col-span-2">
                <h3 className="text-sm font-medium">Mô tả</h3>
                <p className="text-sm text-muted-foreground mt-1">{selectedEvent.description}</p>
              </div>
            </div>
            
            <div className="flex justify-end gap-2 flex-wrap">
              {selectedEvent.status === 'approved' && (
                <>
                  {hasAccess('create', 'YeuCauMuonPhong') && (
                    <Link to={`/facilities/room-requests/new?eventId=${selectedEvent.id}`}>
                      <Button variant="outline">Yêu cầu mượn phòng</Button>
                    </Link>
                  )}
                  
                  {canManageParticipants(selectedEvent) && (
                    <Link to={`/events/${selectedEvent.id}/participants`}>
                      <Button>
                        <UserPlus className="h-4 w-4 mr-1" /> 
                        Mời người tham gia
                      </Button>
                    </Link>
                  )}
                </>
              )}
              
              <Link to={`/events/${selectedEvent.id}`}>
                <Button>Xem chi tiết đầy đủ</Button>
              </Link>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default EventsList;
