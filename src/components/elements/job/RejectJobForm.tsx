/* eslint-disable @typescript-eslint/no-explicit-any */
import { createEmployerNotiAPI } from '@/apis/notiAccountAPI';
import { updateJobAdmin } from '@/apis/jobAPI';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { JOB_STATUS, NOTI_TYPE } from '@/types/type';
import { DialogTitle } from '@radix-ui/react-dialog';
import { useState } from 'react';
import { toast } from 'sonner';

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
      await createEmployerNotiAPI({
        content: reason,
        title: 'Thông báo từ chối đăng tuyển công việc',
        receiverAccountId: employerId,
        link: `/danh-cho-nha-tuyen-dung/thong-tin-tuyen-dung/${id}`,
        type: NOTI_TYPE.REJECTED,
      })
      window.location.reload();
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
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger>
      <Button className='cursor-pointer mt-2'>
        TỪ CHỐI CÔNG VIỆC
      </Button>
      </DialogTrigger>
      <DialogContent>
      <DialogHeader>
        <DialogTitle className='text-xl font-bold text-red-700'>
          TỪ CHỐI ĐĂNG TUYỂN CÔNG VIỆC
        </DialogTitle>
      </DialogHeader>
        <p className='text-sm text-gray-500 mt-2'>
          Lý do từ chối đăng tuyển công việc sẽ được gửi đến nhà tuyển dụng.
        </p>
        <Textarea
          placeholder='Thông báo từ chối đăng tuyển công việc'
          className='w-full h-90 rounded-sm border-2 border-red-400 focus:border-red-400 mt-4'
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={5}
        />
        <div className='mt-4'>
          <Button className='bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700'
            onClick={handleSubmit}>
            Từ chối
          </Button>
          <Button className='ml-2 bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400'>
            Hủy
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  </>
}