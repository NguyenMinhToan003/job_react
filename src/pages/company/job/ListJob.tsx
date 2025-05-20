import { useEffect, useState } from "react";
import { getJobByCompanyId } from "@/apis/jobAPI";
import { Job } from "@/types/JobType";

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

export default function ListJob() {
  const [jobList, setJobList] = useState<Job[]>([]);
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

  const formatSalary = (min: number, max: number) => {
    if (min < 0 || max < 0) return "Thỏa thuận";
    return `${min.toLocaleString()} - ${max.toLocaleString()} VNĐ`;
  };

  return (
    <Card className="max-w-7xl mx-auto mt-8 shadow-xl rounded-md">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-gray-800">
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
                <TableHead className="px-4 py-2 text-left">Mô tả</TableHead>
                <TableHead className="px-4 py-2 text-center">Số lượng</TableHead>
                <TableHead className="px-4 py-2 text-right">Mức lương</TableHead>


                <TableHead className="px-4 py-2 text-center">Hạn nộp</TableHead>
                <TableHead className="px-4 py-2 text-center">Trạng thái</TableHead>
                <TableHead className="px-4 py-2 text-center">Điều chỉnh</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {jobList.map((job) => (
                <TableRow
                  key={job.id}
                  className="hover:bg-gray-100 transition-all"
                >
                  <TableCell className="px-4 py-2 font-medium text-gray-900">
                    {job.name}
                  </TableCell>
                  <TableCell
                    className="px-4 py-2 max-w-sm truncate text-gray-700"
                    title={job.description}
                  >
                    {job.description}
                  </TableCell>
                  <TableCell className="px-4 py-2 text-center">
                    {job.quantity}
                  </TableCell>
                  <TableCell className="px-4 py-2 text-right text-gray-800">
                    {formatSalary(job.minSalary, job.maxSalary)}
                  </TableCell>
                 

                  <TableCell className="px-4 py-2 text-center">
                    {new Date(job.expiredAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="px-4 py-2 text-center">
                    <Badge
                      variant={job.status === 1 ? "default" : "destructive"}
                    >
                      {job.status === 1 ? "Đang tuyển" : "Đã hết hạn"}
                    </Badge>
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
