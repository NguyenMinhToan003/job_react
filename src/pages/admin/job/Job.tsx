import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import JobListActive from './JobListActive';
import JobListExpired from './JobListExpired';
import JobListBlock from './JobListBlock';
import JobListPendding from './JobListPending';
import { useEffect, useState } from 'react';
import { JobResponse } from '@/types/jobType';
import { filterJobAdmin } from '@/apis/jobAPI';
import { JOB_STATUS } from '@/types/type';

export default function JobListPage() {
  const [jobsPending, setJobsPending] = useState<JobResponse[]>([]);
  const [jobsExpired, setJobsExpired] = useState<JobResponse[]>([]);
  const [jobsActive, setJobsActive] = useState<JobResponse[]>([]);
  const [jobsBlock, setJobsBlock] = useState<JobResponse[]>([]);
  
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const [jobsPending, jobsActive, jobsExpired, jobsBlock] = await Promise.all([
          filterJobAdmin({ isActive: JOB_STATUS.PENDING }),
          filterJobAdmin({ isActive: JOB_STATUS.ACTIVE, isExpired: 0}),
          filterJobAdmin({ isActive: JOB_STATUS.ACTIVE, isExpired: 1 }),
          filterJobAdmin({ isActive: JOB_STATUS.BLOCK }),
        ])
        setJobsPending(jobsPending);
        setJobsActive(jobsActive);
        setJobsExpired(jobsExpired);
        setJobsBlock(jobsBlock);
      } catch (err) {
        console.error('Lỗi lấy danh sách công việc:', err);
      }
    };
    fetchJobs();
  }, []);

  return (
    <div className='p-6  w-full'>
      <Tabs defaultValue='gioi-thieu' className='mb-8'>
          <TabsList className='border-b w-full justify-start rounded-sm h-auto p-0 mb-6 bg-white shadow-xl border-b-gray-300'>
            <TabsTrigger
              value='gioi-thieu'
              className='max-w-fit px-7 py-4 h-16 mr-1.5 text-lg font-semibold rounded-none border-b-2 shadow-none text-gray-800 data-[state=active]:text-[#ed1b2f] data-[state=active]:border-b-[#ed1b2f] data-[state=active]:shadow-none'
            >
            Chờ duyệt
            {
              jobsPending.length > 0 && (
                <Badge className='ml-2 bg-[#ed1b2f] text-white px-2 rounded-3xl'>
                  {jobsPending.length}
                </Badge>
              )
            }
            </TabsTrigger>
            <TabsTrigger
              value='danh-gia'
              className='max-w-fit px-7 py-4 h-16 mr-1.5 text-lg font-semibold rounded-none border-b-2 shadow-none text-gray-800 data-[state=active]:text-[#ed1b2f] data-[state=active]:border-b-[#ed1b2f] data-[state=active]:shadow-none'
            >
              Đang hoạt động
            {
              jobsActive.length > 0 && (
                <Badge className='ml-2 bg-[#ed1b2f] text-white px-2 rounded-3xl'>
                  {jobsActive.length}
                </Badge>
              ) 
            }
            </TabsTrigger>
            <TabsTrigger
              value='bai-viet'
              className='max-w-fit px-7 py-4 h-16 mr-1.5 text-lg font-semibold rounded-none border-b-2 shadow-none text-gray-800 data-[state=active]:text-[#ed1b2f] data-[state=active]:border-b-[#ed1b2f] data-[state=active]:shadow-none'
            >
              Đã hết hạn
              {
              jobsExpired.length > 0 && (
                <Badge className='ml-2 bg-[#ed1b2f] text-white px-2 rounded-3xl'>
                  {jobsExpired.length}
                </Badge>
                )
              }
          </TabsTrigger>
          <TabsTrigger
              value='bi-khoa'
              className='max-w-fit px-7 py-4 h-16 mr-1.5 text-lg font-semibold rounded-none border-b-2 shadow-none text-gray-800 data-[state=active]:text-[#ed1b2f] data-[state=active]:border-b-[#ed1b2f] data-[state=active]:shadow-none'
            >
            Bị khóa
            {
              jobsBlock.length > 0 && (
                <Badge className='ml-2 bg-[#ed1b2f] text-white px-2 rounded-3xl'>
                  {jobsBlock.length}
                </Badge>
              )
            }
          </TabsTrigger>
          </TabsList>

          {/* Giới thiệu */}
          <TabsContent value='gioi-thieu' className='mt-0'>
          <JobListPendding
            jobs={jobsPending}
            setJobs={setJobsPending}
          />
          </TabsContent>

          {/* Đánh giá */}
          <TabsContent value='danh-gia'>
          <JobListActive
            jobs={jobsActive}
            setJobs={setJobsActive}
          />
          </TabsContent>

          {/* Bài viết */}
          <TabsContent value='bai-viet'>
          <JobListExpired
            jobs={jobsExpired}
            setJobs={setJobsExpired}
          />
        </TabsContent>
        
          <TabsContent value='bi-khoa'>
            {/* Nội dung cho tab Bị khóa */}
          <JobListBlock
            jobs={jobsBlock}
            setJobs={setJobsBlock}
          />
          </TabsContent>
      </Tabs>
    </div>
  );
}
