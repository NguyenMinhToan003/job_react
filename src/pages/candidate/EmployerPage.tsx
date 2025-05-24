import { Card, CardContent } from '@/components/ui/card';
import { MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EmployerDetailResponse } from '@/types/companyType';
import { useEffect, useState } from 'react';
import { getCompanyDetailAPI } from '@/apis/companyAPI';
import { useParams } from 'react-router-dom';
import JobList from '@/components/elements/job/job-list/JobList';
import { JobResponse } from '@/types/jobType';

import { toast } from 'sonner';
import ViewCompany from '@/components/elements/company/ViewCompany';

export default function CompanyPage() {
  const { id = -1 } = useParams();
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

  useEffect(() => {
    fetchCompanyDetail();
  }, []);

  if (!employer) {
    return <div className="text-center py-16 text-gray-500">Loading...</div>;
  }

  return (
    <div className="flex flex-col bg-[#f7f7f7]">
      <div className="bg-gradient-to-r from-[#121212] to-[#53151c] text-white">
        <div className="max-w-7xl mx-auto py-4 px-6 flex items-center gap-6">
          <div className="bg-white rounded-md p-1 min-w-40 min-h-40 max-w-40 max-h-40 flex items-center justify-center">
            <img src={employer.logo} alt="CBTW Logo" className="w-full h-full" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{employer.name}</h1>
            <div className="flex items-center mt-2 gap-4">
              <div className="flex items-center gap-1">
                <MapPin className="w-5 h-5" />
                {employer.locations.length > 0 && (
                  <Badge className="bg-gray-200 text-gray-800">{employer.locations[0].name}</Badge>
                )}
              </div>
              <div className="flex items-center gap-1">
                <Button variant="link" className="text-green-500 p-0">
                  {employer.jobs.length} việc làm đang tuyển dụng
                </Button>
              </div>
            </div>
          </div>
          <div className="flex gap-4">
            <Button
              variant="destructive"
              className="bg-red-600 hover:bg-red-700 rounded-[2px] w-40 h-14 text-md font-bold"
            >
              Viết đánh giá
            </Button>
            <Button className="bg-white hover:bg-gray-100 rounded-[2px] w-40 h-14 text-md font-bold border-red-500 border text-red-500">
              Theo dõi
            </Button>
          </div>
        </div>
      </div>

      <div className="min-w-7xl max-w-7xl mx-auto px-6 py-8 grid grid-cols-5 gap-8">
        <div className="col-span-3 h-full">
          <Tabs defaultValue="gioi-thieu" className="mb-8 h-full !shadow-none col-span-3">
            <TabsList className="min-w-full justify-start rounded-none h-auto p-0 mb-6 bg-white shadow-md sticky top-16 z-100">
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

            <TabsContent value="gioi-thieu" >
              <ViewCompany/>
            </TabsContent>

            <TabsContent value="danh-gia">
              <Card className="text-center py-16 text-gray-500 w-full">
                <CardContent>
                  <span className="font-bold text-2xl">Đánh giá công ty</span>
                  <div className="w-full h-[1px] bg-gray-200 my-4"></div>
                  <p className="text-gray-700 mb-4 font-semibold space-x-1">Chưa có đánh giá nào</p>
                  <Button
                    variant="destructive"
                    className="bg-red-600 hover:bg-red-700 rounded-[2px] w-40 h-14 text-md font-bold"
                  >
                    Viết đánh giá
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="bai-viet">
              <Card className="text-center py-16 text-gray-500 w-full">
                <CardContent>
                  <span className="font-bold text-2xl">Bài viết</span>
                  <div className="w-full h-[1px] bg-gray-200 my-4"></div>
                  <p className="text-gray-700 mb-4 font-semibold space-x-1">Chưa có bài viết nào</p>
                  <Button
                    variant="destructive"
                    className="bg-red-600 hover:bg-red-700 rounded-[2px] w-40 h-14 text-md font-bold"
                  >
                    Viết bài
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <Card className="px-1 py-2 bg-[#f7f7f7] border-none shadow-none  col-span-2">
          <CardContent className="p-1">
            <h2 className="text-xl font-bold mb-6">{employer.jobs.length} việc làm đang tuyển dụng</h2>

            <div className="space-y-4">
              <div className="col-span-2 space-y-4">
                {employer.jobs.map((job) => (
                  <JobList
                    isPrev={true}
                    key={job.id}
                    job={job}
                    selectedJob={{} as JobResponse}
                    setSelectedJob={() => {}}
                  />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
