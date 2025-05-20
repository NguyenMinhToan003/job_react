import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Briefcase,
  Mail,
  Settings,
  User,
  Inbox,
} from "lucide-react";
import { Outlet, useNavigate } from "react-router-dom";

const userMenuItems = [
  { label: "Tổng quan", icon: <LayoutDashboard className="w-6 h-6" />, path: '' },
  { label: "Hồ sơ", icon: <User className="w-6 h-6" />, path: 'ca-nhan' },
  { label: "Công việc đã lưu", icon: <Briefcase className="w-6 h-6" />, path: 'cong-viec-luu' },
  { label: "Tin nhắn", icon: <Inbox className="w-6 h-6" />, path: 'tin-nhan' },
  { label: "Thông báo", icon: <Mail className="w-6 h-6" />, path: 'thong-bao' },
  { label: "Cài đặt", icon: <Settings className="w-6 h-6" />, path: 'cai-dat' },
];

export default function UserDashboard() {
  const navigate = useNavigate();

  const handleChangePage = (path: string) => () => {
    navigate(path);
  };

  return (
    <div className="p-6 flex gap-6">
      {/* Sidebar */}
      <Card className="w-[300px] h-fit p-0 rounded-sm px-2 py-4 shadow-xl sticky top-18">
        <CardHeader>
          <p className="text-sm text-muted-foreground">👋 Xin chào</p>
          <CardTitle className="text-2xl font-semibold">Toan</CardTitle>
        </CardHeader>
        <CardContent className="text-base space-y-2 p-0">
          {userMenuItems.map((item) => (
            <Button
              key={item.label}
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

      {/* Main Content */}
      <div className="flex-1 space-y-6">
        <Outlet />
      </div>
    </div>
  );
}
