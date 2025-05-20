import { getExperienceList } from "@/apis/experienceAPI";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Experience } from "@/types/experienceType";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button";


export default function ExperiencePage() {
  const [experienceList, setExperienceList] = useState<Experience[]>([]);
  const fetchExprerienceList = async () => {
    try {
      const response = await getExperienceList();
      setExperienceList(response);
    }
    catch (error) {
      console.error("Error fetching experience list:", error);
    } 
  }
  useEffect(() => {
    fetchExprerienceList();
  }, []);
  return (
    <div className="p-6 flex gap-6 bg-[#f7f7f7] w-full">
      <Card className="flex-1">
        <CardHeader>
          <CardTitle >
            Quản lý kinh nghiệm
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-2">
          <Table className="w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>Tên kinh nghiệm</TableHead>
                <TableHead>Mô tả</TableHead>
                <TableHead className="w-[100px]">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {experienceList.map((item) => (
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