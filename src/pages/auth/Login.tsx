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

export default function LoginForm() {
  const {updateDataUser} = useAccount();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
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
        <div className='text-center mb-8'>
          <div className='inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl mb-4 shadow-lg'>
            <LogIn className='w-8 h-8 text-white' />
          </div>
          <h1 className='text-3xl font-bold text-gray-900 mb-2'>Đăng nhập</h1>
        </div>
        <div className='bg-white rounded-2xl shadow-xl p-8 border border-gray-100'>

          <div className='space-y-4'>
            <div>
              <Label className='block text-sm font-medium text-gray-700 mb-2'>
                Email
              </Label>
              <div className='relative'>
                <Mail className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400' />
                <input
                  type='email'
                  name='email'
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors `}
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
                <input
                  type={showPassword ? 'text' : 'password'}
                  name='password'
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors `}
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
            <button
              type='button'
              onClick={handleSubmit}
              disabled={isLoading}
              className='w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-medium flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl'
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
            </button>

          </div>
          <div className='mt-6'>
            <Button
              variant='link'
              className='text-sm text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
              onClick={() => navigate('/nha-tuyen-dung/dang-ky')}
            >
              Đăng ký nhà tuyển dụng
            </Button>
            <Button
              variant='link'
              className='text-sm text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ml-4'
              onClick={() => navigate('/dang-ky')}
            >
              Đăng ký ứng viên
            </Button>
          </div>
        </div>
        <div className='mt-6'>
          <div className='relative'>
            <div className='absolute inset-0 flex items-center'>
              <div className='w-full border-t border-gray-300' />
            </div>
            <div className='relative flex justify-center text-sm'>
              <span className='px-2 bg-gray-50 text-gray-500'>Hoặc đăng nhập bằng</span>
            </div>
          </div>

          <div className='flex flex-col space-y-4 mt-4'>
            <button
              type='button'
              className='w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors'
            >
              <svg className='w-5 h-5' viewBox='0 0 24 24'>
                <path fill='currentColor' d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'/>
                <path fill='currentColor' d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'/>
                <path fill='currentColor' d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'/>
                <path fill='currentColor' d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'/>
              </svg>
              <span className='ml-2'>Google</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}