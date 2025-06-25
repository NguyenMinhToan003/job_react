import { subscriptionUseBanner } from "@/apis/paymentAPI";
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { EmployerSubResponse } from "@/types/employerSubType";
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
      <AlertDialogTrigger className="w-full">
        <Button className="w-full bg-purple-100 text-purple-800 hover:bg-[#ebe2ff] hover:text-[#451e99] rounded-none font-bold text-sm">
          Sử dụng dịch vụ
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="w-full max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-lg font-semibold text-center">
            {
            employerSub ? `Bạn đã sử dụng dịch vụ ${employerSub.package.name}` : "Bạn có muốn sử dụng dịch vụ này không?"
            }
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm text-gray-600 text-center mt-2">
            Việc sử dụng dịch vụ sẽ giúp bạn quản lý và tối ưu hóa các hoạt động của mình một cách hiệu quả hơn.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex justify-end mt-4">
          <Button variant="outline" className="mr-2" onClick={() => setOpen(false)}>
            Hủy
          </Button>
          <Button className="bg-purple-600 text-white hover:bg-purple-700" onClick={activeService}>
            Xác nhận
          </Button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}