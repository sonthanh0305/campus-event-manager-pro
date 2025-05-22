
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import { PTITLogo } from '@/assets/logo';
import { ArrowLeft, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    if (!email) {
      toast.error('Vui lòng nhập email');
      setLoading(false);
      return;
    }
    
    try {
      // Trong thực tế, đây là nơi gọi API để gửi email reset mật khẩu
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Mã OTP đã được gửi vào email của bạn');
      // Chuyển sang trang xác nhận OTP với email đã nhập
      navigate('/verify-otp?email=' + encodeURIComponent(email));
    } catch (error) {
      console.error('Error:', error);
      toast.error('Không thể gửi mã xác nhận. Vui lòng thử lại sau.');
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
            <h1 className="text-2xl font-bold mt-4">Quên mật khẩu</h1>
            <p className="mt-2 text-muted-foreground">
              Nhập email của bạn để nhận mã xác nhận OTP
            </p>
          </div>
          
          <div className="bg-card border rounded-lg shadow-lg p-8">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Nhập email đã đăng ký"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? 'Đang gửi...' : 'Gửi mã xác nhận'}
              </Button>

              <Link to="/login" className="flex items-center justify-center mt-4 text-sm font-medium text-primary">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Quay lại đăng nhập
              </Link>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ForgotPassword;
