/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { JobResponse } from '@/types/jobType';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';


export default function JobListPendding({ jobs, setJobs }: {
  jobs: JobResponse[];
  setJobs: React.Dispatch<React.SetStateAction<JobResponse[]>>;
}
) {

  return <>
    <Card>
      <CardContent className='p-6'>
        <Table>
          <TableHeader className='bg-red-100 p-6'>
            <TableRow>
              <TableHead>Công việc</TableHead>
              <TableHead>Thời gian đăng</TableHead>
              <TableHead>Hạn</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className='text-right'>Review Job</TableHead>
            </TableRow>
          </TableHeader>
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
                <TableCell className='flex items-center gap-4'>
                  <Avatar>
                    <AvatarImage src={job.employer.logo} />
                    <AvatarFallback>{job.employer.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>{job.name}</div>
                </TableCell>
                <TableCell>
                  {new Date(job.createdAt).toLocaleDateString('vi-VN', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                  })}
                </TableCell>
                <TableCell>
                  {new Date(job.updatedAt).toLocaleDateString('vi-VN', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                  })}
                </TableCell>
                <TableCell>
                </TableCell>
                <TableCell className='text-right'>
                  <Button
                    onClick={() => {
                      window.location.href = `/admin/tuyen-dung/review/${job.id}`;
                    }}
                  >
                    review
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