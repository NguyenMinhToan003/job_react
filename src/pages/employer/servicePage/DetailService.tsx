"use client"

/* eslint-disable @typescript-eslint/no-explicit-any */

import { getTransactionDetail } from "@/apis/paymentAPI"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Table, TableRow, TableCell, TableHead, TableHeader, TableBody } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { convertDateToString } from "@/utils/dateTime"
import type { TransactionDetailResponse } from "@/types/employerSubType"
import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { toast } from "sonner"
import FormActiveServiceBanner from "@/components/elements/servicePage/FormActiveServiceBanner"
import { PackageType } from "@/types/type"
import { Label } from "@/components/ui/label"
import {
  ArrowLeft,
  Receipt,
  Calendar,
  CheckCircle,
  Clock,
  CreditCard,
  Package,
  Briefcase,
  CalendarDays,
  PlayCircle,
  StopCircle,
  Activity,
} from "lucide-react"

export default function DetailService() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [transactionDetail, setTransactionDetail] = useState<TransactionDetailResponse>()
  const [loading, setLoading] = useState(true)

  const fetchDataTransactionDetail = async (transactionId: number) => {
    try {
      setLoading(true)
      const response = await getTransactionDetail(transactionId)
      setTransactionDetail(response)
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Lỗi không xác định")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) {
      fetchDataTransactionDetail(Number.parseInt(id))
    }
  }, [id])

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-50 text-green-800 border-green-200"
      case "inactive":
        return "bg-gray-50 text-gray-600 border-gray-200"
      case "expired":
        return "bg-red-50 text-red-700 border-red-200"
      default:
        return "bg-gray-50 text-gray-600 border-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return <CheckCircle className="h-3 w-3" />
      case "inactive":
        return <StopCircle className="h-3 w-3" />
      case "expired":
        return <Clock className="h-3 w-3" />
      default:
        return <Activity className="h-3 w-3" />
    }
  }

  if (loading) {
    return (
      <div className="space-y-4 p-6">
        <div className="flex items-center gap-4 mb-6">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-8 w-48" />
        </div>
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-32 bg-gray-100 rounded" />
        ))}
      </div>
    )
  }

  if (!transactionDetail) return null

  return (
    <div className="w-full mx-auto p-6 space-y-6 bg-white">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 border-gray-300 hover:bg-gray-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Quay lại
          </Button>
          <div className="flex items-center gap-3">
            <Receipt className="h-5 w-5 text-gray-600" />
            <h1 className="text-xl font-semibold text-gray-900">Hóa đơn giao dịch</h1>
          </div>
        </div>
      </div>

      {/* Transaction Overview */}
      <Card className="border border-gray-200 shadow-none">
        <CardHeader className="bg-gray-50 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-gray-600" />
                Mã giao dịch: {transactionDetail.vnp_TxnRef}
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">Chi tiết thông tin giao dịch</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Tổng tiền</p>
              <p className="text-2xl font-bold text-gray-900">
                {(transactionDetail.amount * 1.0).toLocaleString("vi-VN")} VNĐ
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-gray-500">
                <Calendar className="h-4 w-4" />
                <span className="text-xs font-medium uppercase tracking-wide">Ngày tạo</span>
              </div>
              <p className="text-sm font-semibold text-gray-900">{convertDateToString(transactionDetail.createdAt)}</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-gray-500">
                <CheckCircle className="h-4 w-4" />
                <span className="text-xs font-medium uppercase tracking-wide">Ghi nhận</span>
              </div>
              <p className="text-sm font-semibold text-gray-900">
                {transactionDetail.recordedAt ? convertDateToString(transactionDetail.recordedAt) : "Đang cập nhật"}
              </p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-gray-500">
                <Package className="h-4 w-4" />
                <span className="text-xs font-medium uppercase tracking-wide">Loại giao dịch</span>
              </div>
              <p className="text-sm font-semibold text-gray-900">{transactionDetail.transactionType}</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-gray-500">
                <Activity className="h-4 w-4" />
                <span className="text-xs font-medium uppercase tracking-wide">Trạng thái</span>
              </div>
              <Badge className={`${getStatusColor(transactionDetail.status)} font-medium text-xs`}>
                {getStatusIcon(transactionDetail.status)}
                <span className="ml-1">{transactionDetail.status}</span>
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subscriptions Table */}
      <Card className="border border-gray-200 shadow-none">
        <CardHeader className="bg-gray-50 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Briefcase className="h-5 w-5 text-gray-600" />
            <div>
              <CardTitle className="text-lg font-semibold text-gray-900">Chi tiết dịch vụ</CardTitle>
              <p className="text-sm text-gray-600 mt-1">Danh sách các gói dịch vụ đã mua</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-white border-b border-gray-200 hover:bg-white">
                  <TableHead className="font-semibold text-gray-700 h-12 text-left">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-gray-400" />
                      <span>Tên gói</span>
                    </div>
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700 h-12 text-left">
                    <div className="flex items-center gap-2">
                      <PlayCircle className="h-4 w-4 text-gray-400" />
                      <span>Công việc kích hoạt</span>
                    </div>
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700 h-12 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span>Thời hạn</span>
                    </div>
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700 h-12 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <CalendarDays className="h-4 w-4 text-gray-400" />
                      <span>Bắt đầu</span>
                    </div>
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700 h-12 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <CalendarDays className="h-4 w-4 text-gray-400" />
                      <span>Kết thúc</span>
                    </div>
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700 h-12 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Activity className="h-4 w-4 text-gray-400" />
                      <span>Trạng thái</span>
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactionDetail.employerSubscriptions.map((sub, index) => (
                  <TableRow
                    key={sub.id}
                    className={`border-b border-gray-100 h-14 hover:bg-gray-50 ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                    }`}
                  >
                    <TableCell className="font-medium text-gray-900">{sub.package?.name}</TableCell>
                    <TableCell>
                      {sub.package.type === PackageType.EMPLOYER ? (
                        <FormActiveServiceBanner employerSub={sub} />
                      ) : (
                        <div className="flex items-center gap-2">
                          <Briefcase className="h-4 w-4 text-gray-400" />
                          <Label className="font-medium text-gray-700">{sub?.job?.name}</Label>
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="font-medium text-gray-700">{sub.package?.dayValue} ngày</span>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="text-gray-700 font-medium">{convertDateToString(sub.startDate)}</span>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="text-gray-700 font-medium">{convertDateToString(sub.endDate)}</span>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge className={`${getStatusColor(sub.status)} font-medium text-xs`}>
                        {getStatusIcon(sub.status)}
                        <span className="ml-1">{sub.status}</span>
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
