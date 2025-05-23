
import React, { useState } from 'react';
import { format, parseISO, addDays } from 'date-fns';
import { vi } from 'date-fns/locale';
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RoomCalendar } from '@/components/ui/room-calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DatePickerWithRange } from '@/components/DateRangePicker';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, Check, Clock, Filter, MapPin, Users, X } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { useRole } from '@/context/RoleContext';

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

// Mock data for room requests without assigned rooms
const mockRoomRequests = [
  {
    id: '1',
    title: 'Hội thảo Khởi nghiệp 2023',
    organizer: 'Trung tâm Hỗ trợ Sinh viên',
    requestDate: new Date(2025, 4, 18),
    status: 'pending' as const,
    participantsCount: 120,
    preferredDate: new Date(2025, 4, 25),
    preferredStartTime: '08:00',
    preferredEndTime: '12:00',
    preferredRoomType: 'conference',
    purpose: 'Tổ chức hội thảo về khởi nghiệp cho sinh viên năm cuối',
    equipment: 'Máy chiếu, micro, hệ thống âm thanh'
  },
  {
    id: '2',
    title: 'Họp Tổng kết Năm học',
    organizer: 'Phòng Đào tạo',
    requestDate: new Date(2025, 4, 19),
    status: 'pending' as const,
    participantsCount: 45,
    preferredDate: new Date(2025, 4, 30),
    preferredStartTime: '14:00',
    preferredEndTime: '17:00',
    preferredRoomType: 'meeting',
    purpose: 'Họp tổng kết năm học và lập kế hoạch cho năm học mới',
    equipment: 'Máy chiếu, laptop'
  }
];

interface TimeSlot {
  id: string;
  start: Date;
  end: Date;
}

