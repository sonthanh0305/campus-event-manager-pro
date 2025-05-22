
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
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { 
  Search, 
  FileText, 
  Building,
  Plus,
  Pencil,
  Trash,
  Calendar,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useForm } from 'react-hook-form';
import { toast } from '@/components/ui/sonner';
import { motion } from 'framer-motion';

// Mock data for rooms
const mockRooms = [
  {
    id: '1',
    name: 'A1-01',
    type: 'classroom',
    capacity: 60,
    building: 'A1',
    floor: '1',
    status: 'available',
    equipment: ['Máy chiếu', 'Điều hòa', 'Âm thanh'],
    notes: 'Phòng học lý thuyết thông thường',
  },
  {
    id: '2',
    name: 'A1-02',
    type: 'classroom',
    capacity: 60,
    building: 'A1',
    floor: '1',
    status: 'maintenance',
    equipment: ['Máy chiếu', 'Điều hòa'],
    notes: 'Đang sửa chữa hệ thống điều hòa',
  },
  {
    id: '3',
    name: 'A2-01',
    type: 'lab',
    capacity: 40,
    building: 'A2',
    floor: '1',
    status: 'available',
    equipment: ['Máy tính (40)', 'Máy chiếu', 'Điều hòa', 'Mạng LAN'],
    notes: 'Phòng máy tính cho thực hành lập trình',
  },
  {
    id: '4',
    name: 'B2-01',
    type: 'conference',
    capacity: 80,
    building: 'B2',
    floor: '1',
    status: 'occupied',
    equipment: ['Máy chiếu', 'Hệ thống âm thanh', 'Micro không dây (4)', 'Điều hòa'],
    notes: 'Phòng họp lớn cho hội nghị và seminar',
  },
  {
    id: '5',
    name: 'HT-A',
    type: 'auditorium',
    capacity: 300,
    building: 'Khu Hội trường',
    floor: '1',
    status: 'available',
    equipment: ['Hệ thống âm thanh cao cấp', 'Máy chiếu lớn', 'Điều hòa trung tâm', 'Micro không dây (8)'],
    notes: 'Hội trường lớn cho sự kiện toàn trường',
  },
];

// Mock events for room schedule
const mockSchedule = [
  {
    roomId: '4',
    events: [
      {
        id: '1',
        title: 'Họp Hội đồng Khoa học',
        start: '2023-11-20T09:00:00',
        end: '2023-11-20T11:30:00',
        organizer: 'Ban Giám hiệu',
      },
      {
        id: '2',
        title: 'Workshop Kỹ năng mềm cho sinh viên',
        start: '2023-11-20T13:30:00',
        end: '2023-11-20T17:00:00',
        organizer: 'Phòng Công tác Sinh viên',
      },
    ],
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
    case 'available':
      return <Badge className="bg-green-500">Sẵn sàng</Badge>;
    case 'occupied':
      return <Badge className="bg-yellow-500">Đang sử dụng</Badge>;
    case 'maintenance':
      return <Badge variant="destructive">Bảo trì</Badge>;
    default:
      return <Badge variant="outline">Không xác định</Badge>;
  }
};

