/* eslint-disable @typescript-eslint/no-explicit-any */
import { updateJobAdmin } from "@/apis/jobAPI";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { JobResponse } from "@/types/jobType";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";

export default function JobListExpired({ jobs, setJobs }: {
  jobs: JobResponse[];
  setJobs: React.Dispatch<React.SetStateAction<JobResponse[]>>;
}
) {

  const toggleStatus = async (id: number) => {
  };
  return <>
    <Card>
      <CardContent className="p-6">
        <Table>
          <TableHeader className="bg-red-100 p-6">
            <TableRow>
              <TableHead>Công việc</TableHead>
              <TableHead>Thời gian đăng</TableHead>
              <TableHead>Hạn</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {jobs.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4 text-gray-500">
                  Không có công việc nào.
                </TableCell>
              </TableRow>
            )}
            {jobs.map((job) => (
              <TableRow key={job.id}>
                <TableCell className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={job.employer.logo} />
                    <AvatarFallback>{job.employer.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>{job.name}</div>
                </TableCell>
                <TableCell>
                  {new Date(job.createdAt).toLocaleDateString("vi-VN", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  })}
                </TableCell>
                <TableCell>
                  {new Date(job.updatedAt).toLocaleDateString("vi-VN", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  })}
                </TableCell>
                <TableCell>
                  <span
                    className={cn(
                      "px-2 py-1 text-sm rounded",
                      job.isActive === 1
                        ? "bg-green-100 text-green-600"
                        : job.isActive === 0
                          ? "bg-red-100 text-red-600"
                          : "bg-yellow-100 text-yellow-600"
                    )}
                  >
                    {job.isActive === 1
                      ? "Đã duyệt"
                      : job.isActive === 0
                        ? "Bị khóa"
                        : "Chờ duyệt"}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" onClick={() => toggleStatus(job.id)}>
                    {job.isActive === -1
                      ? "Duyệt"
                      : job.isActive === 1
                        ? "Khóa"
                        : "Mở khóa"}
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