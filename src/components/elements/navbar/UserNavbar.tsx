import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Bell, ChevronDown, Menu } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAccount } from '@/providers/UserProvider';

export default function UserNavbar() {
  const navigate = useNavigate();
  const { dataUser } = useAccount();

  const navItems = [
    {
      label: 'Nhà Tuyển Dụng',
      path: '/danh-cho-nha-tuyen-dung',
      icon: null,
    },
    {
      label: 'Tài khoản',
      path: '/tong-quat-ho-so',
      icon: (
        <Avatar className='p-[0.5px] bg-[#3d1419] border border-[#f5f3f4]'>
          <AvatarImage src={dataUser?.avatar} />
        </Avatar>
      ),
    },
    {
      label: null,
      path: null,
      icon: <Button variant={'ghost'} className='hover:text-gray-500 hover:bg-black' >
        <Bell className='h-5 w-5 text-[#f5f3f4]' />
      </Button>,
    },
  ];

  const handleClick = (path: string | null) => {
    if (path) navigate(path);
  };

  return (
    <div className='sticky top-0 z-50 w-full border-b border-[#502c30] shadow-sm bg-gradient-to-r from-[#121212] to-[#53151c]'>
      <div className='flex h-16 items-center justify-between px-4'>
        {/* Left section */}
        <div className='flex items-center gap-1'>
          <Avatar className='p-[0.5px] border border-[#f5f3f4]'>
            <AvatarImage src={dataUser?.avatar} />
          </Avatar>
          <Button className='text-[#959595]' variant='link'>
            <span>
              <NavLink to='/'>
                <span className='text-gray-400 font-semibold'>Tìm việc</span>
              </NavLink>
            </span>
            <ChevronDown className='h-5 w-5' />
          </Button>
          <Button className='text-gray-400' variant='link'>
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
        </div>
      </div>
    </div>
  );
}
