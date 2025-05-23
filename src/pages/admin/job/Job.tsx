import { useEffect, useState } from "react";
import { getAllJob, updateJobAdmin } from "@/apis/jobAPI";
import {
  Card,
  CardHeader,
  CardTitle,
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
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { Dot } from "lucide-react";
import { toast } from "sonner";

export default function JobListPage() {
  const [jobs, setJobs] = useState<JobResponse[]>([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await getAllJob();
        setJobs(data);
      } catch (err) {
        console.error("Lỗi lấy danh sách công việc:", err);
      }
    };
    fetchJobs();
  }, []);


  const toggleStatus = async(id: number) => {
    try {
      await updateJobAdmin(id, {
        isActive: jobs.find(job => job.id === id)?.isActive === 1 ? 0 : 1,
      })
      toast.success("Thay đổi trạng thái công việc thành công");
      setJobs(prev =>
        prev.map(job =>
          job.id === id
            ? { ...job, isActive: job.isActive === 1 ? 0 : 1 }
            : job
        )
      );
    }
    catch (error) {
      toast.error(error.response.data.message);
    }

  };

  return (
    <div className="p-6 flex gap-6 bg-[#f7f7f7] w-full">
      <Card className="flex-1 w-full">
        <CardHeader>
          <CardTitle>Danh sách công việc</CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-2">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Công ty</TableHead>
                <TableHead>Công việc</TableHead>
                <TableHead>Địa điểm</TableHead>
                <TableHead>Lương</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {jobs.map((job) => (
                <TableRow key={job.id}>
                   <TableCell>
                    <Avatar>
                      <AvatarImage
                        src={job.company.logo}
                        alt="Company Logo"
                      />
                      <AvatarFallback>
                        {job.company.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell>
                    <Button 
                      className="text-left w-fit justify-start text-sm "
                      variant="link"
                      onClick={() => {
                      }}
                    >
                      {job.name}
                    </Button>
                  </TableCell>
                  <TableCell className="flex flex-col flex-start">
                    {
                      job.locations.map((location) => (
                        <>
                          <Button
                            className="text-left w-fit justify-start"
                            key={location.id}
                            variant="link"
                            onClick={() => {
                            }}
                          >
                            <Dot/>{location.name}
                          </Button>
                        </>
                      ))
                    }
                  </TableCell>
                  <TableCell>
                    {job.minSalary === -9999 && job.maxSalary === -9999
                      ? "Thương lượng"
                      : `${job.minSalary.toLocaleString()} - ${job.maxSalary.toLocaleString()} đ`}
                  </TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        "px-2 py-1 text-sm rounded",
                        job.isActive === 1
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-600"
                      )}
                    >
                      {job.isActive === 1 ? "Hoạt động" : "Tạm khóa"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => toggleStatus(job.id)}
                    >
                      {job.isActive === 1 ? "Khóa" : "Kích hoạt"}
                    </Button>
                    <Button>Sửa</Button>
                  </TableCell>
                </TableRow>
              ))}
              {jobs.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-4 text-gray-500">
                    Không có công việc nào.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
