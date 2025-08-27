/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { getJobByCompanyId } from "@/apis/jobAPI";
import { CompanyFilterJob, JobFilterResponse } from "@/types/jobType";
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
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { convertDateToString } from "@/utils/dateTime";
import JobMenu from "@/components/elements/job/menuMore";

export default function ExpiredJobs() {
  
  const [jobList, setJobList] = useState<JobFilterResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchJobList = async () => {
    try {
      const response = await getJobByCompanyId({
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
  const buttonAction = () => {
    return (
      <Button
        className='text-[#451DA0] hover:text-[#451DA0] bg-[#EDECFF] hover:bg-[#EDECFF] rounded-none w-24'
      >
        Hết hạn
      </Button>
    );
  }

  const switchPublicJob = () => {
    return <>
      <Switch
        disabled={true}
        checked={false}
      />
      <Label className='text-xs text-[#2C95FF] flex justify-center w-full'>
        Hết hạn
      </Label>
    </>
  }


  return (
    <Card className='w-full mt-4 mr-4 h-fit shadow-none border border-gray-200 rounded-xl'>
      <CardContent className='overflow-x-auto'>
        {loading ? (
          <p className='text-center text-gray-600 py-12'>Đang tải dữ liệu...</p>
        ) : jobList.length === 0 ? (
          <p className='text-center text-gray-600 py-12'>
            Chưa có công việc nào được đăng tuyển.
          </p>
        ) : (
          <Table className=' text-sm'>
            <TableHeader>
                  <TableRow >
                <TableHead className='text-gray-700 text-xs text-left pl-3'>Mã</TableHead>
                <TableHead className='text-gray-700 text-xs text-left pl-3'>Tên công việc</TableHead>
                <TableHead className='text-gray-700 text-xs text-center'>CV</TableHead>
                <TableHead className='text-gray-700 text-xs text-center'>Thời hạn</TableHead>
                <TableHead className='text-gray-700 text-xs text-center'>Hoạt động</TableHead>
                <TableHead className='text-gray-700 text-xs text-center pr-3'>Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className='z-1'>
              {jobList.map((job) => (
                <TableRow
                  key={job.id}
                  className='hover:bg-gray-100 transition-all cursor-pointer group'
                >
                  <TableCell className='pl-3 text-gray-500'>
                    {job.id}
                  </TableCell>
                  <TableCell >
                    <Button variant='link' className='p-0 text-[#080808] group-hover:text-[#2C95FF] group-hover:underline'
                      onClick={() =>navigate(`/danh-cho-nha-tuyen-dung/danh-sach-ung-tuyen/${job.id}`)}
                    >
                      {job.name}
                    </Button>
                  </TableCell>
                  <TableHead className=' text-center font-bold text-[#2C95FF]'>
                    {job.applyJobs.length} cv
                  </TableHead>
                  <TableCell className=' flex justify-center items-center flex-col gap-3'>
                    <Label>{convertDateToString(job.createdAt)} -</Label>
                    <Label>{convertDateToString(job.expiredAt)}</Label>
                  </TableCell>

                  <TableCell className='text-center'>
                    {switchPublicJob()}
                  </TableCell>
                  <TableCell className=' text-center'>
                    <div className='flex justify-center items-center'>
                    {buttonAction()}
                    <JobMenu job={job} />
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
