
import { useState } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

interface Notification {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
}

export function NotificationBell() {
  // Mock data cho thông báo
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "Sự kiện được duyệt",
      message: "Sự kiện 'Hội thảo Công nghệ AI' đã được duyệt",
      date: "2 giờ trước",
      read: false,
    },
    {
      id: "2",
      title: "Sự kiện sắp diễn ra",
      message: "Sự kiện 'Workshop Blockchain' sẽ diễn ra trong 2 ngày tới",
      date: "5 giờ trước",
      read: false,
    },
    {
      id: "3",
      title: "Yêu cầu mượn phòng",
      message: "Yêu cầu mượn phòng H.A5.01 đã được chấp nhận",
      date: "Hôm qua",
      read: true,
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleReadNotification = (id: string) => {
    setNotifications(
      notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(
      notifications.map((n) => ({ ...n, read: true }))
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-full">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-secondary text-secondary-foreground"
              variant="default"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end">
        <DropdownMenuLabel className="flex justify-between items-center">
          <span>Thông báo</span>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead} className="text-xs h-auto py-1">
              Đánh dấu đã đọc
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup className="max-h-80 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              Không có thông báo
            </div>
          ) : (
            notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className={`flex flex-col items-start p-3 cursor-pointer ${!notification.read ? 'bg-muted/50' : ''}`}
                onClick={() => handleReadNotification(notification.id)}
              >
                <div className="flex w-full justify-between">
                  <span className="font-semibold text-sm">{notification.title}</span>
                  <span className="text-xs text-muted-foreground">{notification.date}</span>
                </div>
                <p className="text-sm mt-1">{notification.message}</p>
              </DropdownMenuItem>
            ))
          )}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="justify-center text-center text-primary cursor-pointer">
          Xem tất cả thông báo
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
