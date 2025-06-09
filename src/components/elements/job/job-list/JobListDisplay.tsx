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
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';

import { JobFilterResponse } from '@/types/jobType';
import {
  HandCoins,
  MapPin,
  Book,
  Building2,
  ExternalLink,
  Heart,
} from 'lucide-react';

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
        <div className='flex-1 space-y-4'>
          <div className='flex items-center gap-3'>
            <Avatar className='w-25 h-25 shadow-xl border border-gray-400 rounded-sm'>
              <AvatarImage src={job.employer.logo} />
            </Avatar>
            <div className='flex flex-col gap-2'>
              <div className='text-2xl font-bold text-gray-700'>
                <NavLink
                  to={`/cong-viec/${job.id}`}
                  className='hover:underline cursor-pointer'
                >
                  {job.name}
                </NavLink>
              </div>
              <span
                onClick={() => navigate(`/nha-tuyen-dung/${job.employer.id}`)}
                className='text-sm font-semibold text-gray-700 cursor-pointer hover:underline'
              >
                {job.employer.name}
              </span>
              <div className='flex items-center gap-2 text-green-600 font-bold text-xl'>
                <HandCoins size={16} />
                {job.maxSalary === job.minSalary && job.maxSalary === null ? (
                  <span>Thỏa thuận</span>
                ) : (
                  <span>
                    {job.minSalary} - {job.maxSalary} VND
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className='flex items-center gap-2'>
          {job.isApplied ? (
            <Button className='bg-orange-100 text-green-700 font-bold flex-1 cursor-pointer rounded-none h-[45px]'
              variant={'outline'}
            >
              Bạn đã ứng tuyển  
            </Button>
          ) : (
            <Button
              className='bg-[#ed1b2f] hover:bg-red-600 text-white font-bold flex-1 cursor-pointer rounded-none h-[45px]'
              onClick={() => navigate(`/ung-tuyen-cong-viec/${job.id}`)}
              disabled={loading}
            >
              Ứng tuyển
            </Button>
          )}

          {job.isSaved ? (
            <Button
              className='font-bold  cursor-pointer rounded-none h-[45px] text-red-500 bg-red-50 hover:bg-red-100 hover:text-red-600'
              variant={'outline'}
            >
              <Heart className='w-4 h-4 mr-2' /> Đã lưu
            </Button>
          ) : (
              <Button
                className='font-bold  cursor-pointer rounded-none h-[45px]'
                variant={'outline'}
                onClick={() => handleSaveJob(job.id)}
              >
                <Heart className='w-4 h-4 mr-2' />
                Lưu công việc
              </Button>
          )}
        </div>

        <div className='space-y-4 h-[50vh] overflow-y-auto'>
          <div className='text-lg font-bold text-gray-800 uppercase'>
            Thông tin
          </div>

          <div className='grid grid-cols-1 gap-4 mt-6'>
            <div className='flex items-center gap-2 text-sm text-gray-600 font-semibold'>
              <Building2 size={16} />
              {job.typeJobs.map((type) => type.name).join(', ')}
            </div>

            {job.locations.map((location) => (
              <div
                key={location.id}
                className='flex items-center gap-2 text-sm text-gray-600 font-semibold'
              >
                <MapPin size={16} />
                {location.name}
                <ExternalLink
                  className='w-4 h-4 text-blue-600'
                  onClick={() =>
                    navigate(`/map/${location.lat}/${location.lng}`)
                  }
                />
              </div>
            ))}

            <div className='flex items-center gap-2 text-sm text-gray-600 font-semibold'>
              <Book size={16} />
              {job.experience.name} kinh nghiệm làm việc
            </div>
          </div>

          <Table className='bg-transparent'>
            <TableBody>
              <TableRow className='border-none bg-transparent'>
                <TableCell className='font-semibold text-gray-700'>
                  Kỹ năng:
                </TableCell>
                <TableCell>
                  <div className='flex flex-wrap gap-2'>
                    {job.skills.map((skill, index) => (
                      <Badge
                        key={index}
                        variant='outline'
                        className='text-sm px-3 py-1 rounded-full border border-gray-300 text-gray-600 bg-gray-100 hover:border-black transition-colors duration-200 font-semibold cursor-pointer'
                      >
                        {skill.name}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
              </TableRow>

              <TableRow className='border-none bg-transparent'>
                <TableCell className='font-semibold text-gray-700'>
                  Chuyên môn:
                </TableCell>
                <TableCell>
                  {job.fields.map((field, index) => (
                    field?.majors?.map((major, majorIndex) => (
                      <Badge
                        key={`${index}-${majorIndex}`}
                        variant='outline'
                        className='text-sm px-3 py-1 rounded-full border border-gray-300 text-gray-600 bg-gray-100 hover:border-black transition-colors duration-200 font-semibold cursor-pointer'
                      >
                        {major.name}
                      </Badge>
                    ))
                  ))}
                </TableCell>
              </TableRow>

              <TableRow className='border-none bg-transparent'>
                <TableCell className='font-semibold text-gray-700'>
                  Lĩnh vực:
                </TableCell>
                <TableCell>
                  {job.fields.map((field, index) => (
                    <Badge
                      key={index}
                      variant='outline'
                      className='text-sm px-3 py-1 rounded-full border border-gray-300 text-gray-600 bg-gray-100 hover:border-black transition-colors duration-200 font-semibold cursor-pointer'
                    >
                      {field.name}
                    </Badge>
                  ))}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <div className='space-y-2 text-sm text-gray-700 leading-relaxed'>
            <p className='font-bold text-lg text-black'>Mô tả công việc:</p>
            <div
                className='font-semibold text-gray-800'
                dangerouslySetInnerHTML={{ __html: job.description }}
              />
          </div>

          <div className='space-y-2 text-sm text-gray-700 leading-relaxed'>
            <p className='font-bold text-lg text-black'>Yêu cầu công việc:</p>
            <div
              className='font-semibold text-gray-800'
              dangerouslySetInnerHTML={{ __html: job.requirement }}
            />
          </div>
          <div>
          <p className='font-bold text-lg text-black'>Quyền lợi:</p>
          <ul className='list-disc list-inside text-sm text-gray-700 mt-2 space-y-1 font-semibold'>
            {job.benefits.map((benefit, idx) => (
              <li key={idx} className='marker:text-[#ed1b2f]'>
                {benefit.name}
              </li>
            ))}
          </ul>
          </div>
          <div className='flex justify-end mt-4'>
          <Button
            variant='outline'
            className='text-gray-600 hover:text-gray-800'
            onClick={() => navigate(`/nha-tuyen-dung/${job.employer.id}`)}
          >
            Xem thêm việc làm của nhà tuyển dụng
          </Button>
        </div>
        </div>
      </CardContent>
    </Card>
  );
}
