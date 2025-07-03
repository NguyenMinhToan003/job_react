/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react'
import { getPackageAdmin, deletePackage, changeStatusPackage } from '@/apis/paymentAPI'
import type { PackageResponse } from '@/types/packageType'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

import {
  Search,
  Trash2,
  Package,
  TrendingUp,
  Users,
  DollarSign,
  Calendar,
} from 'lucide-react'
import { toast } from 'sonner'
import { PackageType } from '@/types/type'
import { useAlertDialog } from '@/providers/AlertDialogProvider'
import FormCreatePackage from '@/components/elements/job/package-component/FormCreatePackage'
import { convertPrice } from '@/utils/convertPrice'
import { Switch } from '@/components/ui/switch'
import { useNavigate } from 'react-router-dom'


export default function PackagesAdmin() {
  const [packages, setPackages] = useState<PackageResponse[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [search, setSearch] = useState<string>('')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const { showAlert } = useAlertDialog()
  const [isChange, setIsChange] = useState<boolean>(false)
  const navigate = useNavigate()

  useEffect(() => {
    setLoading(true)
    fetchPackages()
    setLoading(false)
  }, [])
  useEffect(() => {
    if (isChange) {
      fetchPackages()
      setIsChange(false)
    }
  }, [isChange])

  const fetchPackages = async () => {
    try {
      const data = await getPackageAdmin()
      setPackages(data)
    } catch (error) {
      console.error('Lỗi khi lấy danh sách gói:', error)
      toast.error('Có lỗi xảy ra khi tải danh sách gói dịch vụ')
    }
  }

  const handleToggleStatus = async (pkg: PackageResponse) => {
    try {
      await changeStatusPackage(pkg.id)
      setIsChange(true)
    }
    catch (error: any) {
      toast.error(error?.response?.data?.message || 'Có lỗi xảy ra khi thay đổi trạng thái gói dịch vụ')
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deletePackage(id)
      toast.success('Xóa gói dịch vụ thành công')
      fetchPackages()
    } catch (error: any) {
      console.error('Error deleting package:', error)
      toast.error(error?.response?.data?.message || 'Có lỗi xảy ra khi xóa gói dịch vụ')
    }
  }

  // Statistics
  const totalPackages = packages.length
  const totalRevenue = packages.reduce((sum, pkg) => sum + pkg.price * (pkg.employerSubscriptions?.length || 0), 0)
  const totalSubscriptions = packages.reduce((sum, pkg) => sum + (pkg.employerSubscriptions?.length || 0), 0)
  const packageTypes = [...new Set(packages.map((pkg) => pkg.type))].length

  const getPackageTypeName = (type: string) => {
    switch (type) {
      case PackageType.JOB:
        return 'Gói hiệu ứng tin tuyển dụng'
      case PackageType.EMPLOYER:
        return 'Gói nhà tuyển dụng'
      case PackageType.BANNER:
        return 'Gói công việc gấp'
      default:
        return type
    }
  }

  return (
    <div className='space-y-6'>
      {/* Statistics Cards */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Tổng gói dịch vụ</CardTitle>
            <Package className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{totalPackages}</div>
            <p className='text-xs text-muted-foreground'>{packageTypes} loại gói khác nhau</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Tổng đăng ký</CardTitle>
            <Users className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{totalSubscriptions}</div>
            <p className='text-xs text-muted-foreground'>Doanh nghiệp đang sử dụng</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Tổng doanh thu</CardTitle>
            <DollarSign className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{convertPrice(totalRevenue, null)}</div>
            <p className='text-xs text-muted-foreground'>Từ tất cả gói dịch vụ</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Trung bình/gói</CardTitle>
            <TrendingUp className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {totalPackages > 0 ? Math.round(totalSubscriptions / totalPackages) : 0}
            </div>
            <p className='text-xs text-muted-foreground'>Đăng ký trung bình</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <CardTitle>Quản lý gói dịch vụ</CardTitle>
            <FormCreatePackage
              setIsChange={setIsChange}
            />
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className='flex flex-col sm:flex-row gap-4 mb-6'>
            <div className='flex-1 relative'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4' />
              <Input
                placeholder='Tìm kiếm theo tên gói, loại...'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className='pl-10'
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className='w-48'>
                <SelectValue placeholder='Lọc theo loại' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>Tất cả loại</SelectItem>
                <SelectItem value={PackageType.JOB}>Gói đăng tin</SelectItem>
                <SelectItem value={PackageType.EMPLOYER}>Gói nhà tuyển dụng</SelectItem>
                <SelectItem value={PackageType.BANNER}>Gói quảng cáo</SelectItem>
                <SelectItem value={PackageType.REFRESH}>Gói làm mới</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className='rounded-md border'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Gói dịch vụ</TableHead>
                  <TableHead>Loại</TableHead>
                  <TableHead>Giá</TableHead>
                  <TableHead>Thời hạn</TableHead>
                  <TableHead>Đăng ký</TableHead>
                  <TableHead>Doanh thu</TableHead>
                  <TableHead className='text-right'>Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className='text-center py-8'>
                      <div className='flex items-center justify-center'>
                        <div className='animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900'></div>
                        <span className='ml-2'>Đang tải...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : packages.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className='text-center py-8 text-gray-500'>
                      Không có gói dịch vụ nào
                    </TableCell>
                  </TableRow>
                ) : (
                  packages.map((pkg) => (
                    <TableRow key={pkg.id}>
                      <TableCell>
                        <div className='flex items-center gap-3'>

                          <Avatar className='h-10 w-10'>
                            <AvatarImage src={pkg.image || '/placeholder.svg'} alt={pkg.name} />
                            <AvatarFallback>
                              <Package className='h-5 w-5' />
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className='font-medium'>{pkg.name}</div>
                            <div className='text-sm text-gray-500'>ID: {pkg.id}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant='outline'>{getPackageTypeName(pkg.type)}</Badge>
                      </TableCell>
                      <TableCell className='font-medium'>{convertPrice(pkg.price,null)}</TableCell>
                      <TableCell>
                        <div className='flex items-center gap-1'>
                          <Calendar className='h-4 w-4 text-gray-400' />
                          {pkg.dayValue} ngày
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className='flex items-center gap-1'>
                          <Users className='h-4 w-4 text-gray-400' />
                          {pkg.employerSubscriptions?.length || 0}
                        </div>
                      </TableCell>
                      <TableCell className='font-medium'>
                        {convertPrice(pkg.price * (pkg.employerSubscriptions?.length || 0),null)}
                      </TableCell>
                      <TableCell className='text-right'>
                        <div className='flex items-center justify-end gap-2'>
                          <Switch
                            checked={pkg.status}
                            onCheckedChange={() => handleToggleStatus(pkg)}
                          />
                          <Button
                            variant='outline'
                            size='sm'
                            onClick={() => navigate(`/admin/goi-dich-vu/${pkg.id}`)}
                          >
                            <span className='flex items-center gap-1'>
                              <Users className='h-4 w-4' />
                              Xem đăng ký
                            </span>
                          </Button>
                          <FormCreatePackage
                            setIsChange={setIsChange}
                            package={pkg}
                          />
                          <Button variant='ghost' size='sm' onClick={() => showAlert({
                            title: 'Xác nhận xóa gói dịch vụ',
                            content: `Bạn có chắc chắn muốn xóa gói dịch vụ "${pkg.name}"?`,
                            handleConfirm() {
                              handleDelete(pkg.id)
                            },
                            confirmText: 'Xóa',
                            cancelText: 'Hủy bỏ',
                          })}
                          >
                            <Trash2 className='h-4 w-4' />
                          </Button>
                          
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
