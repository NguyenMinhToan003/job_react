/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from '@/components/ui/button';
import { Bell, Building2, CheckCircle, ChevronDown, ChevronRight, Clipboard, LayoutDashboard, MessageSquare, Settings, UserCog } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import clsx from 'clsx';
import { useState } from 'react';
export default function CandidateNavbarDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [openMenuIndex, setOpenMenuIndex] = useState<number | null>(null);

  const menuItems = [
    {
      label: 'Tổng quan',
      icon: <LayoutDashboard className='w-6 h-6' />,
      path: '/tong-quat-ho-so',
    },
    {
      label: 'Hồ sơ',
      icon: <Clipboard className='w-6 h-6' />,
      children: [
        { label: 'Tạo hồ sơ', path: '/tong-quat-ho-so/tao-ho-so' },
        { label: 'Danh sách hồ sơ', path: '/tong-quat-ho-so/ho-so' },
      ],
    },
    {
      label: 'Việc làm của tôi',
      icon: <CheckCircle className='w-6 h-6' />,
      path: '/tong-quat-ho-so/viec-lam',
    },
    {
      label: 'Công ty của tôi',
      icon: <Building2 className='w-6 h-6' />,
      children: [
        { label: 'Gợi ý từ nhà tuyển dụng', path: '/tong-quat-ho-so/goi-y-tu-nha-tuyen-dung' },
        { label: 'Công ty đã theo dõi', path: '/tong-quat-ho-so/follow-nha-tuyen-dung' },
      ],
    },
    {
      label: 'Tin nhắn',
      icon: <MessageSquare className='w-6 h-6' />,
      path: '/tong-quat-ho-so/tin-nhan',
    },
    {
      label: 'Thông báo',
      icon: <Bell className='w-6 h-6' />,
      path: '/tong-quat-ho-so/thong-bao',
    },
    {
      label: 'Cập nhật thông tin',
      icon: <UserCog className='w-6 h-6' />,
      path: '/tong-quat-ho-so/cap-nhat-thong-tin',
    },
    
  ];

  const isPathActive = (path?: string) =>
    path && location.pathname.includes(path);

  const handleClick = (item: any, index: number) => {
    if (item.children) {
      setOpenMenuIndex(openMenuIndex === index ? null : index);
    } else if (item.path) {
      navigate(item.path);
    }
  };
  return <>
    <Card className='min-w-[280px] max-w-[280px] h-fit rounded-sm px-2 py-4 shadow-xl sticky top-20'>
      <CardContent className='text-base space-y-2 p-0'>
        {menuItems.map((item, index) => {
          const isOpen = openMenuIndex === index;

          return (
            <div key={index} className='space-y-1'>
              <Button
                onClick={() => handleClick(item, index)}
                variant='ghost'
                className={clsx(
                  'w-full justify-between rounded-md px-3 h-12 transition-colors duration-300',
                  isPathActive(item.path) && 'bg-purple-50 text-purple-700',
                  'hover:bg-purple-50 hover:text-gray-600'
                )}
              >
                <div className='flex items-center gap-3'>
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                {item.children &&
                  (isOpen ? (
                    <ChevronDown className='w-4 h-4' />
                  ) : (
                    <ChevronRight className='w-4 h-4' />
                  ))}
              </Button>

              {item.children && (
                <div
                  className={clsx(
                    'pl-10 space-y-1 overflow-hidden transition-all duration-300',
                    isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                  )}
                >
                  {item.children.map((child, childIdx: number) => (
                    <Button
                      key={childIdx}
                      onClick={() => navigate(child.path)}
                      variant='ghost'
                      className={clsx(
                        'w-full justify-start text-sm h-10 transition-colors duration-300',
                        isPathActive(child.path)
                          ? 'text-purple-600 bg-purple-50'
                          : 'text-muted-foreground hover:text-purple-600 hover:bg-purple-50'
                      )}
                    >
                      {child.label}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  </>
}