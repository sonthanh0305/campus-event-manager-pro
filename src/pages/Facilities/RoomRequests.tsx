
import React, { useState } from 'react';
import MainNavigation from '@/components/MainNavigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { DatePickerWithRange } from '@/components/DateRangePicker';
import { Calendar as CalendarIcon, ArrowRight, Clock, User, Users, MapPin, Calendar, CheckCircle, XCircle, ChevronDown, Filter, Search } from 'lucide-react';
import { addDays, format, isSameDay, parse, startOfWeek } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';

// Room request type
type RoomRequestStatus = 'pending' | 'approved' | 'rejected' | 'assigned';

interface RoomRequest {
  id: string;
  eventName: string;
  organizerName: string;
  organizerUnit: string;
  requestDate: string;
  eventStartDate: string;
  eventEndDate: string;
  expectedAttendees: number;
  equipmentNeeds: string[];
  specialRequirements: string;
  status: RoomRequestStatus;
  assignedRooms?: AssignedRoom[];
}

interface AssignedRoom {
  roomId: string;
  roomName: string;
  building: string;
  floor: number;
  capacity: number;
  startDate: string;
  endDate: string;
}

interface Room {
  id: string;
  name: string;
  building: string;
  floor: number;
  capacity: number;
  type: string;
  equipment: string[];
  availability: TimeSlot[];
}

interface TimeSlot {
  date: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  eventId?: string;
  eventName?: string;
}

// Mock data
const mockRoomRequests: RoomRequest[] = [
  {
    id: '1',
    eventName: 'Hội nghị Khoa học Công nghệ 2023',
    organizerName: 'TS. Nguyễn Văn A',
    organizerUnit: 'Khoa Công nghệ Thông tin',
    requestDate: '2023-10-15T08:00:00',
    eventStartDate: '2023-11-20T08:00:00',
    eventEndDate: '2023-11-20T16:00:00',
    expectedAttendees: 150,
    equipmentNeeds: ['Máy chiếu', 'Micro không dây', 'Hệ thống âm thanh'],
    specialRequirements: 'Cần bàn ghế xếp theo kiểu hội nghị, có bàn cho ban tổ chức',
    status: 'pending'
  },
  {
    id: '2',
    eventName: 'Workshop Kỹ năng mềm cho sinh viên',
    organizerName: 'ThS. Trần Thị B',
    organizerUnit: 'Phòng Công tác Sinh viên',
    requestDate: '2023-10-17T10:30:00',
    eventStartDate: '2023-11-25T13:30:00',
    eventEndDate: '2023-11-25T16:30:00',
    expectedAttendees: 80,
    equipmentNeeds: ['Máy chiếu', 'Micro không dây'],
    specialRequirements: 'Bàn ghế có thể di chuyển để làm việc nhóm',
    status: 'pending'
  },
  {
    id: '3',
    eventName: 'Cuộc thi Lập trình IoT 2023',
    organizerName: 'ThS. Phạm Văn C',
    organizerUnit: 'CLB IT',
    requestDate: '2023-10-20T14:15:00',
    eventStartDate: '2023-12-01T08:00:00',
    eventEndDate: '2023-12-01T17:00:00',
    expectedAttendees: 100,
    equipmentNeeds: ['Máy chiếu', 'Micro không dây', 'Kết nối internet tốc độ cao', 'Ổ cắm điện nhiều'],
    specialRequirements: 'Cần không gian rộng để đặt các mô hình IoT, nhiều bàn dài',
    status: 'approved',
    assignedRooms: [
      {
        roomId: 'B1-01',
        roomName: 'Phòng thực hành B1-01',
        building: 'B1',
        floor: 1,
        capacity: 120,
        startDate: '2023-12-01T08:00:00',
        endDate: '2023-12-01T17:00:00'
      }
    ]
  },
  {
    id: '4',
    eventName: 'Seminar về Trí tuệ nhân tạo',
    organizerName: 'TS. Lê D',
    organizerUnit: 'Khoa Công nghệ Thông tin',
    requestDate: '2023-10-22T09:45:00',
    eventStartDate: '2023-11-28T09:00:00',
    eventEndDate: '2023-11-28T11:30:00',
    expectedAttendees: 60,
    equipmentNeeds: ['Máy chiếu', 'Micro không dây', 'Hệ thống âm thanh'],
    specialRequirements: '',
    status: 'pending'
  },
  {
    id: '5',
    eventName: 'Tập huấn kỹ năng nghiên cứu khoa học',
    organizerName: 'PGS.TS. Hoàng E',
    organizerUnit: 'Phòng Khoa học Công nghệ',
    requestDate: '2023-10-25T11:20:00',
    eventStartDate: '2023-12-05T13:00:00',
    eventEndDate: '2023-12-05T17:00:00',
    expectedAttendees: 45,
    equipmentNeeds: ['Máy chiếu', 'Micro không dây'],
    specialRequirements: 'Cần bố trí chỗ ngồi theo nhóm 5-6 người',
    status: 'rejected'
  }
];

