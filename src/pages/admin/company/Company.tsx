'use client'

import { useEffect, useState } from 'react'
import { allEmployer } from '@/apis/companyAPI'
import { changeStatus } from '@/apis/authAPI'
import type { EmployerDetailResponse } from '@/types/companyType'
import { ACCOUNT_STATUS } from '@/types/type'

import {
  Search, ArrowUpDown, ArrowUp, ArrowDown,
  Building2, MapPin,
  ExternalLink, Phone, Globe
} from 'lucide-react'
import { toast } from 'sonner'
import PaginationModel1 from '@/components/elements/pagination/PaginationModel1'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

export default function CompanyListPage() {
  const [companies, setCompanies] = useState<EmployerDetailResponse[]>([])
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [sortBy, setSortBy] = useState('id')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(false)

  const fetchCompanies = async () => {
    try {
      setLoading(true)
      const data = await allEmployer({ page, limit, search, sortBy, sortOrder })
      setCompanies(data.items)
      setTotalPages(data.totalPage)
    } catch (err) {
      console.error('Fetch error:', err)
      toast.error('Không thể tải danh sách công ty')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchCompanies() }, [])
  useEffect(() => { fetchCompanies() }, [page, limit, sortBy, sortOrder])

  const handleSearch = () => {
    setPage(1)
    fetchCompanies()
  }

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(column)
      setSortOrder('asc')
    }
  }

  const getSortIcon = (column: string) => {
    if (sortBy !== column) return <ArrowUpDown className='h-4 w-4' />
    return sortOrder === 'asc' ? <ArrowUp className='h-4 w-4' /> : <ArrowDown className='h-4 w-4' />
  }

  const handleChangeStatus = async (companyId: number, status: ACCOUNT_STATUS) => {
    try {
      await changeStatus({
        status,
        accountId: companyId,
      })
      toast.success('Thay đổi trạng thái thành công')
      fetchCompanies()
    } catch (err) {
      toast.error('Lỗi thay đổi trạng thái')
    }
  }

  return (
    <div className='space-y-6'>
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Building2 className='w-5 h-5' />
            Danh sách công ty
          </CardTitle>
        </CardHeader>

        <CardContent>
          {/* Filters */}
          <div className='flex flex-col sm:flex-row gap-4 mb-6'>
            <div className='flex-1 relative'>
              <Search className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4' />
              <Input
                placeholder='Tìm kiếm theo tên, MST...'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className='pl-10'
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <Button onClick={handleSearch} disabled={loading}>
              Tìm kiếm
            </Button>
            <Select value={limit.toString()} onValueChange={(v) => setLimit(Number(v))}>
              <SelectTrigger className='w-32'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[5, 10, 20, 50].map(n => (
                  <SelectItem key={n} value={n.toString()}>{n} / trang</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className='rounded-md border'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead onClick={() => handleSort('id')} className='cursor-pointer hover:bg-gray-50'>
                    <div className='flex items-center gap-2'>ID {getSortIcon('id')}</div>
                  </TableHead>
                  <TableHead>Logo</TableHead>
                  <TableHead onClick={() => handleSort('name')} className='cursor-pointer hover:bg-gray-50'>
                    <div className='flex items-center gap-2'>Tên công ty {getSortIcon('name')}</div>
                  </TableHead>
                  <TableHead>Thông tin liên hệ</TableHead>
                  <TableHead>Quy mô</TableHead>
                  <TableHead>Lĩnh vực</TableHead>
                  <TableHead>Quốc gia</TableHead>
                  <TableHead>Việc làm</TableHead>
                  <TableHead>Trạng thái</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={10} className='text-center py-8'>Đang tải...</TableCell>
                  </TableRow>
                ) : companies.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} className='text-center py-8 text-gray-500'>Không có dữ liệu</TableCell>
                  </TableRow>
                ) : companies.map((company) => (
                  <TableRow key={company.id}>
                    <TableCell>{company.id}</TableCell>
                    <TableCell>
                      <Avatar className='w-12 h-12'>
                        <AvatarImage src={company.logo || '/placeholder.svg'} alt={company.name} />
                        <AvatarFallback><Building2 className='h-5 w-5' /></AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell>
                      <div className='font-medium'>{company.name}</div>
                      <div className='text-xs text-muted-foreground'>MST: {company.taxCode}</div>
                    </TableCell>
                    <TableCell className='text-sm space-y-1'>
                      {company.phone && (
                        <div className='flex items-center gap-1'>
                          <Phone className='h-3 w-3' />
                          {company.phone}
                        </div>
                      )}
                      {company.website && (
                        <div className='flex items-center gap-1'>
                          <Globe className='h-3 w-3' />
                          <a href={company.website} target='_blank' className='text-blue-600 hover:underline flex items-center gap-1'>
                            Website <ExternalLink className='h-3 w-3' />
                          </a>
                        </div>
                      )}
                      <div className='text-xs text-muted-foreground'>{company.account.email}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant='outline'>{company.employeeScale?.name || 'Chưa xác định'}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant='outline'>{company.businessType?.name || 'Chưa xác định'}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className='flex items-center gap-2'>
                        {company.country.flag && (
                          <img src={company.country.flag} alt='flag' className='w-5 h-4 rounded object-cover' />
                        )}
                        <span className='text-sm'>{company.country.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant='secondary'>{company.jobs?.length || 0} việc làm</Badge>
                      {company.locations?.length > 0 && (
                        <div className='flex gap-1 items-center text-xs text-muted-foreground'>
                          <MapPin className='h-3 w-3' />
                          {company.locations.length} địa điểm
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <Select
                        value={company.account.status}
                        onValueChange={(value: ACCOUNT_STATUS) =>
                          handleChangeStatus(company.id, value)
                        }
                      >
                        <SelectTrigger className='w-[140px] h-8 text-xs'>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={ACCOUNT_STATUS.CREATED}>Chưa xét duyệt</SelectItem>
                          <SelectItem value={ACCOUNT_STATUS.ACTIVE}>Đã xét duyệt</SelectItem>
                          <SelectItem value={ACCOUNT_STATUS.BLOCKED}>Đã khóa</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <PaginationModel1 page={page} setPage={setPage} totalPages={totalPages} />
        </CardContent>
      </Card>
    </div>
  )
}
