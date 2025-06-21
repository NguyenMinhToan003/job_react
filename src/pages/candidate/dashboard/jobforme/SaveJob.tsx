import { getRecomendedSaveJobAPI, getSaveJobAPI } from '@/apis/saveJobAPI';
import JobList from '@/components/elements/job/job-list/JobItem';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from '@/components/ui/pagination';
import { ApplyJobResponse } from '@/types/applyJobType';
import { JobFilterResponse } from '@/types/jobType';
import { convertPrice } from '@/utils/convertPrice';
import { ChevronLeft, ChevronRight, HandCoins } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SaveJob() {
  const navigate = useNavigate();
  const [applyJobs, setApplyJobs] = useState<ApplyJobResponse[]>([]);
  const [page, setPage] = useState(1);
  const limit = 5;
  const [totalPages, setTotalPages] = useState(0);
  const [recomendedJobs, setRecomendedJobs] = useState<JobFilterResponse[]>([]);
  const [total, setTotal] = useState(0);

  const fetchApplyJobs = async () => {
    try {
      const response = await getSaveJobAPI(page, limit);
      setApplyJobs(response.items);
      setTotal(response.total);
      setTotalPages(response.totalPage || 0);
    } catch (error) {
      console.error('Error fetching saved jobs:', error);
    }
  };
  const fetchRecomendedJobs = async () => {
    try {
      const response = await getRecomendedSaveJobAPI();
      setRecomendedJobs(response);
    } catch (error) {
      console.error('Error fetching recommended jobs:', error);
    }
  }
  useEffect(() => {
    fetchRecomendedJobs();
  }, []);

  useEffect(() => {
    fetchApplyJobs();
  }, [page, limit]);


  return (
    <>
    <Card className="rounded-none shadow-none  border-none">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-800">
          Công việc đã lưu {total > 0 ? `(${total})` : ''}
        </CardTitle>
      </CardHeader>
    </Card>
      {applyJobs.length > 0 ? (
        applyJobs.map((savejob) => (
          <Card className='rounded-none shadow-none hover:shadow-2xl' key={savejob.id}>
            <CardContent className='flex items-start justify-start gap-2'>
              <div className='bg-white rounded-none w-18 h-18 flex items-center justify-center border border-gray-200'>
                <img
                  src={savejob.job.employer?.logo}
                  alt='Logo'
                  className='w-full h-full object-contain'
                />
              </div>

              <div className='flex-1 flex-col gap-1'>
                <div
                  className='font-bold text-gray-800 text-lg hover:underline cursor-pointer'
                  onClick={() => navigate(`/cong-viec/${savejob.job.id}`)}
                >
                  {savejob.job.name}
                </div>

                <div
                  className='text-[12px] text-gray-500 font-semibold hover:underline cursor-pointer'
                  onClick={() => navigate(`/nha-tuyen-dung/${savejob.job.employer?.id}`)}
                >
                  {savejob.job.employer?.name}
                </div>

                <div className='text-[12px] text-gray-500 font-semibold'>
                  {savejob?.job?.locations?.[0]?.district?.city?.name}
                </div>

                <div className='flex gap-2 items-center justify-start font-semibold text-green-600 text-sm'>
                  <HandCoins className='w-4 h-4' />
                  {convertPrice(savejob.job.minSalary, savejob.job.maxSalary)}
                </div>
              </div>

              <div className='flex flex-col items-end justify-start gap-2'>
                <Button
                  variant={'destructive'}
                  className='cursor-pointer text-sm font-semibold h-10  bg-red-500'
                  onClick={() => navigate(`/ung-tuyen-cong-viec/${savejob.job.id}`)}
                >
                  Ứng tuyển công việc
                </Button>
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <div className='text-center text-gray-500 font-semibold'>
          Chưa có công việc nào được lưu
        </div>
      )}

      <Pagination className=' w-full bg-white py-2'>
        <PaginationContent className='list-none flex justify-center items-center gap-1'>
          <Button
            variant='ghost'
            className='cursor-pointer'
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          >
            <ChevronLeft className='w-4 h-4 mr-1' />
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
            className='cursor-pointer ml-5'
            onClick={() => setPage((prev) => (prev < totalPages ? prev + 1 : prev))}
          >
            Tiếp theo
            <ChevronRight className='w-4 h-4 mr-1' />
          </Button>
        </PaginationContent>
      </Pagination>
      <Card className='mt-4 bg-transparent shadow-none'>
        <CardHeader className='text-center text-gray-800 font-bold'>
          <CardTitle className='text-lg text-[#451da1]'>
            <p>Dựa trên công việc bạn lưu mà chúng tôi tìm thấy <strong>{recomendedJobs.length}</strong> công việc tương tự</p>
          </CardTitle>
        </CardHeader>
        <CardContent className='text-center text-gray-500 font-semibold  grid grid-cols-2 gap-4 p-0'>
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
  );
}
