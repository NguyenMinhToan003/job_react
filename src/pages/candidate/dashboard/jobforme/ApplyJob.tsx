import { getApplyJobs } from "@/apis/applyJobAPI";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ApplyJobResponse } from "@/types/applyJobType";
import { HandCoins } from "lucide-react";
import { useEffect, useState } from "react";

export default function ApplyJob() {
  const [applyJobs, setApplyJobs] = useState<ApplyJobResponse[]>([])
  const fetchApplyJobs = async () => {
    try {
      const response = await getApplyJobs()
      setApplyJobs(response);
    }
    catch(error) {
      console.error("Error fetching apply applyJobs:", error);
    }
  }
  useEffect(() => {
    fetchApplyJobs();
  }, [])
  return <>
    {
      applyJobs.map((applyJob) => (
        <Card className="rounded-none shadow-none hover:shadow-2xl" key={applyJob.id}>
          <CardContent className="flex items-start justify-start gap-2">
          <div className='bg-white rounded-none w-18 h-18 flex items-center justify-center border border-gray-200'>
            <img src={applyJob.job.employer?.logo} alt='CBTW Logo' className='w-full h-full' />
            </div>
            <div className="flex-1 flex-col gap-1">
              <div className='font-bold text-gray-800 text-lg'>{applyJob.job.name}</div>
              <div className='text-[12px] text-gray-500 font-semibold'>{applyJob.job.employer?.name}</div>
              <div className='text-[12px] text-gray-500 font-semibold'>{applyJob?.job?.locations[0]?.district?.city?.name}</div>
              <div className="text-green-600 font-semibold text-sm">
                {applyJob?.job?.maxSalary === applyJob?.job?.minSalary && applyJob?.job?.maxSalary === -9999 ? (
                  <div className='flex gap-2 items-center justify-start font-semibold'><HandCoins className="w-4 h-4"/><span> Thỏa thuận</span></div>
                ) : (
                  <div className='flex gap-2 items-center justify-start font-semibold'><HandCoins className="w-4 h-4"/> <span>Từ {applyJob?.job?.minSalary} đến {applyJob?.job?.maxSalary}</span></div>
                )}
              </div>
              
            </div>
            <div className="flex flex-col items-end justify-start gap-2">
              <span className='text-[12px] text-gray-400 font-semibold'>Đã ứng tuyển vào {
                new Date(applyJob.time).toLocaleDateString('vi-VN', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                })
              }</span>
              <Button variant={'destructive'}>
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