/* eslint-disable @typescript-eslint/no-explicit-any */
import { deleteLocationAPI, getLocationByCompanyAPI, toggleEnableLocationAPI } from "@/apis/locationAPI";
import { Card, CardContent } from "@/components/ui/card";
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
import { useAlertDialog } from "@/providers/AlertDialogProvider";
import FormUpdateLocation from "@/components/elements/location/FormUpdateLocation";

export default function ListLocation() {
  const [locationList, setLocationList] = useState<LocationResponse[]>([]);
  const [isChanged, setIsChanged] = useState(false);
  const { showAlert } = useAlertDialog();

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

  useEffect(() => {
    if (isChanged) {
      fetchLocationList();
      setIsChanged(false);
    }
  }
  , [isChanged]);

  const handleToggle = async (id: number) => {
    try {
      await toggleEnableLocationAPI(id)
      fetchLocationList()
    }
    catch (error : any) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteLocationAPI(id);
      toast.success("Xóa địa điểm thành công");
      fetchLocationList();
    } catch (error : any) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
    }
  }

  return (
    <Card className="flex-1 shadow-none border border-gray-200 rounded-xl mr-4">
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
                    onClick={() => handleToggle(item.id)}
                  />
                </TableCell>
                <TableCell className="flex items-center space-x-2">

                  <FormUpdateLocation
                    location={item}
                    setIsChanged={setIsChanged}
                  />
                  <Button
                    variant="destructive"
                    className="text-red-500 hover:text-red-500 bg-red-50 hover:bg-red-50 rounded-sm w-24"
                    onClick={() => showAlert({
                      title: "Xác nhận xóa",
                      content: "Bạn có chắc chắn muốn xóa địa điểm này?",
                      confirmText: "Xóa địa điểm",
                      cancelText: "Hủy bỏ",
                      handleConfirm() {
                        handleDelete(item.id);
                      },
                    })}
                  >Xóa</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
