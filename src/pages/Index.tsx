
import React from 'react';
import { Link } from 'react-router-dom';
import MainNavigation from '@/components/MainNavigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { PTITLogo } from '@/assets/logo';
import { motion } from 'framer-motion';
import { 
  FileText, 
  CalendarDays, 
  Bookmark, 
  Phone,
  Mail,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  ArrowRight,
  ChevronRight
} from 'lucide-react';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

// Hero background image
const heroBgImage = "https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&q=80";

// Event highlights data
const eventHighlights = [
  {
    id: '1',
    title: 'PTIT Hackathon 2023',
    date: '12/11/2023',
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=500',
    description: 'Cuộc thi lập trình với chủ đề "Công nghệ cho cộng đồng", thu hút hơn 150 đội tham gia từ các trường đại học trên toàn quốc.'
  },
  {
    id: '2',
    title: 'Ngày hội Việc làm PTIT 2023',
    date: '20/09/2023',
    image: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&q=80&w=500',
    description: 'Kết nối hơn 50 doanh nghiệp hàng đầu với sinh viên PTITHCM, mở ra cơ hội thực tập và việc làm cho hơn 2000 sinh viên.'
  },
  {
    id: '3',
    title: 'PTIT Tour - Khám phá công nghệ',
    date: '05/08/2023',
    image: 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&q=80&w=500',
    description: 'Chương trình tham quan, trải nghiệm công nghệ mới dành cho học sinh THPT, giới thiệu về ngành Công nghệ Thông tin và Viễn thông.'
  },
];

// Testimonials data
const testimonials = [
  {
    id: '1',
    name: 'Nguyễn Thanh Tùng',
    role: 'Sinh viên năm 3, Ngành CNTT',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=tung&backgroundColor=1e88e5',
    content: 'Các sự kiện tại PTITHCM luôn được tổ chức chuyên nghiệp và bổ ích. Tôi đã học hỏi được rất nhiều từ Hackathon năm ngoái và có cơ hội kết nối với nhiều doanh nghiệp.'
  },
  {
    id: '2',
    name: 'ThS. Phạm Minh Triết',
    role: 'Giảng viên Khoa CNTT',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=triet&backgroundColor=1e88e5',
    content: 'Việc tổ chức sự kiện thông qua hệ thống quản lý trực tuyến giúp công tác quản lý trở nên hiệu quả hơn rất nhiều. Việc đặt phòng và theo dõi sự kiện trở nên dễ dàng.'
  },
  {
    id: '3',
    name: 'Trần Thị Hương',
    role: 'Sinh viên năm 4, Ngành Marketing',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=huong&backgroundColor=1e88e5',
    content: 'Tôi đã tham gia nhiều sự kiện giao lưu doanh nghiệp và nhờ đó có được cơ hội thực tập tại một công ty lớn. Rất biết ơn nhà trường đã tổ chức những sự kiện bổ ích như vậy.'
  },
];

// Quick links
const quickLinks = [
  { title: 'Trang chủ', href: '/' },
  { title: 'Giới thiệu', href: '#about' },
  { title: 'Đào tạo', href: 'https://portal.ptit.edu.vn/gioithieu/dao-tao/' },
  { title: 'Tuyển sinh', href: 'https://tuyensinh.ptit.edu.vn/' },
  { title: 'Nghiên cứu khoa học', href: 'https://portal.ptit.edu.vn/gioithieu/nghien-cuu-khoa-hoc/' },
  { title: 'Hợp tác quốc tế', href: 'https://portal.ptit.edu.vn/gioithieu/hop-tac-quoc-te/' },
];

// Social media links
const socialLinks = [
  { icon: Facebook, href: 'https://www.facebook.com/PTITHCMC', label: 'Facebook' },
  { icon: Youtube, href: 'https://www.youtube.com/@ptithcmc', label: 'Youtube' },
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Twitter, href: '#', label: 'Twitter' },
];

