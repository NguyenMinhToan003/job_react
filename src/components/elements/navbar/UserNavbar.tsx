import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { ChevronDown, Menu } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

const navItems = [
  { label: 'Nhà Tuyển Dụng', path: "/danh-cho-nha-tuyen-dung", icon: null},
  { label: "Tài khoản", path: "/tong-quat-ho-so", icon:<Avatar className='p-[0.5px] bg-[#3d1419] border border-[#f5f3f4]'>
    <AvatarImage src="https://lh3.googleusercontent.com/a/ACg8ocJ1La7mSP1N6T-yDRY285A40n24K3eJWQtEQYZudRq1UQ=s96-c" />
  </Avatar>}
];


export default function UserNavbar() {
  const navigate = useNavigate();

  const handleClick = (path: string) => navigate(path);

  return (
    <div className="sticky top-0 z-50 w-full border-b border-[#502c30] shadow-sm bg-gradient-to-r from-[#121212] to-[#53151c]">
      <div className="flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-1 ">
          <Avatar className='p-[0.5px] border border-[#f5f3f4]'>
            <AvatarImage src="https://lh3.googleusercontent.com/a/ACg8ocJ1La7mSP1N6T-yDRY285A40n24K3eJWQtEQYZudRq1UQ=s96-c" />
          </Avatar>
          <Button className="text-[#959595]" variant="link">
            <span><NavLink to='/'>Tìm việc</NavLink></span>
            <ChevronDown className="h-5 w-5" />
          </Button>
          <Button className="text-[#959595]" variant="link">
            <span>Tìm Công ty</span>
            <ChevronDown className="h-5 w-5" />
          </Button>
        </div>

        {/* Mobile menu */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64">
              <div className="space-y-4 mt-6">
                {navItems.map((item) => (
                  <Button
                    key={item.path}
                    variant="ghost"
                    className="w-full justify-start text-base"
                    onClick={() => handleClick(item.path)}
                  >
                    <span className="mr-2">{item.icon}</span>
                    {item.label}
                  </Button>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center gap-1 ">
          {navItems.map((item) => (
            <Button
              key={item.path}
              variant={'link'}
              onClick={() => handleClick(item.path)}
              className="flex items-center text-[#f5f3f4]"
            >
              {item.icon}
              <span className="ml-1">{item.label}</span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
