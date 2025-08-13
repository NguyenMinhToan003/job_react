/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Download, Mail, MoreHorizontal,  PieChart, Repeat} from "lucide-react";

import { ApplyJobResponse } from "@/types/applyJobType";

import { useState } from "react";
import { FormChangeStatusApplyJob } from "./FormChangeStatusApplyJob";
import { useNavigate } from "react-router-dom";




export default function ApplyJobMenu({ applyJob, setIsChange }: {
  applyJob: ApplyJobResponse,
  setIsChange?: (isChange: boolean) => void;
}) {
  const [openStatus, setOpenStatus] = useState(false);
  const [isSendEmail, setIsSendEmail] = useState(false);
  const navigate = useNavigate();
  const hanldeDownloadCV = () => {
    window.open(applyJob.resumeVersion?.urlPdf, '_blank');
  }
  return <>
    <FormChangeStatusApplyJob setOpen={setOpenStatus} open={openStatus} applyJob={applyJob}
      isOpenSendEmail={isSendEmail} setIsChange={setIsChange}
    />
    <Popover>
      <PopoverTrigger>
        <Button className='text-[#451DA0] hover:text-[#451DA0] bg-[#EDECFF] hover:bg-[#EDECFF] rounded-sm w-8 h-8 ml-2 p-0 hover:border-[#451DA0] border'>
          <MoreHorizontal />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-48 border border-[#2C95FF] shadow-lg rounded-md p-2'>
        <Label
          className='w-full text-left px-3 py-2 text-sm text-gray-700 flex items-center cursor-pointer hover:bg-[#EDECFF] hover:text-[#2C95FF]'
          onClick={hanldeDownloadCV}
        >
          <Download className='w-4 h-4 mr-2' />
          Tải xuống CV
        </Label>
        <Label
          className='w-full text-left px-3 py-2 text-sm text-gray-700 flex items-center cursor-pointer hover:bg-[#EDECFF] hover:text-[#2C95FF]'
          onClick={() => {
            setIsSendEmail(true);
            setOpenStatus(true);
          }}
        >
          <Mail className='w-4 h-4 mr-2' />
          Liên hệ ứng viên
        </Label>
        <Label
          className='w-full text-left px-3 py-2 text-sm text-gray-700 flex items-center cursor-pointer hover:bg-[#EDECFF] hover:text-[#2C95FF]'
          onClick={() => {
            setIsSendEmail(false);
            setOpenStatus(true);
          }}
        >
          <Repeat className='w-4 h-4 mr-2' />
          Đổi trạng thái
        </Label>
        <Label
          className='w-full text-left px-3 py-2 text-sm text-gray-700 flex items-center cursor-pointer hover:bg-[#EDECFF] hover:text-[#2C95FF]'
          onClick={() => {
            navigate(`/danh-cho-nha-tuyen-dung/danh-gia-ho-so-cong-viec/${applyJob.id}`);
          }}
        >
          <PieChart className='w-4 h-4 mr-2' />
          Đánh giá ứng viên
        </Label>
      </PopoverContent>
    </Popover>
  </>
}