const mockRooms: Room[] = [
  {
    id: 'A1-01',
    name: 'Phòng học A1-01',
    building: 'A1',
    floor: 1,
    capacity: 60,
    type: 'Phòng học',
    equipment: ['Máy chiếu', 'Micro có dây', 'Điều hòa'],
    availability: generateAvailability('A1-01')
  },
  {
    id: 'A1-02',
    name: 'Phòng học A1-02',
    building: 'A1',
    floor: 1,
    capacity: 60,
    type: 'Phòng học',
    equipment: ['Máy chiếu', 'Micro có dây', 'Điều hòa'],
    availability: generateAvailability('A1-02')
  },
  {
    id: 'A2-01',
    name: 'Phòng thực hành A2-01',
    building: 'A2',
    floor: 1,
    capacity: 40,
    type: 'Phòng thực hành',
    equipment: ['Máy chiếu', 'Máy tính (40)', 'Điều hòa', 'Micro không dây'],
    availability: generateAvailability('A2-01')
  },
  {
    id: 'B1-01',
    name: 'Phòng thực hành B1-01',
    building: 'B1',
    floor: 1,
    capacity: 120,
    type: 'Phòng thực hành lớn',
    equipment: ['Máy chiếu', 'Máy tính (40)', 'Hệ thống âm thanh', 'Micro không dây', 'Điều hòa'],
    availability: generateAvailability('B1-01')
  },
  {
    id: 'B2-01',
    name: 'Hội trường B2-01',
    building: 'B2',
    floor: 1,
    capacity: 200,
    type: 'Hội trường',
    equipment: ['Máy chiếu', 'Hệ thống âm thanh', 'Micro không dây (4)', 'Điều hòa', 'Bục phát biểu'],
    availability: generateAvailability('B2-01')
  },
  {
    id: 'C1-01',
    name: 'Phòng hội thảo C1-01',
    building: 'C1',
    floor: 1,
    capacity: 80,
    type: 'Phòng hội thảo',
    equipment: ['Máy chiếu', 'Hệ thống âm thanh', 'Micro không dây (2)', 'Điều hòa', 'Bàn hội nghị'],
    availability: generateAvailability('C1-01')
  }
];

