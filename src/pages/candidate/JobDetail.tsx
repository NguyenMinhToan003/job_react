/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import {
  Heart,
  TrendingUp,
  TargetIcon,
  AlertCircleIcon,
  MapPin,
  Facebook,
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { filterJob, getDetailJobById } from '@/apis/jobAPI';
import { JobFilterResponse } from '@/types/jobType';
import { saveJob } from '@/apis/saveJobAPI';
import { JOB_STATUS, ROLE_LIST } from '@/types/type';
import { addViewJobAPI, getViewJobByIdAPI } from '@/apis/viewJobAPI';
import JobItem from '@/components/elements/job/job-list/JobItem';
import { Alert, AlertTitle } from '@/components/ui/alert';
import BannerEmployer from '@/components/elements/company/BannerEmployer';
import JobElementDetail from '@/components/elements/job/job-list/JobElementDetail';
import Map from './Map';
import { LocationResponse } from '@/types/location';
import JobBanner from '@/components/elements/job/job-list/JobBanner';
import clsx from 'clsx';
import Footer from '@/components/elements/footer/Footer';
import { convertDateToString } from '@/utils/dateTime';
import { Label } from '@/components/ui/label';

export default function JobDetail() {
  const { id } = useParams();
  const role = localStorage.getItem('role');
  const [job, setJob] = useState<JobFilterResponse>();
  const [jobOrders, setJobOrders] = useState<JobFilterResponse[]>([]);
  const [view, setView] = useState(0);
  const navigate = useNavigate();
  const [selectLocation, setSelectLocation] = useState<LocationResponse>();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    fetchJobDetail();
    if (role === ROLE_LIST.CANDIDATE) {
      handleViewJob();
    }
  }, [id]);

  useEffect(() => {
    if (job) getJobOrther();
  }, [job]);

  const fetchJobDetail = async () => {
    try {
      const response = await getDetailJobById(Number(id));
      const countView = await getViewJobByIdAPI(Number(id));
      setJob(response);
      setView(countView);
      setSelectLocation(response.locations[0]);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Lỗi khi tải thông tin công việc');
    }
  };

  const handleViewJob = async () => {
    try {
      await addViewJobAPI(Number(id));
    } catch (error: any) {
      console.error('Error viewing job:', error);
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

  const getJobOrther = async () => {
    try {
      const ortherJobs = await filterJob({
        benefits: job?.benefits.map((b) => b.id) || [],
        skills: job?.skills.map((s) => s.id) || [],
        levels: job?.levels.map((l) => l.id) || [],
        page: 1,
        limit: 5,
      });
      setJobOrders(ortherJobs.data.filter((j: JobFilterResponse) => j.id !== job?.id));
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Lỗi khi tải việc làm tương tự');
    }
  };

  if (!job) {
    return (
      <div className='max-w-6xl mx-auto animate-pulse space-y-4'>
        <div className='h-8 bg-gray-200 rounded w-3/4' />
        <div className='h-4 bg-gray-200 rounded w-1/2' />
        <div className='h-32 bg-gray-200 rounded' />
      </div>
    );
  }

  return (
    <div className='w-full mx-auto min-h-screen'>
      <Alert className={clsx('max-w-7xl mx-auto py-2 px-4 border-none',
        job.isActive === JOB_STATUS.ACTIVE ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800',
        'flex items-center gap-2'
      )}>
        <AlertCircleIcon />
        <AlertTitle>{job.isActive === JOB_STATUS.ACTIVE ? 'Đã kiểm duyệt' : 'Chưa được kiểm duyệt'}</AlertTitle>
      </Alert>

      <div className='bg-gradient-to-r from-[#121212] to-[#53151c] text-white sticky top-0 z-[99999999]'>
        <div className='max-w-7xl mx-auto py-2 px-4 flex items-center gap-6 shadow-lg'>
          <div className='bg-white rounded-sm p-1 min-w-25 min-h-25 max-w-25 max-h-25 flex items-start justify-center'>
            <img src={job.employer.logo} className='w-full h-full rounded-sm' />
          </div>
          <div className='flex-1 space-y-2'>
            <div className='text-2xl font-bold'>{job.name}</div>
            <div
              className='flex font-semibold items-center mt-2 gap-4 text-[#fbfaff] cursor-pointer hover:underline'
              onClick={() => navigate(`/nha-tuyen-dung/${job.employer.id}`)}
            >
              {job.employer.name}
            </div>
            <Label className='text-xs font-semibold'>{view} lượt xem</Label>
            <Label className='text-xs font-semibold text-gray-300'>
              Cập nhật gần nhất : {convertDateToString(job.updatedAt)}
            </Label>
          </div>
          <div className='flex gap-4'>
            <Button
              variant={job.isApplied ? 'outline' : 'destructive'}
              className={`${job.isApplied ? 'bg-green-600 text-white border-green-700' : 'bg-red-600 hover:bg-red-700'} rounded-[2px] h-14 text-md font-bold`}
              disabled={job.isApplied}
              onClick={() => !job.isApplied && navigate(`/ung-tuyen-cong-viec/${job.id}`)}
            >
              <TargetIcon className='w-5 h-5 mr-2' />
              {job.isApplied ? 'Đã ứng tuyển' : 'Ứng tuyển ngay'}
            </Button>
            <Button
              className={`rounded-[2px] w-40 h-14 text-md font-bold ${job.isSaved ? 'bg-gray-200 text-red-500' : 'bg-white text-red-500 border-red-500 border hover:bg-gray-100'}`}
              onClick={handleSaveJob}
              disabled={job.isSaved}
            >
              <Heart className='w-5 h-5 mr-2 fill-current' />
              {job.isSaved ? 'Đã lưu' : 'Lưu công việc'}
            </Button>
            
          </div>
        </div>
      </div>
      <div className='max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 mt-5'>
        <div className='lg:col-span-2 space-y-6'>
          <JobElementDetail job={job} />
        </div>
        <div className='space-y-6'>
          {
            job.locations.length > 0 && job.locations.map((location) => (
              <Card
              key={location.id}
              className={`mb-4 p-0 border rounded-sm cursor-pointer hover:bg-gray-100 font-semibold ${
                selectLocation?.id === location.id ? 'border-[#451da1] bg-purple-50' : ''
              }`}
              onClick={() => setSelectLocation(location)}
            >
              <CardContent className="flex items-start gap-4 p-2">
                <MapPin
                  className={`min-w-5 min-h-5 ${
                    selectLocation?.id === location.id ? 'text-[#451da1]' : 'text-gray-300'
                  }`}
                />
                <div className="text-gray-700">{location.name}</div>
              </CardContent>
              </Card>
            ))
          }
          <Map 
            lat={selectLocation?.lat || 0}
            lng={selectLocation?.lng || 0}
          />
          {jobOrders.length > 0 && (
            <Card className='border-none shadow-none bg-transparent'>
              <CardHeader className='bg-white py-3'>
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
      <JobBanner/>
      <BannerEmployer />
      <Footer />
    </div>
  );
}
