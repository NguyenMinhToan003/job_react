import { employerSubGetMe, getMyTransactions } from "@/apis/employer_sub";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableCell, TableRow } from "@/components/ui/table";
import { TransactionResponse } from "@/types/employerSubType";
import { convertDateToString } from "@/utils/dateTime";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function Service() {
  const [transaction, setTransaction] = useState<TransactionResponse[]>([]);
  const fetchEmployerSub = async () => {
    try {
      const response = await getMyTransactions();
      setTransaction(response);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    catch (error: any) {
      toast.error(error.response?.data?.message || 'Lỗi không xác định');
    }
  }
  useEffect(() => {
    fetchEmployerSub();
  }, []);
  return <div className="container mx-auto p-4">
    {
      transaction.length > 0 && transaction.map((item, index) => (
        <Card key={index} className="mb-4">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">{item.package.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableRow>
                <TableCell className="font-medium">Ngày thanh toán:</TableCell>
                <TableCell>{convertDateToString(item.createdAt)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Số lượng:</TableCell>
                <TableCell>{item.quantity}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Tổng tiền:</TableCell>
                <TableCell>{item.totalPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</TableCell>
              </TableRow>
            </Table>
          </CardContent>
        </Card>
      ))
    }
  </div>
}