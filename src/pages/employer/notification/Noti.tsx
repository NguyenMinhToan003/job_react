/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { getMeNotificationAPI, markAllAsReadAPI } from '@/apis/employerNotiAPI';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { Bell, LinkIcon, CheckCircle2, DotSquareIcon } from 'lucide-react';
import { NOTI_TYPE } from '@/types/type';
import { EmployerNoti } from '@/types/eployerNotiType';
import { convertDateToString } from '@/utils/dateTime';

const NOTI_CONFIG = {
  [NOTI_TYPE.ACCEPTED]: { label: 'Đã chấp nhận', color: 'bg-green-100 text-green-600 border-green-200' },
  [NOTI_TYPE.REJECTED]: { label: 'Đã từ chối', color: 'bg-red-100 text-red-600 border-red-200' },
  [NOTI_TYPE.DEFAULT]: { label: 'Thông báo', color: 'bg-blue-100 text-blue-600 border-blue-200' },
};
function NotificationItem({ noti }: { noti: EmployerNoti }) {
  const { label, color } = NOTI_CONFIG[noti.type || NOTI_TYPE.DEFAULT];
  const isRead = noti.isRead === 1;
  return (
    <Card
      className={`w-full p-4 border ${isRead ? 'bg-white' : 'bg-gray-50'} hover:shadow-md transition-shadow duration-200 cursor-pointer`}
    >
      <div className='flex justify-between items-start gap-4'>
        <div className='flex items-start gap-3'>
          {!isRead && (
            <div className='min-w-2 h-2 rounded-full bg-red-500 mt-2' title='Chưa đọc' />
          )}
          <div className='space-y-1'>
            <ul className='text-gray-800 font-medium'>
              {
                noti.content.split('\n').map((line, index) => (
                  line.trim() && (
                    <li key={index} className='flex items-center gap-1 mb-1'>
                      <DotSquareIcon className='inline-block text-red-500 mr-1' size={16} />
                      <span key={index} className='block'>
                      {line}
                    </span>
                  </li>
                  )
                ))
              }
            </ul>
            <p className='text-sm text-gray-500'>
              {convertDateToString(noti.time)}
            </p>
          </div>
        </div>
        <div className='flex items-center gap-2'>
          <Badge variant='outline' className={`text-xs font-semibold ${color}`}>
            {label}
          </Badge>
          {noti.link && (
            <a
              href={noti.link}
              target='_blank'
              rel='noopener noreferrer'
              className='text-blue-500 hover:text-blue-700 flex items-center gap-1 transition-colors'
              onClick={(e) => e.stopPropagation()}
            >
              <LinkIcon size={16} />
            </a>
          )}
          <button
            className={`text-sm ${isRead ? 'text-gray-400' : 'text-green-500 hover:text-green-700'} transition-colors`}
          >
            <CheckCircle2 size={16} />
          </button>
        </div>
      </div>
    </Card>
  );
}


export default function EmployerNotification() {
  const [notifications, setNotifications] = useState<EmployerNoti[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const data = await getMeNotificationAPI();
      setNotifications(Array.isArray(data) ? data : [data]);
      await markAllAsReadAPI();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Lỗi khi tải thông báo');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <Card className='shadow-lg w-full'>
      <CardHeader className='flex items-center gap-3'>
        <Bell className='text-red-500 h-6 w-6' />
        <CardTitle className='text-2xl font-bold text-gray-800'>
          THÔNG BÁO
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        {loading ? (
          <div className='space-y-3'>
            {[...Array(3)].map((_, index) => (
              <Skeleton key={index} className='h-20 w-full rounded-lg' />
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <div className='text-center py-6'>
            <p className='text-gray-500 text-lg'>Không có thông báo nào.</p>
          </div>
        ) : (
          <div className='space-y-3'>
            {notifications.map((noti) => (
              <NotificationItem key={noti.id} noti={noti}  />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}