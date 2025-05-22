
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import MainNavigation from '@/components/MainNavigation';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  Calendar 
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

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
    hostUnit: 'Khoa Công nghệ Thông tin',
    participants: 150,
  },
  {
    id: '2',
    title: 'Workshop Kỹ năng mềm cho sinh viên',
    type: 'training',
    startDate: '2023-11-20T13:30:00',
    endDate: '2023-11-20T17:00:00',
    location: 'Phòng hội thảo B2-01',
    status: 'pending',
    hostUnit: 'Phòng Công tác Sinh viên',
    participants: 80,
  },
  {
    id: '3',
    title: 'Cuộc thi Lập trình IoT 2023',
    type: 'competition',
    startDate: '2023-12-01T08:00:00',
    endDate: '2023-12-02T17:00:00',
    location: 'Khu vực thực hành',
    status: 'approved',
    hostUnit: 'CLB IT',
    participants: 200,
  },
  {
    id: '4',
    title: 'Họp Hội đồng Khoa học',
    type: 'meeting',
    startDate: '2023-11-10T14:00:00',
    endDate: '2023-11-10T16:30:00',
    location: 'Phòng họp A3-01',
    status: 'cancelled',
    hostUnit: 'Ban Giám hiệu',
    participants: 25,
  },
  {
    id: '5',
    title: 'Đêm nhạc Chào tân sinh viên',
    type: 'culture',
    startDate: '2023-10-25T18:30:00',
    endDate: '2023-10-25T21:30:00',
    location: 'Sân vận động',
    status: 'completed',
    hostUnit: 'Đoàn Thanh niên',
    participants: 500,
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

const EventsList = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  
  // Filter events based on search term and filters
  const filteredEvents = mockEvents.filter(event => {
    // Search term filter
    const matchesSearch = 
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.hostUnit.toLowerCase().includes(searchTerm.toLowerCase());
      
    // Type filter
    const matchesType = filterType === 'all' || event.type === filterType;
    
    // Status filter
    const matchesStatus = filterStatus === 'all' || event.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="flex min-h-screen flex-col">
      <MainNavigation />
      
      <main className="flex-1 container py-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Quản lý sự kiện</h1>
              <p className="text-muted-foreground">Danh sách các sự kiện và trạng thái xử lý</p>
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

          <Tabs defaultValue="all" className="space-y-4">
            <div className="flex justify-between">
              <TabsList>
                <TabsTrigger value="all">Tất cả</TabsTrigger>
                <TabsTrigger value="mine">Sự kiện của tôi</TabsTrigger>
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
                    <div className="flex gap-4">
                      <Select value={filterType} onValueChange={setFilterType}>
                        <SelectTrigger className="w-[180px]">
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
                        <SelectTrigger className="w-[180px]">
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
                  
                  <div className="rounded-md border">
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
                              <TableCell className="font-medium">{event.title}</TableCell>
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
                                <Link to={`/events/${event.id}`}>
                                  <Button variant="outline" size="sm">
                                    <FileText className="h-4 w-4 mr-1" />
                                    Chi tiết
                                  </Button>
                                </Link>
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
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="mine" className="space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Sự kiện của tôi</CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Similar content as "all" tab but filtered for current user's events */}
                  <p className="text-muted-foreground text-center py-6">
                    Các sự kiện do bạn tạo hoặc được giao quản lý sẽ hiển thị ở đây
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="upcoming" className="space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Sự kiện sắp diễn ra</CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Similar content as "all" tab but filtered for upcoming events */}
                  <p className="text-muted-foreground text-center py-6">
                    Các sự kiện sắp diễn ra trong 7 ngày tới sẽ hiển thị ở đây
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>
    </div>
  );
};

export default EventsList;
