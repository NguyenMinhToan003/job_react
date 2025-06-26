import { filterEmployer } from "@/apis/companyAPI";
import BannerEmployer from "@/components/elements/company/BannerEmployer";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { Label } from "@/components/ui/label";
import { EmployerResponse } from "@/types/accountType";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function EmployerList() {
  const [employerList, setEmployerList] = useState<EmployerResponse[]>([]);
  const fetchEmployers = async () => {
    try {
      const response = await filterEmployer({});
      setEmployerList(response.items);
    }
    catch (error) {
      toast.error(error?.response?.data?.message || "Failed to fetch employers");
    }
  }

  useEffect(() => {
    fetchEmployers();
  }, []);
  return <>
    <BannerEmployer />
    <div>
      <h1 className="text-2xl font-bold text-center my-8">Danh sách nhà tuyển dụng</h1>
      <p className="text-center text-gray-600 mb-4">Khám phá các nhà tuyển dụng hàng đầu và cơ hội nghề nghiệp của họ</p>
    </div>
    <div className="w-7xl mx-auto px-4 py-8 grid grid-cols-3 gap-4 mb-40">
    {
           employerList.map((employer) => (
              <Card key={employer.id} className="flex flex-col rounded-[8px] bg-white border border-[#E7E7E8] hover:border-[#2C95FF] p-4 gap-1 shadow-none cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-101 relative">
                <CardContent className="flex  items-start text-center gap-3 p-0">
                  <Avatar  className="w-16 h-16 rounded-sm">
                    <AvatarImage src={employer.logo} alt={employer.name} />
                  </Avatar>
                  <div className="space-y-2">
                    <Label className="text-start line-clamp-2 text-md">{employer.name}</Label>
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Avatar className="w-4 h-4 mr-1 ">
                        <AvatarImage src={employer.country.flag} className="object-cover" />
                      </Avatar>
                      {employer.country.name}
                    </span>
                    
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      {employer.employeeScale.name} | {employer.businessType.name }
                    </span>
                 </div>
                </CardContent>
              </Card>
            ))
        }
    </div>
  </>
}