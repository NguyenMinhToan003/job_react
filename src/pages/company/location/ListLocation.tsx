import { getLocationByCompanyAPI, toggleEnableLocationAPI } from "@/apis/locationAPI";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LocationResponse } from "@/types/location";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

export default function ListLocation() {
  const [locationList, setLocationList] = useState<LocationResponse[]>([]);

  const fetchLocationList = async () => {
    try {
      const response = await getLocationByCompanyAPI();
      setLocationList(response);
    } catch (error) {
      console.error("Error fetching location list:", error);
    }
  };

  useEffect(() => {
    fetchLocationList();
  }, []);

  const handleToggle = async (id: number, enabled: number) => {
    try {
      console.log(id, enabled);
      await toggleEnableLocationAPI(id)
      fetchLocationList()
    }
    catch (error : any) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  return (
    <Card className="flex-1">
      <CardHeader>
        <CardTitle>Quản lý địa điểm</CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-2">
        <Table className="w-full">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">STT</TableHead>
              <TableHead className="w-[140px]">Thành Phố</TableHead>
              <TableHead className="w-[120px]">Quận</TableHead>
              <TableHead>Tên địa điểm</TableHead>
              <TableHead className="w-[120px]">Hiện</TableHead>
              <TableHead className="w-[220px]">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {locationList.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{item.district.city.name}</TableCell>
                <TableCell>{item.district.name}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>
                  <Switch
                    checked={item.enabled===1}
                    onClick={() => handleToggle(item.id, item.enabled)}
                  />
                </TableCell>
                <TableCell className="flex items-center space-x-2">
                  <Button variant="outline" className="mr-2">
                    Sửa
                  </Button>
                  <Button variant="destructive">Xóa</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
