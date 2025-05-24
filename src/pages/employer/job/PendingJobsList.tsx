import { useEffect, useState } from "react";
import { getJobByCompanyId } from "@/apis/jobAPI";
import { JobResponse } from "@/types/jobType";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent} from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { SquarePen } from "lucide-react";
import dayjs from "dayjs";
import { Label } from "@/components/ui/label";

export default function PendingJobsList() {
  
  const [jobList, setJobList] = useState<JobResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchJobList = async () => {
    try {
      const response = await getJobByCompanyId({
        isActive: 0,
      });
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


  return (
    <Card>
      
      <CardContent className="overflow-x-auto">
        {loading ? (
          <p className="text-center text-gray-600 py-12">Đang tải dữ liệu...</p>
        ) : jobList.length === 0 ? (
          <p className="text-center text-gray-600 py-12">
            Chưa có công việc nào được đăng tuyển.
          </p>
        ) : (
          <Table className="min-w-[1000px] text-sm">
            <TableHeader className="z-1 bg-red-50">
              <TableRow>
                <TableHead className="px-4 py-2 text-left">Tên công việc</TableHead>
                <TableHead className="px-4 py-2 text-center">Ngày đăng</TableHead>
                <TableHead className="px-4 py-2 text-center">Đến hạn</TableHead>
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
                    <Label>
                      {job.name}
                    </Label>
                  </TableCell>
                  <TableCell className="px-4 py-2 text-center">
                    {dayjs(job.createdAt).format("DD/MM/YYYY")}
                  </TableCell>
                  <TableCell className="px-4 py-2 text-center">
                    {dayjs(job.expiredAt).format("DD/MM/YYYY")}
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
