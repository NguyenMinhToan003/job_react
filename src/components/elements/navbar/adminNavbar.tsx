import {
  LayoutDashboard,
  BadgeCheck,
  MapPin,
  BarChart2,
  ClipboardList,
  Factory,
  UserCog,
  Wand2,
  Clock,
  HeartHandshake,
  Shapes,
  Package,
  Receipt,
  Settings,
} from "lucide-react";
import { Button } from "../../ui/button";
import { Card, CardContent } from "../../ui/card";
import { useNavigate } from "react-router-dom";

const userMenuItems = [
  { label: "Tổng quan", icon: <LayoutDashboard className="w-6 h-6" />, path: '' },
  { label: "Quản lý tuyển dụng", icon: <ClipboardList className="w-6 h-6" />, path: 'tuyen-dung' },
  { label: "Quản lý Nhà tuyển dụng", icon: <Factory className="w-6 h-6" />, path: 'nha-tuyen-dung' },
  { label: "Quản lý ứng viên", icon: <UserCog className="w-6 h-6" />, path: 'ung-vien' },
  { label: "Quản lý gói dịch vụ", icon: <Package className="w-6 h-6" />, path: 'goi-dich-vu' },
  { label: "Quản lý giao dịch", icon: <Receipt className="w-6 h-6" />, path: 'giao-dich' },

  { label: "Quản lý kĩ năng", icon: <Wand2 className="w-6 h-6" />, path: 'ki-nang' },
  { label: "Quản lý cấp bậc", icon: <BarChart2 className="w-6 h-6" />, path: 'cap-bac' },
  { label: "Quản lý kinh nghiệm", icon: <BadgeCheck className="w-6 h-6" />, path: 'kinh-nghiem' },
  { label: "Quản lý thành phố/quận", icon: <MapPin className="w-6 h-6" />, path: 'thanh-pho' },
  { label: "Quản lý Hình thức làm việc", icon: <Clock className="w-6 h-6" />, path: 'hinh-thuc-lam-viec' },
  { label: "Quản lý quyền lợi", icon: <HeartHandshake className="w-6 h-6" />, path: 'quyen-loi' },
  { label: "Quản lý lĩnh vực", icon: <Shapes className="w-6 h-6" />, path: 'linh-vuc' },
  { label: "Quốc gia", icon: <BarChart2 className="w-6 h-6" />, path: 'quoc-gia' },
  { label: 'Cài đặt', icon: <Settings className='w-6 h-6' />, path: 'cai-dat' },
];


export default function AdminNavbar() {
  const navigate = useNavigate();
  const handleChangePage = (path: string) => () => {
    navigate(path);
  };
  return (
    <Card className="w-[300px] h-fit p-0 rounded-sm px-2 py-4 shadow-xl sticky top-0 z-10">
      <CardContent className="text-base space-y-2 p-0">
        {userMenuItems.map((item) => (
          <Button
            onClick={handleChangePage(item.path)}
            key={item.label}
            variant="ghost"
            className="w-full justify-start  rounded-md hover:bg-red-50 hover:text-red-600 transition-colors duration-300 px-3 h-12"
          >
            <span className="mr-3">{item.icon}</span>
            <span>{item.label}</span>
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}
