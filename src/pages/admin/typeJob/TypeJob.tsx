import { useEffect, useState } from "react";
import { TypeJob } from "@/types/TypeJobType";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { getTypeJobList } from "@/apis/TypeJobAPI";

export default function TypeJobPage() {
  const [typeJobs, setTypeJobs] = useState<TypeJob[]>([]);

  const fetchTypeJobs = async () => {
    try {
      const data = await getTypeJobList();
      setTypeJobs(data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách loại công việc:", error);
    }
  };

  useEffect(() => {
    fetchTypeJobs();
  }, []);

  return (
    <div className="p-6 flex gap-6 bg-[#f7f7f7] w-full">
      <Card className="flex-1">
        <CardHeader>
          <CardTitle>Quản lý loại công việc</CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-2">
          <Table className="w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>Tên loại công việc</TableHead>
                <TableHead className="w-[120px]">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {typeJobs.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>
                    <Button variant="outline" className="mr-2">Sửa</Button>
                    <Button variant="destructive">Xóa</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
