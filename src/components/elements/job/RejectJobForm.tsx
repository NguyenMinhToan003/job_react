/* eslint-disable @typescript-eslint/no-explicit-any */
import { createEmployerNotiAPI } from '@/apis/notiAccountAPI';
import { updateJobAdmin } from '@/apis/jobAPI';
import { Button } from '@/components/ui/button';
import { JOB_STATUS, NOTI_TYPE } from '@/types/type';
import { useState } from 'react';
import { toast } from 'sonner';
import { ScrollArea } from '@/components/ui/scroll-area';
import Editer from '../editer/editer';
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

export default function RejectJobForm({ id, employerId }: { id: string; employerId: number }) {
  const [isOpen, setIsOpen] = useState(false);
  const [reason, setReason] = useState('Thông báo từ chối đăng tuyển công việc');
  const handleRejectJob = async () => {
    try {
      await updateJobAdmin(+id, {
        isActive: JOB_STATUS.BLOCK,
      });
      toast.success('Đã từ chối công việc');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi từ chối công việc');
    }
  };
  const handleCloseDialog = () => {
    setIsOpen(false);
    setReason('Thông báo từ chối đăng tuyển công việc');
  }
  const handleSendNotification = async () => {
    try {
      if (employerId === -1) {
        toast.error('Không tìm thấy nhà tuyển dụng liên kết với công việc này');
        return;
      }
      createEmployerNotiAPI({
        content: reason,
        title: 'Thông báo từ chối đăng tuyển công việc',
        receiverAccountId: employerId,
        link: `/danh-cho-nha-tuyen-dung/thong-tin-tuyen-dung/${id}`,
        type: NOTI_TYPE.REJECTED,
      });
    }
    catch(error: any) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi gửi thông báo');
    }
  }
  const handleSubmit = async () => {
    await handleRejectJob();
    await handleSendNotification();
    handleCloseDialog();
  };
  return <>
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger className='w-full'>
        <Button className='text-red-500 hover:text-red-500 bg-red-50 hover:bg-red-50 min-w-full border border-red-100 rounded-none h-12 mt-2'>
          Từ chối đăng tuyển công việc
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle className='text-xl font-bold'>
          TỪ CHỐI ĐĂNG TUYỂN CÔNG VIỆC
        </AlertDialogTitle>
      </AlertDialogHeader>
        <AlertDialogDescription>
        <p className=''>
          Lý do từ chối đăng tuyển công việc sẽ được gửi đến nhà tuyển dụng.
        </p>
        <ScrollArea className='mt-4 h-[60vh] overflow-y-auto w-full'>
          <Editer
            text={reason}
            setText={setReason}
          />
        </ScrollArea>
        </AlertDialogDescription>
        <AlertDialogFooter className='mt-4'>
          <Button className='bg-[#451DA0] hover:bg-[#451DA0] text-white rounded-none w-40'
            onClick={handleSubmit}>
            Từ chối đăng tuyển
          </Button>
          <Button
            variant='outline'
            onClick={handleCloseDialog}>
            Hủy
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </>
}