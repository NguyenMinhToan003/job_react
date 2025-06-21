/* eslint-disable react-hooks/exhaustive-deps */
import JobListDetail from './JobListDisplay';
import { JobFilterResponse } from '@/types/jobType';
import JobItem from './JobItem';
import { useEffect, useRef, useState } from 'react';
import PaginationModel1 from '../../pagination/PaginationModel1';
import { Skeleton } from '@/components/ui/skeleton';

export default function JobList({ jobs,loading , page, setPage, totalPages }: {
  jobs: JobFilterResponse[],
  loading: boolean,
  page: number,
  setPage: (page: number) => void,
  totalPages: number
}) {
  const [selectedJob, setSelectedJob] = useState<JobFilterResponse>({} as JobFilterResponse);
  const loadingRef = useRef(null);
  useEffect(() => {
    if (loadingRef.current) {
      window.scrollTo({
        top: loadingRef?.current?.offsetTop - 20 || 0,
        behavior: 'smooth',
      });
    }
   if(jobs.length > 0) {
     setSelectedJob(jobs[0]);
   }
    else setSelectedJob({} as JobFilterResponse);

  },[jobs])
  return (
    <div ref={loadingRef} className=' grid grid-cols-1 md:grid-cols-5 gap-4 mt-4 w-7xl mx-auto min-h-[70vh] p-2'>
      <div className='col-span-2 space-y-4'>
        {loading ?
          <div className='text-center'>
            <Skeleton className='w-full h-30 mb-2' />
            <Skeleton className='w-full h-30 mb-2' />
            <Skeleton className='w-full h-30 mb-2' />
            <Skeleton className='w-full h-30 mb-2' />
            <Skeleton className='w-full h-30 mb-2' />
          </div>
          : jobs.length > 0  && jobs.map((job) => (
            <JobItem
              key={job.id}
              job={job}
              selectedJob={selectedJob}
              setSelectedJob={setSelectedJob}
            />
          ))
        }
        <PaginationModel1
          page={page}
          setPage={setPage}
          totalPages={totalPages}
        />

      </div>
      <div className='col-span-3'>
        <div className='sticky top-20'>
          {jobs.length>0 && selectedJob?.id && <JobListDetail jobDetailId={selectedJob.id} />}
        </div>
      </div>
    </div>
  );
}
