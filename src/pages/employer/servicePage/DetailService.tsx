/* eslint-disable @typescript-eslint/no-explicit-any */
import { getTransactionDetail } from "@/apis/paymentAPI";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { convertDateToString } from "@/utils/dateTime";
import { TransactionDetailResponse } from "@/types/employerSubType";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function DetailService() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [transactionDetail, setTransactionDetail] = useState<TransactionDetailResponse>();
  const [loading, setLoading] = useState(true);

  const fetchDataTransactionDetail = async (transactionId: number) => {
    try {
      setLoading(true);
      const response = await getTransactionDetail(transactionId);
      setTransactionDetail(response);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Lỗi không xác định");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchDataTransactionDetail(parseInt(id));
    }
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-32 bg-gray-100 rounded animate-pulse" />
        ))}
      </div>
    );
  }

  if (!transactionDetail) return null;

  return (
    <div className="space-y-4 w-full mt-2">
      <Card className="border border-gray-200">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-purple-600 text-sm font-medium">
                <Button
                  className="bg-purple-100 text-purple-800 hover:bg-[#ebe2ff] hover:text-[#451e99] rounded-none font-bold text-sm"
                >
                  {transactionDetail.vnp_TxnRef}
                </Button>
              </CardTitle>
              <div className="text-sm text-gray-600 mt-3 space-y-3">
                <div className="text-xs font-semibold text-[#060607]">
                  Ngày tạo:{" "}
                  <span className="text-emerald-600">
                    {convertDateToString(transactionDetail.createdAt)}
                  </span>
                </div>
                <div className="text-xs font-semibold text-[#060607]">
                  Ghi nhận:{" "}
                  <span className="text-emerald-600">
                    {transactionDetail.recordedAt
                      ? convertDateToString(transactionDetail.recordedAt)
                      : "Đang cập nhật"}
                  </span>
                </div>
                <div className="text-xs font-semibold text-[#060607]">
                  Trạng thái:{" "}
                  <span className="text-emerald-600 font-bold">{transactionDetail.status}</span>
                </div>
                <div className="text-xs font-semibold text-[#060607]">
                  Loại giao dịch:{" "}
                  <span className="text-blue-600 font-semibold">
                    {transactionDetail.transactionType}
                  </span>
                </div>
                <div className="text-xs font-semibold text-[#060607]">
                  Tổng tiền:{" "}
                  <span className="text-red-600 font-semibold">
                    {transactionDetail.amount.toLocaleString()} VNĐ
                  </span>
                </div>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => navigate(-1)}
              className="text-sm bg-gray-100 hover:bg-gray-200"
            >
              Quay lại
            </Button>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <Table border={0}>
            <TableRow className="bg-[#f2f3f7] text-[#181818] font-bold">
              <TableCell className="w-full">Tên gói</TableCell>
              <TableCell>Thời gian</TableCell>
              <TableCell>Ngày bắt đầu</TableCell>
              <TableCell>Ngày kết thúc</TableCell>
              <TableCell>Trạng thái</TableCell>
            </TableRow>

            {transactionDetail.employerSubscriptions.map((sub) => (
              <TableRow key={sub.id} className="font-medium hover:bg-transparent">
                <TableCell>{sub.package?.name}</TableCell>
                <TableCell>{sub.package?.dayValue} ngày</TableCell>
                <TableCell className="text-emerald-600">
                  {convertDateToString(sub.startDate)}
                </TableCell>
                <TableCell className="text-rose-600">
                  {convertDateToString(sub.endDate)}
                </TableCell>
                <TableCell>
                  <span
                    className={`font-bold ${
                      sub.status === "ACTIVE" ? "text-emerald-600" : "text-gray-500"
                    }`}
                  >
                    {sub.status}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
