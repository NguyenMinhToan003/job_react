import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getApplyJobByJobId } from "@/apis/applyJobAPI";
import { ApplyJobResponse } from "@/types/applyJobType";
import {
  Card, CardHeader, CardTitle, CardContent
} from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { convertDateToString } from "@/utils/dateTime";
import { JobResponse } from "@/types/jobType";
import JobMenu from "@/components/elements/job/MenuMore";
import EmployerResumeMenu from "@/components/elements/applyJob/ApplyJobMenu";
import { buttonAction } from "@/utils/renderButton";

export default function JobDetailCompany() {
  const { jobId } = useParams<{ jobId: string }>();
  const [list, setList] = useState<ApplyJobResponse[]>([]);
  const [job, setJob] = useState<JobResponse>();
  const [loading, setLoading] = useState(true);

  // Fetch ứng viên đã apply vào job
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


  return (
    <Card className="w-full mt-4 mr-4 h-fit shadow-none border border-gray-200 rounded-xl">
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex justify-between items-center">
          <span>Danh sách ứng tuyển</span>
          {
            job && <JobMenu job={job} />
          }
        </CardTitle>
      </CardHeader>

      <CardContent>
        {loading ? (
          <p className="text-gray-500 text-center py-8">Đang tải dữ liệu...</p>
        ) : list.length === 0 ? (
          <p className="text-gray-500 text-center py-8">Chưa có ứng viên nào ứng tuyển.</p>
        ) : (
          <Table className="min-w-[1000px] text-sm">
            <TableHeader>
              <TableRow>
                <TableHead className="pl-3 text-left text-xs text-gray-700">Hồ sơ ứng viên</TableHead>
                <TableHead className="pl-3 text-left text-xs text-gray-700">Mức phù hợp</TableHead>
                <TableHead className="pl-3 text-left text-xs text-gray-700">Tin đăng</TableHead>
                <TableHead className="pl-3 text-left text-xs text-gray-700">Thời gian nộp</TableHead>
                <TableHead className="text-right text-xs text-gray-700">Trạng thái</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {list.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="pl-3 space-y-1">
                    <div className="flex items-center gap-2">
                      <Avatar><AvatarImage src={item.resumeVersion.avatar} /></Avatar>
                      <span className="font-semibold text-neutral-700">{item.resumeVersion.username}</span>
                    </div>
                    {
                      <Badge className="text-gray-400 bg-gray-100">{item.viewStatus === 1 ? 'Đã xem' : 'Chưa xem'}</Badge>
                    }
                    <div className='flex-1 flex-wrap gap-2 mt-2 flex max-w-50'>
                    {
                      item.tagResumes.length > 0 && item.tagResumes.map(tag => (
                        <Button
                          variant='ghost'
                          className='bg-transparent hover:bg-transparent cursor-pointer !p-0'
                          key={tag.id}>
                          <Label
                          className='px-2  rounded-xl  leading-6 text-neutral-600 cursor-pointer'
                          style={{ backgroundColor: tag.color }}
                        >
                          
                          <span>
                            {tag.name}
                          </span>
                        </Label>
                        </Button>
                      ))
                    }
                    </div>
                  </TableCell>

                  <TableCell>
                    <Badge
                      variant="outline"
                      className="cursor-pointer bg-[#F0F4FF] text-[#2C95FF] hover:bg-[#E0EFFF] hover:text-[#1A73E8] font-semibold"
                    >
                      {item.matchingScore.toFixed(2)}%
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <Label className='text-neutral-700'>{item.job.name}</Label>
                  </TableCell>

                  <TableCell>
                    <Label>{convertDateToString(item.time)}</Label>
                  </TableCell>

                  <TableCell>
                    <div className="flex justify-end items-center gap-1">
                      {buttonAction(item.status)}
                      <EmployerResumeMenu applyJob={item} />
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
