/* eslint-disable react-hooks/exhaustive-deps */
import JobListDetail from './JobListDisplay';
import { JobFilterResponse, JobResponse } from '@/types/jobType';
import JobList from './JobList';
import { useEffect, useState } from 'react';
import { ApplyJobResponse } from '@/types/applyJobType';
import { getApplyByStatus } from '@/apis/applyJobAPI';
import { APPLY_JOB_STATUS } from '@/types/type';
import { useAccount } from '@/providers/UserProvider';

export default function Index({jobs}: { jobs: JobFilterResponse[] }) {
  const [selectedJob, setSelectedJob] = useState<JobFilterResponse>({} as JobResponse);
  const [listApplyJob, setListApplyJob] = useState<ApplyJobResponse[]>([]);
  const [isApplying, setIsApplying] = useState(true);
  const { dataUser } = useAccount();
  const [isSaved, setIsSaved] = useState(false);

  const fetchApplyJobs = async () => {
    try {
      const response = await getApplyByStatus(APPLY_JOB_STATUS.PENDING);
      setListApplyJob(response);
    } catch (error) {
      console.error('Error fetching apply jobs:', error);
    }
  };
  useEffect(() => {
    const isExits = listApplyJob.some((apply)=> apply.job.id === selectedJob.id);
    if (isExits) {
      setIsApplying(true);
    }
    else {
      setIsApplying(false);
    }
    const isSavedJob = dataUser?.saveJobs?.some((job) => job.jobId === selectedJob.id);
    setIsSaved(isSavedJob || false);
  }, [selectedJob]);

  useEffect(() => {
    fetchApplyJobs();
  }, []);

  useEffect(() => {
    
   if(jobs.length > 0) {
     setSelectedJob(jobs[0]);
   }
    else setSelectedJob({} as JobResponse);

  },[jobs])
  return (
    <div className='grid grid-cols-1 md:grid-cols-5 gap-4 mt-4 w-7xl mx-auto min-h-[70vh]'>
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
          {jobs.length>0 && selectedJob?.id && <JobListDetail jobDetailId={selectedJob.id} isApplying={isApplying} isSaved={isSaved} />}
        </div>
      </div>
    </div>
  );
}
