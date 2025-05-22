
import React from 'react';
import { useNavigate } from 'react-router-dom';
import MainNavigation from '@/components/MainNavigation';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePickerWithRange } from '@/components/DateRangePicker';
import { useForm } from 'react-hook-form';
import { CalendarRange, Check, Users, FileText, Building, CalendarIcon } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { motion } from 'framer-motion';

type FormValues = {
  title: string;
  description: string;
  expectedParticipants: string;
  eventType: string;
  hostUnit: string;
  hostPerson: string;
  guestNotes: string;
  dateRange: {
    from: Date | undefined;
    to: Date | undefined;
  };
};

const EventsNew = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const form = useForm<FormValues>({
    defaultValues: {
      title: '',
      description: '',
      expectedParticipants: '',
      eventType: 'meeting',
      hostUnit: user?.donViId || '',
      hostPerson: user?.name || '',
      guestNotes: '',
      dateRange: {
        from: undefined,
        to: undefined,
      },
    },
  });

  const onSubmit = (data: FormValues) => {
    // In a real app, this would send the data to the server
    console.log('Form submitted:', data);
    
    toast.success('Yêu cầu tạo sự kiện đã được gửi đi!', {
      description: 'Sự kiện sẽ được Ban Giám Hiệu xem xét và phê duyệt.'
    });
    
    // Navigate back to events list after submission
    setTimeout(() => {
      navigate('/events');
    }, 1500);
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
              <h1 className="text-3xl font-bold tracking-tight">Tạo sự kiện mới</h1>
              <p className="text-muted-foreground">Điền đầy đủ thông tin để tạo yêu cầu sự kiện mới</p>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Thông tin sự kiện</CardTitle>
              <CardDescription>
                Vui lòng cung cấp đầy đủ thông tin chi tiết về sự kiện. 
                Sau khi gửi, yêu cầu sẽ được Ban Giám Hiệu xem xét phê duyệt.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="title"
                      rules={{ required: "Vui lòng nhập tên sự kiện" }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tên sự kiện <span className="text-destructive">*</span></FormLabel>
                          <FormControl>
                            <Input placeholder="Nhập tên sự kiện" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="eventType"
                      rules={{ required: "Vui lòng chọn loại sự kiện" }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Loại sự kiện <span className="text-destructive">*</span></FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Chọn loại sự kiện" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="meeting">Họp / Hội nghị</SelectItem>
                              <SelectItem value="seminar">Hội thảo / Tọa đàm</SelectItem>
                              <SelectItem value="competition">Cuộc thi</SelectItem>
                              <SelectItem value="training">Đào tạo / Workshop</SelectItem>
                              <SelectItem value="culture">Văn hóa / Nghệ thuật</SelectItem>
                              <SelectItem value="other">Khác</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="description"
                    rules={{ required: "Vui lòng nhập mô tả sự kiện" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mô tả sự kiện <span className="text-destructive">*</span></FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Mô tả chi tiết về nội dung, mục tiêu và chương trình sự kiện..." 
                            className="min-h-[120px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="dateRange"
                      rules={{ required: "Vui lòng chọn thời gian tổ chức" }}
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Thời gian tổ chức <span className="text-destructive">*</span></FormLabel>
                          <DatePickerWithRange
                            date={field.value}
                            setDate={field.onChange}
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="expectedParticipants"
                      rules={{ required: "Vui lòng nhập số người tham dự dự kiến" }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Số người tham dự dự kiến <span className="text-destructive">*</span></FormLabel>
                          <FormControl>
                            <Input type="number" min="1" placeholder="Nhập số lượng" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="hostUnit"
                      rules={{ required: "Vui lòng chọn đơn vị chủ trì" }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Đơn vị chủ trì <span className="text-destructive">*</span></FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Chọn đơn vị chủ trì" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="1">Phòng Công tác Sinh viên</SelectItem>
                              <SelectItem value="2">Khoa Công nghệ Thông tin</SelectItem>
                              <SelectItem value="3">CLB IT</SelectItem>
                              <SelectItem value="4">Phòng Đào tạo</SelectItem>
                              <SelectItem value="5">Khoa Viễn thông</SelectItem>
                              <SelectItem value="6">Đoàn Thanh niên</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="hostPerson"
                      rules={{ required: "Vui lòng nhập người chủ trì" }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Người chủ trì <span className="text-destructive">*</span></FormLabel>
                          <FormControl>
                            <Input placeholder="Nhập tên người chủ trì" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="guestNotes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ghi chú về khách mời</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Thông tin về khách mời, diễn giả, đại biểu..." 
                            className="min-h-[100px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Thông tin này giúp việc chuẩn bị phòng và tiếp đón được chu đáo hơn
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <CardFooter className="px-0 pt-6 flex justify-between border-t">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => navigate('/events')}
                    >
                      Hủy
                    </Button>
                    <Button type="submit">
                      <Check className="mr-2 h-4 w-4" /> Gửi yêu cầu
                    </Button>
                  </CardFooter>
                </form>
              </Form>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
};

export default EventsNew;
