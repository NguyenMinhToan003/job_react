/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useAlertDialog } from "@/providers/AlertDialogProvider";
import { APPLY_JOB_STATUS } from "@/types/type";
import { BadgeCheck, Briefcase, Download, Mail, MoreHorizontal, Phone, PieChart, Repeat, XCircle } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState } from "react";
import { ApplyJobResponse } from "@/types/applyJobType";
import { toast } from "sonner";
import { updateApplyJobStatus } from "@/apis/applyJobAPI";

export default function EmployerResumeMenu({ applyJob }: { applyJob: ApplyJobResponse}) {
  const { showAlert } = useAlertDialog();
  const [status, setStatus] = useState(applyJob.status);
  const handleUpdateStatus = async (resumeId: number, statuss: APPLY_JOB_STATUS) => {
    try {
      await updateApplyJobStatus(resumeId, statuss);
      toast.success('Cập nhật trạng thái thành công');
    }
    catch (error) {
      toast.error(error?.response?.data?.message || 'Cập nhật trạng thái thất bại');
    }
  }
  const handleChangeStatus = async (resumeId: number) => {
    let statusApplyJob = '';
    showAlert({
      title: 'Đổi trạng thái ứng viên',
      content: <>
        <RadioGroup
          value={status}
          onValueChange={(value) => {
            setStatus(value as APPLY_JOB_STATUS);
            statusApplyJob = value as APPLY_JOB_STATUS;
          }}
          className="flex flex-col gap-2 mt-2">
      <Label className="flex items-center gap-2 p-2 rounded-md cursor-pointer bg-gray-100 hover:bg-gray-200">
        <RadioGroupItem value={APPLY_JOB_STATUS.PROCESSING} className="sr-only" />
        <Repeat className="w-4 h-4 text-gray-600" />
        <span className="text-gray-800">Đang xử lý</span>
      </Label>

      <Label className="flex items-center gap-2 p-2 rounded-md cursor-pointer bg-yellow-100 hover:bg-yellow-200">
        <RadioGroupItem value={APPLY_JOB_STATUS.INTERVIEWING} className="sr-only" />
        <Phone className="w-4 h-4 text-yellow-600" />
        <span className="text-yellow-900">Đang phỏng vấn</span>
      </Label>

      <Label className="flex items-center gap-2 p-2 rounded-md cursor-pointer bg-blue-100 hover:bg-blue-200">
        <RadioGroupItem value={APPLY_JOB_STATUS.QUALIFIED} className="sr-only" />
        <BadgeCheck className="w-4 h-4 text-blue-600" />
        <span className="text-blue-900">Phù hợp</span>
      </Label>

      <Label className="flex items-center gap-2 p-2 rounded-md cursor-pointer bg-green-100 hover:bg-green-200">
        <RadioGroupItem value={APPLY_JOB_STATUS.HIRED} className="sr-only" />
        <Briefcase className="w-4 h-4 text-green-600" />
        <span className="text-green-900">Đã tuyển</span>
      </Label>

      <Label className="flex items-center gap-2 p-2 rounded-md cursor-pointer bg-red-100 hover:bg-red-200">
        <RadioGroupItem value={APPLY_JOB_STATUS.UNQUALIFIED} className="sr-only" />
        <XCircle className="w-4 h-4 text-red-600" />
        <span className="text-red-900">Không phù hợp</span>
          </Label>
          <Label className="text-sm text-gray-600 mt-2">
            Hiện tại: <span className="font-semibold text-gray-800">{applyJob.status}</span>
          </Label>
    </RadioGroup>
      </>,
      confirmText: 'Cập nhật',
      cancelText: 'Hủy',
      handleConfirm() {
        handleUpdateStatus(resumeId, statusApplyJob);
      },
    })
  };
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
        >
          <Download className='w-4 h-4 mr-2' />
          Tải xuống CV
        </Label>
        <Label
          className='w-full text-left px-3 py-2 text-sm text-gray-700 flex items-center cursor-pointer hover:bg-[#EDECFF] hover:text-[#2C95FF]'
        >
          <Mail className='w-4 h-4 mr-2' />
          Liên hệ ứng viên
        </Label>
        <Label
          className='w-full text-left px-3 py-2 text-sm text-gray-700 flex items-center cursor-pointer hover:bg-[#EDECFF] hover:text-[#2C95FF]'
          onClick={() => {
            handleChangeStatus(applyJob.id);
          }}
        >
          <Repeat className='w-4 h-4 mr-2' />
          Đổi trạng thái
        </Label>
        <Label
          className='w-full text-left px-3 py-2 text-sm text-gray-700 flex items-center cursor-pointer hover:bg-[#EDECFF] hover:text-[#2C95FF]'
        >
          <PieChart className='w-4 h-4 mr-2' />
          Đánh giá ứng viên
        </Label>
      </PopoverContent>
    </Popover>
  </>
}