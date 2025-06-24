/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { getMeNotificationAPI, markAllAsReadAPI, markAsReadAPI } from '@/apis/notiAccountAPI';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Bell, LinkIcon, CheckCircle2, Clock, CircleAlert } from 'lucide-react';
import { NOTI_TYPE } from '@/types/type';
import { convertDateToString } from '@/utils/dateTime';
import { NotiAccount } from '@/types/eployerNotiType';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';


function NotificationItem({ noti }: { noti: NotiAccount }) {
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
          <div className='space-y-2'>
            <ul className=' text-gray-800 font-medium'>
              <div 
                dangerouslySetInnerHTML={{ __html: noti.content }}
              />
            </ul>
            <Label className='text-xs ml-3 text-gray-500 flex items-center gap-2'>
              <Clock className='w-4 h-4'/>
              <span >
                {convertDateToString(noti.time)}
              </span>
            </Label>
          </div>
        </div>
        <div className='flex items-center gap-2'>
          <Badge variant='outline' className={`text-xs font-semibold `}>
            Thông báo
          </Badge>
          {noti.link && (
            <Button
              variant='ghost'
              className='text-gray-500 hover:text-gray-700'
              onClick={() => {
                markAsReadAPI(noti.id)
                window.open(noti.link, '_blank');
              }}
            >
              <LinkIcon size={16}  />
            </Button>
          )}
          <Button
            variant='ghost'
            className={`text-sm ${isRead ? 'text-gray-400' : 'text-green-500 hover:text-green-700'} transition-colors`}
          >
            <CheckCircle2 size={16} />
          </Button>
        </div>
      </div>
    </Card>
  );
}


export default function CandidateNoti() {
  const [notifications, setNotifications] = useState<NotiAccount[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const data = await getMeNotificationAPI();
      setNotifications(Array.isArray(data) ? data : [data]);
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
    <Card className='w-full mt-2 mr-4 h-fit shadow-none border border-gray-200 rounded-xl'>
      <CardHeader className='flex items-center gap-3'>
        <Bell className='text-red-500 h-6 w-6' />
        <CardTitle className=' flex items-center justify-between w-full'>
          <Label>Thông báo</Label>
          <Button
            variant='outline'
            className='text-sm text-gray-700 hover:bg-gray-100'
            onClick={async () => {
              await markAllAsReadAPI();
              fetchNotifications();
            }}
            disabled={loading}
          >
            <CircleAlert className='h-4 w-4 mr-2' />
            Đánh dấu tất cả là đã đọc
          </Button>
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