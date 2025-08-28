/* eslint-disable @typescript-eslint/no-explicit-any */
import { getRecommendedFollowsAPI } from "@/apis/followEmployerAPI";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { JobFilterResponse } from "@/types/jobType";
import JobItem from "@/components/elements/job/job-list/jobItem";
import PaginationModel1 from "@/components/elements/pagination/paginationModel1";

export default function RecommentFollow() {
  const [jobsRecommend, setJobsRecommend] = useState<JobFilterResponse[]>([]);
  const [totalPage, setTotalPage] = useState(1);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const fetchRecommented = async () => {
    try {
      const response = await getRecommendedFollowsAPI(page);
      setJobsRecommend(response.items);
      setTotalPage(response.totalPage || 1);
      setTotal(response.total || 0);
      
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Lỗi khi tải danh sách gợi ý.");
    }
  };

  useEffect(() => {
    fetchRecommented();
  }, [page]);


  if (jobsRecommend.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <h1 className="text-2xl font-bold mb-4">Nhà tuyển dụng gợi ý</h1>
        <p className="text-gray-600">Hiện bạn chưa có nhà tuyển dụng nào được gợi ý.</p>
      </div>
    );
  }

  return (
    <div className="p-4">
     <Card className="rounded-none shadow-none mb-4 ">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-800">
          Nhà tuyển dụng gợi ý
          </CardTitle>
          <p className="text-sm text-gray-500">Gợi ý dựa trên hồ sơ xin việc của bạn có
            {total} công việc đang chờ bạn khám phá.
        </p>
      </CardHeader>
    </Card>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mr-10">
        {jobsRecommend.map((employer) => (
          <JobItem
            job={employer}
            selectedJob={{} as JobFilterResponse}
            setSelectedJob={() => {}}
            key={employer.id}
          />
        ))}
      </div>
      <PaginationModel1
        page={page}
        setPage={setPage}
        totalPages={totalPage}
      />s
    </div>
  );
}
