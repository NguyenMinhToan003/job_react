
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { JobResponse } from "@/types/jobType";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export default function JobListExpired({ jobs, setJobs }: {
  jobs: JobResponse[];
  setJobs: React.Dispatch<React.SetStateAction<JobResponse[]>>;
}
) {

  return <>
    <Card>
      <CardContent className='p-6'>
        <Table>
          <TableRow>
            <TableHead className="text-gray-700 text-xs text-left">Tên công việc</TableHead>
            <TableHead className="text-gray-700 text-xs text-center">Thời hạn</TableHead>
            <TableHead className="text-gray-700 text-xs text-center">Gói sử dụng</TableHead>
            <TableHead className="text-gray-700 text-xs text-center">Hành động</TableHead>
          </TableRow>
          <TableBody>
            {jobs.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className='text-center py-4 text-gray-500'>
                  Không có công việc nào.
                </TableCell>
              </TableRow>
            )}
            {jobs.map((job) => (
              <TableRow key={job.id}>
                <TableCell >
                  <div className='flex items-center gap-4'>
                    <Avatar className='w-10 h-10'>
                      <AvatarImage src={job.employer.logo} />
                      <AvatarFallback>{job.employer.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold">{job.name}</div>
                      <div className="text-sm text-gray-500">{job.employer.name}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className=" flex justify-center items-center flex-col gap-3">
                  <Label>{convertDateToString(job.createdAt)} -</Label>
                  <Label>{convertDateToString(job.expiredAt)}</Label>
                </TableCell>
                <TableCell>
                  <div className='text-center'>
                    a
                  </div>
                </TableCell>
                <TableCell className='text-center'>
                  <Button
                    className="text-[#451DA0] hover:text-[#451DA0] bg-[#EDECFF] hover:bg-[#EDECFF] rounded-none w-24"
                    onClick={() => navigate(`/admin/tuyen-dung/review/${job.id}`)}
                  >
                    Xem chi tiết
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  </>
}