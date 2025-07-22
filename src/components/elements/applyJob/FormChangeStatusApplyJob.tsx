/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { sendEmailToCandidate, updateApplyJobStatus } from "@/apis/applyJobAPI";
import { ApplyJobResponse } from "@/types/applyJobType";
import { APPLY_JOB_STATUS } from "@/types/type";
import clsx from "clsx";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { AlertTriangle, Briefcase, CheckCircle, LucidePhone, Mail, Mic, RotateCcw, ThumbsDown, ThumbsUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import Editer from "../editer/editer";

const statusLabels: Record<APPLY_JOB_STATUS, string> = {
  DANG_XU_LY: "Đang xử lý",
  DANG_PHONG_VAN: "Đang phỏng vấn",
  PHU_HOP: "Phù hợp",
  KHONG_PHU_HOP: "Không phù hợp",
  DA_TUYEN: "Đã tuyển",
};

export const FormChangeStatusApplyJob = ({
  open,
  setOpen,
  applyJob,
  isOpenSendEmail,
  setIsChange
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
    applyJob: ApplyJobResponse;
    isOpenSendEmail: boolean;
    setSendEmail?: (sendEmail: boolean) => void;
    setIsChange?: (isChange: boolean) => void;
}) => {
  const [selectedStatus, setSelectedStatus] = useState<APPLY_JOB_STATUS>(applyJob.status);
  const [isSendEmail, setIsSendEmail] = useState<boolean>(isOpenSendEmail);
  const [emailContent, setEmailContent] = useState<string>("");
  const [emailSubject, setEmailSubject] = useState<string>("");

  useEffect(() => {
    if (open) {
      setSelectedStatus(applyJob.status);
      setEmailContent("");
      setEmailSubject("");
      setIsSendEmail(isOpenSendEmail);
    }
  }, [open, applyJob]);

  const handleConfirm = async () => {
    try {
      if (isSendEmail) {
        if (!emailSubject || !emailContent) {
          toast.error("Vui lòng nhập tiêu đề và nội dung email");
          return;
        }
        await sendEmailToCandidate(applyJob.id, emailSubject, emailContent);
      }
      if (selectedStatus === applyJob.status) return;
      await updateApplyJobStatus(applyJob.id, selectedStatus);
      toast.success("Cập nhật trạng thái thành công");
      setOpen(false);
      setIsChange?.(true);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Cập nhật trạng thái thất bại");
    }
  };

  const handleRenderIcon = (status: APPLY_JOB_STATUS) => {
    switch (status) {
      case APPLY_JOB_STATUS.PROCESSING:
        return <RotateCcw className="h-3 w-3" />;
      case APPLY_JOB_STATUS.INTERVIEWING:
        return <Mic className="h-3 w-3" />;
      case APPLY_JOB_STATUS.QUALIFIED:
        return <ThumbsUp className="h-3 w-3" />;
      case APPLY_JOB_STATUS.UNQUALIFIED:
        return <ThumbsDown className="h-3 w-3" />;
      case APPLY_JOB_STATUS.HIRED:
        return <CheckCircle className="h-3 w-3" />;
      default:
        return null;
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen} >
      <AlertDialogContent  className="min-w-3xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center font-bold text-md text-neutral-800">
            Đổi trạng thái ứng viên
          </AlertDialogTitle>

        </AlertDialogHeader>
        <AlertDialogDescription className="text-center text-neutral-500 mt-1 space-y-3">
          <div className="flex items-start mb-4 gap-3  bg-[#F6F6F6] p-4 rounded-md">
            <Avatar className="w-20 h-20 mx-auto ">
              <AvatarImage
                src={applyJob.resumeVersion?.avatar}
              />
            </Avatar>
            <div className=" flex-1 flex flex-col justify-start items-start gap-2">
              <div>
                <Label className="font-semibold text-neutral-800">
                  {applyJob.resumeVersion?.username}
                </Label>
              </div>
              <div className="flex items-center gap-3 text-sm text-neutral-500 mt-1">
                <Label className='text-neutral-700'>
                  <LucidePhone className='h-3 w-3 text-neutral-700' /> {
                    applyJob?.phone==='' ? applyJob?.resumeVersion?.phone : applyJob?.phone
                  }
                </Label>
                <Label className='text-sm text-neutral-700'>
                  <Mail className='h-3 w-3 text-neutral-700' /> {
                    applyJob?.email === '' ? applyJob?.resumeVersion?.email : applyJob?.email 
                  }
                </Label>
              </div>
              <Label className="text-sm text-neutral-700">
                <Briefcase className="h-3 w-3 text-neutral-700" />{" "}
                {applyJob.job?.name}
              </Label>
            </div>
          </div>
          <div className='flex item-start gap-2'>
            <div className='p-2'>
              <Label>Trạng thái</Label>
            </div>
            <div className='flex-1'>
              <RadioGroup
                defaultValue={applyJob.status}
                value={selectedStatus}
                onValueChange={(value) => setSelectedStatus(value as APPLY_JOB_STATUS)}
                className="space-y-2 flex "
              >
              {Object.entries(statusLabels).map(([key, label]) => (
                <Label
                  key={key}
                >
                  <RadioGroupItem
                    value={key as APPLY_JOB_STATUS}
                    className="mr-2"
                    hidden
                  />
                  <Badge
                    className={clsx(
                      'py-2 px-3 rounded-full cursor-pointer text-xs flex items-center gap-2',
                      selectedStatus === key ? 'bg-[#414045] text-white' : 'bg-[#f4f4f4] text-[#414045] hover:bg-[#f4f4f4] hover:text-[#341275]',
                      'transition-colors duration-200 ease-in-out'
                    )}
                  >
                    {handleRenderIcon(key as APPLY_JOB_STATUS)}
                    {label}
                  </Badge>
                </Label>
              ))}
            </RadioGroup>
            </div>
            
          </div>
          <Label>
            <Checkbox
              defaultChecked={isSendEmail}
              checked={isSendEmail}
              onCheckedChange={(checked) => setIsSendEmail(!!checked)}
              className="mr-2"
            />
            <span className="text-xs text-neutral-600">Gửi mail cho ứng viên</span>
          </Label>
          {
            isSendEmail && (
              <div className="mt-2 p-3 bg-neutral-50 rounded-md">
                <Label>
                  <span className="max-w-24 min-w-24">Gửi tới</span>
                  <Input
                    type="email"
                    value={applyJob.resumeVersion?.email}
                    readOnly
                    className="mt-1 w-full"
                  />
                </Label>
                <Label className="mt-2">
                  <span className="max-w-24 min-w-24">Tiêu đề *
                  </span>
                  <Input
                    type="text"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    placeholder="Nhập tiêu đề email"
                    className="mt-1 w-full border border-[#2c95ff]"
                  />
                </Label>
                <Label className="mt-2 flex">
                  <span className="max-w-24 min-w-24">Nội dung *
                  </span>
                  <div className=" flex-1 items-start">
                    <Editer
                      text={emailContent}
                      setText={setEmailContent}
                    />
                  </div>
                </Label>
              </div>
            )
          }
          <div className="w-full px-3 text-xs h-fit flex items-center gap-2 bg-orange-50 text-orange-500 py-2 font-semibold rounded-md">
              <AlertTriangle className="h-3 w-3 " />
            <span >
              Khi bạn chọn “Đã tuyển”, trạng thái này sẽ được khóa và không thể sửa đổi.
            </span>
          </div>
          </AlertDialogDescription>

        <AlertDialogFooter className="flex gap-2 pt-4">
          <AlertDialogCancel className="flex-1 rounded-none border border-neutral-300 hover:bg-neutral-100">
            Hủy
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className="bg-[#451DA0] text-white hover:bg-[#341275] rounded-none flex-1"
          >
            Xác nhận
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
