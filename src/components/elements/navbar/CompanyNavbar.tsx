import {
  LayoutDashboard,
  Briefcase,
  MapPin,
  UserCog,
  Mail,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { countUnreadAPI } from "@/apis/employerNotiAPI";


export default function CompanyNavbar() {
  const navigate = useNavigate();
  const handleChangePage = (path: string) => () => {
    navigate(path);
  };
  const [countNoti, setCountNoti] = useState(0);
  const fetchNotificationCount = async () => {
    try {
      const response = await countUnreadAPI()
      setCountNoti(response.length);
    } catch (error) {
      console.error('Error fetching notification count:', error);
    }
  };
  useEffect(() => {
    fetchNotificationCount();
  }, [navigate]);
  const userMenuItems = [
    { label: "Tổng quan", icon: <LayoutDashboard className="w-6 h-6" />, path: '' },
    { label: "Quản lý tuyển dụng", icon: <UserCog className="w-6 h-6" />, path: 'tuyen-dung' },
    { label: "Quản lý địa điểm", icon: <MapPin className="w-6 h-6" />, path: 'dia-diem' },
    { label: "Quản lý thông tin", icon: <Briefcase className="w-6 h-6" />, path: 'tin-nhan' },
    {
      label: <>
        <span className="flex items-center gap-1">
          Thông báo
          {
            countNoti > 0 && (
              <span className="bg-red-500 text-white text-xs font-semibold rounded-full px-2 py-1">
                {countNoti}
              </span>
            )
          }
        </span>
      </>, icon: <Mail className="w-6 h-6" />, path: 'thong-bao'
    },
    { label: "Cài đặt", icon: <Settings className="w-6 h-6" />, path: 'cai-dat' },
  ];

  return (
    <Card className="min-w-[300px] max-w-[300px] h-fit p-0 rounded-sm px-2 py-4 shadow-xl sticky top-18 ">
      <CardHeader>
        <p className="text-sm text-muted-foreground">👋 Xin chào</p>
        <CardTitle className="text-2xl font-semibold">Toan</CardTitle>
      </CardHeader>
      <CardContent className="text-base space-y-2 p-0">
        {userMenuItems.map((item) => (
          <Button
            key={+item.label}
            onClick={handleChangePage(item.path)}
            variant="ghost"
            className="w-full justify-start rounded-md hover:bg-red-50 hover:text-red-600 transition-colors duration-300 px-3 h-12"
          >
            <span className="mr-3">{item.icon}</span>
            <span>{item.label}</span>
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}
