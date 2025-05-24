/* eslint-disable react-hooks/exhaustive-deps */
import { getDetailJobById } from '@/apis/jobAPI';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Line } from '@/components/ui/line';
import { Skeleton } from '@/components/ui/skeleton';

import { JobResponse } from '@/types/jobType';
import { HandCoins, MapPin, Book, Building2, ExternalLink, Heart } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function JobListDetail({ jobDetailId }: { jobDetailId: number }) {
  const navigate = useNavigate();
  const [job, setJob] = useState<JobResponse>();
  const [loading, setLoading] = useState(false);
  const fetchJob = async () => {
    try {
      setLoading(true);
      const res = await getDetailJobById(+jobDetailId);
      setJob(res);
    } catch (error) {
      console.error('Error fetching job details:', error);
    }
    finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if(jobDetailId) {
      fetchJob();
    }
  }, [jobDetailId]);
  
  if (loading || !job) {
    return (
      <Card className='bg-white border border-gray-200 shadow-sm rounded-md overflow-hidden h-[400px]'>
        <CardContent className='p-6 space-y-6'>
          <Skeleton className='h-8 w-full' />
          <Skeleton className='h-4 w-full' />
          <Skeleton className='h-4 w-full' />
          <Skeleton className='h-4 w-full' />
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className='overflow-hidden'>
      <CardContent className='p-6 space-y-6'>
        <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
          <div className='flex-1 space-y-2'>
            <div className='flex items-center gap-2 text-xl font-bold text-gray-800'>
              {job.name}
            </div>
            <div className='flex items-center gap-3'>
              <img
                src={job.employer.logo}
                alt={job.employer.name}
                className='w-10 h-10 rounded-md object-cover'
              />
              <span className='text-sm font-semibold text-gray-700'>{job.employer.name}</span>
              <ExternalLink className='w-4 h-4 text-blue-600'
                onClick={() => navigate(`/nha-tuyen-dung/${job.employer.id}`)} />
            </div>
            <div className='flex items-center gap-2 text-green-600 font-semibold text-sm'>
              <HandCoins size={16} />
              {job.maxSalary === job.minSalary && job.maxSalary === -9999 ? (
                <span>Thỏa thuận</span>
              ) : (
                <span>
                  {job.minSalary} - {job.maxSalary} VND
                </span>
              )}
            </div>
          </div>

          {/* Apply + Heart */}
          <div className='flex items-center gap-2'>
            <Button className='bg-[#ed1b2f] hover:bg-red-600 text-white font-bold px-6 cursor-pointer'
              onClick={()=>navigate(`/ung-tuyen-cong-viec/${job.id}`)}>
              Ứng tuyển
            </Button>
            <Heart className='text-red-500 cursor-pointer' size={24} />
          </div>
        </div>

        <Line className='my-4' variant='secondary' />

        <div className='space-y-4 h-[50vh] overflow-y-auto'>
          <div className='text-lg font-bold text-gray-800 uppercase'>Thông tin</div>

        <div className='grid grid-cols-1  gap-4 mt-6'>
          <div className='flex items-center gap-2 text-sm text-gray-600 font-semibold'>
            <Building2 size={16} />
            {job.typeJobs.map((type) => type.name).join(', ')}
          </div>
            {
            job.locations.map((location) => (
              <div key={location.id} className='flex items-center gap-2 text-sm text-gray-600 font-semibold'>
                <MapPin size={16} />
                {location.name}
                <ExternalLink className='w-4 h-4 text-blue-600'
                  onClick={() => navigate(`/map/${location.lat}/${location.lng}`)}
                />
              </div>
            ))
          }
          <div className='flex items-center gap-2 text-sm text-gray-600 font-semibold'>
            <Book size={16} />
            {job.experience.name} kinh nghiệm làm việc
          </div>
        </div>

        {/* Skills */}
        <div className='mt-4 flex flex-wrap gap-2'>
          {job.skills.map((skill, idx) => (
            <Badge
              key={idx}
              variant='outline'
              className='text-xs font-medium px-2 py-1 rounded-full border'
            >
              {skill.name}
            </Badge>
          ))}
          </div>
          <Line className='my-4' variant={'secondary'}/>
          <div className='space-y-2 text-sm text-gray-700'>
            <p className='font-semibold text-xl'>Mô tả công việc:</p>
            <ul className='list-disc list-inside space-y-1'>
              {
                job.description.split('\n').map((line, index) => (
                  <li key={index}>{line}</li>
                ))
              }
            </ul>
          </div>

          <div className='space-y-2 text-sm text-gray-700'>
            <p className='font-semibold'>Yêu cầu công việc:</p>
            <ul className='list-disc list-inside space-y-1 font-semibold'>
              {
                job.requirement.split('\n').map((line, index) => (
                  <li key={index}>{line}</li>
                ))
              }
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