const RoomRequests = () => {
  const { isEventOrganizer, isFacilityManager } = useRole();
  
  const [date, setDate] = useState<Date>(new Date());
  const [selectedRoom, setSelectedRoom] = useState<string>('');
  const [filterRoom, setFilterRoom] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isNewRequestDialogOpen, setIsNewRequestDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isAssignRoomDialogOpen, setIsAssignRoomDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<any | null>(null);
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<TimeSlot[]>([]);
  
  // Form state
  const [eventTitle, setEventTitle] = useState('');
  const [participantsCount, setParticipantsCount] = useState('');
  const [purpose, setPurpose] = useState('');
  const [equipment, setEquipment] = useState('');
  const [preferredDate, setPreferredDate] = useState<Date>(new Date());
  const [preferredStartTime, setPreferredStartTime] = useState('08:00');
  const [preferredEndTime, setPreferredEndTime] = useState('12:00');
  const [preferredRoomType, setPreferredRoomType] = useState('');

  // Filter bookings
  const filteredBookings = mockBookings.filter(booking => {
    return (filterRoom === 'all' || booking.roomId === filterRoom) &&
           (filterStatus === 'all' || booking.status === filterStatus);
  });
  
  // Format bookings for calendar
  const calendarBookings = mockBookings.map(booking => ({
    id: booking.id,
    roomId: booking.roomId,
    title: booking.title,
    start: booking.start,
    end: booking.end,
    status: booking.status
  }));
  
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
  
  // Submit new request
  const handleSubmitRequest = () => {
    if (!eventTitle) {
      toast.error('Vui lòng nhập tên sự kiện');
      return;
    }
    
    if (!participantsCount) {
      toast.error('Vui lòng nhập số lượng người tham dự');
      return;
    }
    
    if (!preferredRoomType) {
      toast.error('Vui lòng chọn loại phòng mong muốn');
      return;
    }
    
    toast.success('Đã gửi yêu cầu mượn phòng thành công');
    setIsNewRequestDialogOpen(false);
    resetForm();
  };

  // Submit room assignment
  const handleAssignRoom = () => {
    if (!selectedRoom) {
      toast.error('Vui lòng chọn phòng');
      return;
    }
    
    if (selectedTimeSlots.length === 0) {
      toast.error('Vui lòng chọn ít nhất một khung giờ');
      return;
    }
    
    toast.success('Đã phân phòng thành công');
    setIsAssignRoomDialogOpen(false);
    setSelectedRoom('');
    setSelectedTimeSlots([]);
  };
  
  // Reset form
  const resetForm = () => {
    setEventTitle('');
    setParticipantsCount('');
    setPurpose('');
    setEquipment('');
    setPreferredDate(new Date());
    setPreferredStartTime('08:00');
    setPreferredEndTime('12:00');
    setPreferredRoomType('');
    setSelectedRoom('');
    setSelectedTimeSlots([]);
  };
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Yêu cầu mượn phòng</h1>
            <p className="text-muted-foreground">Quản lý các yêu cầu mượn phòng cho các sự kiện</p>
          </div>
          {isEventOrganizer() && (
            <Dialog open={isNewRequestDialogOpen} onOpenChange={setIsNewRequestDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Calendar className="mr-2 h-4 w-4" />
                  Tạo yêu cầu mới
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl">
                <DialogHeader>
                  <DialogTitle>Tạo yêu cầu mượn phòng mới</DialogTitle>
                  <DialogDescription>
                    Điền thông tin về sự kiện của bạn để yêu cầu mượn phòng
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
                      <label className="text-sm font-medium">Ngày dự kiến</label>
                      <DatePickerWithRange />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Loại phòng mong muốn</label>
                      <Select value={preferredRoomType} onValueChange={setPreferredRoomType}>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn loại phòng" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="conference">Hội trường</SelectItem>
                          <SelectItem value="seminar">Phòng hội thảo</SelectItem>
                          <SelectItem value="meeting">Phòng họp</SelectItem>
                          <SelectItem value="lab">Phòng thực hành</SelectItem>
                          <SelectItem value="classroom">Phòng học</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Thời gian bắt đầu</label>
                      <Input 
                        type="time" 
                        value={preferredStartTime} 
                        onChange={(e) => setPreferredStartTime(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Thời gian kết thúc</label>
                      <Input 
                        type="time" 
                        value={preferredEndTime} 
                        onChange={(e) => setPreferredEndTime(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Mục đích sử dụng</label>
                    <Textarea 
                      placeholder="Mô tả mục đích sử dụng phòng" 
                      value={purpose} 
                      onChange={(e) => setPurpose(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Yêu cầu thiết bị</label>
                    <Textarea 
                      placeholder="Liệt kê các thiết bị cần sử dụng (nếu có)" 
                      value={equipment} 
                      onChange={(e) => setEquipment(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => {
                    setIsNewRequestDialogOpen(false);
                    resetForm();
                  }}>
                    Hủy
                  </Button>
                  <Button onClick={handleSubmitRequest}>Gửi yêu cầu</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>

        <Tabs defaultValue="pending" className="space-y-4">
          <div className="flex justify-between">
            <TabsList>
              <TabsTrigger value="pending">Chờ duyệt</TabsTrigger>
              <TabsTrigger value="approved">Đã duyệt</TabsTrigger>
              <TabsTrigger value="all">Tất cả yêu cầu</TabsTrigger>
            </TabsList>
            <div className="flex gap-2">
              <Select value={filterRoom} onValueChange={setFilterRoom}>
                <SelectTrigger className="w-[200px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Lọc theo phòng" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả phòng</SelectItem>
                  {mockRooms.map(room => (
                    <SelectItem key={room.id} value={room.id}>{room.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Pending Room Requests Tab */}
          <TabsContent value="pending">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Yêu cầu mượn phòng chờ phân phòng</CardTitle>
                <CardDescription>
                  {isFacilityManager() 
                    ? "Đây là các yêu cầu mượn phòng đang chờ bạn phân phòng"
                    : "Đây là các yêu cầu mượn phòng đang chờ được phân phòng"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockRoomRequests.map(request => (
                    <div 
                      key={request.id} 
                      className="flex flex-col md:flex-row p-4 border rounded-md hover:bg-muted/50 cursor-pointer"
                      onClick={() => {
                        setSelectedRequest(request);
                        if (isFacilityManager()) {
                          setIsAssignRoomDialogOpen(true);
                        } else {
                          setIsDetailsDialogOpen(true);
                        }
                      }}
                    >
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{request.title}</h3>
                          <div className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                            Chờ phân phòng
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Đơn vị: {request.organizer}
                        </div>
                      </div>
                      <div className="flex flex-row md:flex-col gap-4 mt-2 md:mt-0 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>
                            {format(request.preferredDate, "dd/MM/yyyy", { locale: vi })}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>
                            {request.preferredStartTime} - {request.preferredEndTime}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          <span>{request.participantsCount} người</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {mockRoomRequests.length === 0 && (
                    <div className="p-8 text-center text-muted-foreground">
                      Không có yêu cầu mượn phòng nào đang chờ phân phòng
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Approved Requests Tab */}
          <TabsContent value="approved">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Yêu cầu mượn phòng đã phân phòng</CardTitle>
                <CardDescription>
                  Danh sách các yêu cầu mượn phòng đã được phân phòng
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredBookings.length > 0 ? (
                    filteredBookings
                      .filter(booking => booking.status === 'approved')
                      .map(booking => (
                      <div 
                        key={booking.id} 
                        className="flex flex-col md:flex-row p-4 border rounded-md hover:bg-muted/50 cursor-pointer"
                        onClick={() => {
                          setSelectedBooking(booking);
                          setIsDetailsDialogOpen(true);
                        }}
                      >
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{booking.title}</h3>
                            <div className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                              Đã phân phòng
                            </div>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Đơn vị: {booking.organizer}
                          </div>
                        </div>
                        <div className="flex flex-row md:flex-col gap-4 mt-2 md:mt-0 text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            <span>{mockRooms.find(room => room.id === booking.roomId)?.name}</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            <span>
                              {format(booking.start, 'HH:mm dd/MM/yyyy', { locale: vi })}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-1" />
                            <span>{booking.participantsCount} người</span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center text-muted-foreground">
                      Không có yêu cầu mượn phòng nào đã được phân phòng
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* All Requests Tab */}
          <TabsContent value="all">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Tất cả yêu cầu mượn phòng</CardTitle>
                <CardDescription>
                  Danh sách tất cả các yêu cầu mượn phòng
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Pending Room Requests */}
                  {mockRoomRequests.map(request => (
                    <div 
                      key={request.id} 
                      className="flex flex-col md:flex-row p-4 border rounded-md hover:bg-muted/50 cursor-pointer"
                      onClick={() => {
                        setSelectedRequest(request);
                        if (isFacilityManager()) {
                          setIsAssignRoomDialogOpen(true);
                        } else {
                          setIsDetailsDialogOpen(true);
                        }
                      }}
                    >
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{request.title}</h3>
                          <div className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                            Chờ phân phòng
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Đơn vị: {request.organizer}
                        </div>
                      </div>
                      <div className="flex flex-row md:flex-col gap-4 mt-2 md:mt-0 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>
                            {format(request.preferredDate, "dd/MM/yyyy", { locale: vi })}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>
                            {request.preferredStartTime} - {request.preferredEndTime}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          <span>{request.participantsCount} người</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Approved Room Bookings */}
                  {filteredBookings.length > 0 ? (
                    filteredBookings.map(booking => (
                      <div 
                        key={booking.id} 
                        className="flex flex-col md:flex-row p-4 border rounded-md hover:bg-muted/50 cursor-pointer"
                        onClick={() => {
                          setSelectedBooking(booking);
                          setIsDetailsDialogOpen(true);
                        }}
                      >
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{booking.title}</h3>
                            <div className={`px-2 py-1 rounded-full text-xs ${
                              booking.status === 'approved' 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                            }`}>
                              {booking.status === 'approved' ? 'Đã phân phòng' : 'Chờ duyệt'}
                            </div>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Đơn vị: {booking.organizer}
                          </div>
                        </div>
                        <div className="flex flex-row md:flex-col gap-4 mt-2 md:mt-0 text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            <span>{mockRooms.find(room => room.id === booking.roomId)?.name}</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            <span>
                              {format(booking.start, 'HH:mm dd/MM/yyyy', { locale: vi })}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-1" />
                            <span>{booking.participantsCount} người</span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center text-muted-foreground">
                      Không có yêu cầu mượn phòng nào
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <Card>
          <CardHeader>
            <CardTitle>Lịch sử dụng phòng trong tuần</CardTitle>
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

        {/* Request Details Dialog */}
        <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Chi tiết yêu cầu mượn phòng</DialogTitle>
            </DialogHeader>
            {selectedBooking && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium">{selectedBooking.title}</h3>
                  <p className="text-muted-foreground">Đơn vị: {selectedBooking.organizer}</p>
                </div>
                
                <Separator />
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium">Phòng</p>
                    <p>{mockRooms.find(room => room.id === selectedBooking.roomId)?.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Số người tham dự</p>
                    <p>{selectedBooking.participantsCount} người</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Thời gian bắt đầu</p>
                    <p>{format(selectedBooking.start, 'HH:mm - dd/MM/yyyy', { locale: vi })}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Thời gian kết thúc</p>
                    <p>{format(selectedBooking.end, 'HH:mm - dd/MM/yyyy', { locale: vi })}</p>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <p className="text-sm font-medium">Trạng thái</p>
                  <div className={`mt-1 inline-block px-2 py-1 rounded-full text-xs ${
                    selectedBooking.status === 'approved' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                  }`}>
                    {selectedBooking.status === 'approved' ? 'Đã phân phòng' : 'Chờ duyệt'}
                  </div>
                </div>
              </div>
            )}
            
            {selectedRequest && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium">{selectedRequest.title}</h3>
                  <p className="text-muted-foreground">Đơn vị: {selectedRequest.organizer}</p>
                </div>
                
                <Separator />
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium">Ngày yêu cầu</p>
                    <p>{format(selectedRequest.requestDate, 'dd/MM/yyyy', { locale: vi })}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Số người tham dự</p>
                    <p>{selectedRequest.participantsCount} người</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Ngày dự kiến</p>
                    <p>{format(selectedRequest.preferredDate, 'dd/MM/yyyy', { locale: vi })}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Thời gian dự kiến</p>
                    <p>{selectedRequest.preferredStartTime} - {selectedRequest.preferredEndTime}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Loại phòng</p>
                    <p>{selectedRequest.preferredRoomType === 'conference' ? 'Hội trường' : 
                       selectedRequest.preferredRoomType === 'seminar' ? 'Phòng hội thảo' : 
                       selectedRequest.preferredRoomType === 'meeting' ? 'Phòng họp' :
                       selectedRequest.preferredRoomType === 'lab' ? 'Phòng thực hành' : 'Phòng học'}</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium">Mục đích sử dụng</p>
                  <p className="mt-1 text-sm">{selectedRequest.purpose}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium">Yêu cầu thiết bị</p>
                  <p className="mt-1 text-sm">{selectedRequest.equipment}</p>
                </div>
                
                <Separator />
                
                <div>
                  <p className="text-sm font-medium">Trạng thái</p>
                  <div className="mt-1 inline-block px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                    Chờ phân phòng
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              {isFacilityManager() && selectedRequest && (
                <Button 
                  onClick={() => {
                    setIsDetailsDialogOpen(false);
                    setIsAssignRoomDialogOpen(true);
                  }}
                >
                  Phân phòng
                </Button>
              )}
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsDetailsDialogOpen(false);
                  setSelectedBooking(null);
                  setSelectedRequest(null);
                }}
              >
                Đóng
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Assign Room Dialog - Only for Facility Managers */}
        <Dialog open={isAssignRoomDialogOpen && isFacilityManager()} onOpenChange={setIsAssignRoomDialogOpen}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Phân phòng cho yêu cầu</DialogTitle>
              <DialogDescription>
                {selectedRequest && `Phân phòng cho sự kiện "${selectedRequest.title}"`}
              </DialogDescription>
            </DialogHeader>
            {selectedRequest && (
              <div className="grid gap-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Thông tin yêu cầu:</h3>
                    <div className="p-4 border rounded-md space-y-2">
                      <p className="text-sm"><span className="font-medium">Đơn vị:</span> {selectedRequest.organizer}</p>
                      <p className="text-sm"><span className="font-medium">Số người tham dự:</span> {selectedRequest.participantsCount}</p>
                      <p className="text-sm"><span className="font-medium">Thời gian dự kiến:</span> {format(selectedRequest.preferredDate, 'dd/MM/yyyy', { locale: vi })} {selectedRequest.preferredStartTime} - {selectedRequest.preferredEndTime}</p>
                      <p className="text-sm"><span className="font-medium">Loại phòng mong muốn:</span> {selectedRequest.preferredRoomType === 'conference' ? 'Hội trường' : 
                         selectedRequest.preferredRoomType === 'seminar' ? 'Phòng hội thảo' : 
                         selectedRequest.preferredRoomType === 'meeting' ? 'Phòng họp' :
                         selectedRequest.preferredRoomType === 'lab' ? 'Phòng thực hành' : 'Phòng học'}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Chọn phòng</label>
                      <Select value={selectedRoom} onValueChange={setSelectedRoom}>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn phòng" />
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
                      Vui lòng chọn phòng trước
                    </div>
                  )}
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setIsAssignRoomDialogOpen(false);
                setSelectedRoom('');
                setSelectedTimeSlots([]);
                setSelectedRequest(null);
              }}>
                Hủy
              </Button>
              <Button onClick={handleAssignRoom}>Xác nhận phân phòng</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default RoomRequests;
