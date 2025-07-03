import { subscriptionUseBanner } from "@/apis/paymentAPI";
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { EmployerSubResponse } from "@/types/employerSubType";
import dayjs from "dayjs";
import { useState } from "react";
import { toast } from "sonner";

export default function FormActiveServiceBanner({ employerSub }: { employerSub: EmployerSubResponse }) {
  const [open, setOpen] = useState(false);
  const activeService = async () => {
    try {
      await subscriptionUseBanner({
        employerSubId: employerSub.id,
      });
      toast.success("Bạn đã sử dụng dịch vụ thành công");
    }
    catch (error) {
      toast.error(error?.response?.data?.message || "Lỗi không xác định");
    }
  }
  return (
    <AlertDialog
      open={open}
      onOpenChange={setOpen}
    >
      <AlertDialogTrigger className="w-full"
        asChild
        disabled={employerSub.status === 'USED'}
      >
        <Button className="w-full bg-purple-100 text-purple-800 hover:bg-[#ebe2ff] hover:text-[#451e99] rounded-none font-bold text-sm"
          disabled={employerSub.status === 'USED'}
        >
          Sử dụng dịch vụ banner
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="">
        <AlertDialogHeader>
          <AlertDialogTitle >
            Kich hoạt dịch vụ banner dành cho nhà tuyển dụng
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm text-gray-600 text-center mt-2">
            <div
              key={employerSub.id}
              className={`p-3 border rounded-md cursor-pointer hover:bg-gray-50 transition-colors`}
            >
              <div className='flex items-start gap-3 mb-2'>
                <Avatar className='h-30 w-40 rounded-none border border-gray-200'>
                  <AvatarImage src={employerSub.package.image} alt={employerSub.package.name} />
                </Avatar>
                <div className='flex-1'>
                  <Label className='text-sm font-semibold'>{employerSub.package.name}</Label>
                  <p className='text-xs text-gray-500'>{employerSub.package.features}</p>
                </div>
              </div>
              <div className='text-xs text-gray-600'>
                {employerSub.package.dayValue} ngày | dự kiến tới{' '}
                <span className='text-[#451DA0]'>
                  {dayjs().add(employerSub.package.dayValue, 'day').format('DD/MM/YYYY')}
                </span>
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex justify-end mt-4">
          <Button variant="outline" className="mr-2 flex-1 rounded-none" onClick={() => setOpen(false)}>
            Hủy
          </Button>
          <Button className="flex-1 bg-[#451e99] hover:bg-[#ebe2ff] hover:text-[#451e99] rounded-none font-bold text-sm" onClick={activeService}>
            Xác nhận
          </Button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}