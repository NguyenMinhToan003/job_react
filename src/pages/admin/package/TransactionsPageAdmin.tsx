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

export default function TransactionsPageAdmin() {
  const navigate = useNavigate()
  const [transaction, setTransactions] = useState<TransactionDetailResponse[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [search, setSearch] = useState<string>("")

  useEffect(() => {
    fetchSubscriptions()
  }, [])

  const fetchSubscriptions = async () => {
    try {
      setLoading(true)
      const response = await getAllTransactionsAdmin()
      setTransactions(response)
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

      <div className="mb-4 flex items-center gap-2 max-w-sm">
        <Search className="w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Tìm kiếm theo mã giao dịch..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách giao dịch</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Đang tải...</p>
          ) : (
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
                {transaction
                  .filter((item) =>
                    item.vnp_TxnRef.toLowerCase().includes(search.toLowerCase())
                  )
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
                          {item.amount.toLocaleString("vi-VN")}₫
                        </span>
                      </TableCell>
                      <TableCell>
                        {new Date(item.createdAt).toLocaleDateString("vi-VN")}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            item.status === "SUCCESS"
                              ? "success"
                              : item.status === "PENDING"
                              ? "secondary"
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
          )}
        </CardContent>
      </Card>
    </div>
  )
}
