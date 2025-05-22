import { useEffect, useState } from "react";
import { getJobByCompanyId, updateJob } from "@/apis/jobAPI";
import { CreateJob, JobResponse } from "@/types/jobType";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { SquarePen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import dayjs from "dayjs";
import { toast } from "sonner";

export default function ListJob() {
  
  const [jobList, setJobList] = useState<JobResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchJobList = async () => {
    try {
      const response = await getJobByCompanyId();
      setJobList(response);
    } catch (error) {
      console.error("Error fetching job list:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobList();
  }, []);

  const handleToggleJobStatus = async (jobId: number, isShow: number) => {
    try {
      
      await updateJob(jobId, {
        isShow: isShow === 1 ? 0 : 1,
      } as CreateJob);
      setJobList((prevJobList) =>
        prevJobList.map((job) =>
          job.id === jobId ? { ...job, isShow: isShow === 1 ? 0 : 1 } : job
        )
      );
    } catch (error) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
    }
  };



  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-gray-800 ">
          DANH SÁCH TUYỂN DỤNG
        </CardTitle>
      </CardHeader>

      <CardContent className="overflow-x-auto">
        {loading ? (
          <p className="text-center text-gray-600 py-12">Đang tải dữ liệu...</p>
        ) : jobList.length === 0 ? (
          <p className="text-center text-gray-600 py-12">
            Chưa có công việc nào được đăng tuyển.
          </p>
        ) : (
          <Table className="min-w-[1000px] text-sm">
            <TableHeader>
              <TableRow>
                <TableHead className="px-4 py-2 text-left">Tên công việc</TableHead>
                <TableHead className="px-4 py-2 text-right">CV</TableHead>
                <TableHead className="px-4 py-2 text-center">Hạn hạn</TableHead>
                <TableHead className="px-4 py-2 text-center">Trạng thái</TableHead>
                <TableHead className="px-4 py-2 text-center">Hoạt động</TableHead>
                <TableHead className="px-4 py-2 text-center">Điều chỉnh</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="z-1">
              {jobList.map((job) => (
                <TableRow
                  key={job.id}
                  className="hover:bg-gray-100 transition-all cursor-pointer"
                >
                  <TableCell className="px-4 py-2 font-medium text-gray-900">
                    <Button variant="link" className="p-0"
                      onClick={() =>navigate(`/danh-cho-nha-tuyen-dung/danh-sach-ung-tuyen/${job.id}`)}
                    >
                      {job.name}
                    </Button>
                  </TableCell>
                  <TableHead className="px-4 py-2 text-right font-bold">
                    {job.applyJobs.length}
                  </TableHead>
                  <TableCell className="px-4 py-2 text-center">
                    {(() => {
                      const now = dayjs();
                      const expiredDate = dayjs(job.expiredAt);
                      const daysLeft = expiredDate.diff(now, 'day');
                      return daysLeft < 0 ? (
                        <span className="text-green-500">Đã hết hạn</span>
                      ) : (
                        <span className="text-gray-600">{daysLeft} ngày</span>
                      );
                    })()}
                  </TableCell>
                  <TableCell className="px-4 py-2 text-center">
                    <Badge
                      variant={job.status === 1 ? "default" : "outline"}
                    >
                      {job.status === 1 ? "Đang tuyển" : "Chờ duyệt"}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-2 text-center">
                    <Switch
                      checked={job.isShow === 1 ? true : false}
                      className="text-red-400"                      onClick={() => handleToggleJobStatus(job.id, job.isShow)}
                    />
                  </TableCell>
                  <TableCell className="px-4 py-2 flex justify-center">
                    <SquarePen
                      className="w-6 h-6 text-gray-500 cursor-pointer hover:scale-110 transition-transform"
                      onClick={() => navigate(`/danh-cho-nha-tuyen-dung/cap-nhat-tuyen-dung/${job.id}`)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
