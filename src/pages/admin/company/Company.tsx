import { useEffect, useState } from "react";
import { getAllEmployers } from "@/apis/companyAPI";
import { Employer } from "@/types/companyType";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export default function CompanyListPage() {
  const [companies, setCompanies] = useState<Employer[]>([]);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const data = await getAllEmployers();
        setCompanies(data);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách công ty:", error);
      }
    };
    fetchCompanies();
  }, []);

  const toggleStatus = async (companyId: number) => {
    try {
      const employer = companies.find((c) => c.id === companyId);
      if (employer) {
        const newStatus = employer.account.status === 1 ? 0 : 1;
        setCompanies((prev) =>
          prev.map((c) =>
            c.id === companyId ? { ...c, account: { ...c.account, status: newStatus } } : c
          )
        );
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái công ty:", error);
    }
  };

  return (
    <div className="p-6 flex gap-6  w-full">
      <Card className="flex-1 w-full">
        <CardHeader>
          <CardTitle>Quản lý Công ty</CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-2">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Logo</TableHead>
                <TableHead>Tên</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Mô tả</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {companies.map((employer) => (
                <TableRow key={employer.id}>
                  <TableCell>
                    <Avatar>
                      <AvatarImage src={employer.logo} />
                      <AvatarFallback>{employer.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell>{employer.name}</TableCell>
                  <TableCell>{employer.account.email}</TableCell>
                  <TableCell>{employer.description}</TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        "px-2 py-1 text-sm rounded",
                        employer.account.status === 1
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-600"
                      )}
                    >
                      {employer.account.status === 1 ? "Hoạt động" : "Tạm khóa"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => toggleStatus(employer.id)}
                    >
                      {employer.account.status === 1 ? "Khóa" : "Kích hoạt"}
                    </Button>
                    <Button>Sửa</Button>
                  </TableCell>
                </TableRow>
              ))}
              {companies.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4 text-gray-500">
                    Không có công ty nào.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
