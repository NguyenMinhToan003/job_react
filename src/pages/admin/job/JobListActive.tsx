/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Table, TableRow, TableHead, TableBody, TableCell, TableHeader } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import {
  Search,
  ArrowUpDown,
  Briefcase,
  Building2,
  Calendar,
  Clock,
  Eye,
  Package,
  CheckCircle,
} from 'lucide-react'
import { JobDetailResponse } from '@/types/jobType'
import { convertDateToString, convertRemainingTime } from '@/utils/dateTime'
import PaginationModel1 from '@/components/elements/pagination/PaginationModel1'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { filterJobAdmin } from '@/apis/jobAPI'
import { JOB_STATUS } from '@/types/type'
import { useNavigate } from 'react-router-dom'

export default function JobListActive() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<JobDetailResponse[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(20);
  const [sortBy, setSortBy] = useState<string>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [search, setSearch] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const fetchJobs = async () => {
    try {
      setIsLoading(true);
      const response = await filterJobAdmin({
        isActive: [JOB_STATUS.ACTIVE],
        isExpired: 0,
        limit,
        page,
        sortBy,
        sortOrder,
        search,
      })
      setJobs(response.data);
      setTotalPages(response.totalPages);
    }
    catch (error: any) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi tải danh sách công việc');
    }
    finally {
      setIsLoading(false);
    }
  }
  useEffect(() => {
    fetchJobs();
  }, [page, limit, sortBy, sortOrder]);

  return (
    <div className='space-y-6'>
      <Card>

        <CardContent>

          <div className='flex flex-col sm:flex-row gap-4 mb-6'>
            <div className='flex-1 relative'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4' />
              <Input placeholder='Tìm kiếm theo tên công việc, công ty, kỹ năng...' className='pl-10'
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
              />
            </div>
            <Button
              onClick={() => {
                setPage(1);
                fetchJobs();
              }}
            >Tìm kiếm</Button>
            <Select 
              defaultValue={limit.toString()}
              onValueChange={(value) => {
                setLimit(Number(value));
                setPage(1);
              }}
            >
              <SelectTrigger className='w-32'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='5'>5 / trang</SelectItem>
                <SelectItem value='10'>10 / trang</SelectItem>
                <SelectItem value='20'>20 / trang</SelectItem>
                <SelectItem value='50'>50 / trang</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className='rounded-md border'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className='cursor-pointer hover:bg-gray-50'>
                    <div className='flex items-center gap-2'>
                      <Briefcase className='h-4 w-4' />
                      Tên công việc
                      <ArrowUpDown className='h-4 w-4'
                        onClick={() => {
                          setSortBy('name');
                          setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                        }}
                      />
                    </div>
                  </TableHead>
                  <TableHead className='cursor-pointer hover:bg-gray-50'>
                    <div className='flex items-center gap-2 justify-center'>
                      <Calendar className='h-4 w-4' />
                      Thời hạn
                      <ArrowUpDown className='h-4 w-4'
                        onClick={() => {
                          setSortBy('createdAt');
                          setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                        }}
                      />
                    </div>
                  </TableHead>
                  <TableHead className='text-center'>
                    <div className='flex items-center gap-2 justify-center'>
                      <Package className='h-4 w-4' />
                      Gói sử dụng
                    </div>
                  </TableHead>
                  <TableHead className='text-center'>
                    <div className='flex items-center gap-2 justify-center'>
                      <Clock className='h-4 w-4' />
                      Trạng thái
                    </div>
                  </TableHead>
                  <TableHead className='text-center'>Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {
                  isLoading && (
                    <TableRow>
                      <TableCell colSpan={5} className='text-center py-8'>
                        <div className='flex justify-center items-center gap-2'>
                          <span>Đang tải dữ liệu...</span>
                          <div className='animate-spin rounded-full h-6 w-6 border-t-2 border-blue-500'></div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                }
                {!isLoading && jobs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className='text-center py-8 text-gray-500'>
                      Không có công việc nào.
                    </TableCell>
                  </TableRow>
                ) : (
                  jobs.map((job) => (
                    <TableRow key={job.id}>
                      <TableCell>
                        <div className='flex items-center gap-4'>
                          <Avatar className='w-10 h-10'>
                            <AvatarImage src={job.employer?.logo || '/placeholder.svg'} alt={job.employer?.name} />
                            <AvatarFallback>
                              <Building2 className='h-5 w-5' />
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className='font-semibold flex items-center gap-2'>
                              {job.name}

                            </div>
                            <div className='text-sm text-gray-500 flex items-center gap-1'>
                              <Building2 className='h-3 w-3' />
                              {job.employer?.name}
                            </div>
                            <div className='text-xs text-gray-400 flex items-center gap-2 mt-1'>
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
                        <div className='flex justify-center items-center flex-col gap-2'>
                          <div className='text-sm flex items-center gap-1'>
                            <Calendar className='h-3 w-3' />
                            <Label className='text-xs'>
                              {convertDateToString(job.createdAt)} -
                            </Label>
                          </div>
                          <div className='text-sm flex items-center gap-1'>
                            <Clock className='h-3 w-3' />
                            <Label className='text-xs'>
                              {convertDateToString(job.expiredAt)}
                            </Label>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className='text-center flex flex-col gap-2'>
                          {job.employerSubscription?.length > 0 ? (
                            job.employerSubscription.map((sub) => (
                              <div key={sub.id} className='space-y-1'>
                                <div className='text-xs font-semibold flex items-center justify-center gap-1'>
                                  <Package className='h-3 w-3' />
                                  {sub.package?.name}
                                </div>
                                <div className='text-xs text-gray-600'>
                                  {convertRemainingTime(sub.endDate)}
                                </div>
                              </div>
                            ))
                          ) : (
                            <span className='text-xs text-gray-500'>Không có gói</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className='text-center'>
                        {
                          job.isShow ? (
                            <Badge className='bg-green-100 text-green-800 text-xs'> 
                              <CheckCircle className='h-3 w-3' />
                              Đang hoạt động
                            </Badge>
                          ) : (
                            <Badge className='bg-red-100 text-red-800 text-xs'>
                              <CheckCircle className='h-3 w-3' />
                              Đã hết hạn
                            </Badge>
                          )
                        }
                      </TableCell>
                      <TableCell className='text-center'>
                        <Button variant='outline' size='sm' className='flex items-center gap-2'
                          onClick={() => {navigate(`/admin/tuyen-dung/review/${job.id}`)}}>
                          <Eye className='h-4 w-4' />
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
            page={page}
            setPage={setPage}
            totalPages={totalPages}
          />
        </CardContent>
      </Card>
    </div>
  )
}
