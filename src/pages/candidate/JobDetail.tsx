/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import {
  MapPin,
  Clock3,
  Heart,
  Building,
  Sparkles,
  HandCoins,
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { getDetailJobById } from '@/apis/jobAPI';
import { JobResponse } from '@/types/jobType';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { convertDateToDiffTime } from '@/utils/dateTime';
import { saveJob } from '@/apis/saveJobAPI';

export default function JobDetail() {
  const { id } = useParams();
  const [job, setJob] = useState<JobResponse>();
  const navigate = useNavigate();

  const fetchJobDetail = async () => {
    try {
      const response = await getDetailJobById(Number(id));
      setJob(response);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || 'Lỗi khi tải thông tin công việc'
      );
    }
  };
  const handleSaveJob = async () => {
    try {
      await saveJob(Number(id));
      toast.success('Lưu công việc thành công!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Lỗi khi lưu công việc');
    }
  }

  useEffect(() => {
    fetchJobDetail();
  }, [id]);

  if (!job) {
    return (
      <div className='max-w-6xl mx-auto p-6'>
        <div className='animate-pulse space-y-4'>
          <div className='h-8 bg-gray-200 rounded w-3/4' />
          <div className='h-4 bg-gray-200 rounded w-1/2' />
          <div className='h-32 bg-gray-200 rounded' />
        </div>
      </div>
    );
  }

  return (
    <div className='max-w-6xl mx-auto p-6 space-y-6'>
      {/* Job Header */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        <Card className='lg:col-span-2'>
          <CardHeader className='pb-4'>
            <div className='flex justify-between items-start'>
              <div className='space-y-2'>
                <CardTitle className='text-2xl font-bold text-gray-900'>
                  {job.name}
                </CardTitle>
                <div className='flex items-center gap-2 text-gray-600'>
                  <Building size={16} />
                  <span className='font-medium'>{job.employer.name}</span>
                </div>
              </div>
              <Button
                onClick={handleSaveJob}
                variant='outline'
                size='sm'
                className='text-red-500 border-red-200 hover:bg-red-50'
              >
                <Heart size={16} className='mr-1'/>
                Lưu
              </Button>
            </div>
            <div className='flex items-center gap-2 text-green-600 font-semibold text-md'>
              <HandCoins size={16} />
              {job.maxSalary === job.minSalary && job.maxSalary === -9999 ? (
                <span>Thỏa thuận</span>
              ) : (
                <span>
                  {job.minSalary} - {job.maxSalary} VND
                </span>
              )}
            </div>
            <div className='flex flex-wrap gap-4 text-sm text-gray-600 pt-2'>
              <div className='flex items-center gap-1'>
                <MapPin size={14} />
                <span>Tại văn phòng</span>
              </div>
              <div className='flex items-center gap-1'>
                <Clock3 size={14} />
                <span>Đăng {convertDateToDiffTime(job.createdAt)}</span>
              </div>
            </div>
          </CardHeader>

          <CardContent className='space-y-4'>
            <div className='flex flex-wrap gap-2'>
              {job.skills.map((skill) => (
                <Badge
                  key={skill.id}
                  variant='secondary'
                  className='bg-blue-50 text-blue-700 hover:bg-blue-100'
                >
                  {skill.name}
                </Badge>
              ))}
            </div>

            <div className='flex items-center gap-1 text-gray-600'>
              <MapPin size={16} />
              <span className='text-sm'>{job.locations[0].name}</span>
            </div>

            <Button
              onClick={() => navigate(`/ung-tuyen-cong-viec/${job.id}`)}
              className='w-full bg-red-500 hover:bg-red-600 text-white font-medium py-3'>
              Ứng tuyển
            </Button>
          </CardContent>
        </Card>

        {/* Company Info */}
        <Card>
          <CardHeader className='text-center pb-3'>
            <div className='w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-3 overflow-hidden'>
              <Avatar>
                <AvatarImage
                  src={job.employer.logo || 'https://via.placeholder.com/150'}
                  alt={job.employer.name}
                  className='rounded-full'
                />
              </Avatar>
            </div>
            <CardTitle className='text-lg'>{job.employer.name}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Job Detail Sections */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        <div className='lg:col-span-2 space-y-6'>
          <Card>
            <CardHeader>
              <CardTitle className='text-lg font-semibold'>
                3 Lý do để gia nhập công ty
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className='space-y-2'>
                {job.benefits.map((benefit) => (
                  <li key={benefit.id} className='flex items-start gap-2'>
                    <Sparkles size={16} className='text-red-500 mt-1' />
                    <span className='text-gray-700'>{benefit.name}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className='text-lg font-semibold'>
                Mô tả công việc
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className='list-disc pl-5 space-y-2'>
                {job.description.split('\n').map((desc, index) => (
                  <li key={index} className='text-gray-700'>
                    {desc}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className='text-lg font-semibold'>
                Yêu cầu công việc
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className='list-disc pl-5 space-y-2'>
                {
                  job.requirement.split('\n').map((req, index) => (
                  <li key={index} className='text-gray-700'>
                    {req}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}