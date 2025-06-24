/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, LogIn, ArrowRight } from 'lucide-react';
import { login } from '@/apis/authAPI';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { ROLE_LIST } from '@/types/type';
import { Label } from '@/components/ui/label';
import { useAccount } from '@/providers/UserProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function LoginForm() {
  const {updateDataUser} = useAccount();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const handleInputChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await login({
        email: formData.email,
        password: formData.password
      })
      const role = response.role;
      localStorage.setItem('role', role);
      updateDataUser();
      if (role === ROLE_LIST.ADMIN) {
        navigate('/admin');
      }
      else if (role === ROLE_LIST.EMPLOYER) {
        navigate('/danh-cho-nha-tuyen-dung');
      } else if (role === ROLE_LIST.CANDIDATE) {
        navigate('/');
      } else {
        toast.error('Không xác định được vai trò người dùng.');
        return;
      }

    } catch (e: any) {
      toast.error(e.response?.data?.message || 'Đăng nhập thất bại. Vui lòng thử lại sau.');
      console.error('Login error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4'>
      <div className='w-full max-w-md'>

        <div className='bg-white rounded-2xl shadow-xl p-8 border border-gray-100'>

          <div className='space-y-4'>
            <div>
              <Label className='block text-sm font-medium text-gray-700 mb-2'>
                Email
              </Label>
              <div className='relative'>
                <Mail className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400' />
                <Input
                  type='email'
                  name='email'
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-3 py-3`}
                  placeholder='Nhập email của bạn'
                />
              </div>
            </div>
            <div>
              <Label className='block text-sm font-medium text-gray-700 mb-2'>
                Mật khẩu
              </Label>
              <div className='relative'>
                <Lock className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400' />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  name='password'
                  className={`w-full pl-10 pr-3 py-3`}
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder='Nhập mật khẩu'
                />
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors'
                >
                  {showPassword ? <EyeOff className='w-5 h-5' /> : <Eye className='w-5 h-5' />}
                </button>
              </div>
             
            </div>
            <Button
              type='button'
              onClick={handleSubmit}
              disabled={isLoading}
              className='w-full'
            >
              {isLoading ? (
                <>
                  <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2'></div>
                  Đang đăng nhập...
                </>
              ) : (
                <>
                  Đăng nhập
                  <ArrowRight className='w-5 h-5 ml-2' />
                </>
              )}
            </Button>

          </div>
          <div className='mt-6'>
            <Button
              variant='link'
              onClick={() => navigate('/nha-tuyen-dung/dang-ky')}
            >
              Đăng ký nhà tuyển dụng
            </Button>
            <Button
              variant='link'
              onClick={() => navigate('/dang-ky')}
            >
              Đăng ký ứng viên
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
}