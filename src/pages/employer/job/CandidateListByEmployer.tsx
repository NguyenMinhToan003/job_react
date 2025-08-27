import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getApplyJobByJobId, getApplyJobByTags } from '@/apis/applyJobAPI';
import { ApplyJobResponse } from '@/types/applyJobType';
import {
  Card, CardHeader, CardTitle, CardContent
} from '@/components/ui/card';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { convertDateToString } from '@/utils/dateTime';
import { JobFilterResponse } from '@/types/jobType';
import JobMenu from '@/components/elements/job/menuMore';
import ApplyJobMenu from '@/components/elements/applyJob/applyJobMenu';
import { buttonAction } from '@/utils/renderButton';
import { TagResume } from '@/types/tagResumeType';
import clsx from 'clsx';
import { toast } from 'sonner';
import { getAllTagResumeAPI } from '@/apis/tagResumeAPI';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { APPLY_JOB_STATUS } from '@/types/type';
import { X } from 'lucide-react';

export default function CandidateListByEmployer() {
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(window.location.search);
  const tagIds = searchParams.get('tagIds')?.split(',') || [];
  const { jobId } = useParams<{ jobId: string }>();
  const [list, setList] = useState<ApplyJobResponse[]>([]);
  const [job, setJob] = useState<JobFilterResponse>();
  const [loading, setLoading] = useState(true);
  const [isChange, setIsChange] = useState(false);
  const [tagResumes, setTagResumes] = useState<TagResume[]>([]);
  const [tagsSelected, setTagsSelected] = useState<TagResume[]>([]);
  const [status, setStatus] = useState<APPLY_JOB_STATUS | undefined>(undefined);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = [];
        if (jobId) {
          const response = await getApplyJobByJobId(parseInt(jobId));
          res.push(...response);
        }
        else {
          const response = await getApplyJobByJobId();
          res.push(...response);
        }
        const tagResponse = await getAllTagResumeAPI();
        setTagResumes(tagResponse);
        setList(res);
        setJob(res[0]?.job);
        setTagsSelected(tagResponse.filter(tag => tagIds.includes(tag.id.toString())));
      } catch (error) {
        console.error('Lỗi khi lấy danh sách ứng tuyển:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [jobId, isChange]);

  const fetchApplyJobByTags = async () => {
    try {
      const response = await getApplyJobByTags({
        jobId: Number(jobId) || undefined,
        tagIds: tagsSelected.map(tag => tag.id),
        status: status || undefined
      })
      setList(response);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    catch (error: any) {
      toast.error(error?.response?.data?.message || "Đã có lỗi xảy ra, vui lòng thử lại sau");
    }
  }
  useEffect(() => {
    fetchApplyJobByTags();
  }, [tagsSelected, status]);
  

  return (
    <Card className='w-full mt-4 mr-4 h-fit shadow-none border border-gray-200 rounded-xl'>
      <CardHeader>
        <CardTitle className='text-2xl font-bold flex justify-between items-center'>
          <span>Tỉ lệ ứng tuyển công việc</span>
          {
            jobId && job && <JobMenu job={job} />
          }
        </CardTitle>
      </CardHeader>

      <CardContent>
        {loading ? (
          <p className='text-gray-500 text-center py-8'>Đang tải dữ liệu...</p>
        ) : (
              <>
                <div className='w-full space-x-3 space-y-3 '>
                  <div className='flex items-center justify-between'>
                  <Label>
                    {
                      jobId && <>
                       <span className='text-gray-700'>Tin đăng:</span>
                    <span className='font-semibold text-neutral-800'>{job?.name}</span></>
                   }
                  </Label>
                  <div className='flex items-center gap-2'>
                    <Select
                    defaultValue='-- Chọn trạng thái --'
                    value={status}
                    onValueChange={(value) => {
                      setStatus(value as APPLY_JOB_STATUS);
                    }}
                  >
                    <SelectTrigger className='w-fit border-none bg-gray-100'>
                      {
                        status ? <>
                          {buttonAction(status)}
                        </> : '-- Chọn trạng thái --'
                      }
                    </SelectTrigger>
                    <SelectContent>
                      {
                        Object.values(APPLY_JOB_STATUS).map((status) => (
                          <SelectItem
                            key={status}
                            value={status}
                          >
                           {buttonAction(status)}
                          </SelectItem>
                        ))
                      }
                    </SelectContent>
                    
                    </Select>
                    
                    {
                      status && <>
                        <Button
                          variant='destructive'
                          onClick={() => {
                            setStatus(undefined);
                            setTagsSelected([]);
                          }}
                        >
                          <X className='h-4 w-4' />
                        </Button>
                      </>
                    }
                  </div>
                  </div>
                  {
                    tagResumes.length > 0 && tagResumes.map(tag => (
                        <Button
                          key={tag.id}
                          onClick={() => {
                            if (tagsSelected.includes(tag)) {
                              setTagsSelected(tagsSelected.filter(t => t.id !== tag.id));
                            } else {
                              setTagsSelected([...tagsSelected, tag]);
                            }
                          }}
                          style={{ backgroundColor: tag.color }}
                          className={clsx(
                            'text-neutral-800 hover:bg-opacity-80',
                            tagsSelected.includes(tag) ? 'opacity-100' : 'opacity-50',
                          )}>
                          {tag.name}
                        </Button>
                    ))
                  }
                  </div>
              <Table className='min-w-[1000px] text-sm mb-100'>
                <TableHeader>
              <TableRow>
                <TableHead className='pl-3 text-left text-xs text-gray-700'>Hồ sơ ứng viên</TableHead>
                <TableHead className='pl-3 text-left text-xs text-gray-700'>Mức phù hợp</TableHead>
                <TableHead className='pl-3 text-left text-xs text-gray-700'>Tin đăng</TableHead>
                <TableHead className='pl-3 text-left text-xs text-gray-700'>Thời gian nộp</TableHead>
                <TableHead className='text-right text-xs text-gray-700'>Trạng thái</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {list.length>0 && list.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className='pl-3 space-y-1'>
                    <div className='flex items-center gap-2'
                      
                    >
                      <Avatar><AvatarImage src={item.resumeVersion.avatar} /></Avatar>
                      <span className='font-semibold text-neutral-700'>{item.resumeVersion.username}</span>
                    </div>
                    {
                      <Badge className='text-gray-400 bg-gray-100'>{item.viewStatus === 1 ? 'Đã xem' : 'Chưa xem'}</Badge>
                    }
                    <div className='flex-1 flex-wrap gap-2 mt-2 flex max-w-50'>
                    {
                      item.tagResumes.length > 0 && item.tagResumes.map(tag => (
                        <Button
                          variant='ghost'
                          className='bg-transparent hover:bg-transparent cursor-pointer !p-0'
                          key={tag.id}>
                          <Label
                          className='px-2  rounded-xl  leading-6 text-neutral-600 cursor-pointer'
                          style={{ backgroundColor: tag.color }}
                        >
                          
                          <span>
                            {tag.name}
                          </span>
                        </Label>
                        </Button>
                      ))
                    }
                    </div>
                  </TableCell>

                  <TableCell>
                    <Badge
                      variant='outline'
                      className='cursor-pointer bg-[#F0F4FF] text-[#2C95FF] hover:bg-[#E0EFFF] hover:text-[#1A73E8] font-semibold'
                    >
                      {item.matchingScore.toFixed(2)}%
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <Button
                      variant='link'
                      onClick={() => navigate(`/danh-cho-nha-tuyen-dung/danh-sach-ung-tuyen/${item.job.id}`)}
                      className='text-neutral-700'>{item.job.name}</Button>
                  </TableCell>

                  <TableCell>
                    <Label>{convertDateToString(item.time)}</Label>
                  </TableCell>

                  <TableCell>
                    <div className='flex justify-end items-center gap-1'>
                      {buttonAction(item.status)}
                      <ApplyJobMenu
                        applyJob={item}
                        setIsChange={setIsChange}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
                </Table>
                </>
        )}
      </CardContent>
    </Card>

  );
}
