"use client"
/* eslint-disable @typescript-eslint/no-explicit-any */

import { getAllTransactionsAdmin } from "@/apis/paymentAPI"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import type { TransactionDetailResponse } from "@/types/employerSubType"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Search,
  ArrowLeft,
  Building2,
  Calendar,
  Activity,
  Package,
  Receipt,
  Eye,
} from "lucide-react"
import { toast } from "sonner"
import { PAYMENT_STATUS } from "@/types/type"
import { convertPrice } from "@/utils/convertPrice"
import PaginationModel1 from "@/components/elements/pagination/PaginationModel1"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function TransactionsPageAdmin() {
  const navigate = useNavigate()
  const [transaction, setTransactions] = useState<TransactionDetailResponse[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [search, setSearch] = useState<string>("")
  const [page, setPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(1)
  const [limit, setLimit] = useState<number>(10)
  const [status, setStatus] = useState<PAYMENT_STATUS | null>(null)

  useEffect(() => {
    fetchSubscriptions()
  }, [page, limit])

  const fetchSubscriptions = async () => {
    try {
      setLoading(true)
      const response = await getAllTransactionsAdmin({
        page,
        limit,
        vnp_TxnRef: search,
        status: status || undefined,
      })
      setTransactions(response.items)
      setTotalPages(response.totalPages)
    } catch (error: any) {
      console.error("Error fetching transaction:", error)
      toast.error("Có lỗi xảy ra khi tải danh sách đăng ký")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6">
      <div className="flex items-center mb-4 space-x-2">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h1 className="text-xl font-semibold">Danh sách giao dịch</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Danh sách giao dịch</CardTitle>
        </CardHeader>
        <CardContent>
          
              <>
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                            <div className="flex-1 relative">
                              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                              <Input
                                placeholder="Tìm kiếm theo tên, email..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-10"
                              />
                            </div>
                  <Button onClick={
                    () => {
                      setPage(1)
                      fetchSubscriptions()
                    }
                            } disabled={loading}>
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
              <Select
                value={status || ""}
                onValueChange={(value) => {
                  setStatus(value as PAYMENT_STATUS)
                  setPage(1)
                  fetchSubscriptions()
                }}
              >
                            <SelectTrigger className="w-32">
                              <SelectValue placeholder="Trạng thái" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value={PAYMENT_STATUS.SUCCESS}>Thành công</SelectItem>
                              <SelectItem value={PAYMENT_STATUS.PENDING}>Chờ xử lý</SelectItem>
                              <SelectItem value={PAYMENT_STATUS.FAILED}>Thất bại</SelectItem>
                            </SelectContent>
              </Select>
                          </div>
            <Table>
                <TableHeader>
                  <TableRow>
                    
                  <TableHead>
                    <div className="flex items-center gap-1">
                      <Receipt className="w-4 h-4 text-muted-foreground" />
                      Mã giao dịch
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center gap-1">
                      <Building2 className="w-4 h-4 text-muted-foreground" />
                      Nhà tuyển dụng
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center gap-1">
                      <Package className="w-4 h-4 text-muted-foreground" />
                      Gói
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center gap-1">
                      <Activity className="w-4 h-4 text-muted-foreground" />
                        Số tiền
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      Ngày tạo
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center gap-1">
                      <Activity className="w-4 h-4 text-muted-foreground" />
                      Trạng thái
                    </div>
                  </TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {
                  loading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
                          <span className="ml-2">Đang tải...</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : transaction.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                        Không có giao dịch nào
                      </TableCell>
                    </TableRow>
                  ) : null
                }
                {!loading && transaction
                  .map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.vnp_TxnRef}</TableCell>
                      <TableCell>
                        {item.employerSubscriptions[0]?.employer && (
                          <div className="flex items-center gap-2">
                            <Avatar className="w-8 h-8">
                              <AvatarImage
                                src={
                                  item.employerSubscriptions[0].employer.logo ||
                                  undefined
                                }
                              />
                              <AvatarFallback>
                                {
                                  item.employerSubscriptions[0].employer.name
                                    ?.charAt(0)
                                    .toUpperCase() || "N"
                                }
                              </AvatarFallback>
                            </Avatar>
                            <span>
                              {item.employerSubscriptions[0].employer.name}
                            </span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        {item.employerSubscriptions[0]?.note || "Không có"}
                      </TableCell>
                      <TableCell>
                        <span className="font-semibold text-green-700">
                          {convertPrice(item.amount,null)}
                        </span>
                      </TableCell>
                      <TableCell>
                        {new Date(item.createdAt).toLocaleDateString("vi-VN")}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            item.status === PAYMENT_STATUS.SUCCESS
                              ? "default"
                              : item.status === PAYMENT_STATUS.PENDING
                              ? "outline"
                              : "destructive"
                          } 
                        >
                          {item.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            navigate(`/admin/giao-dich/${item.id}`)
                          }
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
                </Table>
                </>
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
