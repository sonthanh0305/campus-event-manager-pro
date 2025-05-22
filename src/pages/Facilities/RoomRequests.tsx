
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
  CheckCircle, 
  XCircle, 
  Search, 
  FileText, 
  Calendar,
  Building 
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/sonner';
import { motion } from 'framer-motion';

// Mock data for room requests
const mockRoomRequests = [
  {
    id: '1',
    eventId: '1',
    eventTitle: 'Hội nghị Khoa học Công nghệ 2023',
    requestDate: '2023-11-01T10:23:45',
    status: 'pending',
    requestor: 'Nguyễn Văn A',
    requestorUnit: 'Khoa Công nghệ Thông tin',
    details: [
      {
        id: '1-1',
        roomType: 'conference',
        capacity: 200,
        startTime: '2023-11-15T08:00:00',
        endTime: '2023-11-15T17:00:00',
        equipment: ['Máy chiếu', 'Micro không dây', 'Máy tính'],
        status: 'pending',
        notes: 'Cần xếp bàn theo hình chữ U',
      }
    ]
  },
  {
    id: '2',
    eventId: '2',
    eventTitle: 'Workshop Kỹ năng mềm cho sinh viên',
    requestDate: '2023-11-05T14:10:22',
    status: 'approved',
    requestor: 'Trần Thị B',
    requestorUnit: 'Phòng Công tác Sinh viên',
    approvedBy: 'Lê Văn C',
    approveDate: '2023-11-06T09:30:15',
    details: [
      {
        id: '2-1',
        roomType: 'classroom',
        capacity: 80,
        startTime: '2023-11-20T13:30:00',
        endTime: '2023-11-20T17:00:00',
        equipment: ['Máy chiếu', 'Micro không dây'],
        status: 'approved',
        room: 'B2-01',
      }
    ]
  },
  {
    id: '3',
    eventId: '3',
    eventTitle: 'Cuộc thi Lập trình IoT 2023',
    requestDate: '2023-11-10T08:45:30',
    status: 'partially_approved',
    requestor: 'Phạm Văn D',
    requestorUnit: 'CLB IT',
    approvedBy: 'Hoàng Văn E',
    approveDate: '2023-11-11T11:20:40',
    details: [
      {
        id: '3-1',
        roomType: 'lab',
        capacity: 100,
        startTime: '2023-12-01T08:00:00',
        endTime: '2023-12-01T17:00:00',
        equipment: ['Máy tính', 'Mạng Internet tốc độ cao', 'Thiết bị IoT'],
        status: 'approved',
        room: 'Lab A1-05',
      },
      {
        id: '3-2',
        roomType: 'auditorium',
        capacity: 200,
        startTime: '2023-12-02T08:00:00',
        endTime: '2023-12-02T17:00:00',
        equipment: ['Máy chiếu', 'Micro không dây', 'Hệ thống âm thanh'],
        status: 'rejected',
        reason: 'Hội trường đã được đặt cho sự kiện khác',
      }
    ]
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
    case 'partially_approved':
      return <Badge className="bg-blue-500">Duyệt một phần</Badge>;
    default:
      return <Badge variant="outline">Không xác định</Badge>;
  }
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

const RoomRequests = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);
  
  // Check if user is facility manager
  const isFacilityManager = user?.roles.includes('QUAN_LY_CSVC');
  
  // Filter requests based on search term and filter status
  const filteredRequests = mockRoomRequests.filter(request => {
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
    return mockRoomRequests.find(request => request.id === selectedRequest);
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
              <h1 className="text-3xl font-bold tracking-tight">Yêu cầu mượn phòng</h1>
              <p className="text-muted-foreground">Quản lý các yêu cầu mượn phòng cho các sự kiện</p>
            </div>
          </div>

          <Tabs defaultValue="pending" className="space-y-4">
            <div className="flex justify-between">
              <TabsList>
                <TabsTrigger value="pending">Chờ xử lý</TabsTrigger>
                <TabsTrigger value="all">Tất cả yêu cầu</TabsTrigger>
                <TabsTrigger value="approved">Đã duyệt</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="pending" className="space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Yêu cầu chờ xử lý</CardTitle>
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
                  </div>
                  
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[300px]">Sự kiện</TableHead>
                          <TableHead>Người yêu cầu</TableHead>
                          <TableHead>Đơn vị</TableHead>
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
                                <TableCell>{formatDate(request.requestDate)}</TableCell>
                                <TableCell className="text-center">{getStatusBadge(request.status)}</TableCell>
                                <TableCell className="text-right">
                                  <Dialog open={openDetailsDialog && selectedRequest === request.id} onOpenChange={(open) => {
                                    if (!open) setSelectedRequest(null);
                                    setOpenDetailsDialog(open);
                                  }}>
                                    <DialogTrigger asChild>
                                      <Button 
                                        variant="outline" 
                                        size="sm"
                                        onClick={() => setSelectedRequest(request.id)}
                                      >
                                        <FileText className="h-4 w-4 mr-1" />
                                        Chi tiết
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-4xl">
                                      <DialogHeader>
                                        <DialogTitle>Chi tiết yêu cầu mượn phòng</DialogTitle>
                                        <DialogDescription>
                                          {request.eventTitle} - Yêu cầu bởi {request.requestor} ({request.requestorUnit})
                                        </DialogDescription>
                                      </DialogHeader>
                                      <div className="space-y-4">
                                        <h4 className="font-medium">Chi tiết các phòng yêu cầu:</h4>
                                        <div className="rounded-md border">
                                          <Table>
                                            <TableHeader>
                                              <TableRow>
                                                <TableHead>Loại phòng</TableHead>
                                                <TableHead className="text-center">Sức chứa</TableHead>
                                                <TableHead>Thời gian</TableHead>
                                                <TableHead>Thiết bị yêu cầu</TableHead>
                                                <TableHead>Ghi chú</TableHead>
                                                {isFacilityManager && <TableHead className="text-right">Thao tác</TableHead>}
                                              </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                              {request.details.map((detail) => (
                                                <TableRow key={detail.id}>
                                                  <TableCell>{getRoomTypeDisplay(detail.roomType)}</TableCell>
                                                  <TableCell className="text-center">{detail.capacity} người</TableCell>
                                                  <TableCell>
                                                    <div className="flex flex-col text-sm">
                                                      <span>Bắt đầu: {formatDate(detail.startTime)}</span>
                                                      <span>Kết thúc: {formatDate(detail.endTime)}</span>
                                                    </div>
                                                  </TableCell>
                                                  <TableCell>
                                                    <ul className="list-disc list-inside">
                                                      {detail.equipment.map((item, index) => (
                                                        <li key={index} className="text-sm">{item}</li>
                                                      ))}
                                                    </ul>
                                                  </TableCell>
                                                  <TableCell>{detail.notes || 'Không có'}</TableCell>
                                                  {isFacilityManager && (
                                                    <TableCell className="text-right">
                                                      <div className="flex gap-2 justify-end">
                                                        <Dialog>
                                                          <DialogTrigger asChild>
                                                            <Button 
                                                              variant="outline" 
                                                              size="sm"
                                                              className="text-green-600 border-green-600"
                                                            >
                                                              <CheckCircle className="h-4 w-4 mr-1" />
                                                              Xếp phòng
                                                            </Button>
                                                          </DialogTrigger>
                                                          <DialogContent>
                                                            <DialogHeader>
                                                              <DialogTitle>Xếp phòng cho yêu cầu</DialogTitle>
                                                              <DialogDescription>
                                                                Chọn phòng phù hợp với yêu cầu và tiến hành xếp phòng
                                                              </DialogDescription>
                                                            </DialogHeader>
                                                            <div className="grid gap-4 py-4">
                                                              <div className="grid grid-cols-4 items-center gap-4">
                                                                <span className="text-sm font-medium">Loại phòng:</span>
                                                                <span className="col-span-3">{getRoomTypeDisplay(detail.roomType)}</span>
                                                              </div>
                                                              <div className="grid grid-cols-4 items-center gap-4">
                                                                <span className="text-sm font-medium">Sức chứa yêu cầu:</span>
                                                                <span className="col-span-3">{detail.capacity} người</span>
                                                              </div>
                                                              <div className="grid grid-cols-4 items-center gap-4">
                                                                <span className="text-sm font-medium">Thời gian:</span>
                                                                <span className="col-span-3">{formatDate(detail.startTime)} - {formatDate(detail.endTime)}</span>
                                                              </div>
                                                              <div className="grid grid-cols-4 items-center gap-4">
                                                                <span className="text-sm font-medium">Chọn phòng:</span>
                                                                <div className="col-span-3">
                                                                  <Select>
                                                                    <SelectTrigger>
                                                                      <SelectValue placeholder="Chọn phòng phù hợp" />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                      <SelectItem value="A1-01">A1-01 (Sức chứa: 100)</SelectItem>
                                                                      <SelectItem value="A1-02">A1-02 (Sức chứa: 80)</SelectItem>
                                                                      <SelectItem value="B2-01">B2-01 (Sức chứa: 120)</SelectItem>
                                                                      <SelectItem value="HT-A">Hội trường A (Sức chứa: 300)</SelectItem>
                                                                    </SelectContent>
                                                                  </Select>
                                                                </div>
                                                              </div>
                                                              <div className="grid grid-cols-4 items-center gap-4">
                                                                <span className="text-sm font-medium">Ghi chú:</span>
                                                                <div className="col-span-3">
                                                                  <Input placeholder="Ghi chú thêm (nếu có)" />
                                                                </div>
                                                              </div>
                                                            </div>
                                                            <DialogFooter>
                                                              <Button variant="outline" onClick={() => {}}>Hủy</Button>
                                                              <Button onClick={() => {
                                                                toast.success('Đã xếp phòng thành công');
                                                              }}>Xác nhận xếp phòng</Button>
                                                            </DialogFooter>
                                                          </DialogContent>
                                                        </Dialog>
                                                        
                                                        <Dialog>
                                                          <DialogTrigger asChild>
                                                            <Button 
                                                              variant="outline" 
                                                              size="sm"
                                                              className="text-red-600 border-red-600"
                                                            >
                                                              <XCircle className="h-4 w-4 mr-1" />
                                                              Từ chối
                                                            </Button>
                                                          </DialogTrigger>
                                                          <DialogContent>
                                                            <DialogHeader>
                                                              <DialogTitle>Từ chối yêu cầu mượn phòng</DialogTitle>
                                                              <DialogDescription>
                                                                Vui lòng cung cấp lý do từ chối yêu cầu này
                                                              </DialogDescription>
                                                            </DialogHeader>
                                                            <Input placeholder="Nhập lý do từ chối yêu cầu..." />
                                                            <DialogFooter>
                                                              <Button variant="outline" onClick={() => {}}>Hủy</Button>
                                                              <Button variant="destructive" onClick={() => {
                                                                toast.success('Đã từ chối yêu cầu mượn phòng');
                                                              }}>Xác nhận từ chối</Button>
                                                            </DialogFooter>
                                                          </DialogContent>
                                                        </Dialog>
                                                      </div>
                                                    </TableCell>
                                                  )}
                                                </TableRow>
                                              ))}
                                            </TableBody>
                                          </Table>
                                        </div>
                                      </div>
                                      <DialogFooter>
                                        <Button variant="outline" onClick={() => {
                                          setOpenDetailsDialog(false);
                                          setSelectedRequest(null);
                                        }}>Đóng</Button>
                                      </DialogFooter>
                                    </DialogContent>
                                  </Dialog>
                                </TableCell>
                              </TableRow>
                            ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                              Không có yêu cầu mượn phòng nào đang chờ xử lý
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
                  <CardTitle>Tất cả yêu cầu mượn phòng</CardTitle>
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
                          <SelectItem value="partially_approved">Duyệt một phần</SelectItem>
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
                              <TableCell>{formatDate(request.requestDate)}</TableCell>
                              <TableCell className="text-center">{getStatusBadge(request.status)}</TableCell>
                              <TableCell className="text-right">
                                <Button variant="outline" size="sm" onClick={() => {
                                  setSelectedRequest(request.id);
                                  setOpenDetailsDialog(true);
                                }}>
                                  <FileText className="h-4 w-4 mr-1" />
                                  Chi tiết
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                              Không có yêu cầu mượn phòng nào phù hợp với tiêu chí tìm kiếm
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="approved" className="space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Yêu cầu đã được duyệt</CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Similar content but filtered for approved requests */}
                  <div className="relative mb-6">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Tìm kiếm trong yêu cầu đã duyệt..."
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
                          <TableHead>Ngày yêu cầu</TableHead>
                          <TableHead className="text-center">Trạng thái</TableHead>
                          <TableHead className="text-right">Thao tác</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredRequests.filter(r => r.status === 'approved' || r.status === 'partially_approved').length > 0 ? (
                          filteredRequests
                            .filter(r => r.status === 'approved' || r.status === 'partially_approved')
                            .map((request) => (
                              <TableRow key={request.id}>
                                <TableCell className="font-medium">{request.eventTitle}</TableCell>
                                <TableCell>{request.requestor}</TableCell>
                                <TableCell>{request.requestorUnit}</TableCell>
                                <TableCell>{formatDate(request.requestDate)}</TableCell>
                                <TableCell className="text-center">{getStatusBadge(request.status)}</TableCell>
                                <TableCell className="text-right">
                                  <Button variant="outline" size="sm" onClick={() => {
                                    setSelectedRequest(request.id);
                                    setOpenDetailsDialog(true);
                                  }}>
                                    <FileText className="h-4 w-4 mr-1" />
                                    Chi tiết
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                              Không có yêu cầu mượn phòng nào đã được duyệt
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
        </motion.div>
      </main>
    </div>
  );
};

export default RoomRequests;