// Helper function to generate mock availability
function generateAvailability(roomId: string): TimeSlot[] {
  const availability: TimeSlot[] = [];
  const startDate = new Date();
  
  // Generate availability for next 30 days
  for (let i = 0; i < 30; i++) {
    const currentDate = addDays(startDate, i);
    const dateStr = format(currentDate, 'yyyy-MM-dd');
    
    // Morning slot
    availability.push({
      date: dateStr,
      startTime: '08:00',
      endTime: '12:00',
      isAvailable: Math.random() > 0.3,  // 70% chance of being available
      ...(Math.random() > 0.7 && {
        eventId: `event-${Math.floor(Math.random() * 100)}`,
        eventName: 'Sự kiện ngẫu nhiên'
      })
    });
    
    // Afternoon slot
    availability.push({
      date: dateStr,
      startTime: '13:00',
      endTime: '17:00',
      isAvailable: Math.random() > 0.3,
      ...(Math.random() > 0.7 && {
        eventId: `event-${Math.floor(Math.random() * 100)}`,
        eventName: 'Sự kiện ngẫu nhiên'
      })
    });
    
    // Evening slot (some days)
    if (Math.random() > 0.7) {
      availability.push({
        date: dateStr,
        startTime: '18:00',
        endTime: '21:00',
        isAvailable: Math.random() > 0.3,
        ...(Math.random() > 0.7 && {
          eventId: `event-${Math.floor(Math.random() * 100)}`,
          eventName: 'Sự kiện ngẫu nhiên buổi tối'
        })
      });
    }
  }
  
  return availability;
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

const RoomRequests = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedRequest, setSelectedRequest] = useState<RoomRequest | null>(null);
  const [assignRoomDialogOpen, setAssignRoomDialogOpen] = useState(false);
  const [roomsDialogOpen, setRoomsDialogOpen] = useState(false);
  const [selectedRooms, setSelectedRooms] = useState<Room[]>([]);
  const [filteredRooms, setFilteredRooms] = useState<Room[]>(mockRooms);
  
  // State for room filtering
  const [buildingFilter, setBuildingFilter] = useState<string>('all');
  const [capacityFilter, setCapacityFilter] = useState<string>('all');
  const [equipmentFilter, setEquipmentFilter] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // State for room assignment
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: selectedRequest ? new Date(selectedRequest.eventStartDate) : undefined,
    to: selectedRequest ? new Date(selectedRequest.eventEndDate) : undefined,
  });
  
  // State for calendar view
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(startOfWeek(new Date(), { weekStartsOn: 1 }));
  
  // Get filtered requests based on tab
  const getFilteredRequests = () => {
    switch (activeTab) {
      case 'pending':
        return mockRoomRequests.filter(req => req.status === 'pending');
      case 'approved':
        return mockRoomRequests.filter(req => req.status === 'approved' || req.status === 'assigned');
      case 'rejected':
        return mockRoomRequests.filter(req => req.status === 'rejected');
      default:
        return mockRoomRequests;
    }
  };
  
  // Handle opening assign room dialog
  const handleAssignRoom = (request: RoomRequest) => {
    setSelectedRequest(request);
    setDateRange({
      from: new Date(request.eventStartDate),
      to: new Date(request.eventEndDate),
    });
    setAssignRoomDialogOpen(true);
  };
  
  // Handle opening room selection dialog
  const handleViewRooms = () => {
    // Apply filters based on the selected request
    filterRooms();
    setRoomsDialogOpen(true);
  };
  
  // Filter rooms based on criteria
  const filterRooms = () => {
    let filtered = [...mockRooms];
    
    // Filter by building
    if (buildingFilter !== 'all') {
      filtered = filtered.filter(room => room.building === buildingFilter);
    }
    
    // Filter by capacity
    if (capacityFilter !== 'all') {
      const minCapacity = parseInt(capacityFilter);
      filtered = filtered.filter(room => room.capacity >= minCapacity);
    }
    
    // Filter by equipment
    if (equipmentFilter.length > 0) {
      filtered = filtered.filter(room => 
        equipmentFilter.every(equipment => room.equipment.includes(equipment))
      );
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        room => room.name.toLowerCase().includes(query) || 
               room.id.toLowerCase().includes(query)
      );
    }
    
    // If we have a selected request, filter by capacity
    if (selectedRequest) {
      filtered = filtered.filter(room => room.capacity >= selectedRequest.expectedAttendees);
    }
    
    setFilteredRooms(filtered);
  };
  
  // Handle room selection
  const toggleRoomSelection = (room: Room) => {
    if (selectedRooms.some(r => r.id === room.id)) {
      setSelectedRooms(selectedRooms.filter(r => r.id !== room.id));
    } else {
      setSelectedRooms([...selectedRooms, room]);
    }
  };
  
  // Handle room assignment
  const handleConfirmAssignment = () => {
    if (!selectedRequest || !dateRange || !dateRange.from || selectedRooms.length === 0) {
      toast({
        title: "Không thể phân công phòng",
        description: "Vui lòng chọn phòng và thời gian phù hợp.",
        variant: "destructive"
      });
      return;
    }
    
    // Update the request status and assigned rooms
    const updatedRequests = mockRoomRequests.map(req => {
      if (req.id === selectedRequest.id) {
        return {
          ...req,
          status: 'assigned' as RoomRequestStatus,
          assignedRooms: selectedRooms.map(room => ({
            roomId: room.id,
            roomName: room.name,
            building: room.building,
            floor: room.floor,
            capacity: room.capacity,
            startDate: dateRange.from.toISOString(),
            endDate: dateRange.to ? dateRange.to.toISOString() : dateRange.from.toISOString()
          }))
        };
      }
      return req;
    });
    
    // In a real app, you would update the server here
    // For now, we'll just log the updated requests
    console.log('Updated requests:', updatedRequests);
    
    toast({
      title: "Phân công phòng thành công",
      description: `Đã phân công ${selectedRooms.length} phòng cho sự kiện "${selectedRequest.eventName}"`,
    });
    
    // Close dialogs and reset state
    setAssignRoomDialogOpen(false);
    setRoomsDialogOpen(false);
    setSelectedRequest(null);
    setSelectedRooms([]);
  };
  
  // Generate days for the room calendar
  const getDaysOfWeek = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      days.push(addDays(currentWeekStart, i));
    }
    return days;
  };
  
  // Check if a room is available for a specific day
  const isRoomAvailableOnDay = (room: Room, day: Date) => {
    const dayStr = format(day, 'yyyy-MM-dd');
    const availabilityForDay = room.availability.filter(slot => 
      slot.date === dayStr && slot.isAvailable
    );
    
    // If there are any available slots for this day, return true
    return availabilityForDay.length > 0;
  };
  
  // Get the status badge for a request
  const getStatusBadge = (status: RoomRequestStatus) => {
    switch(status) {
      case 'approved':
        return <Badge className="bg-blue-500">Đã duyệt</Badge>;
      case 'assigned':
        return <Badge className="bg-green-500">Đã phân phòng</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500">Chờ xử lý</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Từ chối</Badge>;
      default:
        return <Badge variant="outline">Không xác định</Badge>;
    }
  };
  
  return (
    <div className="flex min-h-screen flex-col">
      <MainNavigation />
      
      <main className="flex-1 container py-6">
        <h1 className="text-3xl font-bold tracking-tight mb-6">Quản lý yêu cầu mượn phòng</h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="pending">Chờ xử lý</TabsTrigger>
            <TabsTrigger value="approved">Đã phân phòng</TabsTrigger>
            <TabsTrigger value="rejected">Đã từ chối</TabsTrigger>
            <TabsTrigger value="all">Tất cả</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab} className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              {getFilteredRequests().map((request) => (
                <Card key={request.id}>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl">{request.eventName}</CardTitle>
                        <CardDescription className="mt-1">Yêu cầu bởi {request.organizerName} ({request.organizerUnit})</CardDescription>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        {getStatusBadge(request.status)}
                        <span className="text-xs text-muted-foreground">
                          Yêu cầu: {formatDate(request.requestDate)}
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium mb-2">Thông tin sự kiện</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>Thời gian: {formatDate(request.eventStartDate)} - {formatDate(request.eventEndDate)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span>Số người tham dự dự kiến: {request.expectedAttendees}</span>
                          </div>
                          {request.specialRequirements && (
                            <div className="flex items-start gap-2">
                              <ChevronDown className="h-4 w-4 text-muted-foreground mt-1" />
                              <span>Yêu cầu đặc biệt: {request.specialRequirements}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Thiết bị cần thiết</h4>
                        <div className="flex flex-wrap gap-2">
                          {request.equipmentNeeds.map((equipment, index) => (
                            <Badge key={index} variant="outline" className="bg-muted/50">
                              {equipment}
                            </Badge>
                          ))}
                        </div>
                        
                        {request.status === 'assigned' && request.assignedRooms && (
                          <div className="mt-4">
                            <h4 className="font-medium mb-2">Phòng đã phân công</h4>
                            <div className="space-y-2">
                              {request.assignedRooms.map((room) => (
                                <div key={room.roomId} className="p-3 bg-muted/50 rounded-md">
                                  <div className="flex justify-between">
                                    <span className="font-medium">{room.roomName}</span>
                                    <span>Sức chứa: {room.capacity} người</span>
                                  </div>
                                  <div className="text-sm text-muted-foreground mt-1">
                                    <div className="flex items-center gap-1">
                                      <MapPin className="h-3 w-3" />
                                      <span>Tòa {room.building}, Tầng {room.floor}</span>
                                    </div>
                                    <div className="flex items-center gap-1 mt-1">
                                      <Clock className="h-3 w-3" />
                                      <span>{formatDate(room.startDate)} - {formatDate(room.endDate)}</span>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="border-t pt-4">
                    <div className="flex justify-end w-full gap-3">
                      {request.status === 'pending' && (
                        <>
                          <Button variant="outline" onClick={() => toast({
                            title: "Yêu cầu đã bị từ chối",
                            description: "Bạn đã từ chối yêu cầu mượn phòng này.",
                            variant: "destructive"
                          })}>
                            <XCircle className="h-4 w-4 mr-2" />
                            Từ chối
                          </Button>
                          <Button onClick={() => handleAssignRoom(request)}>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Phân công phòng
                          </Button>
                        </>
                      )}
                      
                      {request.status === 'assigned' && (
                        <Button variant="outline" onClick={() => toast({
                          title: "Chức năng đang phát triển",
                          description: "Chức năng chỉnh sửa phân công phòng đang được phát triển.",
                        })}>
                          <ArrowRight className="h-4 w-4 mr-2" />
                          Chỉnh sửa phân công
                        </Button>
                      )}
                    </div>
                  </CardFooter>
                </Card>
              ))}
              
              {getFilteredRequests().length === 0 && (
                <div className="text-center py-12">
                  <h3 className="text-lg font-medium text-muted-foreground">
                    Không có yêu cầu mượn phòng nào {activeTab === 'pending' ? 'đang chờ xử lý' : activeTab === 'approved' ? 'đã được phân phòng' : activeTab === 'rejected' ? 'bị từ chối' : ''}
                  </h3>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>
      
      {/* Dialog for Room Assignment */}
      {selectedRequest && (
        <Dialog open={assignRoomDialogOpen} onOpenChange={setAssignRoomDialogOpen}>
          <DialogContent className="sm:max-w-[900px]">
            <DialogHeader>
              <DialogTitle>Phân công phòng cho sự kiện</DialogTitle>
              <DialogDescription>
                {selectedRequest.eventName} - {formatDate(selectedRequest.eventStartDate)} - {formatDate(selectedRequest.eventEndDate)}
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-1 gap-6 py-4">
              <div>
                <Label className="mb-2 block">Thời gian sử dụng</Label>
                <DatePickerWithRange date={dateRange} setDate={setDateRange} />
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-lg">Phòng được chọn ({selectedRooms.length})</h4>
                  <Button variant="outline" onClick={handleViewRooms}>
                    Tìm và chọn phòng
                  </Button>
                </div>
                
                {selectedRooms.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedRooms.map((room) => (
                      <Card key={room.id} className="bg-accent/50 border-accent">
                        <CardHeader className="py-3 px-4">
                          <div className="flex justify-between items-center">
                            <CardTitle className="text-base">{room.name}</CardTitle>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0" 
                              onClick={() => toggleRoomSelection(room)}
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="py-2 px-4">
                          <div className="text-sm space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">Vị trí:</span>
                              <span>Tòa {room.building}, Tầng {room.floor}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">Sức chứa:</span>
                              <span>{room.capacity} người</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">Loại phòng:</span>
                              <span>{room.type}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 border border-dashed rounded-md">
                    <p className="text-muted-foreground">Chưa có phòng nào được chọn</p>
                    <p className="text-sm text-muted-foreground mt-1">Nhấn "Tìm và chọn phòng" để bắt đầu</p>
                  </div>
                )}
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setAssignRoomDialogOpen(false)}>
                Hủy
              </Button>
              <Button 
                onClick={handleConfirmAssignment}
                disabled={selectedRooms.length === 0 || !dateRange || !dateRange.from}
              >
                Xác nhận phân công
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Dialog for Room Selection */}
      <Dialog open={roomsDialogOpen} onOpenChange={setRoomsDialogOpen}>
        <DialogContent className="sm:max-w-[900px] max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Chọn phòng phù hợp</DialogTitle>
            <DialogDescription>
              Tìm và chọn phòng phù hợp với yêu cầu của sự kiện
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 gap-6 py-4">
            {/* Search and filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Tìm kiếm phòng..." 
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyUp={() => filterRooms()}
                />
              </div>
              
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select value={buildingFilter} onValueChange={(value) => { setBuildingFilter(value); filterRooms(); }}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Chọn tòa nhà" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả tòa nhà</SelectItem>
                    <SelectItem value="A1">Tòa A1</SelectItem>
                    <SelectItem value="A2">Tòa A2</SelectItem>
                    <SelectItem value="B1">Tòa B1</SelectItem>
                    <SelectItem value="B2">Tòa B2</SelectItem>
                    <SelectItem value="C1">Tòa C1</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <Select value={capacityFilter} onValueChange={(value) => { setCapacityFilter(value); filterRooms(); }}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sức chứa" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả sức chứa</SelectItem>
                    <SelectItem value="30">≥ 30 người</SelectItem>
                    <SelectItem value="50">≥ 50 người</SelectItem>
                    <SelectItem value="100">≥ 100 người</SelectItem>
                    <SelectItem value="150">≥ 150 người</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <Tabs defaultValue="list">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="list">Danh sách phòng</TabsTrigger>
                <TabsTrigger value="calendar">Lịch phòng</TabsTrigger>
              </TabsList>
              
              <TabsContent value="list">
                <ScrollArea className="h-[400px]">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredRooms.map((room) => (
                      <Card
                        key={room.id}
                        className={`cursor-pointer transition-colors hover:border-primary ${
                          selectedRooms.some(r => r.id === room.id) ? 'border-primary bg-primary/5' : ''
                        }`}
                        onClick={() => toggleRoomSelection(room)}
                      >
                        <CardHeader className="py-3 px-4">
                          <div className="flex justify-between items-center">
                            <CardTitle className="text-base">{room.name}</CardTitle>
                            <Badge variant="outline">
                              {room.capacity} người
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="py-2 px-4">
                          <div className="text-sm space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">Vị trí:</span>
                              <span>Tòa {room.building}, Tầng {room.floor}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">Loại phòng:</span>
                              <span>{room.type}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground block mb-1">Trang thiết bị:</span>
                              <div className="flex flex-wrap gap-1">
                                {room.equipment.map((eq, index) => (
                                  <Badge key={index} variant="outline" className="text-xs bg-muted/50">
                                    {eq}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="py-2 px-4 border-t bg-muted/20">
                          <div className="w-full flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">
                              {selectedRooms.some(r => r.id === room.id) ? 'Đã chọn' : 'Nhấn để chọn'}
                            </span>
                            {selectedRooms.some(r => r.id === room.id) && (
                              <CheckCircle className="h-4 w-4 text-primary" />
                            )}
                          </div>
                        </CardFooter>
                      </Card>
                    ))}
                    
                    {filteredRooms.length === 0 && (
                      <div className="col-span-2 text-center py-12">
                        <h3 className="text-lg font-medium text-muted-foreground">
                          Không tìm thấy phòng phù hợp với tiêu chí đã chọn
                        </h3>
                        <p className="text-sm text-muted-foreground mt-2">
                          Hãy thử điều chỉnh bộ lọc hoặc tìm kiếm
                        </p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>
              
              <TabsContent value="calendar">
                <div className="flex items-center justify-between mb-4">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setCurrentWeekStart(addDays(currentWeekStart, -7))}
                  >
                    Tuần trước
                  </Button>
                  <div className="text-sm font-medium">
                    {format(currentWeekStart, 'dd/MM/yyyy')} - {format(addDays(currentWeekStart, 6), 'dd/MM/yyyy')}
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setCurrentWeekStart(addDays(currentWeekStart, 7))}
                  >
                    Tuần sau
                  </Button>
                </div>
                
                <ScrollArea className="h-[400px]">
                  <div className="min-w-[800px]">
                    {/* Calendar header */}
                    <div className="grid grid-cols-8 gap-2 mb-2">
                      <div className="bg-muted/50 p-2 rounded-md text-center font-medium">
                        Phòng
                      </div>
                      {getDaysOfWeek().map((day, index) => (
                        <div 
                          key={index} 
                          className={`bg-muted/50 p-2 rounded-md text-center ${
                            isSameDay(day, new Date()) ? 'bg-primary/10' : ''
                          }`}
                        >
                          <div className="font-medium">{format(day, 'EEEE', { locale: require('date-fns/locale/vi') })}</div>
                          <div className="text-xs">{format(day, 'dd/MM')}</div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Calendar body */}
                    <div className="space-y-2">
                      {filteredRooms.map((room) => (
                        <div key={room.id} className="grid grid-cols-8 gap-2">
                          <div 
                            className={`p-2 border rounded-md ${
                              selectedRooms.some(r => r.id === room.id) ? 'border-primary bg-primary/5' : ''
                            }`}
                            onClick={() => toggleRoomSelection(room)}
                          >
                            <div className="font-medium text-sm">{room.name}</div>
                            <div className="text-xs text-muted-foreground">{room.capacity} người</div>
                          </div>
                          
                          {getDaysOfWeek().map((day, index) => (
                            <div 
                              key={index} 
                              className={`p-2 border rounded-md ${
                                isRoomAvailableOnDay(room, day) 
                                  ? 'bg-green-50 dark:bg-green-950/20 hover:bg-green-100 dark:hover:bg-green-900/20 cursor-pointer' 
                                  : 'bg-red-50 dark:bg-red-950/20 text-muted-foreground'
                              }`}
                              onClick={() => isRoomAvailableOnDay(room, day) && toggleRoomSelection(room)}
                            >
                              {isRoomAvailableOnDay(room, day) ? (
                                <>
                                  <div className="text-xs font-medium text-green-600 dark:text-green-400">Có thể đặt</div>
                                  <div className="text-[10px] truncate">Có slot trống</div>
                                </>
                              ) : (
                                <>
                                  <div className="text-xs font-medium text-red-600 dark:text-red-400">Đã đặt</div>
                                  <div className="text-[10px] truncate">Không có slot trống</div>
                                </>
                              )}
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </div>
          
          <DialogFooter>
            <div className="w-full flex justify-between items-center">
              <span className="text-sm">Đã chọn {selectedRooms.length} phòng</span>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setRoomsDialogOpen(false)}>
                  Hủy
                </Button>
                <Button onClick={() => setRoomsDialogOpen(false)}>
                  Xác nhận chọn phòng
                </Button>
              </div>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RoomRequests;
