/* eslint-disable @typescript-eslint/no-explicit-any */
import { getAllViewJobsAPI, getRecomendedViewJobAPI } from "@/apis/viewJobAPI";
import JobList from "@/components/elements/job/job-list/JobItem";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { JobFilterResponse, ViewJobResponse } from "@/types/jobType";
import { convertPrice } from "@/utils/convertPrice";
import { convertDateToString } from "@/utils/dateTime";
import { ChevronLeft, ChevronRight, HandCoins } from "lucide-react";
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
                    <div className='flex gap-2 items-center justify-start font-bold'><HandCoins className="w-4 h-4" />
                      <span className='font-bold'>
                        {convertPrice(viewjob.job.minSalary, viewjob.job.maxSalary)}
                      </span>
                    </div>
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
    <Pagination className=' w-full bg-white py-2'>
        <PaginationContent className='list-none flex justify-center items-center gap-1'>
          <Button
            variant='ghost'
            title='Trước'
            className='cursor-pointer'
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
        >
            <ChevronLeft className='w-4 h-4' />
            Trước
          </Button>

          {Array.from({ length: totalPages }, (_, index) => (
            <PaginationItem key={index}>
              <PaginationLink
                className={`cursor-pointer ${
                  page === index + 1
                    ? 'bg-blue-500 text-white'
                    : 'text-blue-500 hover:bg-blue-100'
                }`}
                onClick={() => setPage(index + 1)}
                isActive={page === index + 1}
              >
                {index + 1}
              </PaginationLink>
            </PaginationItem>
          ))}

          <Button
            variant='ghost'
            title='Tiếp theo'
            className='cursor-pointer ml-5'
            onClick={() => setPage((prev) => (prev < totalPages ? prev + 1 : prev))}
          >
          Tiếp theo
            <ChevronRight className='w-4 h-4' />
          </Button>
        </PaginationContent>
    </Pagination>
    
    <Card className='mt-4'>
            <CardHeader className='text-center text-gray-800 font-bold'>
              <CardTitle className='text-lg font-semibold text-[#451da1]'>
                Gợi ý công việc dựa trên công việc đã xem
              </CardTitle>
            </CardHeader>
            <CardContent className='text-center text-gray-500 font-semibold grid grid-cols-2 gap-4'>
              {
                recomendedJobs.length > 0 ? (
                  recomendedJobs.map((job: JobFilterResponse) => (
                    <JobList
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