const Rooms = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [openScheduleDialog, setOpenScheduleDialog] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  
  // Check if user is facility manager
  const isFacilityManager = user?.roles.includes('QUAN_LY_CSVC');

  // Create form for adding/editing rooms
  const form = useForm({
    defaultValues: {
      name: '',
      type: 'classroom',
      capacity: '',
      building: '',
      floor: '',
      status: 'available',
      equipment: '',
      notes: '',
    },
  });
  
  // Filter rooms based on search term and filters
  const filteredRooms = mockRooms.filter(room => {
    // Search term filter
    const matchesSearch = 
      room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.building.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.notes.toLowerCase().includes(searchTerm.toLowerCase());
      
    // Type filter
    const matchesType = filterType === 'all' || room.type === filterType;
    
    // Status filter
    const matchesStatus = filterStatus === 'all' || room.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });
  
  // Get selected room
  const getSelectedRoom = () => {
    return mockRooms.find(room => room.id === selectedRoom);
  };
  
  // Get room schedule
  const getRoomSchedule = (roomId: string) => {
    const schedule = mockSchedule.find(s => s.roomId === roomId);
    return schedule ? schedule.events : [];
  };
  
  // Set form values for editing
  const setFormValues = (room: any) => {
    form.reset({
      name: room.name,
      type: room.type,
      capacity: room.capacity.toString(),
      building: room.building,
      floor: room.floor,
      status: room.status,
      equipment: room.equipment.join(', '),
      notes: room.notes,
    });
  };
  
  // Handle form submit for adding/editing room
  const onSubmit = (data: any) => {
    toast.success(selectedRoom ? 'Đã cập nhật thông tin phòng' : 'Đã thêm phòng mới');
    if (openAddDialog) setOpenAddDialog(false);
    if (openEditDialog) setOpenEditDialog(false);
    form.reset();
  };
  
  // Handle delete room
  const handleDeleteRoom = () => {
    toast.success('Đã xóa phòng');
    setOpenDeleteDialog(false);
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
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Quản lý phòng</h1>
              <p className="text-muted-foreground">Danh sách các phòng và tình trạng sử dụng</p>
            </div>
            {isFacilityManager && (
              <Button className="flex gap-2" onClick={() => setOpenAddDialog(true)}>
                <Plus className="h-4 w-4" />
                <span>Thêm phòng mới</span>
              </Button>
            )}
          </div>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Danh sách phòng</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Tìm kiếm theo tên phòng, tòa nhà hoặc ghi chú..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex gap-4">
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Loại phòng" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả loại</SelectItem>
                      <SelectItem value="classroom">Phòng học</SelectItem>
                      <SelectItem value="conference">Phòng hội nghị</SelectItem>
                      <SelectItem value="lab">Phòng thực hành</SelectItem>
                      <SelectItem value="auditorium">Hội trường</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả trạng thái</SelectItem>
                      <SelectItem value="available">Sẵn sàng</SelectItem>
                      <SelectItem value="occupied">Đang sử dụng</SelectItem>
                      <SelectItem value="maintenance">Bảo trì</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tên phòng</TableHead>
                      <TableHead>Loại</TableHead>
                      <TableHead className="text-center">Sức chứa</TableHead>
                      <TableHead>Tòa nhà</TableHead>
                      <TableHead>Tầng</TableHead>
                      <TableHead className="text-center">Trạng thái</TableHead>
                      <TableHead className="text-right">Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRooms.length > 0 ? (
                      filteredRooms.map((room) => (
                        <TableRow key={room.id}>
                          <TableCell className="font-medium">{room.name}</TableCell>
                          <TableCell>{getRoomTypeDisplay(room.type)}</TableCell>
                          <TableCell className="text-center">{room.capacity} người</TableCell>
                          <TableCell>{room.building}</TableCell>
                          <TableCell>{room.floor}</TableCell>
                          <TableCell className="text-center">{getStatusBadge(room.status)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex gap-2 justify-end">
                              <Dialog open={openDetailsDialog && selectedRoom === room.id} onOpenChange={(open) => {
                                if (!open) setSelectedRoom(null);
                                setOpenDetailsDialog(open);
                              }}>
                                <DialogTrigger asChild>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => setSelectedRoom(room.id)}
                                  >
                                    <FileText className="h-4 w-4 mr-1" />
                                    Chi tiết
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-md">
                                  <DialogHeader>
                                    <DialogTitle>Chi tiết phòng {room.name}</DialogTitle>
                                  </DialogHeader>
                                  <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                      <span className="text-sm font-medium">Tên phòng:</span>
                                      <span className="col-span-3">{room.name}</span>
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                      <span className="text-sm font-medium">Loại phòng:</span>
                                      <span className="col-span-3">{getRoomTypeDisplay(room.type)}</span>
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                      <span className="text-sm font-medium">Sức chứa:</span>
                                      <span className="col-span-3">{room.capacity} người</span>
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                      <span className="text-sm font-medium">Vị trí:</span>
                                      <span className="col-span-3">Tòa {room.building}, Tầng {room.floor}</span>
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                      <span className="text-sm font-medium">Trạng thái:</span>
                                      <span className="col-span-3">{getStatusBadge(room.status)}</span>
                                    </div>
                                    <div className="grid grid-cols-4 gap-4">
                                      <span className="text-sm font-medium">Thiết bị:</span>
                                      <div className="col-span-3">
                                        <ul className="list-disc list-inside">
                                          {room.equipment.map((item, index) => (
                                            <li key={index} className="text-sm">{item}</li>
                                          ))}
                                        </ul>
                                      </div>
                                    </div>
                                    <div className="grid grid-cols-4 gap-4">
                                      <span className="text-sm font-medium">Ghi chú:</span>
                                      <div className="col-span-3">
                                        <p className="text-sm">{room.notes}</p>
                                      </div>
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>
                              
                              <Dialog open={openScheduleDialog && selectedRoom === room.id} onOpenChange={(open) => {
                                if (!open) setSelectedRoom(null);
                                setOpenScheduleDialog(open);
                              }}>
                                <DialogTrigger asChild>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => setSelectedRoom(room.id)}
                                  >
                                    <Calendar className="h-4 w-4 mr-1" />
                                    Lịch
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-md">
                                  <DialogHeader>
                                    <DialogTitle>Lịch sử dụng phòng {room.name}</DialogTitle>
                                    <DialogDescription>
                                      Danh sách các sự kiện sử dụng phòng
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="py-4">
                                    {getRoomSchedule(room.id).length > 0 ? (
                                      <div className="rounded-md border">
                                        <Table>
                                          <TableHeader>
                                            <TableRow>
                                              <TableHead>Tên sự kiện</TableHead>
                                              <TableHead>Thời gian</TableHead>
                                              <TableHead>Đơn vị tổ chức</TableHead>
                                            </TableRow>
                                          </TableHeader>
                                          <TableBody>
                                            {getRoomSchedule(room.id).map((event) => (
                                              <TableRow key={event.id}>
                                                <TableCell className="font-medium">{event.title}</TableCell>
                                                <TableCell>
                                                  <div className="flex flex-col text-sm">
                                                    <span>Bắt đầu: {formatDate(event.start)}</span>
                                                    <span>Kết thúc: {formatDate(event.end)}</span>
                                                  </div>
                                                </TableCell>
                                                <TableCell>{event.organizer}</TableCell>
                                              </TableRow>
                                            ))}
                                          </TableBody>
                                        </Table>
                                      </div>
                                    ) : (
                                      <p className="text-muted-foreground text-center py-6">
                                        Không có sự kiện nào sử dụng phòng này
                                      </p>
                                    )}
                                  </div>
                                </DialogContent>
                              </Dialog>
                              
                              {isFacilityManager && (
                                <>
                                  <Dialog open={openEditDialog && selectedRoom === room.id} onOpenChange={(open) => {
                                    if (!open) {
                                      setSelectedRoom(null);
                                    } else {
                                      setFormValues(room);
                                    }
                                    setOpenEditDialog(open);
                                  }}>
                                    <DialogTrigger asChild>
                                      <Button 
                                        variant="outline" 
                                        size="sm"
                                        onClick={() => setSelectedRoom(room.id)}
                                      >
                                        <Pencil className="h-4 w-4 mr-1" />
                                        Sửa
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-md">
                                      <DialogHeader>
                                        <DialogTitle>Chỉnh sửa thông tin phòng</DialogTitle>
                                      </DialogHeader>
                                      <Form {...form}>
                                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                          <div className="grid grid-cols-2 gap-4">
                                            <FormField
                                              control={form.control}
                                              name="name"
                                              render={({ field }) => (
                                                <FormItem>
                                                  <FormLabel>Tên phòng</FormLabel>
                                                  <FormControl>
                                                    <Input placeholder="Nhập tên phòng" {...field} />
                                                  </FormControl>
                                                  <FormMessage />
                                                </FormItem>
                                              )}
                                            />
                                            <FormField
                                              control={form.control}
                                              name="type"
                                              render={({ field }) => (
                                                <FormItem>
                                                  <FormLabel>Loại phòng</FormLabel>
                                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                      <SelectTrigger>
                                                        <SelectValue placeholder="Chọn loại phòng" />
                                                      </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                      <SelectItem value="classroom">Phòng học</SelectItem>
                                                      <SelectItem value="conference">Phòng hội nghị</SelectItem>
                                                      <SelectItem value="lab">Phòng thực hành</SelectItem>
                                                      <SelectItem value="auditorium">Hội trường</SelectItem>
                                                    </SelectContent>
                                                  </Select>
                                                  <FormMessage />
                                                </FormItem>
                                              )}
                                            />
                                          </div>
                                          <div className="grid grid-cols-2 gap-4">
                                            <FormField
                                              control={form.control}
                                              name="building"
                                              render={({ field }) => (
                                                <FormItem>
                                                  <FormLabel>Tòa nhà</FormLabel>
                                                  <FormControl>
                                                    <Input placeholder="Nhập tên tòa nhà" {...field} />
                                                  </FormControl>
                                                  <FormMessage />
                                                </FormItem>
                                              )}
                                            />
                                            <FormField
                                              control={form.control}
                                              name="floor"
                                              render={({ field }) => (
                                                <FormItem>
                                                  <FormLabel>Tầng</FormLabel>
                                                  <FormControl>
                                                    <Input placeholder="Nhập số tầng" {...field} />
                                                  </FormControl>
                                                  <FormMessage />
                                                </FormItem>
                                              )}
                                            />
                                          </div>
                                          <div className="grid grid-cols-2 gap-4">
                                            <FormField
                                              control={form.control}
                                              name="capacity"
                                              render={({ field }) => (
                                                <FormItem>
                                                  <FormLabel>Sức chứa</FormLabel>
                                                  <FormControl>
                                                    <Input type="number" placeholder="Nhập số lượng người" {...field} />
                                                  </FormControl>
                                                  <FormMessage />
                                                </FormItem>
                                              )}
                                            />
                                            <FormField
                                              control={form.control}
                                              name="status"
                                              render={({ field }) => (
                                                <FormItem>
                                                  <FormLabel>Trạng thái</FormLabel>
                                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                      <SelectTrigger>
                                                        <SelectValue placeholder="Chọn trạng thái" />
                                                      </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                      <SelectItem value="available">Sẵn sàng</SelectItem>
                                                      <SelectItem value="occupied">Đang sử dụng</SelectItem>
                                                      <SelectItem value="maintenance">Bảo trì</SelectItem>
                                                    </SelectContent>
                                                  </Select>
                                                  <FormMessage />
                                                </FormItem>
                                              )}
                                            />
                                          </div>
                                          <FormField
                                            control={form.control}
                                            name="equipment"
                                            render={({ field }) => (
                                              <FormItem>
                                                <FormLabel>Thiết bị</FormLabel>
                                                <FormControl>
                                                  <Input placeholder="Nhập danh sách thiết bị (ngăn cách bởi dấu phẩy)" {...field} />
                                                </FormControl>
                                                <FormDescription>
                                                  Nhập các thiết bị ngăn cách bởi dấu phẩy, ví dụ: Máy chiếu, Điều hòa, Micro
                                                </FormDescription>
                                                <FormMessage />
                                              </FormItem>
                                            )}
                                          />
                                          <FormField
                                            control={form.control}
                                            name="notes"
                                            render={({ field }) => (
                                              <FormItem>
                                                <FormLabel>Ghi chú</FormLabel>
                                                <FormControl>
                                                  <Input placeholder="Nhập ghi chú (nếu có)" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                              </FormItem>
                                            )}
                                          />
                                          <DialogFooter>
                                            <Button type="submit">Lưu thay đổi</Button>
                                          </DialogFooter>
                                        </form>
                                      </Form>
                                    </DialogContent>
                                  </Dialog>
                                  
                                  <Dialog open={openDeleteDialog && selectedRoom === room.id} onOpenChange={(open) => {
                                    if (!open) setSelectedRoom(null);
                                    setOpenDeleteDialog(open);
                                  }}>
                                    <DialogTrigger asChild>
                                      <Button 
                                        variant="outline" 
                                        size="sm"
                                        className="text-red-600 border-red-600"
                                        onClick={() => setSelectedRoom(room.id)}
                                      >
                                        <Trash className="h-4 w-4 mr-1" />
                                        Xóa
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                      <DialogHeader>
                                        <DialogTitle>Xóa phòng</DialogTitle>
                                        <DialogDescription>
                                          Bạn có chắc chắn muốn xóa phòng {room.name}? Hành động này không thể khôi phục.
                                        </DialogDescription>
                                      </DialogHeader>
                                      <DialogFooter>
                                        <Button 
                                          variant="outline" 
                                          onClick={() => {
                                            setSelectedRoom(null);
                                            setOpenDeleteDialog(false);
                                          }}
                                        >
                                          Hủy
                                        </Button>
                                        <Button variant="destructive" onClick={handleDeleteRoom}>
                                          Xác nhận xóa
                                        </Button>
                                      </DialogFooter>
                                    </DialogContent>
                                  </Dialog>
                                </>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                          Không có phòng nào phù hợp với tiêu chí tìm kiếm
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
      
      {/* Dialog for adding new room */}
      <Dialog open={openAddDialog} onOpenChange={setOpenAddDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Thêm phòng mới</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  rules={{ required: "Vui lòng nhập tên phòng" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tên phòng</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập tên phòng" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="type"
                  rules={{ required: "Vui lòng chọn loại phòng" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Loại phòng</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn loại phòng" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="classroom">Phòng học</SelectItem>
                          <SelectItem value="conference">Phòng hội nghị</SelectItem>
                          <SelectItem value="lab">Phòng thực hành</SelectItem>
                          <SelectItem value="auditorium">Hội trường</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="building"
                  rules={{ required: "Vui lòng nhập tòa nhà" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tòa nhà</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập tên tòa nhà" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="floor"
                  rules={{ required: "Vui lòng nhập tầng" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tầng</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập số tầng" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="capacity"
                  rules={{ required: "Vui lòng nhập sức chứa" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sức chứa</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Nhập số lượng người" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Trạng thái</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn trạng thái" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="available">Sẵn sàng</SelectItem>
                          <SelectItem value="occupied">Đang sử dụng</SelectItem>
                          <SelectItem value="maintenance">Bảo trì</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="equipment"
                rules={{ required: "Vui lòng nhập danh sách thiết bị" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Thiết bị</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập danh sách thiết bị (ngăn cách bởi dấu phẩy)" {...field} />
                    </FormControl>
                    <FormDescription>
                      Nhập các thiết bị ngăn cách bởi dấu phẩy, ví dụ: Máy chiếu, Điều hòa, Micro
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ghi chú</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập ghi chú (nếu có)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => {
                  setOpenAddDialog(false);
                  form.reset();
                }}>Hủy</Button>
                <Button type="submit">Thêm phòng</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Rooms;
