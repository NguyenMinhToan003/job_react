/* eslint-disable @typescript-eslint/no-explicit-any */
import { getApplyByStatus, unApplyJob } from "@/apis/applyJobAPI";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ApplyJobResponse } from "@/types/applyJobType";
import { APPLY_JOB_STATUS } from "@/types/type";
import { convertPrice } from "@/utils/convertPrice";
import { convertDateToString } from "@/utils/dateTime";
import { HandCoins } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function ApplyJob() {
  const navigate = useNavigate();
  const [applyJobs, setApplyJobs] = useState<ApplyJobResponse[]>([])
  const fetchApplyJobs = async () => {
    try {
      const response = await getApplyByStatus(APPLY_JOB_STATUS.PROCESSING);
      setApplyJobs(response);
    }
    catch(error) {
      console.error("Error fetching apply applyJobs:", error);
    }
  }
  useEffect(() => {
    fetchApplyJobs();
  }, [])

  const handleUnApplyJob = async (jobId: number) => {
    try {
      await unApplyJob(jobId);
      toast.success("Hủy ứng tuyển thành công");
    }
    catch (error: any) {
      toast.error(error.response?.data?.message || "Lỗi không xác định");
    }
  }
  return <>
    <Card className="rounded-none shadow-none hover:shadow-2xl">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-800">
          Vị trí tuyển dụng đã ứng tuyển {applyJobs.length > 0 ? `(${applyJobs.length})` : ''}
        </CardTitle>
      </CardHeader>
    </Card>
    {
      applyJobs.map((applyJob) => (
        <Card className="rounded-none shadow-none hover:shadow-2xl" key={applyJob.id}>
          <CardContent className="flex items-start justify-start gap-2">
          <div className='bg-white rounded-none w-18 h-18 flex items-center justify-center border border-gray-200'>
            <img src={applyJob.job.employer?.logo} className='w-full h-full' />
            </div>
            <div className="flex-1 flex-col gap-1">
              <div
                onClick={() => navigate(`/cong-viec/${applyJob.job.id}`)}
                className='font-bold text-gray-800 text-lg hover:underline cursor-pointer'>{applyJob.job.name}</div>
              <div className='text-[12px] text-gray-500 font-semibold hover:underline'>{applyJob.job.employer?.name}</div>
              <div className='text-[12px] text-gray-500 font-semibold hover:underline'>{applyJob?.job?.locations[0]?.district?.city?.name}</div>
              <div className="text-green-600 font-semibold text-sm">
                {applyJob?.job?.maxSalary === applyJob?.job?.minSalary && applyJob?.job?.maxSalary === null ? (
                  <div className='flex gap-2 items-center justify-start font-bold'><HandCoins className="w-4 h-4"/><span> Thỏa thuận</span></div>
                ) : (
                    <div className='flex gap-2 items-center justify-start font-bold'><HandCoins className="w-4 h-4" /> <span>
                    {convertPrice(applyJob.job.minSalary, applyJob.job.maxSalary)}
                    </span></div>
                )}
              </div>
              
            </div>
            <div className="flex flex-col items-end justify-start gap-2">
              <span className='text-[12px] text-gray-400 font-semibold'>Đã ứng tuyển vào {
                convertDateToString(applyJob.time)
              }</span>
              {
               applyJob.viewStatus ? (
                  <span className='text-[12px] text-green-500 font-semibold'>Đã xem</span>
                ) : (
                  <span className='text-[12px] text-gray-500 font-semibold'>Chưa xem</span>
                )
              }
              <Button variant={'destructive'}
                className="w-full"
                onClick={() => handleUnApplyJob(applyJob.job.id)}>
                {
                  applyJob.status
                }
              </Button>
              </div>
          </CardContent>
        </Card>
      ))
    }
  </>
}