// src/components/home/JobBannerCarousel.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { DollarSignIcon, FlameIcon, Clock, Heart, MapPin } from 'lucide-react';
import { JobFilterResponse } from '@/types/jobType';
import { convertPrice } from '@/utils/convertPrice';
import { convertDateToDiffTime } from '@/utils/dateTime';
import clsx from 'clsx';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { saveJob } from '@/apis/saveJobAPI';
import { toast } from 'sonner';
import { getJobBanner } from '@/apis/jobAPI';

export default function JobBanner() {
  const navigate = useNavigate();
  const [jobsBanner, setJobsBanner] = useState<JobFilterResponse[]>([]);

  const fetchJobsBanner = async () => {
    try {
      const data = await getJobBanner();
      setJobsBanner(data);
    } catch (error) {
      toast.error('Lỗi khi tải danh sách việc làm tuyển gấp');
    }
  };

  useEffect(() => {
    fetchJobsBanner();
  }, [])

  const handleSaveJob = async (jobId: number) => {
    try {
      await saveJob(jobId);
      toast.success('Lưu việc làm thành công');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Lỗi không xác định');
    }
  };

  function chunkArray<T>(array: T[], size: number): T[][] {
    const result: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }
    return result;
  }

  return (
    <Card className="w-full  p-6 shadow-none bg-transparent">
      <CardHeader >
        
      </CardHeader>
      <CardContent className="p-6 ">
        <Carousel>
          <CarouselContent className='w-7xl mx-auto p-2'>
            {jobsBanner.length > 0 &&
              chunkArray(jobsBanner, 9).map((jobGroup, index) => (
                <CarouselItem key={index} className="w-full">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {jobGroup.map((job) => (
                      <Card
                        onClick={() => navigate(`/cong-viec/${job.id}`)}
                        key={job.id}
                        className={clsx('flex flex-col rounded-[8px] bg-white border border-[#E7E7E8] hover:border-[#2C95FF] p-2 gap-1 shadow-none cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-101 relative')}
                      >
                        <CardHeader className='p-1 flex items-center justify-between'>
                          <CardTitle className={clsx('font-semibold line-clamp-1', job.isActiveSubscription ? 'text-red-500' : 'text-gray-800')}>
                            {job.name}
                          </CardTitle>
                          <Button
                            variant="ghost"
                            className=" hover:bg-[#eeeaff]"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSaveJob(job.id);
                            }}
                          >
                            <Heart className="w-5 h-5 text-[#2c95ff] shadow-xl" />
                          </Button>
                        </CardHeader>
                        <CardContent className="flex-1 p-1 space-y-2">
                          <div className="flex items-start gap-3 mb-2">
                            <Avatar className='bg-white box-border rounded-md w-[64px] min-w-[64px] h-[64px] min-h-[64px]'>
                              <AvatarImage
                                src={job.employer.logo}
                                alt={job.employer.name}
                              />
                            </Avatar>
                            <div className="flex flex-col gap-2">
                              <div className="text-xs font-semibold text-[#a2a1a3] line-clamp-1">
                                {job.employer.name}
                              </div>
                              <div className="flex items-center gap-1 text-sm text-[#2c95ff] font-semibold">
                                <DollarSignIcon className="w-4 h-4 text-gray-400" />
                                <Label>{convertPrice(job.minSalary, job.maxSalary)}</Label>
                              </div>
                              <div className="flex items-center gap-1 text-sm text-gray-700">
                                <MapPin className="w-4 h-4 text-gray-400" />
                                <Label className='text-[#060607] text-xs'>
                                  {job.locations?.[0]?.district?.city?.name || 'Không rõ địa điểm'}
                                </Label>
                              </div>
                            </div>
                          </div>
                          <hr className="my-2 border-gray-200" />
                          <div className="flex items-center gap-1 text-xs text-gray-500 font-semibold justify-between item-center">
                            <div>
                              {job.isActiveSubscription && (
                                <div className=" bg-red-100 text-red-600 text-xs font-semibold px-2 py-1 rounded-full">
                                  <span className="flex items-center gap-1">
                                    <FlameIcon className="w-4 h-4" />
                                    HOT
                                  </span>
                                </div>
                              )}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>{convertDateToDiffTime(job.createdAt)}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CarouselItem>
              ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext  />
        </Carousel>
      </CardContent>
    </Card>
  );
}
