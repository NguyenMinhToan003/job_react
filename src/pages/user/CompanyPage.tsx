
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CompanyDetailResponse } from '@/types/companyType';
import { useEffect, useState } from 'react';
import { getCompanyDetailAPI } from '@/apis/companyAPI';
import { useParams } from 'react-router-dom';
import JobList from '@/components/elements/job/job-list/JobList';
import { JobResponse } from '@/types/jobType';
import { LocationResponse } from '@/types/location';

export default function CompanyPage() {
  const { id = -1 } = useParams();
  const [company, setCompany] = useState<CompanyDetailResponse>()
  const [selectLocation, setSelectLocation] = useState<LocationResponse>();
  const fetchCompanyDetail = async () => {
    try {
      const response = await getCompanyDetailAPI(+id);
      setCompany(response);
    }
    catch (error) {
      console.error('Error fetching company detail:', error);
    }
  }

  useEffect(() => {
    fetchCompanyDetail();
  }, [])

  
  useEffect(() => {
    if (company?.id) {
      setSelectLocation(company?.locations[0]);
    }
  }, [company])
  
  if (!company) {
    return <div className='text-center py-16 text-gray-500'>Loading...</div>;
  }

  return (
    <div className='flex flex-col bg-[#f7f7f7]'>
      <div className='bg-gradient-to-r from-[#121212] to-[#53151c] text-white'>
        <div className='max-w-7xl mx-auto py-4 px-6 flex items-center gap-6'>
          <div className='bg-white rounded-md p-1 w-40 h-40 flex items-center justify-center'>
            <img src={company?.logo} alt='CBTW Logo' className='w-full h-full' />
          </div>
          <div className='flex-1'>
            <h1 className='text-2xl font-bold'>{company?.name}</h1>
            <div className='flex items-center mt-2 gap-4'>
              <div className='flex items-center gap-1'>
                <MapPin className='w-5 h-5' />
                {
                  company?.locations.length > 0 && <>
                    <Badge className='bg-gray-200 text-gray-800'>{company?.locations[0]?.name}</Badge>
                  </>
                }
              </div>
              <div className='flex items-center gap-1'>
                <Button variant={'link'} className='text-green-500 p-0'>
                  {company.jobs.length} việc làm đang tuyển dụng
                </Button>
              </div>
            </div>
          </div>
          <div className='flex gap-4'>
          <Button variant={'destructive'} className='bg-red-600 hover:bg-red-700 rounded-[2px] w-40 h-14 text-md font-bold'>Viết đánh giá</Button>
          <Button className='bg-white hover:bg-gray-100 rounded-[2px] w-40 h-14 text-md font-bold border-red-500 border text-red-500'>Theo dõi</Button>
        </div>
        </div>
      </div>
      <div className='max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-5 gap-8'>
        <div className='md:col-span-3 h-full'>
          <Tabs defaultValue='gioi-thieu' className='mb-8 h-full !shadow-none'>
            <TabsList className='border-b w-full justify-start rounded-sm h-auto p-0 mb-6  bg-white shadow-md sticky top-17 z-100'> 
            <TabsTrigger
              value="gioi-thieu"
              className="max-w-fit px-7 py-4 h-16 mr-1.5 text-lg font-semibold rounded-none border-b-2 shadow-none text-gray-800 data-[state=active]:text-[#ed1b2f] data-[state=active]:border-b-[#ed1b2f] data-[state=active]:shadow-none"
            >
              Giới thiệu
            </TabsTrigger>
            <TabsTrigger
              value="danh-gia"
              className="max-w-fit px-7 py-4 h-16 mr-1.5 text-lg font-semibold rounded-none border-b-2 shadow-none text-gray-800 data-[state=active]:text-[#ed1b2f] data-[state=active]:border-b-[#ed1b2f] data-[state=active]:shadow-none"
            >
              Đánh giá
              <Badge className="ml-2 bg-gray-200 text-gray-800">53</Badge>
            </TabsTrigger>
            <TabsTrigger
              value="bai-viet"
              className="max-w-fit px-7 py-4 h-16 mr-1.5 text-lg font-semibold rounded-none border-b-2 shadow-none text-gray-800 data-[state=active]:text-[#ed1b2f] data-[state=active]:border-b-[#ed1b2f] data-[state=active]:shadow-none"
            >
              Bài viết
              <Badge className="ml-2 bg-gray-200 text-gray-800">2</Badge>
            </TabsTrigger>
            </TabsList>
            
            <div className=''>
            <div className=''>
            <TabsContent value='gioi-thieu' className='mt-0 '>
                  <Card className='mb-8 shadow-xl'>
                    <CardContent className='px-6 py-1 '>
                      <span className='font-bold text-2xl'>Thông tin chung</span>
                      <div className='w-full h-[1px] bg-gray-200 my-4'></div>
                      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                        <div>
                          <h3 className='text-md text-gray-400 mb-1 font-semibold'>Mô hình công ty</h3>
                          <p className='font-medium'>Dịch vụ và Tư vấn giải pháp</p>
                        </div>
                        <div>
                          <h3 className='text-md text-gray-400 mb-1 font-semibold'>Lĩnh vực công ty</h3>
                          <p className='font-medium'>Dịch Vụ và Tư Vấn IT</p>
                        </div>
                        <div>
                          <h3 className='text-md text-gray-400 mb-1 font-semibold'>Quy mô công ty</h3>
                          <p className='font-medium'>1000+ nhân viên</p>
                        </div>
                        <div>
                          <h3 className='text-md text-gray-400 mb-1 font-semibold'>Quốc gia</h3>
                          <p className='font-medium'>🇧🇪 Belgium</p>
                        </div>
                        <div>
                          <h3 className='text-md text-gray-400 mb-1 font-semibold'>Thời gian làm việc</h3>
                          <p className='font-medium'>Thứ 2 - Thứ 6</p>
                        </div>
                        <div>
                          <h3 className='text-md text-gray-400 mb-1 font-semibold'>Làm việc ngoài giờ</h3>
                          <p className='font-medium'>Không có OT</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className=''>
                    <span className='font-bold text-2xl'>Giới thiệu công ty</span>
                    <div className='w-full h-[1px] bg-gray-200 my-4'></div>
                      <p className='text-gray-700 mb-4 font-semibold space-x-1'>
                      s
                      </p>
                    </CardContent>
                  </Card>
                  <Card className='mt-8 shadow-xl rounded-md'>
                    <CardHeader>
                    <span className='font-bold text-2xl'>Địa điểm</span>
                    <div className='w-full h-[1px] bg-gray-200 my-4'></div>
                      <div className='flex items-start gap-6 text-gray-500'>
                        <div className='w-[300px]'>
                          {
                            company?.locations.length>0 && company?.locations.map((location, index) => (
                              <Card key={index} className={`mb-4 p-0 border rounded-sm cursor-pointer hover:bg-gray-100 font-semibold
                                ${selectLocation?.id === location.id ? 'border-red-600' : ''}`}
                                onClick={() => {
                                  setSelectLocation(location)
                                }}
                              >
                                <CardContent className='flex items-start gap-4 p-2'>
                                  <MapPin className={`w-8 h-8 ${selectLocation?.id === location.id ?'text-red-500': 'text-gray-300'}`} />
                                  <div className='text-gray-700'>{location.name}</div>
                                </CardContent>
                              </Card>
                            ))
                          }
                        </div>
                        <div className='w-full'>
                        {
                          <iframe
                          src={`https://maps.google.com/maps?q=${selectLocation?.lat},${selectLocation?.lng}&hl=vi&z=14&output=embed`}
                          width="100%"
                          height="400"
                          style={{ border: 0 }}
                          allowFullScreen
                        ></iframe>
                        }
                      </div>
                      </div>
                      
                    </CardHeader>
                  </Card>
            </TabsContent>
            
            <TabsContent value='danh-gia'>
              <div className='text-center py-16 text-gray-500'>
                Nội dung đánh giá sẽ xuất hiện ở đây
              </div>
            </TabsContent>
            
            <TabsContent value='bai-viet'>
              <div className='text-center py-16 text-gray-500'>
                Nội dung bài viết sẽ xuất hiện ở đây
              </div>
            </TabsContent>
            </div>
            
            </div>
          </Tabs>
        </div>
        <Card className='px-1 py-2 bg-[#f7f7f7] border-none shadow-none col-span-2'>
          <CardContent className='p-1'>
            <h2 className='text-xl font-bold mb-6'>{company?.jobs?.length} việc làm đang tuyển dụng</h2>
            
            <div className='space-y-4 '>
              <div className="col-span-2 space-y-4">
                {
                  company?.jobs.map((job) => (
                    <JobList
                      isPrev={true}
                      key={job.id}
                      job={job}
                      selectedJob={{} as JobResponse}
                      setSelectedJob={() => {}}
                    />
                  ))
                }
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}