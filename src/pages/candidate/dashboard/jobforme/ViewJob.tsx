/* eslint-disable @typescript-eslint/no-explicit-any */
import { getAllViewJobsAPI } from "@/apis/viewJobAPI";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ViewJobResponse } from "@/types/jobType";
import { convertDateToString } from "@/utils/dateTime";
import { HandCoins } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function ViewJob() {
  const [jobs, setJobs] = useState<ViewJobResponse[]>([]);
  const navigate = useNavigate();
  const fetchJobs = async () => {
    try {
      const response = await getAllViewJobsAPI();
      setJobs(response);
    }
    catch (error: any) {
      toast.error(error.response?.data?.message || 'Lỗi khi lấy danh sách công việc đã xem');
    }
  }

  useEffect(() => {
    fetchJobs();
  }, []);

  
  return <>
    <Card className="rounded-none shadow-none hover:shadow-2xl">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-800">
          Công việc đã xem gần đây {jobs.length > 0 ? `(${jobs.length})` : ''}
        </CardTitle>
      </CardHeader>
    </Card>
    {
      jobs.length > 0 && jobs.map((viewjob) => (
        <Card className="rounded-none shadow-none hover:shadow-2xl" key={viewjob.job.id}>
          <CardContent className="flex items-start justify-start gap-2">
          <div className='bg-white rounded-none w-18 h-18 flex items-center justify-center border border-gray-200'>
            <img src={viewjob.job.employer?.logo} alt='CBTW Logo' className='w-full h-full' />
            </div>
            <div className="flex-1 flex-col gap-1">
              <div className='font-bold text-gray-800 text-lg hover:underline cursor-pointer'
                onClick={() => navigate(`/cong-viec/${viewjob.job.id}`)}
              >{viewjob.job.name}</div>
              <div className='text-[12px] text-gray-500 font-semibold'>{viewjob.job.employer?.name}</div>

              <div className="text-green-600 font-semibold text-sm">
                {viewjob.job?.maxSalary === viewjob.job?.minSalary && viewjob.job?.maxSalary === null ? (
                  <div className='flex gap-2 items-center justify-start font-semibold'><HandCoins className="w-4 h-4"/><span> Thỏa thuận</span></div>
                ) : (
                  <div className='flex gap-2 items-center justify-start font-semibold'><HandCoins className="w-4 h-4"/> <span>Từ {viewjob.job?.minSalary} đến {viewjob.job?.maxSalary}</span></div>
                )}
              </div>
              
            </div>
            <div className="flex flex-col items-end justify-start gap-2">
               <span className='text-[12px] text-gray-400 font-semibold'>Đã xem vào {
                  convertDateToString(viewjob.viewDate)
                }</span>
                <Button variant={'destructive'}
                  onClick={()=> navigate(`/ung-tuyen-cong-viec/${viewjob.job.id}`)}
                >
                 Xem công việc
              </Button>
              </div>
          </CardContent>
        </Card>
      ))
    }
  </>
}