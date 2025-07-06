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
import { Activity, AlertTriangle, Clock, Lock } from 'lucide-react';
import JobListPendding from './JobListPending';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';



export default function JobListPage() {  
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
      count: 3,
    },
    {
      value: "active",
      label: "Đang hoạt động",
      icon: Activity,
      count: 4,
    },
    {
      value: "expired",
      label: "Đã hết hạn",
      icon: AlertTriangle,
      count: 4,
    },
    {
      value: "blocked",
      label: "Bị khóa",
      icon: Lock,
      count: 6,
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
          <JobListPendding/>
        </TabsContent>

        <TabsContent value="active" className="mt-0">
          <JobListActive/>
        </TabsContent>

        <TabsContent value="expired" className="mt-0">
          <JobListExpired/>
        </TabsContent>

        <TabsContent value="blocked" className="mt-0">
          <JobListBlock/>
        </TabsContent>
      </Tabs>
    </div>
  );
}
