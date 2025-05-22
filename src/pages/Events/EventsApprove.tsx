
import React, { useState } from 'react';
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
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { 
  CheckCircle, 
  XCircle, 
  Search, 
  FileText, 
  Calendar, 
  Users 
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/sonner';
import { motion } from 'framer-motion';

// Mock data for events to approve
const mockEventsToApprove = [
  {
    id: '1',
    title: 'Hội thảo Công nghệ AI trong Giáo dục',
    type: 'seminar',
    startDate: '2023-12-10T08:00:00',
    endDate: '2023-12-10T17:00:00',
    location: 'Chưa xác định',
    status: 'pending',
    hostUnit: 'Khoa Công nghệ Thông tin',
    participants: 150,
    description: 'Hội thảo tập trung vào các ứng dụng và tiềm năng của AI trong lĩnh vực giáo dục đại học và nghiên cứu. Các chuyên gia hàng đầu sẽ chia sẻ kiến thức và kinh nghiệm về cách AI có thể cải thiện trải nghiệm học tập và giảng dạy.',
    creator: 'Trần Minh Tuấn',
    createdAt: '2023-11-01T09:15:00',
  },
  {
    id: '2',
    title: 'Workshop Kỹ năng Lãnh đạo cho Sinh viên',
    type: 'training',
    startDate: '2023-12-15T13:30:00',
    endDate: '2023-12-15T17:00:00',
    location: 'Chưa xác định',
    status: 'pending',
    hostUnit: 'Phòng Công tác Sinh viên',
    participants: 80,
    description: 'Workshop nhằm trang bị cho sinh viên những kỹ năng lãnh đạo cần thiết trong môi trường học tập và làm việc. Chương trình bao gồm các hoạt động thực hành và phát triển kỹ năng giao tiếp, quản lý nhóm và giải quyết vấn đề.',
    creator: 'Nguyễn Hoàng Anh',
    createdAt: '2023-11-05T10:30:00',
  },
  {
    id: '3',
    title: 'Ngày hội Việc làm CNTT 2023',
    type: 'other',
    startDate: '2023-12-20T08:00:00',
    endDate: '2023-12-20T17:00:00',
    location: 'Chưa xác định',
    status: 'pending',
    hostUnit: 'Phòng Quan hệ Doanh nghiệp',
    participants: 300,
    description: 'Ngày hội việc làm là cơ hội để sinh viên gặp gỡ và tương tác trực tiếp với các nhà tuyển dụng từ các công ty công nghệ hàng đầu. Sự kiện bao gồm các buổi phỏng vấn tại chỗ, tư vấn nghề nghiệp và cơ hội thực tập.',
    creator: 'Lê Thị Hương',
    createdAt: '2023-11-08T14:45:00',
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

// EventsApprove component
const EventsApprove = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [reasonText, setReasonText] = useState('');
  const [openApproveDialog, setOpenApproveDialog] = useState(false);
  const [openRejectDialog, setOpenRejectDialog] = useState(false);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  
  // Ensure user is BGH
  const isBGH = user?.roles.includes('BGH_DUYET_SK_TRUONG');
  
  // Filter events based on search term
  const filteredEvents = mockEventsToApprove.filter(event => {
    return (
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.hostUnit.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.creator.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });
  
  // Get selected event
  const getSelectedEvent = () => {
    return mockEventsToApprove.find(event => event.id === selectedEvent);
  };
  
  // Handle approve event
  const handleApprove = () => {
    toast.success('Đã duyệt sự kiện thành công');
    setOpenApproveDialog(false);
  };
  
  // Handle reject event
  const handleReject = () => {
    if (!reasonText.trim()) {
      toast.error('Vui lòng nhập lý do từ chối');
      return;
    }
    toast.success('Đã từ chối sự kiện thành công');
    setOpenRejectDialog(false);
    setReasonText('');
  };

  if (!isBGH) {
    return (
      <div className="flex min-h-screen flex-col">
        <MainNavigation />
        <div className="flex-1 container py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Bạn không có quyền truy cập trang này</h1>
          <p className="text-muted-foreground">Trang này chỉ dành cho Ban Giám Hiệu duyệt sự kiện</p>
        </div>
      </div>
    );
  }

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
              <h1 className="text-3xl font-bold tracking-tight">Duyệt sự kiện</h1>
              <p className="text-muted-foreground">Danh sách các sự kiện đang chờ Ban Giám Hiệu duyệt</p>
            </div>
          </div>

          <Tabs defaultValue="pending" className="space-y-4">
            <TabsList>
              <TabsTrigger value="pending">Đang chờ duyệt</TabsTrigger>
              <TabsTrigger value="history">Lịch sử</TabsTrigger>
            </TabsList>
            
            <TabsContent value="pending" className="space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Sự kiện chờ duyệt</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative mb-6">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Tìm kiếm theo tên sự kiện, đơn vị tổ chức hoặc người tạo..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
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
                              <TableCell className="text-right">
                                <div className="flex gap-2 justify-end">
                                  <Dialog open={openDetailsDialog && selectedEvent === event.id} onOpenChange={(open) => {
                                    if (!open) setSelectedEvent(null);
                                    setOpenDetailsDialog(open);
                                  }}>
                                    <DialogTrigger asChild>
                                      <Button 
                                        variant="outline" 
                                        size="sm"
                                        onClick={() => setSelectedEvent(event.id)}
                                      >
                                        <FileText className="h-4 w-4 mr-1" />
                                        Chi tiết
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-xl">
                                      <DialogHeader>
                                        <DialogTitle>{event.title}</DialogTitle>
                                        <DialogDescription>
                                          Được tạo bởi {event.creator} vào {formatDate(event.createdAt)}
                                        </DialogDescription>
                                      </DialogHeader>
                                      <div className="grid gap-4 py-4">
                                        <div className="grid grid-cols-4 items-center gap-4">
                                          <span className="text-sm font-medium">Loại sự kiện:</span>
                                          <span className="col-span-3">{getEventTypeDisplay(event.type)}</span>
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                          <span className="text-sm font-medium">Thời gian dự kiến:</span>
                                          <span className="col-span-3">
                                            {formatDate(event.startDate)} - {formatDate(event.endDate)}
                                          </span>
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                          <span className="text-sm font-medium">Đơn vị tổ chức:</span>
                                          <span className="col-span-3">{event.hostUnit}</span>
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                          <span className="text-sm font-medium">Số người tham dự:</span>
                                          <span className="col-span-3">{event.participants} người</span>
                                        </div>
                                        <div className="grid grid-cols-4 gap-4">
                                          <span className="text-sm font-medium">Mô tả sự kiện:</span>
                                          <div className="col-span-3 p-4 border rounded-md bg-muted/50">
                                            <p className="text-sm">{event.description}</p>
                                          </div>
                                        </div>
                                      </div>
                                      <DialogFooter className="gap-2">
                                        <Button 
                                          variant="outline" 
                                          onClick={() => {
                                            setOpenDetailsDialog(false);
                                            setSelectedEvent(null);
                                          }}
                                        >
                                          Đóng
                                        </Button>
                                        <Button 
                                          variant="outline" 
                                          className="text-green-600 border-green-600"
                                          onClick={() => {
                                            setOpenDetailsDialog(false);
                                            setOpenApproveDialog(true);
                                          }}
                                        >
                                          <CheckCircle className="h-4 w-4 mr-1" />
                                          Duyệt
                                        </Button>
                                        <Button 
                                          variant="outline" 
                                          className="text-red-600 border-red-600"
                                          onClick={() => {
                                            setOpenDetailsDialog(false);
                                            setOpenRejectDialog(true);
                                          }}
                                        >
                                          <XCircle className="h-4 w-4 mr-1" />
                                          Từ chối
                                        </Button>
                                      </DialogFooter>
                                    </DialogContent>
                                  </Dialog>
                                  
                                  <Dialog open={openApproveDialog && selectedEvent === event.id} onOpenChange={(open) => {
                                    if (!open) setSelectedEvent(null);
                                    setOpenApproveDialog(open);
                                  }}>
                                    <DialogTrigger asChild>
                                      <Button 
                                        variant="outline" 
                                        size="sm" 
                                        className="text-green-600 border-green-600"
                                        onClick={() => setSelectedEvent(event.id)}
                                      >
                                        <CheckCircle className="h-4 w-4 mr-1" />
                                        Duyệt
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                      <DialogHeader>
                                        <DialogTitle>Duyệt sự kiện</DialogTitle>
                                        <DialogDescription>
                                          Bạn có chắc chắn muốn duyệt sự kiện "{event.title}"?
                                        </DialogDescription>
                                      </DialogHeader>
                                      <DialogFooter>
                                        <Button 
                                          variant="outline" 
                                          onClick={() => {
                                            setSelectedEvent(null);
                                            setOpenApproveDialog(false);
                                          }}
                                        >
                                          Hủy
                                        </Button>
                                        <Button onClick={handleApprove}>Xác nhận duyệt</Button>
                                      </DialogFooter>
                                    </DialogContent>
                                  </Dialog>
                                  
                                  <Dialog open={openRejectDialog && selectedEvent === event.id} onOpenChange={(open) => {
                                    if (!open) setSelectedEvent(null);
                                    setOpenRejectDialog(open);
                                  }}>
                                    <DialogTrigger asChild>
                                      <Button 
                                        variant="outline" 
                                        size="sm" 
                                        className="text-red-600 border-red-600"
                                        onClick={() => setSelectedEvent(event.id)}
                                      >
                                        <XCircle className="h-4 w-4 mr-1" />
                                        Từ chối
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                      <DialogHeader>
                                        <DialogTitle>Từ chối sự kiện</DialogTitle>
                                        <DialogDescription>
                                          Vui lòng cung cấp lý do từ chối sự kiện "{event.title}".
                                        </DialogDescription>
                                      </DialogHeader>
                                      <Textarea
                                        placeholder="Nhập lý do từ chối..."
                                        value={reasonText}
                                        onChange={(e) => setReasonText(e.target.value)}
                                        className="min-h-[100px]"
                                      />
                                      <DialogFooter>
                                        <Button 
                                          variant="outline" 
                                          onClick={() => {
                                            setSelectedEvent(null);
                                            setOpenRejectDialog(false);
                                            setReasonText('');
                                          }}
                                        >
                                          Hủy
                                        </Button>
                                        <Button variant="destructive" onClick={handleReject}>
                                          Xác nhận từ chối
                                        </Button>
                                      </DialogFooter>
                                    </DialogContent>
                                  </Dialog>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                              Không có sự kiện nào đang chờ duyệt
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="history" className="space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Lịch sử duyệt sự kiện</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-center py-6">
                    Các sự kiện đã duyệt hoặc từ chối sẽ hiển thị ở đây
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

export default EventsApprove;
