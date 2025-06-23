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
import { Job, JobResponse } from "@/types/jobType";
import { Button } from "@/components/ui/button";
import { convertDateToString } from "@/utils/dateTime";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import ViewResumeVersion from "@/pages/candidate/dashboard/resume/ViewResumeVersion";
import JobMenu from "@/components/elements/job/menu";
import { Label } from "@/components/ui/label";
import { APPLY_JOB_STATUS } from "@/types/type";
import EmployerResumeMenu from "@/components/elements/resume/EmployerResumeMenu";

export default function JobDetailCompany() {
  const { jobId } = useParams<{ jobId: string }>();
  const [list, setList] = useState<ApplyJobResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [job, setJob] = useState<JobResponse>();

  useEffect(() => {
    if (!jobId) return;
    const fetchData = async () => {
      try {
        const res = await getApplyJobByJobId(Number(jobId));
        setList(res);
        setJob(res[0]?.job);
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
  const navigate = useNavigate();
  
    const buttonAction = (action: APPLY_JOB_STATUS, jobId: number) => {
      if (action === APPLY_JOB_STATUS.HIRED) {
        return (
          <Button
            className='text-green-600 hover:text-emerald-600 bg-emerald-100 hover:bg-emerald-100 rounded-none w-24'
          >
            Đủ điều kiện
          </Button>
        );
      }
      else if (action === APPLY_JOB_STATUS.PROCESSING) {
        return (
          <Button
            className='text-gray-600 hover:text-gray-600 border border-gray-600 bg-gray-100 hover:bg-gray-100 rounded-sm w-24'
          >
            Đang xử lý
          </Button>
        );
      }
      else if (action === APPLY_JOB_STATUS.QUALIFIED) {
        return (
          <Button
            className='text-white hover:text-white bg-[#2C95FF] hover:bg-[#2C95FF] rounded-none w-24'
          >
            Phù hợp
          </Button>
        );
      }
      else if (action === APPLY_JOB_STATUS.UNQUALIFIED) {
        return (
          <Button
            className='text-red-500 hover:text-red-500 bg-red-50 hover:bg-red-50 rounded-none w-24'
          >
            Không phù hợp
          </Button>
        );
      }
      else if (action === APPLY_JOB_STATUS.INTERVIEWING) {
        return (
          <Button
            className='text-yellow-600 hover:text-yellow-600 bg-yellow-50 hover:bg-yellow-50 rounded-none w-24'
          >
            Phỏng vấn
          </Button>
        );
      }
    }
  return (
    <Card className="w-full shadow-md">
      <CardHeader>
      <CardTitle className='font-bold text-2xl flex justify-between items-center'>
          <div>DANH SACH ỨNG TUYỂN</div>
          <JobMenu job={job} />
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
                    <TableHead className="w-50 text-gray-700 text-xs text-left pl-3">Độ phù hợp</TableHead>
                    <TableHead className="text-gray-700 text-xs text-left pl-3">Ứng viên</TableHead>
                    <TableHead className="text-gray-700 text-xs text-left pl-3">Hồ sơ</TableHead>
                    <TableHead className="text-gray-700 text-xs text-left pl-3">Thời gian nộp</TableHead>
                    <TableHead className="text-gray-700 text-xs text-left pl-3">Trạng thái</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {list.map((item) => (
                <TableRow key={item.id}>
                  <TableCell
                    onClick={() => navigate(`/danh-cho-nha-tuyen-dung/danh-gia-ho-so-cong-viec/${item.id}`)}
                  >
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
                    <span className=" text-center font-bold text-[#2C95FF]">{item?.resumeVersion.username}</span>
                  </TableCell>
                  <TableCell>
                    <Sheet>
                      <SheetTrigger>
                        <Button variant='link' className="w-full  text-center font-bold text-[#2C95FF] hover:text-[#2C95FF] bg-transparent hover:bg-transparent cursor-pointer"
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
                  <TableCell>
                    <Label>
                    {
                      convertDateToString(item.time)
                    }
                    </Label>
                  </TableCell>
                  <TableCell>
                    <div className='flex justify-center items-center'>
                      {buttonAction(item.status, item.id)}
                      <EmployerResumeMenu
                        applyJob={item}
                      />
                    </div>
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
