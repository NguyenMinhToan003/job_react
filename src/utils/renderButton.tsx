import { Button } from "@/components/ui/button";
import { APPLY_JOB_STATUS } from "@/types/type";

  export const buttonAction = (status: APPLY_JOB_STATUS) => {
    const baseStyle = "rounded-sm w-24 text-xs font-semibold";
    switch (status) {
      case APPLY_JOB_STATUS.HIRED:
        return <Button variant='ghost' className={`${baseStyle} text-green-600 bg-emerald-100`}>Đã tuyển</Button>;
      case APPLY_JOB_STATUS.PROCESSING:
        return <Button variant='ghost' className={`${baseStyle} text-gray-600 border border-gray-600 bg-gray-100`}>Đang xử lý</Button>;
      case APPLY_JOB_STATUS.QUALIFIED:
        return <Button variant='ghost' className={`${baseStyle} text-white bg-[#2C95FF]`}>Phù hợp</Button>;
      case APPLY_JOB_STATUS.UNQUALIFIED:
        return <Button variant='ghost' className={`${baseStyle} text-red-500 bg-red-50`}>Không phù hợp</Button>;
      case APPLY_JOB_STATUS.INTERVIEWING:
        return <Button variant='ghost' className={`${baseStyle} text-yellow-600 bg-yellow-50`}>Phỏng vấn</Button>;
      default:
        return null;
    }
  };