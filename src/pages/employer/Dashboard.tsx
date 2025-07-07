/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Package, CreditCard, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import { getPackageAvailable } from '@/apis/paymentAPI'
import { getCountJobDashboard } from '@/apis/jobAPI'
import { getApplyJobDashboard } from '@/apis/applyJobAPI'
import type { PackageResponse } from '@/types/packageType'
import { Skeleton } from '@/components/ui/skeleton'
import BarChartCompo from '@/components/elements/charts/BarChartCompo'
import { getMeNotificationAPI } from '@/apis/notiAccountAPI'
import { Label } from '@/components/ui/label'

export default function EmployerDashboard() {
  const [loading, setLoading] = useState(false)
  const [packagesAvailable, setPackagesAvailable] = useState<PackageResponse[]>([])
  const [countJobs, setCountJobs] = useState({
    total: 0,
    active: 0,
    pending: 0,
    expired: 0,
  })
  const [countApplyJobs, setCountApplyJobs] = useState({
    totalApply: 0,
    notViewed: 0,
    penddingApply: 0,
    hiredApply: 0,
    interviewApply: 0,
    qualifiedApply: 0,
  })
  const [noti, setNoti] = useState<{
    items: any[]
    total: number
    totalPage: number
    unreadCount: number
  }>({
    items: [],
    total: 0,
    totalPage: 0,
    unreadCount: 0,
  })
  const navigate = useNavigate()

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const dataPackages = await getPackageAvailable({})
      const countJobs = await getCountJobDashboard()
      const countApplyJobs = await getApplyJobDashboard()
      const noti = await getMeNotificationAPI({
        page: 1,
        limit: 5,
      })
      setNoti(noti)
      setPackagesAvailable(dataPackages)
      setCountJobs(countJobs)
      setCountApplyJobs(countApplyJobs)
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Lỗi không xác định khi tải dữ liệu dashboard')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className='container mx-auto p-6 space-y-6 w-full'>
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
                {/* Gói dịch vụ hiện có */}
                <div className='flex items-center mb-4 gap-6 overflow-hidden w-7xl'>
        {packagesAvailable.slice(0,4).map((pkg) => {
          const usagePercentage = pkg.sub_total
            ? ((pkg.sub_used || 0) / pkg.sub_total) * 100
            : 0

          return (
            <Card key={pkg.id} className='group hover:shadow-lg transition-shadow duration-300 min-w-100'>
              <CardHeader>
                <div className='space-y-3'>
                  <div className='relative overflow-hidden bg-gray-50 rounded-lg'>
                    <img
                      src={pkg.image || '/placeholder.svg?height=128&width=300'}
                      alt={pkg.name}
                      className='w-full h-32 object-cover transition-transform duration-300 group-hover:scale-105'
                    />
                    <div className='absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
                  </div>
                  <CardTitle className='text-lg text-gray-900 font-semibold'>{pkg.name}</CardTitle>
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
                  <Progress value={usagePercentage} className='h-2' />
                </div>

                <div className='flex gap-2 pt-2'>
                  <Button
                    variant='outline'
                    size='sm'
                    className='flex-1 text-[#451DA0] hover:text-[#451DA0] bg-white hover:bg-white rounded-sm'
                    onClick={() => navigate(`/danh-cho-nha-tuyen-dung/dich-vu`)}
                  >
                    Xem chi tiết
                  </Button>
                  <Button
                    size='sm'
                    className='flex-1 text-[#451DA0] hover:text-[#451DA0] bg-[#EDECFF] hover:bg-[#EDECFF] rounded-none'
                    disabled={usagePercentage >= 100}
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
      <div className='flex justify-end mb-4'> 
        <Button
          variant='outline'
          size='sm'
          className='text-[#451DA0] hover:text-[#451DA0] bg-white hover:bg-white rounded-sm'
          onClick={() => navigate(`/danh-cho-nha-tuyen-dung/dich-vu-cua-toi`)}
        >
          Xem tất cả gói dịch vụ
        </Button>
      </div>
      {/* Stats Chart */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <div className='col-span-2'>
          <BarChartCompo
            title='Hiệu quả tuyển dụng'
            barData={[
              {
                name: 'Hồ sơ ứng tuyển',
                value: countApplyJobs.totalApply,
                color: '#A5B4FC',
              },
              {
                name: 'Chưa xem',
                value: countApplyJobs.notViewed,
                color: '#22C55E',
              },
              {
                name: 'Chờ đánh giá',
                value: countApplyJobs.penddingApply,
                color: '#F59E0B',
              },
              {
                name: 'Phù hợp',
                value: countApplyJobs.qualifiedApply,
                color: '#451da1',
              },
              {
                name: 'Phỏng vấn',
                value: countApplyJobs.interviewApply,
                color: '#9277f2',
              },
              {
                name: 'Đã tuyển',
                value: countApplyJobs.hiredApply,
                color: '#2C95FF',
              },
            ]}
          />
        </div>
        <div>
          <Card className="border border-gray-200 rounded-xl shadow-none h-full">
            <CardHeader>
              <CardTitle className='flex items-center gap-2 text-lg font-semibold'>
                <AlertCircle className='text-[#451da1] w-4 h-4' />
                <Label>Thông báo</Label>
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              {noti.items.length === 0 ? (
                <div className='text-center py-6'>
                  <p className='text-gray-500 text-lg'>Không có thông báo nào.</p>
                </div>
              ) : (
                noti.items.map((item) => (
                  <div key={item.id} className='p-4 border-b last:border-0 hover:bg-neutral-200 transition-colors'>
                    <Label className='text-sm text-gray-700 line-clamp-1'>{item.content}</Label>
                  </div>
                ))
              )}
              {noti.items.length > 0 && (
                <div className='text-center mt-4'>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => navigate('/danh-cho-nha-tuyen-dung/thong-bao')}
                  >
                    Xem tất cả (có <strong>{noti.unreadCount}</strong> chưa đọc)
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        <div className='col-span-2 space-y-4'>
        <BarChartCompo
          title='Tình trạng công việc'
          barData={[
            { name: 'Tổng số công việc', value: countJobs.total, color: '#3B82F6' },
            { name: 'Đang hoạt động', value: countJobs.active, color: '#10B981' },
            { name: 'Chờ duyệt', value: countJobs.pending, color: '#F59E0B' },
            { name: 'Đã hết hạn', value: countJobs.expired, color: '#EF4444' },
          ]}
          />
           <Card>
        <CardHeader>
          <CardTitle>Mua gói dịch vụ mới</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='text-center py-8 '>
            <Package className='h-16 w-16 text-gray-400 mx-auto mb-4' />
            <h3 className='text-lg font-semibold mb-2'>Cần thêm credits?</h3>
            <p className='text-gray-600 mb-4'>Mua gói dịch vụ để đăng thêm tin tuyển dụng</p>
            <Button onClick={() => navigate(`/danh-cho-nha-tuyen-dung/bang-gia`)}>
              <CreditCard className='h-4 w-4 mr-2' />
              Xem gói dịch vụ
            </Button>
          </div>
        </CardContent>
      </Card>
        </div>

        <div>


     
        </div>
        
      </div>
    </div>
  )
}
