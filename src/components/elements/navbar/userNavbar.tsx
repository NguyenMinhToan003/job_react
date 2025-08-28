import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Bell, ChevronDown, LogOut, MapIcon, Menu } from 'lucide-react';
import { useAccount } from '@/providers/userProvider';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getMeNotificationAPI } from '@/apis/notiAccountAPI';
import { useAlertDialog } from '@/providers/alertDialogProvider';

export default function UserNavbar() {
  const navigate = useNavigate();
  const [countNoti, setCountNoti] = useState(0);
  const { dataUser } = useAccount();
  const { showAlert } = useAlertDialog();

  const navItems = [
    {
      label: 'Tìm theo vị trí',
      path: '/tim-theo-vi-tri',
      icon: <MapIcon className='h-5 w-5 text-[#f5f3f4]' />,
    },
    {
      label: 'Nhà Tuyển Dụng',
      path: '/danh-cho-nha-tuyen-dung',
      icon: null,
    },
    {
      label: 'Tài khoản',
      path: '/tong-quat-ho-so',
      icon: (
        <Avatar className='border border-[#f5f3f4]'>
          <AvatarImage src={dataUser?.avatar || dataUser?.logo} className='object-fill' />
        </Avatar>
      ),
    },
    {
      label: null,
      path: null,
      icon: <Button variant={'ghost'} className='hover:text-gray-500 relative bg-[#2c95ff]' >
        <Bell className='h-5 w-5 text-[#f5f3f4] ' />
        {countNoti > 0 && (
          <span className='absolute top-2 right-2 inline-flex h-2.5 w-2.5 translate-x-1/2 -translate-y-1/2 rounded-full bg-red-500' />
        )}
      </Button>,
    },
  ];

  const handleClick = (path: string | null) => {
    if (path) navigate(path);
  };
  const handleLogout = () => {
    sessionStorage.removeItem('cart');
    navigate('/auth/login');
  }
  useEffect(() => {
    const fetchNotificationCount = async () => {
      try {
        // Replace with actual API call to get notification count
        const response = await getMeNotificationAPI({});
        setCountNoti(response.unreadCount);
      } catch (error) {
        console.error('Error fetching notification count:', error);
      }
    };

    fetchNotificationCount();
  }
  , []);  

  return (
    <div className='sticky top-0 z-50 w-full border-b border-[#6136c6] shadow-sm bg-[#451da1]'>
      <div className='flex h-16 items-center justify-between px-4'>
        {/* Left section */}
        <div className='flex items-center gap-1'>

          <Button className='text-white' variant='link'
            onClick={() => navigate('/')}>
            <span>
              Tìm việc làm 
            </span>
            <ChevronDown className='h-5 w-5' />
          </Button>
          <Button className='text-white' variant='link'
            onClick={() => navigate('/nha-tuyen-dung-tiem-nang')}
          >
            <span>Tìm Công ty</span>
            <ChevronDown className='h-5 w-5' />
          </Button>
        </div>

        {/* Mobile menu */}
        <div className='md:hidden'>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant='outline' size='icon'>
                <Menu className='h-5 w-5' />
              </Button>
            </SheetTrigger>
            <SheetContent side='left' className='w-64'>
              <div className='space-y-4 mt-6'>
                {navItems.map((item, index) => (
                  <Button
                    key={index}
                    variant='ghost'
                    className='w-full justify-start text-base'
                    onClick={() => handleClick(item.path)}
                  >
                    <span className='mr-2'>{item.icon}</span>
                    {item.label}
                  </Button>
                ))}
                
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop menu */}
        <div className='hidden md:flex items-center gap-1'>
          {navItems.map((item, index) => (
            <Button
              key={index}
              variant='link'
              onClick={() => handleClick(item.path)}
              className='flex items-center text-[#f5f3f4]'
            >
              {item.icon}
              {item.label && <span className='ml-1'>{item.label}</span>}
            </Button>
          ))}
            <Button
            variant={'ghost'} className='
            hover:bg-[#2c95ff] bg-neutral-500
            '
            onClick={() => showAlert({
              title: 'Đăng xuất',
              content: 'Bạn có chắc chắn muốn đăng xuất?',
              confirmText: 'Đăng xuất',
              cancelText: 'Hủy',
              handleConfirm: handleLogout,
            })}
            >
              <LogOut className='h-5 w-5 text-[#f5f3f4]' />
            </Button>
        </div>
      </div>
    </div>
  );
}
