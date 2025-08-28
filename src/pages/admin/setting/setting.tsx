/* eslint-disable @typescript-eslint/no-explicit-any */
import { refreshJobInPackage } from "@/apis/jobAPI";
import { cronjobDeleteResumeVersionDraftAPI } from "@/apis/resumeAPI";
import { Button } from "@/components/ui/button";
import { useAlertDialog } from "@/providers/alertDialogProvider";
import { toast } from "sonner";

export default function Setting() {
  const { showAlert } = useAlertDialog();
  const refreshJobs = async () => {
    try {
      await refreshJobInPackage();
    }
    catch (error: any) {
      toast.error(error?.response?.data?.message || 'Có lỗi xảy ra khi làm mới danh sách công việc');
    }
  }
  const deleteDrafts = async () => {
    try {
      await cronjobDeleteResumeVersionDraftAPI();
      toast.success('Đã xóa các bản nháp CV thành công');
    }
    catch (error: any) {
      toast.error(error?.response?.data?.message || 'Có lỗi xảy ra khi xóa các bản nháp CV');
    }
  }
  return (
    <div className="p-4 flex flex-col items-start space-y-4">
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
      <Button
        variant="outline"
        onClick={
          () => showAlert({
            title: 'Xóa các bản nháp CV',
            content: 'Bạn có chắc chắn muốn xóa tất cả các bản nháp CV không?',
            confirmText: 'Xác nhận',
            cancelText: 'Hủy',
            handleConfirm: async () => {
              await deleteDrafts();
              toast.success('Đã xóa các bản nháp CV thành công');
            }
          })
        }
        className="mb-4"
      >
        Xóa các bản nháp CV
      </Button>
      <p className="text-sm text-gray-500">
        Lưu ý: Thao tác này sẽ xóa tất cả các bản nháp CV hiện có. Hãy chắc chắn rằng bạn đã sao lưu các thông tin quan trọng trước khi thực hiện.
      </p>
    </div>
  );
}