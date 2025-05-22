
import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';

const Login: React.FC = () => {
  const { isAuthenticated, login, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">Đăng nhập</h1>
          <p className="mt-2 text-gray-600">Nhập thông tin để truy cập vào hệ thống</p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Email đăng nhập"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Mật khẩu</Label>
                <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                  Quên mật khẩu?
                </a>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="Mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </Button>

          <div className="mt-4 text-center text-sm">
            <p className="text-gray-600">
              Tài khoản demo:
            </p>
            <div className="mt-1 grid grid-cols-2 gap-2 text-xs">
              <div>admin@example.com</div>
              <div>event@example.com</div>
              <div>facility@example.com</div>
              <div>dean@example.com</div>
              <div>principal@example.com</div>
              <div>club@example.com</div>
              <div>student@example.com</div>
              <div>lecturer@example.com</div>
            </div>
            <p className="mt-1 text-gray-500">(Mật khẩu không kiểm tra)</p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
