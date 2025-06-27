/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { getDetailJobById } from '@/apis/jobAPI';
import { saveJob } from '@/apis/saveJobAPI';

import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { JobFilterResponse } from '@/types/jobType';
import {
  HandCoins,
  Building2,
  Heart,
  Clock,
  Target,
  CheckCircle
} from 'lucide-react';
import { dayRemaning } from '@/utils/dateTime';
import { convertPrice } from '@/utils/convertPrice';
import { ScrollArea } from '@/components/ui/scroll-area';
import JobElementDetail from './JobElementDetail';

export default function JobListDetail({ jobDetailId }: { jobDetailId: number }) {
  const navigate = useNavigate();
  const [job, setJob] = useState<JobFilterResponse>();
  const [loading, setLoading] = useState(false);

  const fetchJob = async () => {
    try {
      setLoading(true);
      const res = await getDetailJobById(+jobDetailId);
      setJob(res);
    } catch (error) {
      console.error('Error fetching job details:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (jobDetailId) {
      fetchJob();
    }
  }, [jobDetailId]);

  const handleSaveJob = async (jobId: number) => {
    try {
      await saveJob(jobId);
      toast.success('Lưu công việc thành công!');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Lỗi khi lưu công việc');
    }
  };

  if (loading || !job) {
    return (
      <div className=''>
        <Card className=' rounded-md overflow-hidden h-[400px]'>
          <CardContent className='p-6 space-y-6'>
            <Skeleton className='h-8 w-full' />
            <Skeleton className='h-4 w-full' />
            <Skeleton className='h-4 w-full' />
            <Skeleton className='h-4 w-full' />
          </CardContent>
        </Card>
      </div>
    );
  }


  return (
      <Card className='h-[90vh] w-full shadow-2xl rounded-md '>
        <CardContent className='p-4 space-y-4 overflow-hidden' >
          <div className=' space-y-4'>
            <div className='flex items-center gap-3'>
              <Avatar className='w-25 h-25 shadow-xl border border-gray-400 rounded-sm'>
                <AvatarImage src={job.employer.logo} />
              </Avatar>
              <div className='flex flex-col gap-2'>
                <div className='text-2xl font-bold text-[#000209'>
                  <NavLink
                    to={`/cong-viec/${job.id}`}
                    className='hover:underline cursor-pointer'
                  >
                    {job.name}
                  </NavLink>
                </div>
                <span
                  onClick={() => navigate(`/nha-tuyen-dung/${job.employer.id}`)}
                  className='text-sm font-semibold text-[#000209 cursor-pointer hover:underline flex items-center gap-1'
                >
                  <Building2 size={14} />
                  {job.employer.name}
                </span>
                <div className='flex items-center gap-2 text-green-600 font-bold text-xl'>
                  <HandCoins size={16} />
                  <span>{convertPrice(job.minSalary,job.maxSalary)}</span>
                </div>
              </div>
            </div>

            {/* Status badges */}
            <div className='flex items-center gap-2 flex-wrap'>
              {job.isApplied && (
                <Badge className='bg-green-100 text-green-700 border-green-300'>
                  <CheckCircle size={12} className='mr-1' />
                  Đã ứng tuyển
                </Badge>
              )}
              {job.isSaved && (
                <Badge className='bg-red-100 text-red-700 border-red-300'>
                  <Heart size={12} className='mr-1' />
                  Đã lưu
                </Badge>
              )}
              {dayRemaning(job.expiredAt) <= 7 && dayRemaning(job.expiredAt) > 0 && (
                <Badge className='bg-orange-100 text-orange-700 border-orange-300'>
                  <Clock size={12} className='mr-1' />
                  Còn {dayRemaning(job.expiredAt)} ngày
                </Badge>
              )}

            </div>
          </div>

          <div className='flex items-center gap-2'>
            {job.isApplied ? (
              <Button className='bg-orange-100 text-green-700 font-bold flex-1 cursor-pointer rounded-none h-[45px]'
                variant={'outline'}
              >
                <CheckCircle className='w-4 h-4 mr-2' />
                Bạn đã ứng tuyển  
              </Button>
            ) : (
              <Button
                className='bg-red-600 hover:bg-red-600 text-white font-bold flex-1 cursor-pointer rounded-none h-[45px]'
                onClick={() => navigate(`/ung-tuyen-cong-viec/${job.id}`)}
                disabled={loading}
              >
                <Target className='w-4 h-4 mr-2' />
                Ứng tuyển
              </Button>
            )}

            {job.isSaved ? (
              <Button
                className='font-bold cursor-pointer rounded-none h-[45px] text-red-500 bg-red-50 hover:bg-red-100 hover:text-red-600'
                variant={'outline'}
              >
                <Heart className='w-4 h-4 mr-2 fill-current' /> Đã lưu
              </Button>
            ) : (
                <Button
                  className='font-bold cursor-pointer rounded-none h-[45px]'
                  variant={'outline'}
                  onClick={() => handleSaveJob(job.id)}
                >
                  <Heart className='w-4 h-4 mr-2' />
                  Lưu công việc
                </Button>
            )}
          </div>

          <ScrollArea className='space-y-4 h-[60vh] overflow-y-auto'>
            
            <JobElementDetail job={job} />
              <Button
                variant='outline'
                className='w-full text-gray-700 hover:text-gray-900 hover:bg-gray-50 flex items-center justify-center gap-2 h-12 rounded-xl border-2 border-gray-200 font-medium'
                onClick={() => navigate(`/nha-tuyen-dung/${job.employer.id}`)}
              >
                <Building2 size={16} />
                Xem thêm việc làm từ {job.employer.name}
              </Button>

          </ScrollArea>
        </CardContent>
      </Card>
  );
}