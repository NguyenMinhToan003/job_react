/* eslint-disable @typescript-eslint/no-explicit-any */
import { deleteJob } from "@/apis/jobAPI";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useAlertDialog } from "@/providers/AlertDialogProvider";
import { JobResponse } from "@/types/jobType";
import { Copy, Edit, Eye, MoreHorizontal, RotateCcw, ScanEye, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function JobMenu({ job }: { job: JobResponse}) {
  const { showAlert } = useAlertDialog();
  const navigate = useNavigate();
  const handleDeleteJob = async (jobId: number) => {
    try {
      await deleteJob(jobId);
      toast.success('Xoá công việc thành công');
      window.location.reload();
    }
    catch (error: any) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi xoá công việc');
    }
  }
  return <>
    <Popover>
      <PopoverTrigger>
        <Button className='text-[#451DA0] hover:text-[#451DA0] bg-[#EDECFF] hover:bg-[#EDECFF] rounded-sm w-8 h-8 ml-2 p-0 hover:border-[#451DA0] border'>
          <MoreHorizontal />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-48 border border-[#2C95FF] shadow-lg rounded-md p-2'>
        <Label
          className='w-full text-left px-3 py-2 text-sm text-gray-700 flex items-center cursor-pointer hover:bg-[#EDECFF] hover:text-[#2C95FF]'
          onClick={() => navigate(`/danh-cho-nha-tuyen-dung/nhan-ban/${job.id}`)}
        >
          <Copy className='w-4 h-4 mr-2' />
          Sao chép tin
        </Label>
        <Label
          className='w-full text-left px-3 py-2 text-sm text-gray-700 flex items-center cursor-pointer hover:bg-[#EDECFF] hover:text-[#2C95FF]'
          onClick={() => navigate(`/danh-cho-nha-tuyen-dung/cap-nhat-tuyen-dung/${job.id}`)}
        >
          <Edit className='w-4 h-4 mr-2' />
          Chỉnh sửa tin
        </Label>
        <Label
          className='w-full text-left px-3 py-2 text-sm text-gray-700 flex items-center cursor-pointer hover:bg-[#EDECFF] hover:text-[#2C95FF]'
          onClick={() => navigate(`/cong-viec/${job.id}`)}
        >
          <Eye className='w-4 h-4 mr-2' />
          Xem trên website
        </Label>
        <Label
          className='w-full text-left px-3 py-2 text-sm text-gray-700 flex items-center cursor-pointer hover:bg-[#EDECFF] hover:text-[#2C95FF]'
          onClick={() => navigate(`/danh-cho-nha-tuyen-dung/thong-tin-tuyen-dung/${job.id}`)}
        >
          <ScanEye className='w-4 h-4 mr-2' />
          Xem chi tiết tin
        </Label>
        <Label
          className='w-full text-left px-3 py-2 text-sm text-gray-700 flex items-center cursor-pointer hover:bg-[#EDECFF] hover:text-[#2C95FF]'
          onClick={() => navigate(`/danh-cho-nha-tuyen-dung/danh-sach-ung-tuyen/${job.id}`)}
        >
          <RotateCcw className='w-4 h-4 mr-2' />
          Gia hạn
        </Label>
        <hr className='my-1' />
        <Label
          className='w-full text-left px-3 py-2 text-sm text-red-600 flex items-center cursor-pointer hover:bg-red-50 hover:text-red-600'
          onClick={() => showAlert({
            title: <div className='space-y-2'>
              <div>Xóa tin tuyển dụng này?</div>
              <div className='text-xs text-gray-500'>Bạn có chắc chắn muốn xoá công việc này không?</div>
              <hr className='mt-2' />
            </div>,
            content: <div className='p-3 space-y-3'>
              <div className='font-semibold text-sm text-black'>{job.name}</div>
              <span className='font-semibold text-[12px] text-gray-400'>Trạng thái: </span>
              <span className='font-semibold text-sm text-gray-500'>{job.isActive}</span>
            </div>,
            confirmText: 'Xoá công việc',
            cancelText: 'Hủy',
            handleConfirm() {
              handleDeleteJob(job.id);
            },
          })}
        >
          <Trash2 className='w-4 h-4 mr-2' />
          Xoá công việc
        </Label>
      </PopoverContent>
    </Popover>
  </>
}