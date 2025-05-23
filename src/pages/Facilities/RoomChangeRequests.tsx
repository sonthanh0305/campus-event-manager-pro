import React, { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { vi } from 'date-fns/locale';
import DashboardLayout from '@/components/DashboardLayout';
import { RoomCalendar } from '@/components/ui/room-calendar';
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
import { Textarea } from '@/components/ui/textarea';
import { 
  CheckCircle, 
  XCircle, 
  Search, 
  FileText, 
  Calendar, 
  ArrowRight 
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/sonner';
import { motion } from 'framer-motion';

// Mock data for rooms
const mockRooms = [
  { id: '1', name: 'Hội trường A', type: 'conference', capacity: 300, building: 'A', floor: '1', status: 'available' },
  { id: '2', name: 'Hội trường B', type: 'conference', capacity: 250, building: 'B', floor: '1', status: 'available' },
  { id: '3', name: 'Phòng hội thảo B2-01', type: 'seminar', capacity: 80, building: 'B', floor: '2', status: 'available' },
  { id: '4', name: 'Phòng họp A3-01', type: 'meeting', capacity: 30, building: 'A', floor: '3', status: 'available' },
  { id: '5', name: 'Phòng thực hành CNTT', type: 'lab', capacity: 60, building: 'C', floor: '1', status: 'available' },
];

// Mock data for bookings
const mockBookings = [
  {
    id: '1',
    roomId: '1',
    title: 'Hội nghị Khoa học Công nghệ 2023',
    organizer: 'Khoa Công nghệ Thông tin',
    start: new Date(2025, 4, 23, 8, 0),
    end: new Date(2025, 4, 23, 12, 0),
    status: 'approved' as const,
    participantsCount: 250
  },
  {
    id: '2',
    roomId: '3',
    title: 'Workshop Kỹ năng mềm cho sinh viên',
    organizer: 'Phòng Công tác Sinh viên',
    start: new Date(2025, 4, 24, 13, 30),
    end: new Date(2025, 4, 24, 17, 0),
    status: 'approved' as const,
    participantsCount: 70
  },
  {
    id: '3',
    roomId: '5',
    title: 'Cuộc thi Lập trình IoT 2023',
    organizer: 'CLB IT',
    start: new Date(2025, 4, 22, 8, 0),
    end: new Date(2025, 4, 22, 17, 0),
    status: 'pending' as const,
    participantsCount: 55
  },
];

// Mock data for room change requests
const mockRoomChangeRequests = [
  {
    id: '1',
    eventId: '1',
    eventTitle: 'Hội nghị Khoa học Công nghệ 2023',
    requestDate: '2023-11-05T10:23:45',
    status: 'pending',
    requestor: 'Nguyễn Văn A',
    requestorUnit: 'Khoa Công nghệ Thông tin',
    reason: 'Số lượng tham dự tăng đột xuất, cần phòng lớn hơn',
    currentRoom: {
      id: '1',
      name: 'A1-01',
      type: 'classroom',
      capacity: 60,
    },
    preferredRoomType: 'auditorium',
    preferredCapacity: 150,
    preferredFeatures: ['Hệ thống âm thanh tốt', 'Máy chiếu chất lượng cao'],
    startTime: '2023-11-15T08:00:00',
    endTime: '2023-11-15T17:00:00',
  },
  {
    id: '2',
    eventId: '2',
    eventTitle: 'Workshop Kỹ năng mềm cho sinh viên',
    requestDate: '2023-11-08T14:10:22',
    status: 'approved',
    requestor: 'Trần Thị B',
    requestorUnit: 'Phòng Công tác Sinh viên',
    reason: 'Phòng hiện tại có vấn đề về hệ thống điều hòa',
    approvedBy: 'Lê Văn C',
    approveDate: '2023-11-09T09:30:15',
    currentRoom: {
      id: '2',
      name: 'B2-01',
      type: 'conference',
      capacity: 80,
    },
    newRoom: {
      id: '3',
      name: 'B3-05',
      type: 'conference',
      capacity: 80,
    },
    preferredRoomType: 'conference',
    preferredCapacity: 80,
    preferredFeatures: ['Điều hòa hoạt động tốt'],
    startTime: '2023-11-20T13:30:00',
    endTime: '2023-11-20T17:00:00',
  },
  {
    id: '3',
    eventId: '3',
    eventTitle: 'Cuộc thi Lập trình IoT 2023',
    requestDate: '2023-11-10T08:45:30',
    status: 'rejected',
    requestor: 'Phạm Văn D',
    requestorUnit: 'CLB IT',
    reason: 'Cần phòng có nhiều ổ cắm điện hơn cho thiết bị IoT',
    approvedBy: 'Hoàng Văn E',
    approveDate: '2023-11-11T11:20:40',
    rejectReason: 'Không có phòng nào phù hợp với yêu cầu vào thời điểm này',
    currentRoom: {
      id: '4',
      name: 'Lab A1-05',
      type: 'lab',
      capacity: 100,
    },
    preferredRoomType: 'lab',
    preferredCapacity: 100,
    preferredFeatures: ['Nhiều ổ cắm điện', 'Mạng Internet ổn định', 'Bàn rộng cho thiết bị'],
    startTime: '2023-12-01T08:00:00',
    endTime: '2023-12-01T17:00:00',
  },
];

interface TimeSlot {
  id: string;
  start: Date;
  end: Date;
}

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

// Helper function to get room type display
const getRoomTypeDisplay = (type: string) => {
  switch(type) {
    case 'classroom':
      return 'Phòng học';
    case 'conference':
      return 'Phòng hội nghị';
    case 'lab':
      return 'Phòng thực hành';
    case 'auditorium':
      return 'Hội trường';
    default:
      return 'Khác';
  }
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
    default:
      return <Badge variant="outline">Không xác định</Badge>;
  }
};

const RoomChangeRequests = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [openApproveDialog, setOpenApproveDialog] = useState(false);
  const [openRejectDialog, setOpenRejectDialog] = useState(false);
  const [openNewRequestDialog, setOpenNewRequestDialog] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);
  const [reasonText, setReasonText] = useState('');
  const [selectedRoom, setSelectedRoom] = useState('');
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<TimeSlot[]>([]);

  // Form fields for new change request
  const [eventTitle, setEventTitle] = useState('');
  const [currentRoom, setCurrentRoom] = useState('');
  const [preferredRoomType, setPreferredRoomType] = useState('');
  const [participantsCount, setParticipantsCount] = useState('');
  const [changeReason, setChangeReason] = useState('');
  
  // Filter requests based on search term and filter status
  const filteredRequests = mockRoomChangeRequests.filter(request => {
    // Search term filter
    const matchesSearch = 
      request.eventTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.requestor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.requestorUnit.toLowerCase().includes(searchTerm.toLowerCase());
      
    // Status filter
    const matchesStatus = filterStatus === 'all' || request.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });
  
  // Get selected request
  const getSelectedRequest = () => {
    return mockRoomChangeRequests.find(request => request.id === selectedRequest);
  };
  
  // Handle time slot selection
  const handleTimeSlotClick = (roomId: string, timeSlot: TimeSlot) => {
    const existingIndex = selectedTimeSlots.findIndex(slot => slot.id === timeSlot.id);
    
    if (existingIndex >= 0) {
      // Remove if already selected
      setSelectedTimeSlots(prev => prev.filter(slot => slot.id !== timeSlot.id));
    } else {
      // Add new selection
      setSelectedTimeSlots(prev => [...prev, timeSlot]);
    }
  };
  
  // Handle approve request
  const handleApprove = () => {
    if (!selectedRoom) {
      toast.error('Vui lòng chọn phòng thay thế');
      return;
    }
    toast.success('Đã phê duyệt yêu cầu đổi phòng');
    setOpenApproveDialog(false);
    setSelectedRoom('');
    setSelectedTimeSlots([]);
  };
  
  // Handle reject request
  const handleReject = () => {
    if (!reasonText.trim()) {
      toast.error('Vui lòng nhập lý do từ chối');
      return;
    }
    toast.success('Đã từ chối yêu cầu đổi phòng');
    setOpenRejectDialog(false);
    setReasonText('');
  };
  
  // Handle submit new change request
  const handleSubmitChangeRequest = () => {
    if (!eventTitle || !currentRoom || !preferredRoomType || !selectedRoom || !changeReason || selectedTimeSlots.length === 0) {
      toast.error('Vui lòng điền đầy đủ thông tin và chọn ít nhất một khung giờ');
      return;
    }
    
    toast.success('Đã gửi yêu cầu đổi phòng thành công');
    setOpenNewRequestDialog(false);
    resetForm();
  };
  
  // Reset form
  const resetForm = () => {
    setEventTitle('');
    setCurrentRoom('');
    setPreferredRoomType('');
    setParticipantsCount('');
    setChangeReason('');
    setSelectedRoom('');
    setSelectedTimeSlots([]);
  };

  // Format bookings for calendar
  const calendarBookings = mockBookings.map(booking => ({
    id: booking.id,
    roomId: booking.roomId,
    title: booking.title,
    start: booking.start,
    end: booking.end,
    status: booking.status
  }));

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Yêu cầu đổi phòng</h1>
            <p className="text-muted-foreground">Quản lý các yêu cầu đổi phòng cho các sự kiện</p>
          </div>
          
          <Dialog open={openNewRequestDialog} onOpenChange={setOpenNewRequestDialog}>
            <DialogTrigger asChild>
              <Button>
                <Calendar className="mr-2 h-4 w-4" /> 
                Tạo yêu cầu mới
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Tạo yêu cầu đổi phòng mới</DialogTitle>
                <DialogDescription>
                  Điền thông tin và chọn khung giờ để yêu cầu đổi phòng cho sự kiện của bạn
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Tên sự kiện</label>
                    <Input 
                      placeholder="Nhập tên sự kiện" 
                      value={eventTitle} 
                      onChange={(e) => setEventTitle(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Số người tham dự</label>
                    <Input 
                      type="number" 
                      placeholder="Nhập số người tham dự" 
                      value={participantsCount} 
                      onChange={(e) => setParticipantsCount(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Phòng hiện tại</label>
                    <Select value={currentRoom} onValueChange={setCurrentRoom}>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn phòng hiện tại" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockRooms.map(room => (
                          <SelectItem key={room.id} value={room.id}>
                            {room.name} (Sức chứa: {room.capacity})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Loại phòng mong muốn</label>
                    <Select value={preferredRoomType} onValueChange={setPreferredRoomType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn loại phòng mong muốn" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="classroom">Phòng học</SelectItem>
                        <SelectItem value="conference">Phòng hội nghị</SelectItem>
                        <SelectItem value="lab">Phòng thực hành</SelectItem>
                        <SelectItem value="auditorium">Hội trường</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Phòng thay thế mong muốn</label>
                    <Select value={selectedRoom} onValueChange={setSelectedRoom}>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn phòng mong muốn (nếu có)" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockRooms.map(room => (
                          <SelectItem key={room.id} value={room.id}>
                            {room.name} (Sức chứa: {room.capacity})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Lý do đổi phòng</label>
                  <Textarea 
                    placeholder="Mô tả lý do cần đổi phòng" 
                    value={changeReason} 
                    onChange={(e) => setChangeReason(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="flex justify-between">
                    <span className="text-sm font-medium">Chọn khung giờ</span>
                    <span className="text-xs text-muted-foreground">Đã chọn {selectedTimeSlots.length} khung giờ</span>
                  </label>
                  {selectedRoom ? (
                    <div className="border rounded-md">
                      <RoomCalendar
                        rooms={mockRooms.filter(room => room.id === selectedRoom)}
                        bookings={calendarBookings}
                        date={date}
                        onDateChange={setDate}
                        onTimeSlotClick={handleTimeSlotClick}
                        selectedSlots={selectedTimeSlots}
                        mode="select"
                      />
                    </div>
                  ) : (
                    <div className="border rounded-md p-4 text-center text-muted-foreground">
                      Vui lòng chọn phòng mong muốn trước
                    </div>
                  )}
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => {
                  setOpenNewRequestDialog(false);
                  resetForm();
                }}>
                  Hủy
                </Button>
                <Button onClick={handleSubmitChangeRequest}>Gửi yêu cầu</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="pending" className="space-y-4">
          <div className="flex justify-between">
            <TabsList>
              <TabsTrigger value="pending">Chờ xử lý</TabsTrigger>
              <TabsTrigger value="all">Tất cả yêu cầu</TabsTrigger>
              <TabsTrigger value="history">Lịch sử</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="pending" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Yêu cầu chờ xử lý</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative mb-6">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Tìm kiếm theo tên sự kiện, người yêu cầu hoặc đơn vị..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[300px]">Sự kiện</TableHead>
                        <TableHead>Người yêu cầu</TableHead>
                        <TableHead>Đơn vị</TableHead>
                        <TableHead>Phòng hiện tại</TableHead>
                        <TableHead>Ngày yêu cầu</TableHead>
                        <TableHead className="text-center">Trạng thái</TableHead>
                        <TableHead className="text-right">Thao tác</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredRequests.filter(r => r.status === 'pending').length > 0 ? (
                        filteredRequests
                          .filter(r => r.status === 'pending')
                          .map((request) => (
                            <TableRow key={request.id}>
                              <TableCell className="font-medium">{request.eventTitle}</TableCell>
                              <TableCell>{request.requestor}</TableCell>
                              <TableCell>{request.requestorUnit}</TableCell>
                              <TableCell>{request.currentRoom.name}</TableCell>
                              <TableCell>{formatDate(request.requestDate)}</TableCell>
                              <TableCell className="text-center">{getStatusBadge(request.status)}</TableCell>
                              <TableCell className="text-right">
                                <div className="flex gap-2 justify-end">
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => {
                                      setSelectedRequest(request.id);
                                      setOpenDetailsDialog(true);
                                    }}
                                  >
                                    <FileText className="h-4 w-4 mr-1" />
                                    Chi tiết
                                  </Button>
                                  
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="text-green-600 border-green-600"
                                    onClick={() => {
                                      setSelectedRequest(request.id);
                                      setOpenApproveDialog(true);
                                    }}
                                  >
                                    <CheckCircle className="h-4 w-4 mr-1" />
                                    Duyệt
                                  </Button>
                                  
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="text-red-600 border-red-600"
                                    onClick={() => {
                                      setSelectedRequest(request.id);
                                      setOpenRejectDialog(true);
                                    }}
                                  >
                                    <XCircle className="h-4 w-4 mr-1" />
                                    Từ chối
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                            Không có yêu cầu đổi phòng nào đang chờ xử lý
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="all" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Tất cả yêu cầu đổi phòng</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Tìm kiếm theo tên sự kiện, người yêu cầu hoặc đơn vị..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div>
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Trạng thái" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tất cả trạng thái</SelectItem>
                        <SelectItem value="pending">Chờ duyệt</SelectItem>
                        <SelectItem value="approved">Đã duyệt</SelectItem>
                        <SelectItem value="rejected">Bị từ chối</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[300px]">Sự kiện</TableHead>
                        <TableHead>Người yêu cầu</TableHead>
                        <TableHead>Đơn vị</TableHead>
                        <TableHead>Phòng hiện tại</TableHead>
                        <TableHead>Ngày yêu cầu</TableHead>
                        <TableHead className="text-center">Trạng thái</TableHead>
                        <TableHead className="text-right">Thao tác</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredRequests.length > 0 ? (
                        filteredRequests.map((request) => (
                          <TableRow key={request.id}>
                            <TableCell className="font-medium">{request.eventTitle}</TableCell>
                            <TableCell>{request.requestor}</TableCell>
                            <TableCell>{request.requestorUnit}</TableCell>
                            <TableCell>
                              {request.status === 'approved' ? (
                                <div className="flex items-center gap-2">
                                  <span>{request.currentRoom.name}</span>
                                  <ArrowRight className="h-4 w-4" />
                                  <span className="font-medium">{request.newRoom?.name}</span>
                                </div>
                              ) : (
                                request.currentRoom.name
                              )}
                            </TableCell>
                            <TableCell>{formatDate(request.requestDate)}</TableCell>
                            <TableCell className="text-center">{getStatusBadge(request.status)}</TableCell>
                            <TableCell className="text-right">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => {
                                  setSelectedRequest(request.id);
                                  setOpenDetailsDialog(true);
                                }}
                              >
                                <FileText className="h-4 w-4 mr-1" />
                                Chi tiết
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                            Không có yêu cầu đổi phòng nào phù hợp với tiêu chí tìm kiếm
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
                <CardTitle>Lịch sử yêu cầu đổi phòng</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative mb-6">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Tìm kiếm trong lịch sử..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[300px]">Sự kiện</TableHead>
                        <TableHead>Người yêu cầu</TableHead>
                        <TableHead>Thay đổi phòng</TableHead>
                        <TableHead>Kết quả</TableHead>
                        <TableHead>Người xử lý</TableHead>
                        <TableHead>Ngày xử lý</TableHead>
                        <TableHead className="text-right">Thao tác</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredRequests.filter(r => r.status !== 'pending').length > 0 ? (
                        filteredRequests
                          .filter(r => r.status !== 'pending')
                          .map((request) => (
                            <TableRow key={request.id}>
                              <TableCell className="font-medium">{request.eventTitle}</TableCell>
                              <TableCell>{request.requestor}</TableCell>
                              <TableCell>
                                {request.status === 'approved' ? (
                                  <div className="flex items-center gap-2">
                                    <span>{request.currentRoom.name}</span>
                                    <ArrowRight className="h-4 w-4" />
                                    <span className="font-medium">{request.newRoom?.name}</span>
                                  </div>
                                ) : (
                                  <span>Không thay đổi</span>
                                )}
                              </TableCell>
                              <TableCell>{getStatusBadge(request.status)}</TableCell>
                              <TableCell>{request.approvedBy}</TableCell>
                              <TableCell>{formatDate(request.approveDate || '')}</TableCell>
                              <TableCell className="text-right">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => {
                                    setSelectedRequest(request.id);
                                    setOpenDetailsDialog(true);
                                  }}
                                >
                                  <FileText className="h-4 w-4 mr-1" />
                                  Chi tiết
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                            Không có dữ liệu lịch sử
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        {/* Room Calendar */}
        <Card>
          <CardHeader>
            <CardTitle>Lịch phòng trong tuần</CardTitle>
          </CardHeader>
          <CardContent>
            <RoomCalendar
              rooms={mockRooms}
              bookings={calendarBookings}
              date={date}
              onDateChange={setDate}
              mode="view"
            />
          </CardContent>
        </Card>

        {/* Details Dialog */}
        <Dialog open={openDetailsDialog} onOpenChange={setOpenDetailsDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Chi tiết yêu cầu đổi phòng</DialogTitle>
              <DialogDescription>
                {getSelectedRequest()?.eventTitle}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {selectedRequest && (
                <>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <span className="text-sm font-medium">Người yêu cầu:</span>
                    <span className="col-span-3">{getSelectedRequest()?.requestor} ({getSelectedRequest()?.requestorUnit})</span>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <span className="text-sm font-medium">Thời gian sự kiện:</span>
                    <span className="col-span-3">
                      {formatDate(getSelectedRequest()?.startTime || '')} - {formatDate(getSelectedRequest()?.endTime || '')}
                    </span>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <span className="text-sm font-medium">Phòng hiện tại:</span>
                    <span className="col-span-3">
                      {getSelectedRequest()?.currentRoom.name} ({getRoomTypeDisplay(getSelectedRequest()?.currentRoom.type || '')}, sức chứa {getSelectedRequest()?.currentRoom.capacity} người)
                    </span>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <span className="text-sm font-medium">Loại phòng mong muốn:</span>
                    <span className="col-span-3">{getRoomTypeDisplay(getSelectedRequest()?.preferredRoomType || '')}</span>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <span className="text-sm font-medium">Sức chứa mong muốn:</span>
                    <span className="col-span-3">{getSelectedRequest()?.preferredCapacity} người</span>
                  </div>
                  <div className="grid grid-cols-4 gap-4">
                    <span className="text-sm font-medium">Tính năng mong muốn:</span>
                    <div className="col-span-3">
                      <ul className="list-disc list-inside">
                        {getSelectedRequest()?.preferredFeatures.map((feature, index) => (
                          <li key={index} className="text-sm">{feature}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-4">
                    <span className="text-sm font-medium">Lý do đổi phòng:</span>
                    <div className="col-span-3 p-4 border rounded-md bg-muted/50">
                      <p className="text-sm">{getSelectedRequest()?.reason}</p>
                    </div>
                  </div>
                </>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setOpenDetailsDialog(false);
                setSelectedRequest(null);
              }}>Đóng</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Approve Dialog */}
        <Dialog open={openApproveDialog} onOpenChange={setOpenApproveDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Duyệt yêu cầu đổi phòng</DialogTitle>
              <DialogDescription>
                Chọn phòng thay thế cho sự kiện "{getSelectedRequest()?.eventTitle}"
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-sm font-medium">Phòng hiện tại:</span>
                <span className="col-span-3">
                  {getSelectedRequest()?.currentRoom.name} ({getRoomTypeDisplay(getSelectedRequest()?.currentRoom.type || '')}, sức chứa {getSelectedRequest()?.currentRoom.capacity} người)
                </span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-sm font-medium">Loại phòng mong muốn:</span>
                <span className="col-span-3">{getRoomTypeDisplay(getSelectedRequest()?.preferredRoomType || '')}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-sm font-medium">Chọn phòng mới:</span>
                <div className="col-span-3">
                  <Select value={selectedRoom} onValueChange={setSelectedRoom}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn phòng thay thế" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockRooms.map(room => (
                        <SelectItem key={room.id} value={room.id}>
                          {room.name} ({getRoomTypeDisplay(room.type)}, sức chứa {room.capacity} người)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="flex justify-between">
                  <span className="text-sm font-medium">Xem lịch phòng</span>
                </label>
                {selectedRoom ? (
                  <div className="border rounded-md">
                    <RoomCalendar
                      rooms={mockRooms.filter(room => room.id === selectedRoom)}
                      bookings={calendarBookings}
                      date={date}
                      onDateChange={setDate}
                      mode="view"
                    />
                  </div>
                ) : (
                  <div className="border rounded-md p-4 text-center text-muted-foreground">
                    Vui lòng chọn phòng thay thế
                  </div>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSelectedRequest(null);
                  setOpenApproveDialog(false);
                  setSelectedRoom('');
                }}
              >
                Hủy
              </Button>
              <Button onClick={handleApprove}>Xác nhận duyệt</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Reject Dialog */}
        <Dialog open={openRejectDialog} onOpenChange={setOpenRejectDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Từ chối yêu cầu đổi phòng</DialogTitle>
              <DialogDescription>
                Vui lòng cung cấp lý do từ chối yêu cầu này
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
                  setSelectedRequest(null);
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
    </DashboardLayout>
  );
};

export default RoomChangeRequests;
