import { getLocationByCompanyAPI } from "@/apis/locationAPI";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { LocationResponse } from "@/types/location";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
export default function ListLocation() {
  const [locationList, setLocationList] = useState<LocationResponse[]>();
  const fetchLocationList = async () => {
    try {
      const response = await getLocationByCompanyAPI();
      setLocationList(response);
    }
    catch (error) {
      console.error("Error fetching location list:", error);
    } 
  }
  useEffect(() => {
    fetchLocationList();
  }, []);
  return (
    <>
      <Card className="flex-1">
        <CardHeader>
          <CardTitle >
            Quản lý địa điểm
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-2">
          <Table className="w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>Tên địa điểm</TableHead>
                <TableHead className="w-[100px]">Thành Phố</TableHead>
                <TableHead className="w-[100px]">Quận</TableHead>
                <TableHead className="w-[100px]">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {locationList?.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.district.city.name}</TableCell>
                  <TableCell>{item.district.name}</TableCell>
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
    </>
  )
}