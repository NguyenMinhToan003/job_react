"use client"

/* eslint-disable @typescript-eslint/no-explicit-any */
import { allCandidate } from "@/apis/candidateAPI"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { CandidateResponse } from "@/types/accountType"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Search, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"
import PaginationModel1 from "@/components/elements/pagination/paginationModel1"
import { ACCOUNT_STATUS } from "@/types/type"
import { changeStatus } from "@/apis/authAPI"

export default function CandidateList() {
  const [candidates, setCandidates] = useState<CandidateResponse[]>([])
  const [search, setSearch] = useState<string>("")
  const [page, setPage] = useState<number>(1)
  const [limit, setLimit] = useState<number>(10)
  const [sortBy, setSortBy] = useState<string>("id")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [totalPages, setTotalPages] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(false)

  const fetchListCandidate = async () => {
    try {
      setLoading(true)
      const response = await allCandidate({
        search: search,
        page: page,
        limit: limit,
        sortBy: sortBy,
        sortOrder: sortOrder,
      })
      setCandidates(response.items)
      setTotalPages(response.totalPage)
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Có lỗi xảy ra khi tải danh sách ứng viên")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchListCandidate()
  }, [])

  useEffect(() => {
    fetchListCandidate()
  }, [page, limit, sortBy, sortOrder])

  const handleSearch = () => {
    setPage(1)
    fetchListCandidate()
  }
  const handleChangeStatus = async (id: number, status: ACCOUNT_STATUS) => {
    try {
      setLoading(true)
      await changeStatus({
        status,
        accountId: id,
      })
      toast.success("Cập nhật trạng thái thành công")
    }
    catch (error: any) {
      toast.error(error?.response?.data?.message || "Có lỗi xảy ra khi cập nhật trạng thái")
    } finally {
      setLoading(false)
    }
  }

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(column)
      setSortOrder("asc")
    }
  }

  const getGenderText = (gender: string) => {
    switch (gender) {
      case 'NAM':
        return "Nam"
      case 'NU':
        return "Nữ"
      default:
        return "Khác"
    }
  }


  const getSortIcon = (column: string) => {
    if (sortBy !== column) return <ArrowUpDown className="h-4 w-4" />
    return sortOrder === "asc" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Danh sách ứng viên</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Tìm kiếm theo tên, email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <Button onClick={handleSearch} disabled={loading}>
              Tìm kiếm
            </Button>
            <Select value={limit.toString()} onValueChange={(value) => setLimit(Number(value))}>
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
                  <TableHead className="cursor-pointer hover:bg-gray-50" onClick={() => handleSort("id")}>
                    <div className="flex items-center gap-2">
                      ID
                      {getSortIcon("id")}
                    </div>
                  </TableHead>
                  <TableHead>Ảnh đại diện</TableHead>
                  <TableHead className="cursor-pointer hover:bg-gray-50" onClick={() => handleSort("name")}>
                    <div className="flex items-center gap-2">
                      Tên
                      {getSortIcon("name")}
                    </div>
                  </TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Số điện thoại</TableHead>
                  <TableHead>Giới tính</TableHead>
                  <TableHead>Vai trò</TableHead>
                  <TableHead>Trạng thái</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
                        <span className="ml-2">Đang tải...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : candidates.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                      Không có ứng viên nào
                    </TableCell>
                  </TableRow>
                ) : (
                  candidates.map((candidate) => (
                    <TableRow key={candidate.id}>
                      <TableCell className="font-medium">{candidate.id}</TableCell>
                      <TableCell>
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={candidate.avatar || "/placeholder.svg"} alt={candidate.name} />
                          <AvatarFallback>{candidate.name.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                      </TableCell>
                      <TableCell className="font-medium">{candidate.name}</TableCell>
                      <TableCell>{candidate.account.email}</TableCell>
                      <TableCell>{candidate.phone || "Chưa cập nhật"}</TableCell>
                      <TableCell>{getGenderText(candidate.gender)}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{candidate.account.role}</Badge>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={candidate.account.status}
                          onValueChange={(value: ACCOUNT_STATUS) =>
                            handleChangeStatus(candidate.id, value)
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
