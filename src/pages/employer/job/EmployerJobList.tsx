/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { getJobByCompanyId, toggleJobStatus } from '@/apis/jobAPI';
import { CompanyFilterJob, JobDetailResponse } from '@/types/jobType';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { JOB_STATUS } from '@/types/type';
import { Label } from '@/components/ui/label';
import JobMenu from '@/components/elements/job/MenuMore';
import { convertDateToString } from '@/utils/dateTime';
import FormPublish from '@/components/elements/job/FormPublich';
import { getViewJobByIdAPI } from '@/apis/viewJobAPI';

export default function EmployerJobList() {
  
  const [jobList, setJobList] = useState<JobDetailResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [isChange, setIsChange] = useState(false);
  const [viewCounts, setViewCounts] = useState<Record<number, number>>({});
  const navigate = useNavigate();


  const fetchJobList = async () => {
    try {
      const response = await getJobByCompanyId({
        isActive: [
          JOB_STATUS.ACTIVE,
          JOB_STATUS.CREATE,
          JOB_STATUS.PENDING,
          JOB_STATUS.BLOCK
        ],
        isExpired: 0,
      } as CompanyFilterJob);
      setJobList(response);
      const newCounts: Record<number, number> = {};
      for (const job of response) {
        const res = await getViewJobByIdAPI(job.id);
        newCounts[job.id] = res || 0;
      }
      setViewCounts(newCounts);
    } catch (error) {
      toast.error(
        (error as any).response?.data?.message || 'Có lỗi xảy ra khi tải danh sách công việc'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobList();
  }, []);
  useEffect(() => {
    if (isChange) {
      fetchJobList();
      setIsChange(false);
    }
  }, [isChange, setIsChange]);

  const handleToggleJobStatus = async (jobId: number, isShow: number) => {
    try {
      
      await toggleJobStatus(jobId);
      setJobList((prevJobList) =>
        prevJobList.map((job) =>
          job.id === jobId ? { ...job, isShow: isShow === 1 ? 0 : 1 } : job
        )
      );
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
    }
  };


  const buttonAction = (job: JobDetailResponse) => {
 if (job.isActive === JOB_STATUS.BLOCK) {
      return (
        <Button
          className='text-red-500 hover:text-red-500 bg-red-50 hover:bg-red-50 rounded-none w-24'
        >
          Bị khóa
        </Button>
      );
    }
 else return <FormPublish
   job={job}
  setIsChange={setIsChange}
 />
  }

  const switchPublicJob = (jobId: number, isShow: number, status: JOB_STATUS) => {
    switch (status) {
      case JOB_STATUS.ACTIVE:
        return <>
          <Switch
            disabled={status !== JOB_STATUS.ACTIVE ? true : false}
            checked={
              status !== JOB_STATUS.ACTIVE ? false:
              isShow === 1 ? true : false
            }
            className='text-red-400'
            onClick={() => handleToggleJobStatus(jobId, isShow)}
          />
          <Label className='text-xs text-[#2C95FF] flex justify-center w-full'>
            {isShow === 1 ? 'Hiển thị' : 'Ẩn'}
          </Label>
        </>
      case JOB_STATUS.CREATE :
        return (
          <Label className='text-xs text-gray-400 flex justify-center w
          full'>
            Chưa xuất bản
          </Label>
        );
      case JOB_STATUS.PENDING:
        return (
          <>
          <Switch
            checked={
              status !== JOB_STATUS.PENDING ? false:
              isShow === 1 ? true : false
            }
            className='text-red-400'
            onClick={() => handleToggleJobStatus(jobId, isShow)}
          />
          <Label className='text-xs text-gray-400 flex justify-center w-full'>
            Đang duyệt
          </Label>
        </>
        );
      case JOB_STATUS.BLOCK:
        return (
          <Label className='text-xs text-orange-500 flex justify-center w-full'>
            Bị từ chối
          </Label>
        );
    }
  }



  return (
    <Card className='w-full mt-4 mr-4 h-fit shadow-none border border-gray-200 rounded-xl'>
      <CardContent className='overflow-x-auto'>
        {loading ? (
          <p className='text-center text-gray-600 py-12'>Đang tải dữ liệu...</p>
        ) : jobList.length === 0 ? (
          <p className='text-center text-gray-600 py-12'>
            Chưa có công việc nào được đăng tuyển.
          </p>
        ) : (
          <Table className=' text-sm'>
            <TableHeader>
                  <TableRow className='col-span-full flex'
                    onClick={() => fetchJobList()}
                  >
                    <Button>
                      Làm mới
                    </Button>
                  </TableRow>
                    
              <TableRow >
                <TableHead className='text-gray-700 text-xs text-left pl-3'>Mã</TableHead>
                <TableHead className='text-gray-700 text-xs text-left '>Tên công việc</TableHead>
                    <TableHead className='text-gray-700 text-xs text-center'>CV</TableHead>
                    <TableHead className='text-gray-700 text-xs text-center'>Lượt xem</TableHead>
                <TableHead className='text-gray-700 text-xs text-center'>Thời hạn</TableHead>
                <TableHead className='text-gray-700 text-xs text-center'>Hoạt động</TableHead>
                <TableHead className='text-gray-700 text-xs text-center pr-3'>Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className='z-1'>
              {jobList.map((job) => (
                <TableRow
                  key={job.id}
                  className='hover:bg-gray-100 transition-all cursor-pointer group'
                >
                  <TableCell className='pl-3 text-gray-500'>
                    {job.id}
                  </TableCell>
                  <TableCell className='pl-3 peer'>
                    <Button variant='link' className='p-0 text-[#080808] group-hover:text-[#2C95FF] group-hover:underline'
                      onClick={() =>navigate(`/danh-cho-nha-tuyen-dung/danh-sach-ung-tuyen/${job.id}`)}
                    >
                      {job.name}
                    </Button>
                  </TableCell>
                  <TableCell className=' text-center font-bold text-[#2C95FF]'>
                    {job.applyJobs.length} cv
                  </TableCell>
                  <TableCell className='text-center'>
                    {viewCounts[job.id] ? viewCounts[job.id] : 0}
                  </TableCell>
                  <TableCell className=' flex justify-center items-center flex-col gap-3'>
                    <Label>{convertDateToString(job.createdAt)} -</Label>
                    <Label>{convertDateToString(job.expiredAt)}</Label>
                  </TableCell>

                  <TableCell className='text-center'>
                    {switchPublicJob(job.id, job.isShow, job.isActive)}
                  </TableCell>
                  <TableCell className=' text-center'>
                    <div className='flex justify-center items-center'>
                    {buttonAction(job)}
                      <JobMenu
                        job={job}
                        setIsChange={setIsChange}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
