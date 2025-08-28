/* eslint-disable @typescript-eslint/no-explicit-any */
import { getAllViewJobsAPI, getRecomendedViewJobAPI } from "@/apis/viewJobAPI";
import JobItem from "@/components/elements/job/job-list/jobItem";
import PaginationModel1 from "@/components/elements/pagination/paginationModel1";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { JobFilterResponse, ViewJobResponse } from "@/types/jobType";
import { convertPrice } from "@/utils/convertPrice";
import { convertDateToString } from "@/utils/dateTime";
import { HandCoins } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function ViewJob() {
  const [jobs, setJobs] = useState<ViewJobResponse[]>([]);
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const limit = 5;
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [recomendedJobs, setRecomendedJobs] = useState<JobFilterResponse[]>([]);
  const fetchJobs = async () => {
    try {
      const response = await getAllViewJobsAPI(page, limit);
      setJobs(response.items);
      setTotalPages(response.totalPage || 1);
      setTotal(response.total);
    }
    catch (error: any) {
      toast.error(error.response?.data?.message || 'Lỗi khi lấy danh sách công việc đã xem');
    }
  }
  const fetchRecomendedJobs = async () => {
    try {
      const response = await getRecomendedViewJobAPI();
      setRecomendedJobs(response);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Lỗi khi lấy danh sách công việc gợi ý');
    }
  }

  useEffect(() => {
    fetchRecomendedJobs();
  }, []);
  useEffect(() => {
    fetchJobs();
  }, [page]);

  
  return <>
    <Card className="rounded-none shadow-none hover:shadow-2xl">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-800">
          Công việc đã xem gần đây {total > 0 ? `(${total})` : ''}
        </CardTitle>
      </CardHeader>
    </Card>
    {
      jobs.length > 0 && jobs.map((viewjob) => (
        <Card className="rounded-none shadow-none hover:shadow-2xl" key={viewjob.job.id}>
          <CardContent className="flex items-start justify-start gap-2">
          <div className='bg-white rounded-none w-24 h-24 flex items-center justify-center border border-gray-200'>
            <img src={viewjob.job.employer?.logo} className='w-full h-full' />
            </div>
            <div className="flex-1 flex-col gap-1">
              <div
                onClick={() => navigate(`/cong-viec/${viewjob.job.id}`)}
                className='font-semibold text-[#451da1] text-lg hover:underline cursor-pointer'>{viewjob.job.name}</div>
              <div className='text-sm text-gray-500 font-semibold hover:underline'>{viewjob.job.employer?.name}</div>
              <div className='text-sm text-gray-500 font-semibold hover:underline'>{viewjob?.job?.locations[0]?.district?.city?.name}</div>
              <div className="text-[#2c95ff] font-semibold text-sm">
                {viewjob?.job?.maxSalary === viewjob?.job?.minSalary && viewjob?.job?.maxSalary === null ? (
                  <div className='flex gap-2 items-center justify-start font-bold'><HandCoins className="w-4 h-4"/><span> Thỏa thuận</span></div>
                ) : (
                    <div className='flex gap-2 items-center justify-start font-bold'><HandCoins className="w-4 h-4" /> <span>
                    {convertPrice(viewjob.job.minSalary, viewjob.job.maxSalary)}
                    </span></div>
                )}
              </div>
              
            </div>
            <div className="flex flex-col items-end justify-start gap-2">
               <span className='text-[12px] text-gray-400 font-semibold'>Đã xem vào {
                  convertDateToString(viewjob.viewDate)
                }</span>
              <Button variant={'destructive'}
                className='cursor-pointer'
                  onClick={()=> navigate(`/cong-viec/${viewjob.job.id}`)}
                >
                 Xem công việc
              </Button>
              </div>
          </CardContent>
        </Card>
      ))
    }
      <PaginationModel1
        page={page}
        setPage={setPage}
        totalPages={totalPages}
      />
    
    <Card className='mt-4'>
            <CardHeader className='text-center text-gray-800 font-bold'>
              <CardTitle className='text-lg font-semibold text-[#451da1]'>
                Gợi ý công việc dựa trên công việc đã xem
              </CardTitle>
            </CardHeader>
            <CardContent className='text-center text-gray-500 font-semibold grid grid-cols-3 gap-4'>
              {
                recomendedJobs.length > 0 ? (
                  recomendedJobs.map((job: JobFilterResponse) => (
                    <JobItem
                      key={job.id}
                      job={job}
                      selectedJob={{} as JobFilterResponse}
                      setSelectedJob={() => navigate(`/cong-viec/${job.id}`)}
                    />
                  ))
                ) : (
                  <div className='col-span-2'>Không có công việc gợi ý</div>
                )
              }
            </CardContent>
          </Card>
  </>
}