const Index = () => {
  const { user, isAuthenticated } = useAuth();

  return (
    <div className="flex min-h-screen flex-col">
      <MainNavigation />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section 
          className="relative bg-cover bg-center py-24 md:py-32" 
          style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.7)), url(${heroBgImage})` }}
        >
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="mb-4 text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
                  Chào mừng bạn đến với Học viện Công nghệ Bưu chính Viễn thông
                </h1>
                <h2 className="mb-6 text-2xl font-semibold text-white sm:text-3xl">
                  Cơ sở TP.HCM (PTITHCM)
                </h2>
                <p className="mb-8 text-lg text-white/90 md:text-xl">
                  Nơi đào tạo nhân lực chất lượng cao trong lĩnh vực công nghệ thông tin và viễn thông
                </p>
                <div className="flex flex-wrap gap-4">
                  <a href="#about">
                    <Button size="lg" className="bg-primary hover:bg-primary/90">
                      Tìm hiểu thêm
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </a>
                  {isAuthenticated ? (
                    <Link to="/events">
                      <Button size="lg" variant="outline" className="bg-white/10 text-white border-white/30 hover:bg-white/20">
                        Xem sự kiện
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  ) : (
                    <Link to="/login">
                      <Button size="lg" variant="outline" className="bg-white/10 text-white border-white/30 hover:bg-white/20">
                        Đăng nhập
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">Về PTITHCM</h2>
                <p className="mb-4 text-muted-foreground">
                  Học viện Công nghệ Bưu chính Viễn thông (PTIT) Cơ sở tại TP.HCM được thành lập từ năm 1997 và chính thức trở thành cơ sở đào tạo trực thuộc Học viện Công nghệ Bưu chính Viễn thông từ năm 2005.
                </p>
                <p className="mb-4 text-muted-foreground">
                  Với hơn 25 năm xây dựng và phát triển, PTITHCM đã trở thành một trong những cơ sở giáo dục đại học uy tín trong lĩnh vực Công nghệ Thông tin và Viễn thông tại khu vực phía Nam.
                </p>
                
                <h3 className="text-xl font-semibold mt-6 mb-3">Tầm nhìn</h3>
                <p className="mb-4 text-muted-foreground">
                  Trở thành học viện hàng đầu Việt Nam về đào tạo, nghiên cứu khoa học và chuyển giao công nghệ trong lĩnh vực Công nghệ thông tin, Viễn thông và Truyền thông.
                </p>
                
                <h3 className="text-xl font-semibold mt-6 mb-3">Sứ mệnh</h3>
                <p className="mb-4 text-muted-foreground">
                  Đào tạo nguồn nhân lực chất lượng cao, phát triển tài năng; nghiên cứu khoa học, chuyển giao công nghệ phục vụ sự phát triển của ngành Thông tin và Truyền thông và đất nước.
                </p>
              </div>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-card p-6 rounded-xl shadow-sm border">
                    <div className="bg-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">Đào tạo</h3>
                    <p className="text-sm text-muted-foreground">
                      Đa dạng ngành nghề đào tạo từ Công nghệ thông tin, Kỹ thuật viễn thông đến Quản trị kinh doanh.
                    </p>
                  </div>
                  
                  <div className="bg-card p-6 rounded-xl shadow-sm border">
                    <div className="bg-secondary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                      <CalendarDays className="h-6 w-6 text-secondary" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">Sự kiện</h3>
                    <p className="text-sm text-muted-foreground">
                      Tổ chức đa dạng sự kiện học thuật, hội thảo khoa học và hoạt động sinh viên.
                    </p>
                  </div>
                  
                  <div className="bg-card p-6 rounded-xl shadow-sm border">
                    <div className="bg-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                      <Bookmark className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">Nghiên cứu</h3>
                    <p className="text-sm text-muted-foreground">
                      Thực hiện nhiều đề tài nghiên cứu khoa học các cấp, công bố quốc tế.
                    </p>
                  </div>
                  
                  <div className="bg-card p-6 rounded-xl shadow-sm border">
                    <div className="bg-secondary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                      <CalendarDays className="h-6 w-6 text-secondary" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">Hợp tác</h3>
                    <p className="text-sm text-muted-foreground">
                      Liên kết với doanh nghiệp và các đối tác quốc tế trong đào tạo và nghiên cứu.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Event Highlights */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Sự kiện nổi bật</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {eventHighlights.map((event) => (
                <motion.div
                  key={event.id}
                  className="bg-card border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={event.image} 
                      alt={event.title} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div className="p-6">
                    <div className="text-sm text-muted-foreground mb-2">{event.date}</div>
                    <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                    <p className="text-muted-foreground mb-4">{event.description}</p>
                    <Button variant="outline" size="sm">
                      Xem chi tiết
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="mt-12 text-center">
              <Link to="/events">
                <Button>
                  Xem tất cả sự kiện
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
        
        {/* Testimonials */}
        <section className="py-16 bg-gradient-to-b from-muted/50 to-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Đánh giá từ người tham gia</h2>
            
            <Carousel className="w-full max-w-4xl mx-auto">
              <CarouselContent>
                {testimonials.map((testimonial) => (
                  <CarouselItem key={testimonial.id}>
                    <div className="bg-card border rounded-xl p-8 text-center">
                      <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden">
                        <img 
                          src={testimonial.avatar} 
                          alt={testimonial.name}
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <p className="text-lg italic mb-6">"{testimonial.content}"</p>
                      <h4 className="font-semibold">{testimonial.name}</h4>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="flex justify-center mt-6 gap-2">
                <CarouselPrevious />
                <CarouselNext />
              </div>
            </Carousel>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 bg-primary/5">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Sẵn sàng tham gia cùng PTITHCM?</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Khám phá thêm về các sự kiện sắp tới và cơ hội học tập tại Học viện Công nghệ Bưu chính Viễn thông TPHCM
            </p>
            
            <div className="flex flex-wrap gap-4 justify-center">
              <a href="https://tuyensinh.ptit.edu.vn/" target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  Thông tin tuyển sinh
                </Button>
              </a>
              <Link to="/events">
                <Button size="lg" variant="outline">
                  Xem lịch sự kiện
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-muted py-12 border-t">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <PTITLogo size={40} />
                <span className="font-bold text-xl">PTITHCM</span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Học viện Công nghệ Bưu chính Viễn thông - Cơ sở TP.HCM
              </p>
              <div className="flex space-x-4">
                {socialLinks.map((link) => (
                  <a 
                    key={link.label}
                    href={link.href} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors"
                    aria-label={link.label}
                  >
                    <link.icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-4">Liên kết nhanh</h3>
              <ul className="space-y-2">
                {quickLinks.map((link) => (
                  <li key={link.title}>
                    <a 
                      href={link.href}
                      className="text-muted-foreground hover:text-primary hover:underline transition-colors"
                    >
                      {link.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-4">Dành cho</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-muted-foreground hover:text-primary hover:underline transition-colors">
                    Sinh viên
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-primary hover:underline transition-colors">
                    Giảng viên
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-primary hover:underline transition-colors">
                    Cán bộ
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-primary hover:underline transition-colors">
                    Cựu sinh viên
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-primary hover:underline transition-colors">
                    Đối tác
                  </a>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-4">Thông tin liên hệ</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <span className="text-sm text-muted-foreground">
                    97 Man Thiện, Phường Tăng Nhơn Phú A, TP Thủ Đức, TP.HCM
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  <a href="tel:02837305316" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    (028) 3730 5316
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <a href="mailto:csptit@ptithcm.edu.vn" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    csptit@ptithcm.edu.vn
                  </a>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t mt-8 pt-8 text-center">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Học viện Công nghệ Bưu chính Viễn thông - Cơ sở tại TP.HCM. Tất cả quyền được bảo lưu.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
