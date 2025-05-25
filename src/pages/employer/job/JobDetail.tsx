import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getApplyJobByJobId } from "@/apis/applyJobAPI";
import { ApplyJobResponse } from "@/types/applyJobType";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Job } from "@/types/jobType";
import { Button } from "@/components/ui/button";

export default function JobDetailCompany() {
  const { jobId } = useParams();
  const job = { id: Number(jobId) } as Job;
  const [list, setList] = useState<ApplyJobResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!jobId) return;
    const fetchData = async () => {
      try {
        console.log(job)
        const res = await getApplyJobByJobId(job);
        setList(res);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách ứng tuyển:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [job, jobId]);

  const renderStatus = (status: string) => {
    switch (status) {
      case 'UNG_TUYEN':
        return <Badge variant="secondary">Chờ phản hồi</Badge>;
      case 'THANH_CONG':
        return <Badge variant="default">Đã phản hồi</Badge>;
      case 'HUY':
        return <Badge variant="outline">Hẹn phỏng vấn</Badge>;
      case 'TU_CHOI':
        return <Badge variant="destructive">Từ chối</Badge>;
      default:
        return <Badge>Không xác định</Badge>;
    }
  };

  return (
    <Card className="w-full shadow-md">
      <CardHeader>
        <CardTitle className="text-xl font-bold">
          Danh sách ứng viên ứng tuyển
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-gray-500 text-center py-8">Đang tải dữ liệu...</p>
        ) : list.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            Chưa có ứng viên nào ứng tuyển.
          </p>
        ) : (
          <Table className="min-w-[1000px] text-sm">
            <TableHeader>
                  <TableRow>
                <TableHead>Ứng viên</TableHead>
                    <TableHead>Ghi chú</TableHead>
                    <TableHead>CV</TableHead>
                <TableHead>Thời gian nộp</TableHead>
                <TableHead>Trạng thái</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {list.map((item) => (
                <TableRow key={item.id}>
                  
                  <TableCell className="flex items-center gap-2">
                    <Avatar>
                      <AvatarImage
                        src={item.cv.candidate.avatar}
                        alt={item.cv.candidate.name}
                      />
                    </Avatar>
                    <span className="font-medium">{item.cv.candidate.name}</span>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="link"
                      onClick={() => {
                        window.open(item.cv.url, "_blank");
                      }}
                    >
                      Xem CV
                    </Button>
                  </TableCell>
                  <TableCell>{item.note || "Không có ghi chú"}</TableCell>
                  <TableCell>
                    {new Date(item.time).toLocaleString("vi-VN")}
                  </TableCell>
                  <TableCell>{renderStatus(item.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
