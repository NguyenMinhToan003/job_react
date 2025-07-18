import { refreshJobInPackage } from "@/apis/jobAPI";
import { Button } from "@/components/ui/button";
import { useAlertDialog } from "@/providers/AlertDialogProvider";
import { toast } from "sonner";

export default function Setting() {
  const { showAlert } = useAlertDialog();
  const refreshJobs = async () => {
    try {
      await refreshJobInPackage();
    }
    catch (error) {
      toast.error(error?.response?.data?.message || 'Có lỗi xảy ra khi làm mới danh sách công việc');
    }
  }
  return (
    <div className="p-4">
      <Button
        variant="outline"
        onClick={
          () => showAlert({
            title: 'Thao tác thử công làm mới Cho gói dịch vụ làm mới công việc',
            content: 'Bạn có chắc chắn muốn thực hiện thao tác này không?',
            confirmText: 'Xác nhận',
            cancelText: 'Hủy',
            handleConfirm: async () => {
              await refreshJobs();
              toast.success('Đã thực hiện thao tác làm mới công việc');
            }
          })
        }
        className="mb-4"
      >
        Thao tác thử công làm mới Cho gói dịch vụ làm mới công việc
      </Button>
    </div>
  );
}