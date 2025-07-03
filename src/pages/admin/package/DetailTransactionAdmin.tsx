/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  ArrowLeft,
  Receipt,
  Calendar,
  Clock,
  CheckCircle,
  Activity,
  Briefcase,
  Building2,
  Search,
  Package,
  CalendarDays,
  Timer,
  FileClock,
  User2,
  Mail,
} from "lucide-react"
import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { getTransactionDetail } from "@/apis/paymentAPI"
import { toast } from "sonner"
import { convertDateToString } from "@/utils/dateTime"
import { TransactionDetailResponse } from "@/types/employerSubType"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Table,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"

export default function DetailTransactionAdmin() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [transaction, setTransaction] = useState<TransactionDetailResponse>()
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    if (id) fetchTransaction()
  }, [id])

  const fetchTransaction = async () => {
    try {
      setLoading(true)
      const res = await getTransactionDetail(Number(id))
      setTransaction(res)
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Có lỗi xảy ra khi tải giao dịch")
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "success":
        return <Badge variant="success">Thành công</Badge>
      case "pending":
        return <Badge variant="secondary">Chờ xử lý</Badge>
      default:
        return <Badge variant="destructive">Thất bại</Badge>
    }
  }

  if (loading)
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-10 w-40" />
        <Skeleton className="h-32 rounded bg-gray-100" />
      </div>
    )

  if (!transaction) return null

  const employer = transaction.employerSubscriptions[0]?.employer

  const isMatchSearch =
    transaction.vnp_TxnRef.toLowerCase().includes(searchTerm.toLowerCase())

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Button>
          <h1 className="text-xl font-semibold flex items-center gap-2">
            <Receipt className="w-5 h-5" />
            Chi tiết giao dịch (Admin)
          </h1>
        </div>

        <div className="flex items-center gap-2 w-full md:w-72">
          <Search className="w-4 h-4 text-gray-500" />
          <Input
            placeholder="Tìm theo mã giao dịch..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {!isMatchSearch ? (
        <div className="text-center text-gray-500 italic">Không tìm thấy giao dịch phù hợp</div>
      ) : (
        <>
          {/* Transaction Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Thông tin giao dịch</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center gap-2">
                <FileClock className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Mã giao dịch</p>
                  <p className="font-semibold">{transaction.vnp_TxnRef}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Ngày tạo</p>
                  <p className="font-semibold">{convertDateToString(transaction.createdAt)}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Ghi nhận lúc</p>
                  <p className="font-semibold">
                    {transaction.recordedAt
                      ? convertDateToString(transaction.recordedAt)
                      : "Đang cập nhật"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Số tiền</p>
                  <p className="text-lg font-bold text-green-700">
                    {transaction.amount.toLocaleString("vi-VN")} VNĐ
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Trạng thái</p>
                  {getStatusBadge(transaction.status)}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Loại giao dịch</p>
                  <p className="font-semibold">{transaction.transactionType}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Employer Info */}
          {employer && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Thông tin nhà tuyển dụng</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center gap-4">
                <Avatar className="w-14 h-14">
                  <AvatarImage src={employer.logo || undefined} />
                  <AvatarFallback>{employer.name?.[0]}</AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <User2 className="w-4 h-4 text-gray-500" />
                    <p className="font-semibold text-gray-900">{employer.name}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <p className="text-sm text-gray-600">{employer.email}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Subscriptions Table */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Gói dịch vụ đã đăng ký</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-gray-500" />
                        Tên gói
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center gap-2">
                        <Timer className="w-4 h-4 text-gray-500" />
                        Thời hạn
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center gap-2">
                        <CalendarDays className="w-4 h-4 text-gray-500" />
                        Bắt đầu
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center gap-2">
                        <CalendarDays className="w-4 h-4 text-gray-500" />
                        Kết thúc
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4 text-gray-500" />
                        Trạng thái
                      </div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transaction.employerSubscriptions.map((sub) => (
                    <TableRow key={sub.id}>
                      <TableCell>{sub.package?.name || "N/A"}</TableCell>
                      <TableCell>{sub.package?.dayValue} ngày</TableCell>
                      <TableCell>{convertDateToString(sub.startDate)}</TableCell>
                      <TableCell>{convertDateToString(sub.endDate)}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{sub.status}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
