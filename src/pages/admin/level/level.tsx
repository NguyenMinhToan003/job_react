import { useEffect, useState } from "react";
import { getLevelList } from "@/apis/levelAPI";
import { Level } from "@/types/levelType";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

export default function LevelPage() {
  const [levels, setLevels] = useState<Level[]>([]);

  const fetchLevels = async () => {
    try {
      const data = await getLevelList();
      setLevels(data);
    } catch (error) {
      console.error("Error fetching level list:", error);
    }
  };

  useEffect(() => {
    fetchLevels();
  }, []);

  return (
    <div className="p-6 flex gap-6 bg-[#f7f7f7] w-full">
      <Card className="flex-1">
        <CardHeader>
          <CardTitle>Quản lý cấp độ</CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-2">
          <Table className="w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>Tên cấp độ</TableHead>
                <TableHead>Mô tả</TableHead>
                <TableHead className="w-[120px]">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {levels.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.description}</TableCell>
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
