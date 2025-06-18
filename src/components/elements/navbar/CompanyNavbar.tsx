import {
  LayoutDashboard,
  MapPin,
  Settings,
  ChevronDown,
  ChevronRight,
  Package,
  DollarSign,
  Search,
  MessageCircle,
  ClipboardList,
  Bell,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { countUnreadAPI } from '@/apis/employerNotiAPI';
import clsx from 'clsx';

export default function CompanyNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [countNoti, setCountNoti] = useState(0);
  const [openMenuIndex, setOpenMenuIndex] = useState<number | null>(null);

  const fetchNotificationCount = async () => {
    try {
      const response = await countUnreadAPI();
      setCountNoti(response.length);
    } catch (error) {
      console.error('Error fetching notification count:', error);
    }
  };

  useEffect(() => {
    fetchNotificationCount();
  }, []);

  const userMenuItems = [
    { label: 'Tổng quan', icon: <LayoutDashboard className='w-6 h-6' />, path: '' },
    {
      label: 'Quản lý tuyển dụng',
      icon: <ClipboardList className='w-6 h-6' />, // thay vì UserCog
      children: [
        { label: 'Danh sách', path: 'tuyen-dung' },
        { label: 'Hết hạn', path: 'tuyen-dung/het-han' },
        { label: 'Hàng đợi', path: 'tuyen-dung/hang-doi' },
        { label: 'Tạo mới', path: 'dang-tin-tuyen-dung' },
      ],
    },
    { label: 'Quản lý địa điểm', icon: <MapPin className='w-6 h-6' />, path: 'dia-diem' },
    { label: 'Dịch vụ', icon: <Package className='w-6 h-6' />, path: 'dich-vu' },
    { label: 'Bảng giá', icon: <DollarSign className='w-6 h-6' />, path: 'bang-gia' },
    { label: 'Tìm kiếm ứng viên', icon: <Search className='w-6 h-6' />, path: 'tim-kiem-ung-vien' },
    { label: 'Blog', icon: <MessageCircle className='w-6 h-6' />, path: 'blog' },
    { label: 'Quản lý thông tin', icon: <MessageCircle className='w-6 h-6' />, path: 'tin-nhan' },
    {
      label: (
        <span className='flex items-center gap-1'>
          Thông báo
          {countNoti > 0 && (
            <span className='bg-red-500 text-white text-xs font-semibold rounded-full px-2 py-1'>
              {countNoti}
            </span>
          )}
        </span>
      ),
      icon: <Bell className='w-6 h-6' />, // thay vì Mail
      path: 'thong-bao',
    },
    { label: 'Cài đặt', icon: <Settings className='w-6 h-6' />, path: 'cai-dat' },
  ];
  

  const isPathActive = (path?: string) =>
    path && location.pathname.includes(path);

  return (
    <Card className='min-w-[300px] max-w-[300px] h-fit p-0 rounded-sm px-2 py-4 shadow-xl sticky top-6'>
      <CardHeader>
        <p className='text-sm text-muted-foreground'>👋 Xin chào</p>
        <CardTitle className='text-2xl font-semibold'>Toan</CardTitle>
      </CardHeader>

      <CardContent className='text-base space-y-2 p-0'>
        {userMenuItems.map((item, index) => {
          const isOpen = openMenuIndex === index;

          const handleClick = () => {
            if (item.children) {
              setOpenMenuIndex(isOpen ? null : index);
            } else if (item.path) {
              navigate(item.path);
            }
          };

          return (
            <div key={index} className='space-y-1'>
              <Button
                onClick={handleClick}
                variant='ghost'
                className={clsx(
                  'w-full justify-between rounded-md px-3 h-12 transition-colors duration-300',
                  isPathActive(typeof item.path === 'string' ? item.path : '') && 'bg-red-50 text-red-600',
                  'hover:bg-red-50 hover:text-gray-600'
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
                  {item.children.map((child, childIdx) => (
                    <Button
                      key={childIdx}
                      onClick={() => navigate(child.path)}
                      variant='ghost'
                      className={clsx(
                        'w-full justify-start text-sm h-10 transition-colors duration-300',
                        isPathActive(child.path)
                          ? 'text-red-600 bg-red-50'
                          : 'text-muted-foreground hover:text-red-600 hover:bg-red-50'
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
  );
}
