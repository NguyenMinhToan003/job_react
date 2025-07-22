/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Eye, File, Upload } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { JobFilterResponse } from '@/types/jobType';
import { filterJob } from '@/apis/jobAPI';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useAccount } from '@/providers/UserProvider';
import { updateInfoCandidate } from '@/apis/candidateAPI';
import { createEmployerNotiAPI } from '@/apis/notiAccountAPI';
import { NOTI_TYPE } from '@/types/type';
import { Resume } from '@/types/resumeType';
import { getAllResumeAPI, uploadNewCVAPI } from '@/apis/resumeAPI';
import { applyJob } from '@/apis/applyJobAPI';
import { convertDateToString } from '@/utils/dateTime';
import { useLoading } from '@/providers/LoadingProvider';

export default function JobApplicationForm() {
  const { jobId } = useParams();
  const { dataUser, updateDataUser } = useAccount()
  const [cvOption, setCvOption] = useState<string| null>(null);
  const [job, setJob] = useState<JobFilterResponse>();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [note, setNote] = useState<string>('');
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [uploadNewCV, setUploadNewCV] = useState<File | null>(null);
  const { setLoading } = useLoading()
  const navigate = useNavigate();

  const fetchJob = async () => {
    try {
      const response = await filterJob({ id: Number(jobId) });
      setJob(response.data[0]);
    } catch (error) {
      toast.error('Có lỗi xảy ra khi tải thông tin công việc');
    }
  };

  useEffect(() => {
    if (dataUser) {
      setName(dataUser?.account?.email);
      setPhone(dataUser.phone);
    }
  }, [dataUser]);

  useEffect(() => {
    fetchJob();
  }, [jobId]);

  const fetchResume = async () => {
    try {
      setLoading(true);
      const response = await getAllResumeAPI()
      setResumes(response);
    }
    catch (error: any){
      toast.error(error?.response?.data?.message || 'Có lỗi xảy ra khi tải thông tin CV');
    }
    finally {
      setLoading(false);
    }
  }
  
  useEffect(() => {
    fetchResume();
  }, []);

  const handleApplyJob = async () => {
    try {
      setLoading(true);
      await updateInfoCandidate({
        name,
        phone
      });
      if (uploadNewCV) {
        await uploadNewCVAPI(
          Number(cvOption),
          uploadNewCV
        )
      }
      updateDataUser();
      await applyJob(
        Number(jobId),
        {
          resumeId: Number(cvOption),
          candidateNote: note,
          feedback: '',
          email: name,
          phone,
        }
      )

  
      createEmployerNotiAPI({
        content: `Đơn ứng tuyển công việc "${job?.name}" của ${name}.`,
        title: 'Có đơn ứng tuyển mới',
        receiverAccountId: job?.employer.id || -1,
        link: `/danh-cho-nha-tuyen-dung/danh-sach-ung-tuyen/${jobId}`,
        type: NOTI_TYPE.DEFAULT
      });
  
      toast.success('Ứng tuyển thành công');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Đã xảy ra lỗi khi ứng tuyển');
    }
    finally {
      setLoading(false);
    }
  };
  
  

  return <>
    
    <div className='max-w-4xl mx-auto p-8'>
      <div
        className='my-4 flex items-center text-sm gap-1 w-fit cursor-pointer'
        onClick={() => window.history.back()}
      >
        <ChevronLeft className='w-4 h-4' />
        <span className='font-bold'>Quay lại</span>
      </div>

      <Card className='border-none shadow-sm'>
        <CardHeader>
          <CardTitle className='text-xl font-semibold'>
            <span className='text-red-800 font-bold'>{job?.name}</span> tại{' '}
            <span className='text-red-800 font-bold'>{job?.employer.name}</span>
          </CardTitle>
        </CardHeader>

        <CardContent className='space-y-6'>
          <div>
            <Label className='text-lg font-bold text-red-600 '>CV ứng tuyển *</Label>
            <RadioGroup value={cvOption} onValueChange={
              (value) => {
                setCvOption(value);
                setUploadNewCV(null);
              }} className='mt-3 space-y-3'>
              {
                resumes.length > 0 && resumes.map((resume) => (
                  <Label key={resume.id} htmlFor={`${resume.id}`} className='block'>
                    <Card
                      className={`rounded-sm cursor-pointer border-2 transition shadow-none ${
                        cvOption === `${resume.id}` ? 'border-red-500 bg-red-50' : 'border-gray-200'
                      }`}
                    >
                      <CardContent className='flex items-start justify-between w-full'>
                        <div className='flex flex-1 items-start'>
                          <RadioGroupItem value={`${resume.id}`} id={`${resume.id}`} className='mr-3'  />
                          <div className='flex flex-col gap-2'>
                            <p className='text-xl font-semibold'>{resume.name}</p>
                            <p className='text-blue-600 font-semibold'>Cập nhật lần cuối {convertDateToString(resume.updatedAt)}</p>
                          </div>
                          
                        </div>
                        <div >
                          {
                            cvOption === `${resume.id}` && (
                            <Button
                              variant='link'
                              className=' text-red-500'
                            >
                              <Label htmlFor='uploadNewCV'>    
                                {
                                    !uploadNewCV ? <>
                                      <Upload className='w-4 h-4' />
                                      <span className='ml-2'>Tải lên CV mới</span>
                                    </>   
                                      : 
                                      <>
                                        <File className='w-4 h-4' />
                                        <span className='ml-2'>{uploadNewCV.name}</span>
                                      </>
                                }
                              </Label>
                              <input
                                type='file'
                                id='uploadNewCV'
                                className='hidden'
                                onChange={(e) => {
                                  if (e.target.files && e.target.files.length > 0) {
                                    setUploadNewCV(e.target.files[0]);
                                  }
                                }}
                              />
                              </Button>
                            )
                          }
                          <Button
                            onClick={() => navigate(`/tong-quat-ho-so/ho-so/${resume.id}`)}
                            variant='ghost' className='border-blue-200 border'>
                            <Eye className='w-4 h-4 text-blue-600 ' />
                            <span className='ml-2'>Xem</span>
                          </Button>
                          </div>
                      </CardContent>
                    </Card>
                  </Label>
                ))
              }
            </RadioGroup>
          </div>

          <Card className='border-none shadow-none p-0'>
            <CardHeader className='p-0'>
              <CardTitle className='text-lg font-bold text-red-600 '>Thông tin cơ bản</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <Label className='text-sm font-semibold'>Email</Label>
              <Input
                type='text'
                placeholder='Họ và tên'
                value={name}
                onChange={(e) => setName(e.target.value)}
                className='px-3 py-6 rounded-1'
              />

              <Label className='text-sm font-semibold'>Số điện thoại</Label>
              <Input
                type='text'
                placeholder='Số điện thoại'
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className='px-3 py-6 rounded-1'
              />

              <Label className='text-sm font-semibold'>Thư xin việc</Label>
              <Input
                type='text'
                placeholder='Hãy viết thư xin việc để đạt hiệu quả hơn'
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className='px-3 py-6 rounded-1'
              />
            </CardContent>
          </Card>

          <div className='pt-4'>
            <Button
              variant={'destructive'}
              className='w-full text-lg font-semibold h-14 rounded-none bg-red-500'
              onClick={handleApplyJob}
            >
              Gửi hồ sơ
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>

  </>
}
