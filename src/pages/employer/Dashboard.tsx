/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Users, Briefcase, Eye, Package, CreditCard } from 'lucide-react'
import { toast } from 'sonner'
import { getPackageAvailable } from '@/apis/paymentAPI'
import { getViewDashboardAPI } from '@/apis/viewJobAPI'
import { getCountJobDashboard } from '@/apis/jobAPI'
import { getApplyJobDashboard } from '@/apis/applyJobAPI'
import { PackageResponse } from '@/types/packageType'
import { Skeleton } from '@/components/ui/skeleton'
import { useNavigate } from 'react-router-dom'


export default function EmployerDashboard() {
  const [loading, setLoading] = useState(false)
  const [packagesAvailable, setPackagesAvailable] = useState<PackageResponse[]>([])
  const [viewJobs, setViewJobs] = useState<number>(0)
  const navigate = useNavigate()
  const [countJobs, setCountJobs] = useState<{
    total: number
    active: number
    pending: number
    expired: number
  }>({
    total: 0,
    active: 0,
    pending: 0,
    expired: 0,
  })
  const [countApplyJobs, setCountApplyJobs] = useState<{
    totalApply: number
    notViewed: number
  }>({
    totalApply: 0,
    notViewed: 0,
  })

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const dataPackages = await getPackageAvailable()
      setPackagesAvailable(dataPackages)
      const viewJobCount = await getViewDashboardAPI()
      setViewJobs(viewJobCount)
      const countJobs = await getCountJobDashboard();
      setCountJobs(countJobs);
      const countApplyJobs = await getApplyJobDashboard();
      setCountApplyJobs(countApplyJobs);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Lỗi không xác định khi tải dữ liệu dashboard')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className='container mx-auto  p-6 space-y-6 w-full'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className='animate-pulse'>
                <Skeleton className='h-6 w-1/2 mb-2' />
              </CardHeader>
              <CardContent className='animate-pulse'>
                <div className='space-y-4'>
                  <Skeleton className='h-8 w-3/4' />
                  <Skeleton className='h-6 w-1/2' />
                  <Skeleton className='h-6 w-full' />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className='container mx-auto p-6 space-y-6 w-full'>
      {/* Stats Cards */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Tổng tin tuyển dụng</CardTitle>
            <Briefcase className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{countJobs.total}</div>
            <p className='text-xs text-muted-foreground'>{countJobs.active} tin đang hoạt động</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Tổng ứng tuyển</CardTitle>
            <Users className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{countApplyJobs.totalApply}</div>
            <p className='text-xs text-muted-foreground'>+{countApplyJobs.notViewed} ứng tuyển mới</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Lượt xem công việc</CardTitle>
            <Eye className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{viewJobs?.toLocaleString()}</div>
            <p className='text-xs text-muted-foreground'>Trong 30 ngày qua</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Credits còn lại</CardTitle>
            <Package className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{packagesAvailable.length}</div>
            <p className='text-xs text-muted-foreground'>gói có thể sử dụng</p>
          </CardContent>
        </Card>
      </div>

      {/* Package Cards */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        {packagesAvailable.map((pkg) => {
          const usagePercentage = pkg.sub_total ? ((pkg.sub_used || 0) / pkg.sub_total) * 100 : 0

          return (
            <Card key={pkg.id} className='group hover:shadow-lg transition-shadow duration-300'>
              <CardHeader>
                  <div className="space-y-3">
                    <div className="relative overflow-hidden bg-gray-50">
                      <img
                        src={pkg.image || "/placeholder.svg"}
                        alt={pkg.name}
                        className="w-full h-32 object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <CardTitle className="text-lg text-gray-900 font-semibold">{pkg.name}</CardTitle>
                  </div>
                </CardHeader>
              <CardContent className='space-y-4'>
                <div>
                  <div className='flex justify-between text-sm mb-2'>
                    <span>Đã sử dụng</span>
                    <span>
                      {pkg.sub_used || 0}/{pkg.sub_total || 0}
                    </span>
                  </div>
                  <Progress value={usagePercentage} className='h-2 ' />
                </div>

                <div className='flex gap-2'>
                  <Button variant='outline' size='sm' className='flex-1 text-[#451DA0] hover:text-[#451DA0]  bg-white hover:bg-white rounded-sm'
                    onClick={() => navigate(`/danh-cho-nha-tuyen-dung/dich-vu`)}
                  >
                    Xem chi tiết
                  </Button>
                  <Button size='sm' className='flex-1 text-[#451DA0] hover:text-[#451DA0] bg-[#EDECFF] hover:bg-[#EDECFF] rounded-none' disabled={usagePercentage >= 100}
                    onClick={() => navigate(`/danh-cho-nha-tuyen-dung/dang-tin-tuyen-dung`)}
                  >
                    Sử dụng
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Mua gói dịch vụ mới</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='text-center py-8'>
            <Package className='h-16 w-16 text-gray-400 mx-auto mb-4' />
            <h3 className='text-lg font-semibold mb-2'>Cần thêm credits?</h3>
            <p className='text-gray-600 mb-4'>Mua gói dịch vụ để đăng thêm tin tuyển dụng</p>
            <Button
              onClick={() => navigate(`/danh-cho-nha-tuyen-dung/bang-gia`)}
            >
              <CreditCard className='h-4 w-4 mr-2' />
              Xem gói dịch vụ
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
