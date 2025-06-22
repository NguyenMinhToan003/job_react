/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { getJobByCompanyId, toggleJobStatus } from "@/apis/jobAPI";
import { CompanyFilterJob, JobResponse } from "@/types/jobType";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Telescope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import dayjs from "dayjs";
import { toast } from "sonner";

export default function ExpiredJobs() {
  
  const [jobList, setJobList] = useState<JobResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchJobList = async () => {
    try {
      const response = await getJobByCompanyId({
        isActive: 1,
        isExpired: 1,
      } as CompanyFilterJob);
      setJobList(response);
    } catch (error) {
      toast.error(
        (error as any).response?.data?.message || "Có lỗi xảy ra khi tải danh sách công việc"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobList();
  }, []);

  const handleToggleJobStatus = async (jobId: number, isShow: number) => {
    try {
      
      await toggleJobStatus(jobId);
      setJobList((prevJobList) =>
        prevJobList.map((job) =>
          job.id === jobId ? { ...job, isShow: isShow === 1 ? 0 : 1 } : job
        )
      );
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
    }
  };



  return (
    <Card className="w-full mt-2 mr-2">
      {/* <CardHeader>
        <CardTitle className="text-2xl font-bold text-gray-800 ">
          DANH SÁCH TUYỂN DỤNG
        </CardTitle>
      </CardHeader> */}

      <CardContent className="overflow-x-auto">
        {loading ? (
          <p className="text-center text-gray-600 py-12">Đang tải dữ liệu...</p>
        ) : jobList.length === 0 ? (
          <p className="text-center text-gray-600 py-12">
            Chưa có công việc nào được đăng tuyển.
          </p>
        ) : (
          <Table className="min-w-[1000px] text-sm">
            <TableHeader className=" bg-red-50">
              <TableRow>
                <TableHead className="px-4 py-2 text-left">Tên công việc</TableHead>
                <TableHead className="px-4 py-2 text-center">CV</TableHead>
                <TableHead className="px-4 py-2 text-center">Ngày đăng</TableHead>
                <TableHead className="px-4 py-2 text-center">Đến hạn</TableHead>
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
                  <TableHead className="px-4 py-2 text-center font-bold">
                    {job.applyJobs.length}
                  </TableHead>
                  <TableCell className="px-4 py-2 text-center">
                    {dayjs(job.createdAt).format("DD/MM/YYYY")}
                  </TableCell>
                  <TableCell className="px-4 py-2 text-center">
                    {dayjs(job.expiredAt).format("DD/MM/YYYY")}
                  </TableCell>
                  <TableCell className="px-4 py-2 text-center">
                    <Switch
                      disabled={true}
                      checked={job.isShow === 1 ? true : false}
                      className="text-red-400"
                      onClick={() => handleToggleJobStatus(job.id, job.isShow)}
                    />
                  </TableCell>
                  <TableCell className="px-4 py-2 flex justify-center">
                    <Telescope
                      className="w-6 h-6 text-gray-500 cursor-pointer hover:scale-110 transition-transform"
                      onClick={() => navigate(`/danh-cho-nha-tuyen-dung/thong-tin-tuyen-dung/${job.id}`)}
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
