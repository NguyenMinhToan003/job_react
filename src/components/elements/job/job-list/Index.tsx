/* eslint-disable react-hooks/exhaustive-deps */
import JobListDetail from './JobListDisplay';
import { JobFilterResponse } from '@/types/jobType';
import JobList from './JobList';
import { useEffect, useState } from 'react';

export default function Index({jobs}: { jobs: JobFilterResponse[] }) {
  const [selectedJob, setSelectedJob] = useState<JobFilterResponse>({} as JobFilterResponse);

  useEffect(() => {
    
   if(jobs.length > 0) {
     setSelectedJob(jobs[0]);
   }
    else setSelectedJob({} as JobFilterResponse);

  },[jobs])
  return (
    <div className='grid grid-cols-1 md:grid-cols-5 gap-4 mt-4 w-7xl mx-auto min-h-[70vh] p-2'>
      <div className='col-span-2 space-y-4'>
        {jobs.map((job) => (
          <JobList
            key={job.id}
            job={job}
            selectedJob={selectedJob}
            setSelectedJob={setSelectedJob}
          />
        ))}
      </div>
      <div className='col-span-3'>
        <div className='sticky top-20'>
          {jobs.length>0 && selectedJob?.id && <JobListDetail jobDetailId={selectedJob.id} />}
        </div>
      </div>
    </div>
  );
}
