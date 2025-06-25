/* eslint-disable @typescript-eslint/no-explicit-any */
import { getMyTransactions } from "@/apis/paymentAPI";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableCell, TableRow } from "@/components/ui/table";
import { TransactionResponse } from "@/types/employerSubType";
import { PAYMENT_STATUS } from "@/types/type";
import { convertDateToString } from "@/utils/dateTime";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function Service() {
  const [transactions, setTransactions] = useState<TransactionResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await getMyTransactions();
      setTransactions(response);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Lỗi không xác định');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-32 bg-gray-100 rounded animate-pulse"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4 w-full mt-2 mr-4">
      {transactions.map((transaction) => (
        <Card key={transaction.id} className=" shadow-none border border-gray-200 rounded-xl">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-purple-600 text-sm font-medium">
                  <Button
                    className='bg-purple-100 text-purple-800 hover:bg-[#ebe2ff] hover:text-[#451e99] rounded-none font-bold text-sm'
                  >
                    {transaction.vnp_TxnRef}
                  </Button>
                </CardTitle>
                <div className="text-sm text-gray-600 mt-3 space-y-3">
                  <div className="text-xs font-semibold text-[#060607]">Ngày ghi nhận: <span className="text-emerald-600">
                    {convertDateToString(transaction.recordedAt)}
                  </span></div>
                  <div className="text-xs font-semibold text-[#060607]">
                    Ngày tạo:{" "}
                    <span className="text-emerald-600">
                      {convertDateToString(transaction.createdAt)}
                    </span>
                  </div>
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  Trạng thái:{" "}
                  <span className="text-emerald-600 font-semibold">
                    {transaction.status}
                  </span>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Ghi chú:{" "}
                  <span className="text-gray-700 font-semibold">
                    {transaction.note || "Không có ghi chú"}
                  </span>
                </div>
              </div>
              <Button className="text-purple-600 bg-gray-100 hover:text-purple-600 hover:bg-gray-100 text-sm flex items-center gap-1"
                onClick={() => navigate(`${transaction.id}`)}
              >
                Chi tiết kích hoạt <ArrowRight/>
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="pt-0">
            <Table border={0} className='border-color-transparent'>
              <TableRow className=' bg-[#f2f3f7] hover:bg-[#f2f3f7] text-[#181818] font-bold p-5'>
                <TableCell className="w-full">
                  Tên dịch vụ
                </TableCell>
                <TableCell className="min-w-[150px]">
                  Số lượng
                </TableCell >
                <TableCell className="min-w-[150px]">
                  Thời gian
                </TableCell>
                <TableCell className="min-w-[150px]">
                  Đã kích hoạt	
                </TableCell>
                <TableCell className="min-w-[150px]">
                  Chưa kích hoạt
                </TableCell>
              </TableRow>
              {
                transaction.package?.map((pkg) => (
                  <TableRow key={pkg.id} className="font-semibold hover:bg-transparent">
                    <TableCell >
                      {pkg.name}
                    </TableCell>
                    <TableCell>
                      {pkg.sub_total} Tin
                    </TableCell>
                    <TableCell>
                      {pkg.dayValue} ngày
                    </TableCell>
                    <TableCell>
                      <div className="text-emerald-600">{pkg.sub_used} Tin</div>
                    </TableCell>
                    <TableCell>
                      {
                        transaction.status !== PAYMENT_STATUS.SUCCESS
                          ? <div className="text-red-600">0 Tin</div>
                          : <div className="text-blue-500">{pkg.sub_total - pkg.sub_used} Tin</div>
                      }
                    </TableCell>
                  </TableRow>
                ))
              }
            </Table>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}