/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, CardContent } from '@/components/ui/card';
import { MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EmployerDetailResponse } from '@/types/companyType';
import { useEffect, useState } from 'react';
import { getCompanyDetailAPI } from '@/apis/companyAPI';
import { useNavigate, useParams } from 'react-router-dom';
import { JobFilterResponse } from '@/types/jobType';

import { toast } from 'sonner';
import ViewCompany from '@/components/elements/company/ViewCompany';
import { followEmployerAPI, unfollowEmployerAPI } from '@/apis/followEmployerAPI';
import JobItem from '@/components/elements/job/job-list/JobItem';
import BannerEmployer from '@/components/elements/company/BannerEmployer';

export default function CompanyPage() {
  const { id = -1 } = useParams();
  const navigate = useNavigate();
  const [employer, setCompany] = useState<EmployerDetailResponse>();

  const fetchCompanyDetail = async () => {
    try {
      const response = await getCompanyDetailAPI(+id);
      setCompany(response);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error : any) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi tải thông tin công ty');
    }
  };
  const handleFollow = async () => {
    try {
      await followEmployerAPI(+id);
      setCompany((prev) => {
        if (prev) {
          return {
            ...prev,
            isFollowed: true,
            countFollows: prev.countFollows + 1,
          };
        }
        return prev;
      });
      toast.success('Theo dõi công ty thành công');
    }
    catch (error: any) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi theo dõi công ty');
    }
  }
  const handleUnFollow = async () => {
    try {
      await unfollowEmployerAPI(+id);
      setCompany((prev) => {
        if (prev) {
          return {
            ...prev,
            isFollowed: false,
            countFollows: prev.countFollows - 1,
          };
        }
        return prev;
      });
      toast.success('Bỏ theo dõi công ty thành công');
    }
    catch (error: any) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi bỏ theo dõi công ty');
    }
  }

  useEffect(() => {
    fetchCompanyDetail();
  }, []);

  if (!employer) {
    return <div className='text-center py-16 text-gray-500'>Loading...</div>;
  }


  return (
    <div className='flex flex-col border-t border-red-200'>
      <div className='bg-gradient-to-r from-[#121212] to-[#53151c] text-white'>
        <div className='max-w-7xl mx-auto py-4 px-6 flex items-center gap-6'>
          <div className='bg-white rounded-md p-1 min-w-40 min-h-40 max-w-40 max-h-40 flex items-center justify-center'>
            <img src={employer.logo} alt='CBTW Logo' className='w-full h-full' />
          </div>
          <div className='flex-1'>
            <h1 className='text-2xl font-bold'>{employer.name}</h1>
            <div className='flex  mt-2 gap-4 flex-col justify-start items-start'>
              <div className='flex items-center gap-1'>
                <MapPin className='w-5 h-5 text-green-500' />
                {employer.locations.length > 0 && (
                  <Badge className='bg-gray-200 text-gray-800'>{employer.locations[0].name}</Badge>
                )}
              </div>
            </div>
          </div>
          <div className='flex gap-4'>
            <Button
              variant='destructive'
              className='bg-red-600 hover:bg-red-700 rounded-[2px] w-40 h-14 text-md font-bold'
            >
              {employer.countFollows} người theo dõi
            </Button>
            {
              !employer.isFollowed ? <>
                <Button className='bg-white hover:bg-gray-100 rounded-[2px] w-40 h-14 text-md font-bold border-red-500 border text-red-500'
              onClick={handleFollow}>
              Theo dõi
            </Button>
              </>
                : 
                <>
                <Button className='bg-gray-200 hover:bg-gray-100 rounded-[2px] w-40 h-14 text-md font-bold border-red-500 border text-red-500'
                  onClick={handleUnFollow}>
                  Bỏ theo dõi
                  </Button>
                </>
            }
          </div>
        </div>
      </div>

      <div className='min-w-7xl max-w-7xl mx-auto px-6 py-8 grid grid-cols-5 gap-8'>
        <div className='col-span-3 h-full'>
          <Tabs defaultValue='gioi-thieu' className='mb-8 h-full !shadow-none col-span-3'>
            <TabsList className='min-w-full justify-start rounded-none h-auto p-0 mb-6 bg-white shadow-md sticky top-16 z-100'>
              <TabsTrigger
                value='gioi-thieu'
                className='max-w-fit px-7 py-4 h-16 mr-1.5 text-lg font-semibold rounded-none border-b-2 shadow-none text-gray-800 data-[state=active]:text-[#ed1b2f] data-[state=active]:border-b-[#ed1b2f] data-[state=active]:shadow-none'
              >
                Giới thiệu
              </TabsTrigger>

            </TabsList>

            <TabsContent value='gioi-thieu' >
              <ViewCompany/>
            </TabsContent>

          </Tabs>
        </div>

        <Card className='px-1 py-2 bg-[#f7f7f7] border-none shadow-none  col-span-2'>
          <CardContent className='p-1'>
            <h2 className='text-xl font-bold mb-6'>{employer.jobs.length} việc làm đang tuyển dụng</h2>

            <div className='space-y-4'>
              <div className='col-span-2 space-y-4'>
                {employer.jobs.map((job) => (
                  <div key={job.id} onClick={()=> navigate(`/cong-viec/${job.id}`)} className='cursor-pointer'>
                    <JobItem
                      job={job}
                      key={job.id}
                      selectedJob={{} as JobFilterResponse}
                      setSelectedJob={() => {}}
                    />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <BannerEmployer />
    </div>
  );
}
