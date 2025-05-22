import { getSkillList } from "@/apis/skillAPI";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skill } from "@/types/skillType";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

export default function SkillPage() {
  const [skillList, setSkillList] = useState<Skill[]>([]);

  const fetchSkillList = async () => {
    try {
      const response = await getSkillList();
      setSkillList(response);
    } catch (error) {
      console.error("Error fetching skill list:", error);
    }
  };

  useEffect(() => {
    fetchSkillList();
  }, []);

  return (
    <div className="p-6 flex gap-6 bg-[#f7f7f7] w-full">
      <Card className="flex-1">
        <CardHeader>
          <CardTitle>Quản lý Kĩ năng</CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-2">
          <Table className="w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>Tên kĩ năng</TableHead>
                <TableHead>Mô tả</TableHead>
                <TableHead className="w-[100px]">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {skillList.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell>
                    <Button variant="outline" className="mr-2">
                      Sửa
                    </Button>
                    <Button variant="destructive">
                      Xóa
                    </Button>
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
