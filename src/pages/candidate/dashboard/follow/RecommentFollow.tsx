import { getRecommendedFollowsAPI } from "@/apis/followEmployerAPI";
import { RecommendedJobsFollowResponse } from "@/types/followType";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function RecommentFollow() {
  const [jobsRecommend, setJobsRecommend] = useState<RecommendedJobsFollowResponse[]>([]);
  const fetchRecommented = async () => {
    try {
      const response = await getRecommendedFollowsAPI();
      if (response.length > 0) {
        setJobsRecommend(response);
      } else {
        toast.info("Không tìm thấy nhà tuyển dụng gợi ý.");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Lỗi khi tải danh sách gợi ý.");
    }
  };

  useEffect(() => {
    fetchRecommented();
  }, []);

  const navigate = useNavigate();

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
     <Card className="rounded-none shadow-none mb-4">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-800">
          Nhà tuyển dụng gợi ý
          </CardTitle>
        <p className="text-sm text-gray-500">Gợi ý dựa trên hồ sơ xin việc của bạn</p>
      </CardHeader>
    </Card>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {jobsRecommend.map((employer) => (
          <Card key={employer.id} className="shadow-md">
            <CardHeader>
              <div className="flex items-center space-x-4">
                <img
                  src={employer.logo}
                  alt={employer.name}
                  className="w-12 h-12 object-cover rounded-full"
                />
                <div>
                  <CardTitle
                    className='hover:underline cursor-pointer text-lg font-semibold text-gray-800' 
                    onClick={() => navigate(`/nha-tuyen-dung/${employer.id}`)}
                  >{employer.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{employer.businessType}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>

              <div className="space-y-2">
                {employer.jobs.slice(0, 3).map((job) => (
                  <div
                    onClick={() => navigate(`/cong-viec/${job.id}`)}
                    key={job.id}
                    className="p-2 border rounded hover:bg-muted transition cursor-pointer"
                  >
                    <div className="font-medium">{job.name}</div>
                    <div className="text-sm text-muted-foreground">
                      Mức lương:{" "}
                      {job.minSalary && job.maxSalary
                        ? `${job.minSalary.toLocaleString()} - ${job.maxSalary.toLocaleString()} VNĐ`
                        : "Thoả thuận"}
                    </div>
                    <div className="text-xs text-gray-500">
                      Hạn: {new Date(job.expiredAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-end">
                <Button variant="ghost" size="sm">
                  Xem thêm việc làm
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
