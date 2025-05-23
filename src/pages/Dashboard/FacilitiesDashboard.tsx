
import DashboardLayout from "@/components/DashboardLayout";
import {
  Building,
  Calendar,
  Users,
  Clock,
  AlertTriangle,
  Wrench,
  Award
} from "lucide-react";
import DashboardCard from "@/components/dashboard/DashboardCard";
import ChartCard from "@/components/dashboard/ChartCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Mock data
const roomCounts = {
  total: 120,
  lecture: 85,
  lab: 20,
  meeting: 10,
  auditorium: 5,
};

const roomBookingData = [
  { date: "T1", requests: 125, approvals: 110 },
  { date: "T2", requests: 132, approvals: 118 },
  { date: "T3", requests: 141, approvals: 130 },
  { date: "T4", requests: 158, approvals: 142 },
  { date: "T5", requests: 165, approvals: 152 },
  { date: "T6", requests: 178, approvals: 160 },
  { date: "T7", requests: 120, approvals: 105 },
  { date: "T8", requests: 90, approvals: 88 },
  { date: "T9", requests: 145, approvals: 135 },
  { date: "T10", requests: 160, approvals: 148 },
  { date: "T11", requests: 170, approvals: 158 },
  { date: "T12", requests: 155, approvals: 142 },
];

