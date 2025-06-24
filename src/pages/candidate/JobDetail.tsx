/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import {
  MapPin,
  Heart,
  ExternalLink,
  Book,
  Building2,
  TimerIcon,
  Users,
  Clock,
  GraduationCap,
  Trophy,
  Briefcase,
  Star,
  CheckCircle,
  TrendingUp,
  Zap,
  TargetIcon,
  CircleDollarSignIcon,
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { filterJob, getDetailJobById } from '@/apis/jobAPI';
import { JobFilterResponse } from '@/types/jobType';
import { convertDateToDiffTime, convertDateToString, dayRemaning } from '@/utils/dateTime';
import { saveJob } from '@/apis/saveJobAPI';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { ROLE_LIST } from '@/types/type';
import { addViewJobAPI, getViewJobByIdAPI } from '@/apis/viewJobAPI';
import JobItem from '@/components/elements/job/job-list/JobItem';
import { convertPrice } from '@/utils/convertPrice';

export default function JobDetail() {
  const { id } = useParams();
  const role = localStorage.getItem('role');
  const [job, setJob] = useState<JobFilterResponse>();
  const navigate = useNavigate();
  const [jobOrders, setJobOrders] = useState<JobFilterResponse[]>([]);
  const [view , setView] = useState(0);

  const fetchJobDetail = async () => {
    try {
      const response = await getDetailJobById(Number(id));
      const countView = await getViewJobByIdAPI(Number(id));
      setJob(response);
      setView(countView);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Lỗi khi tải thông tin công việc');
    }
  };

  const handleSaveJob = async () => {
    try {
      await saveJob(Number(id));
      toast.success('Lưu công việc thành công!');
      fetchJobDetail();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Lỗi khi lưu công việc');
    }
  };

  const handleViewJob = async () => {
    try {
      await addViewJobAPI(Number(id));
    } catch (error: any) {
      console.log('Error viewing job:', error);
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    fetchJobDetail();
    if (role === ROLE_LIST.CANDIDATE) {
      handleViewJob();
    }
  }, [id]);

  const getJobOrther = async () => {
    try {
      const ortherJobs = await filterJob({
        benefits: job?.benefits.map((benefit) => benefit.id) || [],
        skills: job?.skills.map((skill) => skill.id) || [],
        levels: job?.levels.map((level) => level.id) || [],
        page: 1,
        limit: 4,
      });
      ortherJobs.data = ortherJobs.data.filter((j: JobFilterResponse) => j.id !== job?.id);
      setJobOrders(ortherJobs.data);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Lỗi khi tải thông tin công việc');
    }
  };

  useEffect(() => {
    if (job) {
      getJobOrther();
    }
  }, [job]);

  const filterMajor = (majorId: number) => {
    navigate(`/tim-kiem-cong-viec?majorId=${majorId}`);
  }

  if (!job) {
    return (
      <div className='max-w-6xl mx-auto'>
        <div className='animate-pulse space-y-4'>
          <div className='h-8 bg-gray-200 rounded w-3/4' />
          <div className='h-4 bg-gray-200 rounded w-1/2' />
          <div className='h-32 bg-gray-200 rounded' />
        </div>
      </div>
    );
  }

  return (
    <div className='w-full mx-auto  min-h-screen'>
      <div className='bg-gradient-to-r from-[#121212] to-[#53151c] text-white sticky top-0 z-[99999999]'>
        <div className='max-w-7xl mx-auto py-2 px-4 flex items-center gap-6 shadow-lg'>
          <div className='bg-white rounded-md p-1 min-w-25 min-h-25 max-w-25 max-h-25 flex items-start justify-center'>
            <img src={job.employer.logo}  className='w-full h-full' />
          </div>
          <div className='flex-1'>
            <div className='text-2xl font-bold'>{job.name}</div>
            <div
              className='flex font-semibold items-center mt-2 gap-4 text-[#fbfaff] cursor-pointer hover:underline'
              onClick={() => navigate(`/nha-tuyen-dung/${job.employer.id}`)}
            >
              {job.employer.name}
            </div>
            <div className='text-xs font-semibold'>
              {view} lượt xem
            </div>
          </div>
          <div className='flex gap-4'>
            <Button
              variant='destructive'
              className='bg-red-600 hover:bg-red-700 rounded-[2px]  h-14 text-md font-bold'
              onClick={() => navigate(`/ung-tuyen-cong-viec/${job.id}`)}
            >
              <TargetIcon className='w-5 h-5 mr-2' />
              Ứng tuyển ngay
            </Button>
            {
              !job.isSaved ? <>
                <Button className='bg-white hover:bg-gray-100 rounded-[2px] w-40 h-14 text-md font-bold border-red-500 border text-red-500'
                onClick={handleSaveJob}
                disabled={job.isSaved}
             >
              <Heart className='w-5 h-5 mr-2' />
                  Lưu công việc
            </Button>
              </>
                : 
                <>
                  <Button className='bg-gray-200 hover:bg-gray-100 rounded-[2px] w-40 h-14 text-md font-bold border-red-500 border text-red-500'
                  >
                    <Heart className='w-5 h-5 mr-2' />
                    Đã lưu
                  </Button>
                </>
            }
          </div>
        </div>
      </div>
      <div className='max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 mt-5'>
        <div className='lg:col-span-2 space-y-6'>
          <Card className='p-6 bg-white shadow-sm border border-gray-200'>
            <CardHeader className='border-b'>
              <CardTitle className='text-lg font-semibold text-[#000209] flex items-center gap-2'>
                <Building2 className='w-5 h-5 text-blue-600' />
                Chi tiết tuyển dụng
              </CardTitle>
            </CardHeader>

            <CardContent>
            {/* Job Details */}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-1 mt-6'>
                <div className='flex items-start gap-3 p-3 bg-[#f5f3ff] '>
                  <CircleDollarSignIcon className='w-5 h-5 text-green-600 mt-0.5' />
                  <div>
                    <div className='text-sm font-medium text-[#857876]'>Mức lương</div>
                    <div className='text-[#000209] font-semibold'>
                      {convertPrice(job.minSalary, job.maxSalary)}
                    </div>
                  </div>
                </div>
                <div className='flex items-start gap-3 p-3 bg-[#f5f3ff] '>
                <Users className='w-5 h-5 text-[#9277f2] mt-0.5' />
                <div>
                  <div className='text-sm font-medium text-[#857876]'>Số lượng</div>
                  <div className='text-[#000209] font-semibold'>{job.quantity} người</div>
                </div>
              </div>
              <div className='flex items-start gap-3 p-3 bg-[#f5f3ff] '>
                <TimerIcon className='w-5 h-5 text-blue-600 mt-0.5' />
                <div>
                  <div className='text-sm font-medium text-[#857876]'>Đăng tuyển</div>
                  <div className='text-[#000209] font-semibold'>{convertDateToDiffTime(job.createdAt)} trước</div>
                </div>
              </div>
              <div className='flex items-start gap-3 p-3 bg-[#f5f3ff] '>
                <Clock className={`w-5 h-5 mt-0.5 ${dayRemaning(job.expiredAt) <= 7 ? 'text-red-600' : 'text-gray-600'}`} />
                <div>
                  <div className='text-sm font-medium text-[#857876]'>Hạn nộp</div>
                  <div className={`text-[#000209] font-semibold ${dayRemaning(job.expiredAt) <= 7 ? 'font-bold text-red-600' : ''}`}>
                    {convertDateToString(job.expiredAt)}
                  </div>
                </div>
              </div>
              <div className='flex items-start gap-3 p-3 bg-[#f5f3ff] '>
                <Briefcase className='w-5 h-5 text-purple-600 mt-0.5' />
                <div>
                  <div className='text-sm font-medium text-[#857876]'>Loại công việc</div>
                  <div className='text-[#000209] font-semibold'>{job.typeJobs.map((typeJob) => typeJob.name).join(', ')}</div>
                </div>
              </div>
              
              <div className='flex items-start gap-3 p-3 bg-[#f5f3ff] '>
                <Book className='w-5 h-5 text-green-600 mt-0.5' />
                <div>
                  <div className='text-sm font-medium text-[#857876]'>Kinh nghiệm</div>
                  <div className='text-[#000209] font-semibold'>{job.experience.name}</div>
                </div>
              </div>
              {job.education && (
                <div className='flex items-start gap-3 p-3 bg-[#f5f3ff] '>
                  <GraduationCap className='w-5 h-5 text-indigo-600 mt-0.5' />
                  <div>
                    <div className='text-sm font-medium text-[#857876]'>Học vấn</div>
                    <div className='text-[#000209] font-semibold'>{job.education.name}</div>
                  </div>
                </div>
                )}
                {
                  job.majors.length > 0 && (
                    <div className='flex items-start gap-3 p-3 bg-[#f5f3ff] '>
                      <Star className='w-5 h-5 text-yellow-600 mt-0.5' />
                      <div>
                        <div className='text-sm font-medium text-[#857876]'>Ngành nghề</div>
                        <div className='text-[#000209] font-semibold'>
                          {job.majors[0].field.name}
                        </div>
                      </div>
                    </div>
                  )
                }
            </div>

            {/* Locations */}
            <Card className='mt-6'>
              <h2 className='text-lg text-[#000209] font-semibold mb-4 flex items-center gap-2'>
                <MapPin className='w-5 h-5 text-red-600' />
                Địa điểm làm việc
              </h2>
              <div className='space-y-2'>
                {job.locations.map((location) => (
                  <div
                    key={location.id}
                    className='flex items-center justify-between p-3 bg-blue-50 '
                  >
                    <div className='flex items-center gap-2 text-sm text-[#000209] font-semibold'>
                      <MapPin size={14} className='text-blue-600' />
                      {location.name}
                    </div>
                    {location.lat && location.lng && (
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => navigate(`/map/${location.lat}/${location.lng}`)}
                      >
                        <ExternalLink className='w-4 h-4 text-blue-600' />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </Card>

            {/* Skills and Fields */}
            <div className='mt-6'>
              <h2 className='text-lg  text-[#000209] font-semibold mb-4 flex items-center gap-2'>
                <Trophy className='w-5 h-5 text-yellow-600' />
                Yêu cầu kỹ năng và ngành nghề
              </h2>
              <Table border={0} className='bg-white  border border-gray-200'>
                <TableBody className='divide-y-0 divide-gray-200 '>
                  <TableRow>
                    <TableCell className='font-semibold text-[#857876] w-1/3'>
                      Kỹ năng yêu cầu
                    </TableCell>
                    <TableCell>
                      <div className='flex flex-wrap gap-2'>
                        {job.skills.map((skill) => (
                          <Badge
                            key={skill.id}
                            variant='secondary'
                            className='font-semibold px-3 py-1'
                          >
                            <Zap size={12} className='mr-1 text-orange-500' />
                            {skill.name}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                  </TableRow>
                  {job.majors.length> 0 && (
                    <TableRow>
                      <TableCell className='font-semibold text-[#857876]'>Chuyên ngành</TableCell>
                      <TableCell className='flex flex-wrap gap-2'>
                        {
                            job.majors.map((major, index) => (
                              <div className=' text-[#2b7fdc] font-bold hover:underline cursor-pointer flex items-center gap-2'>
                                <div
                                  key={major.id}
                                  onClick={() => filterMajor(major.id)}
                                >{major.name}{' '}</div>
                                {
                                  index < job.majors.length - 1
                                    ? <div>/</div>
                                    : ''
                                }
                              </div>
                            ))
                        }
                      </TableCell>
                    </TableRow>
                  )}
                  {job.levels.length > 0 && (
                    <TableRow>
                      <TableCell className='font-semibold text-[#857876]'>Cấp bậc</TableCell>
                      <TableCell>
                        <div className='flex flex-wrap gap-2'>
                          {job.levels.map((level) => (
                            <Badge
                              key={level.id}
                              className='font-semibold bg-[#451da1] text-white px-3 py-1'
                            >
                              <Star size={12} className='mr-1' />
                              {level.name}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                  {job.languageJobs.length > 0 && (
                    <TableRow>
                      <TableCell className='font-semibold text-[#857876]'>Ngôn ngữ</TableCell>
                      <TableCell>
                        <div className='flex flex-wrap gap-2'>
                          {job.languageJobs.map((lang) => (
                            <Badge
                              variant='secondary'
                              key={lang.id}
                              className='px-3 py-1 '
                            >
                              {lang.language?.name} - {lang.level}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            </CardContent>
          </Card>

          {/* Benefits */}
          <Card className='p-6 bg-white shadow-sm border border-gray-200'>
            <h2 className='text-lg text-[#000209] font-semibold mb-4 flex items-center gap-2'>
              <Trophy className='w-5 h-5 text-yellow-600' />
              {job.benefits.length} Lý do gia nhập
            </h2>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {job.benefits.map((benefit) => (
                <div
                  key={benefit.id}
                  className='flex items-start gap-3 p-3 bg-green-50 '
                >
                  <CheckCircle className='w-5 h-5 text-green-600 mt-0.5' />
                  <span className='text-[#000209] font-semibold'>{benefit.name}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Job Description */}
          <Card className='p-6 bg-white shadow-sm border border-gray-200'>
            <h2 className='text-lg font-semibold text-[#000209]  mb-4 flex items-center gap-2'>
              <Book className='w-5 h-5 text-blue-600' />
              Mô tả công việc
            </h2>
            <div
              className='text-[#857876] prose prose-sm max-w-none'
              dangerouslySetInnerHTML={{ __html: job.description }}
            />
          </Card>

          {/* Job Requirements */}
          <Card className='p-6 bg-white shadow-sm border border-gray-200'>
            <h2 className='text-lg  text-[#000209] font-semibold mb-4 flex items-center gap-2'>
              <CheckCircle className='w-5 h-5 text-orange-600' />
              Yêu cầu công việc
            </h2>
            <div
              className='text-[#857876] prose prose-sm max-w-none'
              dangerouslySetInnerHTML={{ __html: job.requirement }}
            />
          </Card>
        </div>

        {/* Company Info Sidebar */}
        <div className='space-y-6'>
        {jobOrders.length > 0 && (
        <Card className='border-none shadow-none bg-transparent'>
          <CardHeader className='bg-white border-b'>
              <CardTitle className='text-lg font-semibold text-[#000209] flex gap-3 items-center'>
                <TrendingUp className='w-5 h-5 text-purple-600' />
                {jobOrders.length} Việc làm tương tự
              </CardTitle>
          </CardHeader>
          <CardContent className='flex flex-col gap-4 p-0'>
            {jobOrders.map((jobOrder) => (
              <div
                key={jobOrder.id}
                onClick={() => navigate(`/cong-viec/${jobOrder.id}`)}
                className='cursor-pointer'
              >
                <JobItem
                  isPrev={true}
                  job={jobOrder}
                  selectedJob={{} as JobFilterResponse}
                  setSelectedJob={() => {}}
                />
              </div>
            ))}
          </CardContent>
        </Card>
      )}

        </div>
      </div>
    </div>
  );
}