
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import { PTITLogo } from '@/assets/logo';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

const VerifyOTP: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const email = queryParams.get('email') || '';
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (!email) {
      navigate('/forgot-password');
    }
    
    // Countdown timer for resend OTP
    let timer: ReturnType<typeof setInterval> | null = null;
    if (countdown > 0 && !canResend) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0 && !canResend) {
      setCanResend(true);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [email, countdown, canResend, navigate]);

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    if (otp.length !== 6) {
      toast.error('Vui lòng nhập đủ 6 chữ số OTP');
      setLoading(false);
      return;
    }
    
    try {
      // Trong thực tế, đây là nơi gọi API để xác nhận OTP
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Xác thực OTP thành công');
      // Chuyển sang trang đặt lại mật khẩu
      navigate('/reset-password?email=' + encodeURIComponent(email) + '&token=' + otp);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Mã OTP không đúng hoặc đã hết hạn');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!canResend) return;
    
    setLoading(true);
    try {
      // Trong thực tế, đây là nơi gọi API để gửi lại OTP
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Mã OTP mới đã được gửi vào email của bạn');
      setCountdown(60);
      setCanResend(false);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Không thể gửi lại mã OTP. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-background to-muted">
      <div className="absolute top-4 right-4">
        <ThemeSwitcher />
      </div>
      
      <div className="w-full max-w-md mx-auto p-8 flex flex-col justify-center">
        <motion.div 
          className="space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center">
            <PTITLogo size={60} className="mx-auto" />
            <h1 className="text-2xl font-bold mt-4">Xác nhận OTP</h1>
            <p className="mt-2 text-muted-foreground">
              Nhập mã OTP đã được gửi đến email {email ? <span className="font-medium">{email}</span> : ''}
            </p>
          </div>
          
          <div className="bg-card border rounded-lg shadow-lg p-8">
            <form className="space-y-6" onSubmit={handleVerifyOTP}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="otp" className="text-center block">Mã xác nhận</Label>
                  <div className="flex justify-center">
                    <InputOTP 
                      maxLength={6} 
                      value={otp} 
                      onChange={setOtp}
                      render={({ slots }) => (
                        <InputOTPGroup>
                          {slots.map((slot, index) => (
                            <InputOTPSlot key={index} {...slot} index={index} />
                          ))}
                        </InputOTPGroup>
                      )}
                    />
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={loading || otp.length !== 6}
              >
                {loading ? 'Đang xác thực...' : 'Xác nhận'}
              </Button>

              <div className="text-center text-sm">
                {canResend ? (
                  <Button 
                    variant="link" 
                    onClick={handleResendOTP} 
                    className="p-0 h-auto text-primary"
                    disabled={loading}
                  >
                    Gửi lại mã OTP
                  </Button>
                ) : (
                  <p className="text-muted-foreground">
                    Gửi lại mã OTP sau {countdown} giây
                  </p>
                )}
              </div>

              <Link to="/forgot-password" className="flex items-center justify-center mt-4 text-sm font-medium text-primary">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Quay lại
              </Link>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default VerifyOTP;
