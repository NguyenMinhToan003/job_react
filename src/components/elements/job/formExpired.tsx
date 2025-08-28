/* eslint-disable @typescript-eslint/no-explicit-any */
import { extendJob } from "@/apis/jobAPI";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { JobFilterResponse } from "@/types/jobType";
import { vi } from "date-fns/locale";
import dayjs from "dayjs";
import { RotateCcw, CalendarDays, Clock } from "lucide-react";
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "sonner";

export default function FormExpired({ job, setIsChange }: {
  job: JobFilterResponse | undefined;
  setIsChange?: (isChange: boolean) => void;
}) {
  const [open, setOpen] = useState(false);
  const now = new Date();
  const startDate = dayjs(job?.createdAt).toDate();
  const [expiredAt, setExpiredAt] = useState<Date | null>(
    dayjs(job?.expiredAt).toDate()
  );
  const handleUpdateExpired = async () => {
    try {
      if (!expiredAt) {
        toast.error('Vui lòng chọn thời hạn nộp');
        return;
      }
      await extendJob(job?.id|| -1, expiredAt);
      setIsChange?.(true);
      toast.success('Gia hạn thời gian nộp thành công');
    }
    catch (error: any) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi gia hạn thời gian nộp');
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Label className="w-full text-left px-3 py-2 text-sm text-gray-700 flex items-center cursor-pointer hover:bg-[#EDECFF] hover:text-[#2C95FF]">
          <RotateCcw className="w-4 h-4 mr-2" />
          Gia hạn
        </Label>
      </AlertDialogTrigger>

      <AlertDialogContent className="rounded-sm p-4">
        <AlertDialogHeader className="text-left ">
          <AlertDialogTitle className=" text-neutral-800">
            Gia hạn thời gian nộp
          </AlertDialogTitle>
          <hr className="my-2 border-gray-300" />
          <AlertDialogDescription className=" space-y-2 text-left">

            <div className=" space-y-4">
              <div className="space-y-3">
                <Label>Ngày đăng tin</Label>
                <div className="relative">
                  <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-5.5 h-5.5 text-[#451da1] z-[39]" />
                  <DatePicker
                    selected={startDate}
                    dateFormat="dd/MM/yyyy"
                    locale={vi}
                    className=" bg-neutral-100 cursor-not-allowed pl-10 pr-5 py-2 min-w-120 rounded-sm border text-sm text-neutral-900 border-[#6bbbf9] font-semibold"
                    readOnly
                  />
                </div>
              </div>
              <div className="space-y-3">
                <Label>Thời hạn nộp</Label>
                <div className="relative ">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5.5 h-5.5 text-[#451da1]" />
                  <DatePicker
                    selected={expiredAt}
                    onChange={(date: Date | null) => {
                      if (date) setExpiredAt(date);
                    }}
                    minDate={now}
                    maxDate={new Date(now.getFullYear() + 1, now.getMonth(), now.getDate())}
                    dateFormat="dd/MM/yyyy"
                    locale={vi}
                    className="pl-10 pr-5 py-2 min-w-120 rounded-sm border text-sm text-neutral-900 border-[#6bbbf9] font-semibold"
                    placeholderText="Chọn ngày"
                  />
                </div>
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="mt-4">
          <AlertDialogCancel className="flex-1 rounded-none w-40 h-12">
            Hủy bỏ
          </AlertDialogCancel>
          <AlertDialogAction className="flex-1 bg-[#451DA0] hover:bg-[#3a1580] text-white rounded-none w-40 h-12"
            onClick={() => {handleUpdateExpired(); setOpen(false);}}>
            Gia hạn
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
