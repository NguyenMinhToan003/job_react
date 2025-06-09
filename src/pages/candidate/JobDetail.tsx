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
  Heart,
  HandCoins,
  ExternalLink,
  Book,
  Building2,
  TimerIcon,
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { filterJob, getDetailJobById } from '@/apis/jobAPI';
import { Job, JobFilterResponse, JobResponse } from '@/types/jobType';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { convertDateToDiffTime } from '@/utils/dateTime';
import { saveJob } from '@/apis/saveJobAPI';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import JobList from '@/components/elements/job/job-list/JobList';

export default function JobDetail() {
  const { id } = useParams();
  const [job, setJob] = useState<JobFilterResponse>();
  const navigate = useNavigate();
  const [jobOrders, setJobOrders] = useState<JobFilterResponse[]>([]);

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
    window.scrollTo({ top: 0, behavior: 'smooth' });
    fetchJobDetail();
  }, [id]);

  const getJobOrther = async() => {
    try {
      const ortherJobs = await filterJob({
        benefits: job?.benefits.map((benefit) => benefit.id) || [],
        skills: job?.skills.map((skill) => skill.id) || [],
        levels: job?.levels.map((level) => level.id) || [],
        page: 1,
        limit: 5,
      });
      ortherJobs.data = ortherJobs.data.filter((j: JobFilterResponse) => j.id !== job?.id);
      setJobOrders(ortherJobs.data);
    }
    catch(error: any) {
      toast.error(error.response?.data?.message || 'Lỗi khi tải thông tin công việc');
    }
  }

  useEffect(() => {
    if(job) {
      getJobOrther();
    }
  }, [job]);

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
              </div>
              {
                job.isSaved === true ? (
                  <Button
                  onClick={handleSaveJob}
                  variant='outline'
                  size='sm'
                  className='text-red-500 border-red-200 hover:bg-red-50'
                >
                  <Heart size={16} className='mr-1'/>
                  Lưu
                </Button>
                )
                : <>
                  <Button>
                    Đã lưu công việc
                  </Button>
                </>
              }
            </div>
            <div className='flex items-center gap-2 text-green-600 font-semibold text-md'>
              <HandCoins size={16} />
              {job.maxSalary === job.minSalary && job.maxSalary === null ? (
                <span>Thỏa thuận</span>
              ) : (
                <span>
                  {job.minSalary} - {job.maxSalary} VND
                </span>
              )}
            </div>
            <div className='grid grid-cols-1 gap-4 mt-6'>
              <div className='flex items-center gap-2 text-sm text-gray-600 font-semibold'>
                <TimerIcon className='text-gray-500 w-5 h-5' />
                <span className='text-sm text-gray-600 font-semibold'>
                  {convertDateToDiffTime(job.createdAt)} trước
                </span>
              </div>
            <div className='flex items-center gap-2 text-sm text-gray-600 font-semibold'>
                {
                  job.typeJobs.map((typeJob) => (
                    <div key={typeJob.id} className='flex items-center gap-2'>
                      <Building2 size={16} />
                      {typeJob.name}
                    </div>
                  ))
                }
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
                <TableCell className='flex flex-wrap gap-2'>
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
          </CardHeader>

          <CardContent className='space-y-4'>


            {
              job.isApplied ? (
                <Button
                  variant='outline'
                  className=' bg-green-50 rounded-sm w-fit border-green-700 text-green-700 font-bold py-3 border-2' 
                >
                  Đã ứng tuyển
                </Button>
              ) : (
                  <Button
                    variant='outline'
                onClick={() => navigate(`/ung-tuyen-cong-viec/${job.id}`)}
                className='w-full  bg-red-100 text-red-600 font-bold py-3 border-2 border-red-600 hover:bg-red-200 transition-colors duration-200 rounded-none'>
                ỨNG TUYỂN
              </Button>
              )
              
            
            }
          </CardContent>
        </Card>

        {/* Company Info */}
        <Card>
          <CardHeader className='text-center pb-3'>
            <Avatar className='w-24 h-24 mx-auto mb-2'>
              <AvatarImage
                src={job.employer.logo}
                alt={job.employer.name}
                className='rounded-full'
              />
            </Avatar>
            <CardTitle className='text-lg'>{job.employer.name}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Job Detail Sections */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        <div className='lg:col-span-2 space-y-6'>
          <Card>
            <CardHeader>
              <CardTitle className='text-xl font-bold'>
                {job.benefits.length} Lý do để gia nhập công ty
              </CardTitle>
            </CardHeader>
            <CardContent>
           
            <ul >
              {job.benefits.map((benefit, idx) => (
                <li key={idx} >
                  {benefit.name}
                </li>
              ))}
            </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className='text-xl font-bold'>
                Mô tả công việc
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className='text-gray-700 whitespace-pre-line'
                dangerouslySetInnerHTML={{ __html: job.description }}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className='text-xl font-bold'>
                Yêu cầu công việc
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className='text-gray-700 whitespace-pre-line'
                dangerouslySetInnerHTML={{ __html: job.requirement }}
              />
            </CardContent>
          </Card>
        </div>
      </div>
      {
        jobOrders.length > 0 && <Card >
        <CardHeader >
          <CardTitle className='text-xl font-bold'>
            Việc làm tương tự
          </CardTitle>
        </CardHeader>
        <CardContent className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {
          jobOrders.length > 0 && jobOrders.map((job, index) => (
            <>
              <div onClick={() => navigate(`/cong-viec/${job.id}`)} className='cursor-pointer'>
                <JobList
                isPrev={true}
                key={index}
                job={job}
                selectedJob={{} as JobFilterResponse}
                setSelectedJob={() => {}}
              />
            </div>
            </>
          )
          )
          }
        </CardContent>
      </Card>
      }
    </div>
  );
}