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
import { countUnreadAPI } from '@/apis/notiAccountAPI';
import clsx from 'clsx';
import { useAccount } from '@/providers/UserProvider';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function CompanyNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { dataUser } = useAccount();
  const [countNoti, setCountNoti] = useState(0);
  const [openMenuIndex, setOpenMenuIndex] = useState<number | null>(null);

  const fetchNotificationCount = async () => {
    try {
      const response = await countUnreadAPI();
      setCountNoti(response);
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
      icon: <ClipboardList className='w-6 h-6' />,
      children: [
        { label: 'Danh sách', path: 'tuyen-dung' },
        { label: 'Hết hạn', path: 'tuyen-dung/het-han' },
        { label: 'Tạo mới', path: 'dang-tin-tuyen-dung' },
      ],
    },
    { label: 'Quản lý địa điểm', icon: <MapPin className='w-6 h-6' />, path: 'dia-diem' },
    { label: 'Quản lý thẻ', icon: <ClipboardList className='w-6 h-6' />, path: 'quan-ly-the' },
    { label: 'Dịch vụ', icon: <Package className='w-6 h-6' />, path: 'dich-vu' },
    { label: 'Bảng giá', icon: <DollarSign className='w-6 h-6' />, path: 'bang-gia' },
    { label: 'Tìm kiếm ứng viên', icon: <Search className='w-6 h-6' />, path: 'tim-kiem-ung-vien' },
    { label: 'Blog', icon: <MessageCircle className='w-6 h-6' />, path: 'blog' },
    { label: 'Quản lý thông tin', icon: <MessageCircle className='w-6 h-6' />, path: 'quan-ly-thong-tin' },
    {
      label: (
        <span className='flex items-center gap-2'>
          <Label className='text-sm'>Thông báo</Label>
          {countNoti > 0 && (
            <Badge className='bg-purple-500 text-white rounded-full px-2  text-xs w-fit'>
              {countNoti}
            </Badge>
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
    <Card className='min-w-[300px] max-w-[300px] h-fit p-0 rounded-sm px-2 py-4 shadow-xl sticky top-18'>
      <CardHeader>
        <CardTitle className='text-2xl font-semibold'>
          <div className='flex items-center gap-2'>
            <Avatar
              className='border border-gray-300 w-20 h-20 rounded-sm'
            >
              <AvatarImage
                src={dataUser?.logo}
                alt='Company Logo'
              />
              <AvatarFallback>{dataUser?.name[0]}</AvatarFallback>
            </Avatar>
            {dataUser?.name || 'Công ty'}
          </div>
        </CardTitle>
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
                  isPathActive(typeof item.path === 'string' ? item.path : '') && 'bg-purple-100 text-purple-600',
                  'hover:bg-purple-50 hover:text-purple-500'
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
                          ? 'text-purple-600 bg-purple-50'
                          : 'text-muted-foreground '
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