const roomUsageByTypeData = [
  { name: "Phòng học", value: 65 },
  { name: "Phòng máy", value: 18 },
  { name: "Phòng họp", value: 8 },
  { name: "Hội trường", value: 9 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

const pendingRoomRequests = [
  { id: 1, name: "Yêu cầu mượn Hội trường A", requester: "Khoa CNTT", date: "15/06/2025", time: "08:00 - 12:00", status: "pending" },
  { id: 2, name: "Yêu cầu mượn Phòng máy B2", requester: "CLB IT", date: "18/06/2025", time: "14:00 - 17:00", status: "pending" },
  { id: 3, name: "Yêu cầu đổi Phòng họp C3", requester: "Phòng Đào tạo", date: "20/06/2025", time: "13:30 - 15:30", status: "pending" },
  { id: 4, name: "Yêu cầu mượn Phòng lab D1", requester: "Khoa Điện tử", date: "25/06/2025", time: "07:30 - 11:30", status: "pending" },
];

const maintenanceRequests = [
  { id: 1, name: "Máy chiếu hỏng", location: "Phòng học A203", priority: "high", date: "12/06/2025" },
  { id: 2, name: "Điều hòa không hoạt động", location: "Phòng máy B101", priority: "high", date: "13/06/2025" },
  { id: 3, name: "Bàn ghế bị gãy", location: "Phòng học C305", priority: "medium", date: "11/06/2025" },
  { id: 4, name: "Rò rỉ nước", location: "Phòng học D405", priority: "high", date: "10/06/2025" },
  { id: 5, name: "Cửa sổ không đóng được", location: "Phòng họp E201", priority: "low", date: "09/06/2025" },
];

const equipmentUsageData = [
  { name: "Máy chiếu", count: 85, total: 95, percentage: 89 },
  { name: "Máy tính", count: 350, total: 400, percentage: 88 },
  { name: "Loa", count: 40, total: 50, percentage: 80 },
  { name: "Micro", count: 25, total: 30, percentage: 83 },
  { name: "Bảng tương tác", count: 10, total: 15, percentage: 67 },
];

export default function FacilitiesDashboard() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Quản lý Cơ sở vật chất</h1>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <DashboardCard
            title="Tổng số phòng"
            value={roomCounts.total}
            description={`${roomCounts.lecture} phòng học, ${roomCounts.lab} phòng thực hành`}
            icon={<Building />}
          />
          <DashboardCard
            title="Lượt đặt phòng tháng này"
            value="165"
            description="152 yêu cầu được chấp thuận"
            icon={<Calendar />}
            trend={{ value: 8.6, isPositive: true }}
          />
          <DashboardCard
            title="Yêu cầu chờ xử lý"
            value="14"
            description="4 yêu cầu ưu tiên cao"
            icon={<Clock />}
          />
          <DashboardCard
            title="Báo cáo sự cố"
            value="8"
            description="3 sự cố cần xử lý ngay"
            icon={<AlertTriangle />}
            trend={{ value: 4.2, isPositive: false }}
          />
        </div>
        
        <Tabs defaultValue="rooms">
          <TabsList>
            <TabsTrigger value="rooms">Phòng học</TabsTrigger>
            <TabsTrigger value="requests">Yêu cầu</TabsTrigger>
            <TabsTrigger value="maintenance">Bảo trì</TabsTrigger>
          </TabsList>
          
          <TabsContent value="rooms" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <ChartCard title="Thống kê đặt phòng theo tháng">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={roomBookingData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="requests"
                        name="Yêu cầu"
                        stroke="#8884d8"
                        strokeWidth={2}
                      />
                      <Line
                        type="monotone"
                        dataKey="approvals"
                        name="Được duyệt"
                        stroke="#82ca9d"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </ChartCard>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Tỷ lệ sử dụng theo loại phòng</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={roomUsageByTypeData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={90}
                          fill="#8884d8"
                          paddingAngle={2}
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {roomUsageByTypeData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Tình trạng thiết bị</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tên thiết bị</TableHead>
                      <TableHead className="text-center">Đang sử dụng</TableHead>
                      <TableHead className="text-center">Tổng số</TableHead>
                      <TableHead className="text-center">Tỷ lệ</TableHead>
                      <TableHead className="text-right">Tình trạng</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {equipmentUsageData.map(item => (
                      <TableRow key={item.name}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell className="text-center">{item.count}</TableCell>
                        <TableCell className="text-center">{item.total}</TableCell>
                        <TableCell className="text-center">{item.percentage}%</TableCell>
                        <TableCell className="text-right">
                          <Badge variant={
                            item.percentage > 80 ? "default" : 
                            item.percentage > 60 ? "secondary" : 
                            "outline"
                          }>
                            {item.percentage > 80 ? "Tốt" : 
                             item.percentage > 60 ? "Bình thường" : 
                             "Cần bổ sung"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="requests" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base">Yêu cầu đặt phòng chờ xử lý</CardTitle>
                <Button size="sm">Xem tất cả</Button>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Yêu cầu</TableHead>
                      <TableHead>Người yêu cầu</TableHead>
                      <TableHead>Ngày</TableHead>
                      <TableHead>Thời gian</TableHead>
                      <TableHead>Hành động</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingRoomRequests.map(request => (
                      <TableRow key={request.id}>
                        <TableCell className="font-medium">{request.name}</TableCell>
                        <TableCell>{request.requester}</TableCell>
                        <TableCell>{request.date}</TableCell>
                        <TableCell>{request.time}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline" className="h-8 w-8 p-0 text-red-500 hover:text-red-500">
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="maintenance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Báo cáo sự cố</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[400px]">
                  <div className="divide-y">
                    {maintenanceRequests.map((request) => (
                      <div key={request.id} className="flex items-start space-x-4 p-4">
                        <div className={cn(
                          "mt-0.5 rounded-full p-1",
                          request.priority === "high" ? "bg-red-100" : 
                          request.priority === "medium" ? "bg-yellow-100" : 
                          "bg-blue-100"
                        )}>
                          <Wrench className={cn(
                            "h-4 w-4",
                            request.priority === "high" ? "text-red-600" : 
                            request.priority === "medium" ? "text-yellow-600" : 
                            "text-blue-600"
                          )} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">{request.name}</h4>
                            <Badge variant={
                              request.priority === "high" ? "destructive" : 
                              request.priority === "medium" ? "default" : 
                              "secondary"
                            }>
                              {request.priority === "high" ? "Khẩn cấp" : 
                               request.priority === "medium" ? "Thông thường" : 
                               "Thấp"}
                            </Badge>
                          </div>
                          <div className="mt-1">
                            <p className="text-sm text-muted-foreground">
                              {request.location}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Báo cáo: {request.date}
                            </p>
                          </div>
                          <div className="mt-2 flex gap-2">
                            <Button size="sm" variant="outline" className="h-8">
                              Xử lý
                            </Button>
                            <Button size="sm" variant="outline" className="h-8 text-red-500 hover:text-red-500">
                              Hoãn
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
