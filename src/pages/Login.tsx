
import React, { useState } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import { PTITLogo } from '@/assets/logo';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';

const Login: React.FC = () => {
  const { isAuthenticated, login, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { theme } = useTheme();

  // If already logged in, redirect to home page
  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Vui lòng nhập email và mật khẩu');
      return;
    }

    try {
      await login({ email, password });
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
      // Toast error is already shown in the login function
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Left side - background image */}
      <div className="hidden lg:block lg:w-1/2 relative bg-cover bg-center" 
           style={{ backgroundImage: "url('https://images.unsplash.com/photo-1606761568499-6d2451b23c66?q=80&w=1974&auto=format&fit=crop')" }}>
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-secondary/80 mix-blend-multiply" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-md"
          >
            <PTITLogo size={80} className="mx-auto mb-6" />
            <h1 className="text-3xl font-bold mb-4">Học viện Công nghệ Bưu chính Viễn thông</h1>
            <p className="text-lg opacity-90">
              Hệ thống quản lý sự kiện và cơ sở vật chất được phát triển bởi Khoa Công nghệ Thông tin
            </p>
          </motion.div>
        </div>
      </div>
      
      {/* Right side - login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="absolute top-4 right-4">
          <ThemeSwitcher />
        </div>
        <motion.div 
          className="w-full max-w-md space-y-8"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center lg:hidden">
            <PTITLogo size={60} className="mx-auto" />
            <h1 className="text-2xl font-bold mt-4">
              Học viện Công nghệ Bưu chính Viễn thông
            </h1>
          </div>
          
          <div className="bg-card border rounded-lg shadow-lg p-8">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold tracking-tight">Đăng nhập</h1>
              <p className="mt-2 text-muted-foreground">
                Nhập thông tin để truy cập vào hệ thống
              </p>
            </div>
            
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Email đăng nhập"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Mật khẩu</Label>
                    <Link to="/forgot-password" className="text-sm font-medium text-primary">
                      Quên mật khẩu?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Mật khẩu"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
              </Button>
            </form>
          </div>

          <div className="bg-card border rounded-lg p-4 shadow-md">
            <p className="text-center text-sm font-medium mb-2 text-muted-foreground">
              Tài khoản demo:
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="bg-muted rounded px-2 py-1">admin@example.com</div>
              <div className="bg-muted rounded px-2 py-1">event@example.com</div>
              <div className="bg-muted rounded px-2 py-1">facility@example.com</div>
              <div className="bg-muted rounded px-2 py-1">dean@example.com</div>
              <div className="bg-muted rounded px-2 py-1">principal@example.com</div>
              <div className="bg-muted rounded px-2 py-1">club@example.com</div>
              <div className="bg-muted rounded px-2 py-1">student@example.com</div>
              <div className="bg-muted rounded px-2 py-1">lecturer@example.com</div>
            </div>
            <p className="mt-2 text-center text-xs text-muted-foreground">(Mật khẩu bất kỳ)</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
