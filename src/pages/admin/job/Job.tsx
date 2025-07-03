/* eslint-disable @typescript-eslint/no-explicit-any */
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import JobListActive from './JobListActive';
import JobListExpired from './JobListExpired';
import JobListBlock from './JobListBlock';
import { useEffect, useState } from 'react';
import { filterJobAdmin, refreshJobInPackage } from '@/apis/jobAPI';
import { JOB_STATUS } from '@/types/type';
import { toast } from 'sonner';
import { JobDetailResponse } from '@/types/jobType';
import { Activity, AlertTriangle, Badge, Clock, Lock } from 'lucide-react';
import JobListPendding from './JobListPending';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';



export default function JobListPage() {
  const [jobsPending, setJobsPending] = useState<JobDetailResponse[]>([]);
  const [jobsExpired, setJobsExpired] = useState<JobDetailResponse[]>([]);
  const [jobsActive, setJobsActive] = useState<JobDetailResponse[]>([]);
  const [jobsBlock, setJobsBlock] = useState<JobDetailResponse[]>([]);
  const [totalPagePending, setTotalPagePending] = useState(0);
  const [totalPageActive, setTotalPageActive] = useState(0);
  const [totalPageExpired, setTotalPageExpired] = useState(0);
  const [totalPageBlock, setTotalPageBlock] = useState(0);
  const [pagePending, setPagePending] = useState(1);
  const [pageActive, setPageActive] = useState(1);
  const [pageExpired, setPageExpired] = useState(1);
  const [pageBlock, setPageBlock] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortType, setSortType] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const [jobsPending, jobsActive, jobsExpired, jobsBlock] = await Promise.all([
          filterJobAdmin({ isActive: [JOB_STATUS.PENDING] }),
          filterJobAdmin({ isActive: [JOB_STATUS.ACTIVE], isExpired: 0}),
          filterJobAdmin({ isActive: [JOB_STATUS.ACTIVE], isExpired: 1 }),
          filterJobAdmin({ isActive: [JOB_STATUS.BLOCK] }),
        ])
        setJobsPending(jobsPending);
        setJobsActive(jobsActive);
        setJobsExpired(jobsExpired);
        setJobsBlock(jobsBlock);
      } catch (err : any) {
        toast.error(err.response?.data?.message || 'Có lỗi xảy ra khi tải danh sách công việc');
      }
    };
    fetchJobs();
  }, []);

  const getTabBadge = (count: number) => {
    if (count === 0) return null
    return <div>{count}</div>
  }

  const refreshJobs = async () => {
    try {
      await refreshJobInPackage();
    }
    catch (error) {
      toast.error(error?.response?.data?.message || 'Có lỗi xảy ra khi làm mới danh sách công việc');
    }
  }


  const tabData = [
    {
      value: "pending",
      label: "Chờ duyệt",
      icon: Clock,
      count: jobsPending.length,
    },
    {
      value: "active",
      label: "Đang hoạt động",
      icon: Activity,
      count: jobsActive.length,
    },
    {
      value: "expired",
      label: "Đã hết hạn",
      icon: AlertTriangle,
      count: jobsExpired.length,
    },
    {
      value: "blocked",
      label: "Bị khóa",
      icon: Lock,
      count: jobsBlock.length,
    },
  ]


  return (
    <div className="p-6 w-full">
      <Button
        variant="outline"
        className="mb-4"
        onClick={refreshJobs}
      >
        Thao tác thủ công làm mới danh sách công việc dịch vụ
      </Button>
      <Tabs defaultValue="pending" className="mb-8">
        <TabsList className="border-b w-full justify-start rounded-sm h-auto p-0 mb-6 bg-white shadow-sm border-b-gray-200">
          {tabData.map((tab) => {
            const IconComponent = tab.icon
            return (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="max-w-fit px-6 py-4 h-16 mr-2 text-base font-semibold rounded-none border-b-2 shadow-none text-gray-700 hover:text-gray-900 hover:bg-gray-50 data-[state=active]:text-[#ed1b2f] data-[state=active]:border-b-[#ed1b2f] data-[state=active]:shadow-none data-[state=active]:bg-red-50/30 transition-all duration-200"
              >
                <div className="flex items-center gap-2">
                  <IconComponent className="h-4 w-4" />
                  {tab.label}
                  {getTabBadge(tab.count)}
                </div>
              </TabsTrigger>
            )
          })}
        </TabsList>
        <TabsContent value="pending" className="mt-0">
          <JobListPendding jobs={jobsPending} setJobs={setJobsPending} />
        </TabsContent>

        <TabsContent value="active" className="mt-0">
          <JobListActive jobs={jobsActive} setJobs={setJobsActive} />
        </TabsContent>

        <TabsContent value="expired" className="mt-0">
          <JobListExpired jobs={jobsExpired} setJobs={setJobsExpired} />
        </TabsContent>

        <TabsContent value="blocked" className="mt-0">
          <JobListBlock jobs={jobsBlock} setJobs={setJobsBlock} />
        </TabsContent>
      </Tabs>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
        <Card className=" h-fit border-l-4 border-l-yellow-500">
          <CardContent className="">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Chờ duyệt</p>
                <p className="text-2xl font-bold text-yellow-600">{jobsPending.length}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className=" h-fit border-l-4 border-l-green-500">
          <CardContent className="">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Đang hoạt động</p>
                <p className="text-2xl font-bold text-green-600">{jobsActive.length}</p>
              </div>
              <Activity className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className=" h-fit border-l-4 border-l-red-500">
          <CardContent className="">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Đã hết hạn</p>
                <p className="text-2xl font-bold text-red-600">{jobsExpired.length}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card className=" h-fit border-l-4 border-l-gray-500">
          <CardContent className="">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Bị khóa</p>
                <p className="text-2xl font-bold text-gray-600">{jobsBlock.length}</p>
              </div>
              <Lock className="h-8 w-8 text-gray-500" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
