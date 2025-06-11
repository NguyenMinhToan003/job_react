import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getApplyJobByJobId, markViewed } from "@/apis/applyJobAPI";
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
import { convertDateToString } from "@/utils/dateTime";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import ViewResumeVersion from "@/pages/candidate/dashboard/resume/ViewResumeVersion";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { MoreVertical } from "lucide-react";

export default function JobDetailCompany() {
  const { jobId } = useParams();
  const job = { id: Number(jobId) } as Job;
  const [list, setList] = useState<ApplyJobResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!jobId) return;
    const fetchData = async () => {
      try {
        const res = await getApplyJobByJobId(job);
        setList(res);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách ứng tuyển:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [jobId]);


  const markView = (applyId: number) => {
    try {
      markViewed(applyId);
    }
    catch (error) {
      console.error("Lỗi khi đánh dấu đã xem:", error);
    }
  }
  const navigate= useNavigate();
  const { id } = job;
  return (
    <Card className="w-full shadow-md">
      <CardHeader>
      <CardTitle className='font-bold text-2xl flex justify-between items-center'>
          <div>DANH SACH ỨNG TUYỂN</div>
          <Popover>
            <PopoverTrigger>
              <Button
              >
                <MoreVertical />
            </Button>
            </PopoverTrigger>
            <PopoverContent className='w-fit p-0 flex flex-col'>
              <Button variant={'ghost'} className='w-full hover:bg-blue-500 hover:text-white rounded-none'
                onClick={() => navigate(`/danh-cho-nha-tuyen-dung/cap-nhat-tuyen-dung/${id}`)}>
                Chỉnh sửa trọng số
              </Button>
            </PopoverContent>
          </Popover>
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
                    <TableHead className="w-[200px]">Độ phù hợp</TableHead>
                    <TableHead>Ứng viên</TableHead>
                    <TableHead>Hồ sơ</TableHead>
                    <TableHead>Lời nhắn</TableHead>
                    <TableHead>Thời gian nộp</TableHead>
                    <TableHead>Trạng thái</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {list.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Badge >
                      {item.matchingScore.toFixed(2)}%
                    </Badge>
                  </TableCell>
                  <TableCell className="flex items-center gap-2">
                    <Avatar>
                      <AvatarImage
                        src={item?.resumeVersion.avatar}
                      />
                    </Avatar>
                    <span className="font-medium">{item?.resumeVersion.username}</span>
                  </TableCell>
                  <TableCell>
                    <Sheet>
                      <SheetTrigger>
                        <Button variant='link' className="w-full font-semibold"
                          onClick={() => !item.viewStatus && markView(item.id)}
                        >
                          Xem hồ sơ
                       </Button>
                      </SheetTrigger>
                      <SheetContent className="min-w-3xl z-[99999] h-[100vh] overflow-y-auto p-2 bg-gray-200">
                        <ViewResumeVersion
                          resumeVerIdOption={item.resumeVersion.id}
                        />
                      </SheetContent>
                    </Sheet>
                  </TableCell>
                  <TableCell>{item.note || "Không có ghi chú"}</TableCell>
                  <TableCell>
                    {
                      convertDateToString(item.time)
                    }
                  </TableCell>
                  <TableCell>{item.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
