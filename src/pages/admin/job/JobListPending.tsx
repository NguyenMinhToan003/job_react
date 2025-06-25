/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  TableHeader,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { JobDetailResponse } from '@/types/jobType';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { convertDateToString, convertRemainingTime } from '@/utils/dateTime';
import { useNavigate } from 'react-router-dom';
import { ArrowUpDown, Briefcase, Building2, Calendar, Clock, Eye, Package, Search } from 'lucide-react';
import { Select } from '@radix-ui/react-select';
import { SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import PaginationModel1 from '@/components/elements/pagination/PaginationModel1';


export default function JobListPendding({ jobs, setJobs }: {
  jobs: JobDetailResponse[];
  setJobs: React.Dispatch<React.SetStateAction<JobDetailResponse[]>>;
}
) {
  const navigate = useNavigate();

  return <>
    <div className="space-y-6">
      <Card>

        <CardContent>
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input placeholder="Tìm kiếm theo tên công việc, công ty, kỹ năng..." className="pl-10" />
            </div>
            <Button>Tìm kiếm</Button>
            <Select defaultValue="10">
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 / trang</SelectItem>
                <SelectItem value="10">10 / trang</SelectItem>
                <SelectItem value="20">20 / trang</SelectItem>
                <SelectItem value="50">50 / trang</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="cursor-pointer hover:bg-gray-50">
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4" />
                      Tên công việc
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer hover:bg-gray-50">
                    <div className="flex items-center gap-2 justify-center">
                      <Calendar className="h-4 w-4" />
                      Thời hạn
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead className="text-center">
                    <div className="flex items-center gap-2 justify-center">
                      <Package className="h-4 w-4" />
                      Gói sử dụng
                    </div>
                  </TableHead>
                  <TableHead className="text-center">
                    <div className="flex items-center gap-2 justify-center">
                      <Clock className="h-4 w-4" />
                      Trạng thái
                    </div>
                  </TableHead>
                  <TableHead className="text-center">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {jobs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                      Không có công việc nào.
                    </TableCell>
                  </TableRow>
                ) : (
                  jobs.map((job) => (
                    <TableRow key={job.id}>
                      <TableCell>
                        <div className="flex items-center gap-4">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={job.employer?.logo || "/placeholder.svg"} alt={job.employer?.name} />
                            <AvatarFallback>
                              <Building2 className="h-5 w-5" />
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-semibold flex items-center gap-2">
                              {job.name}

                            </div>
                            <div className="text-sm text-gray-500 flex items-center gap-1">
                              <Building2 className="h-3 w-3" />
                              {job.employer?.name}
                            </div>
                            <div className="text-xs text-gray-400 flex items-center gap-2 mt-1">
                              <span>Số lượng tuyển: {job.quantity}</span>
                              {job.minSalary && job.maxSalary && (
                                <span>
                                  ${job.minSalary} - ${job.maxSalary}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-center items-center flex-col gap-2">
                          <div className="text-sm flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <Label className="text-xs">
                              {convertDateToString(job.createdAt)} -
                            </Label>
                          </div>
                          <div className="text-sm flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <Label className="text-xs">
                              {convertDateToString(job.expiredAt)}
                            </Label>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-center flex flex-col gap-2">
                          {job.employerSubscription?.length > 0 ? (
                            job.employerSubscription.map((sub) => (
                              <div key={sub.id} className="space-y-1">
                                <div className="text-xs font-semibold flex items-center justify-center gap-1">
                                  <Package className="h-3 w-3" />
                                  {sub.package?.name}
                                </div>
                                <div className="text-xs text-gray-600">
                                  {convertRemainingTime(sub.endDate)}
                                </div>
                              </div>
                            ))
                          ) : (
                            <span className="text-xs text-gray-500">Không có gói</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        Chờ duyệt
                      </TableCell>
                      <TableCell className="text-center">
                        <Button variant="outline" size="sm" className="flex items-center gap-2"
                          onClick={() => navigate(`/admin/tuyen-dung/review/${job.id}`)}
                        >
                          <Eye className="h-4 w-4" />
                          Xem chi tiết
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <PaginationModel1
            page={1}
            setPage={() => { }}
            totalPages={10}
          />
        </CardContent>
      </Card>
    </div>
  </>
}