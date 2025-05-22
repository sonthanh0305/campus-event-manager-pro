
import React from 'react';
import MainNavigation from '@/components/MainNavigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { PTITLogo } from '@/assets/logo';
import { motion } from 'framer-motion';

const Index = () => {
  const { user, isAuthenticated } = useAuth();

  // Function to determine welcome message based on user type and roles
  const getWelcomeMessage = () => {
    if (!isAuthenticated) {
      return 'Chào mừng đến với Hệ thống Quản lý Sự kiện';
    }

    if (user?.roles.includes('ADMIN_HE_THONG')) {
      return 'Chào mừng Quản trị viên Hệ thống';
    }
    
    if (user?.roles.includes('BGH_DUYET_SK_TRUONG')) {
      return 'Chào mừng Ban Giám hiệu';
    }
    
    if (user?.roles.includes('CB_TO_CHUC_SU_KIEN')) {
      return 'Chào mừng Cán bộ Tổ chức Sự kiện';
    }
    
    if (user?.roles.includes('QUAN_LY_CSVC')) {
      return 'Chào mừng Quản lý Cơ sở Vật chất';
    }
    
    if (user?.roles.includes('TRUONG_KHOA')) {
      return 'Chào mừng Trưởng Khoa';
    }
    
    if (user?.roles.includes('TRUONG_CLB')) {
      return 'Chào mừng Trưởng Câu lạc bộ';
    }
    
    if (user?.userType === 'SINH_VIEN') {
      return 'Chào mừng Sinh viên';
    }
    
    if (user?.userType === 'GIANG_VIEN') {
      return 'Chào mừng Giảng viên';
    }
    
    return `Chào mừng, ${user?.name}`;
  };

  return (
    <div className="flex min-h-screen flex-col">
      <MainNavigation />
      
      <main className="flex-1 bg-gradient-to-b from-background to-muted">
        <div className="container py-12">
          <motion.div 
            className="mx-auto max-w-4xl text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-6 flex justify-center">
              <PTITLogo size={80} className="text-primary" />
            </div>
            
            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {getWelcomeMessage()}
            </h1>
            
            <p className="mb-8 text-xl text-muted-foreground">
              Hệ thống giúp quản lý sự kiện, phòng ốc và các hoạt động của Học viện Công nghệ Bưu chính Viễn thông TPHCM với phân quyền theo vai trò.
            </p>
            
            {!isAuthenticated ? (
              <motion.div 
                className="flex justify-center gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Link to="/login">
                  <Button size="lg" className="min-w-[150px]">
                    Đăng nhập
                  </Button>
                </Link>
              </motion.div>
            ) : (
              <motion.div 
                className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {/* Admin System */}
                {user?.roles.includes('ADMIN_HE_THONG') && (
                  <>
                    <Link to="/users">
                      <Button variant="outline" className="h-24 w-full text-lg hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all">
                        Quản lý Người dùng
                      </Button>
                    </Link>
                    <Link to="/units">
                      <Button variant="outline" className="h-24 w-full text-lg hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all">
                        Quản lý Đơn vị
                      </Button>
                    </Link>
                    <Link to="/settings">
                      <Button variant="outline" className="h-24 w-full text-lg hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all">
                        Cài đặt Hệ thống
                      </Button>
                    </Link>
                  </>
                )}
                
                {/* Event Organizer */}
                {user?.roles.includes('CB_TO_CHUC_SU_KIEN') && (
                  <>
                    <Link to="/events/new">
                      <Button variant="outline" className="h-24 w-full text-lg hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all">
                        Tạo Sự kiện mới
                      </Button>
                    </Link>
                    <Link to="/events">
                      <Button variant="outline" className="h-24 w-full text-lg hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all">
                        Quản lý Sự kiện
                      </Button>
                    </Link>
                    <Link to="/events/cancel-requests">
                      <Button variant="outline" className="h-24 w-full text-lg hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all">
                        Yêu cầu Hủy sự kiện
                      </Button>
                    </Link>
                  </>
                )}
                
                {/* Facility Manager */}
                {user?.roles.includes('QUAN_LY_CSVC') && (
                  <>
                    <Link to="/facilities/room-requests">
                      <Button variant="outline" className="h-24 w-full text-lg hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all">
                        Yêu cầu Mượn phòng
                      </Button>
                    </Link>
                    <Link to="/facilities/rooms">
                      <Button variant="outline" className="h-24 w-full text-lg hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all">
                        Quản lý Phòng
                      </Button>
                    </Link>
                    <Link to="/facilities/room-change-requests">
                      <Button variant="outline" className="h-24 w-full text-lg hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all">
                        Yêu cầu Đổi phòng
                      </Button>
                    </Link>
                  </>
                )}
                
                {/* Principal */}
                {user?.roles.includes('BGH_DUYET_SK_TRUONG') && (
                  <>
                    <Link to="/events/approve">
                      <Button variant="outline" className="h-24 w-full text-lg hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all">
                        Duyệt Sự kiện
                      </Button>
                    </Link>
                    <Link to="/events/cancel-requests">
                      <Button variant="outline" className="h-24 w-full text-lg hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all">
                        Yêu cầu Hủy sự kiện
                      </Button>
                    </Link>
                  </>
                )}
                
                {/* Department Head */}
                {user?.roles.includes('TRUONG_KHOA') && (
                  <>
                    <Link to="/events">
                      <Button variant="outline" className="h-24 w-full text-lg hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all">
                        Xem Sự kiện Khoa
                      </Button>
                    </Link>
                    <Link to="/units/classes">
                      <Button variant="outline" className="h-24 w-full text-lg hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all">
                        Thông tin Lớp học
                      </Button>
                    </Link>
                  </>
                )}
                
                {/* Club Leader */}
                {user?.roles.includes('TRUONG_CLB') && (
                  <Link to="/events">
                    <Button variant="outline" className="h-24 w-full text-lg hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all">
                      Xem Sự kiện CLB
                    </Button>
                  </Link>
                )}
                
                {/* Regular Students and Lecturers */}
                {(user?.userType === 'SINH_VIEN' && !user?.roles.includes('TRUONG_CLB')) && (
                  <Link to="/events">
                    <Button variant="outline" className="h-24 w-full text-lg hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all">
                      Xem Lịch Sự kiện
                    </Button>
                  </Link>
                )}
                
                {(user?.userType === 'GIANG_VIEN' && 
                  !user?.roles.includes('TRUONG_KHOA') && 
                  !user?.roles.includes('BGH_DUYET_SK_TRUONG')) && (
                  <Link to="/events">
                    <Button variant="outline" className="h-24 w-full text-lg hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all">
                      Xem Lịch Sự kiện
                    </Button>
                  </Link>
                )}

                {/* Profile link for all authenticated users */}
                <Link to="/profile">
                  <Button variant="outline" className="h-24 w-full text-lg hover:bg-secondary hover:text-secondary-foreground hover:border-secondary transition-all">
                    Hồ sơ Cá nhân
                  </Button>
                </Link>
              </motion.div>
            )}
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-muted py-6 border-t">
        <div className="container">
          <div className="flex flex-col items-center justify-center text-center">
            <PTITLogo size={40} />
            <p className="mt-4 text-sm text-muted-foreground">
              © {new Date().getFullYear()} Học viện Công nghệ Bưu chính Viễn thông TPHCM.<br/>
              Hệ thống quản lý sự kiện phát triển bởi Khoa CNTT.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
