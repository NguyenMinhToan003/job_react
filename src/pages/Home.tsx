import { getCityList } from "@/apis/cityAPI";
import Navigate from "@/components/elements/Navigate";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapPin, Search } from "lucide-react";
import { useEffect, useState } from "react";

export default function Home() {
  const [selectedCity, setSelectedCity] = useState("");
  const [selectLevel, setSelectLevel] = useState("");
  const [selectType, setSelectType] = useState("");
  const [selectSalary, setSelectSalary] = useState("");
  const [selectExperience, setSelectExperience] = useState("");
  const [cityOptions, setCityOptions] = useState<{ label: string; value: string }[]>([]);
  const fetchCity = async () => {
    try {
      const response = await getCityList()
      setCityOptions(response.map((city: { name: string; id: string }) => ({
        label: city.name,
        value: city.id,
      })));
    }
    catch (error) {
      console.error("Error fetching cities:", error);
    }
  }
  useEffect(() => {
    fetchCity();
  },[])

  const levelOptions = [
    { label: "Intern", value: "intern" },
    { label: "Junior", value: "junior" },
    { label: "Senior", value: "senior" },
  ];

  const typeOptions = [
    { label: "Full-time", value: "fulltime" },
    { label: "Part-time", value: "parttime" },
    { label: "Freelance", value: "freelance" },
  ];

  const salaryOptions = [
    { label: "Dưới 5 triệu", value: "under-5m" },
    { label: "5 triệu - 10 triệu", value: "5m-10m" },
    { label: "10 triệu - 20 triệu", value: "10m-20m" },
    { label: "Trên 20 triệu", value: "over-20m" },
  ];

  const experienceOptions = [
    { label: "Dưới 1 năm", value: "under-1y" },
    { label: "1 năm - 2 năm", value: "1y-2y" },
    { label: "2 năm - 3 năm", value: "2y-3y" },
    { label: "Trên 3 năm", value: "over-3y" },
  ];

  const selectedLabel = cityOptions.find((c) => c.value === selectedCity)?.label;

  return (
    <>
      <Navigate title="Tìm Việc Online" />
      <div className="bg-[#f7f7f7] min-h-screen">
        {/* Banner Tìm kiếm */}
        <div className="h-[400px] bg-gradient-to-r from-[#121212] to-[#53151c] flex gap-2 items-center justify-center px-4">
          <Select value={selectedCity} onValueChange={setSelectedCity}>
            <Button
              variant="secondary"
              className="h-[54px] text-base font-semibold w-[200px] p-0"
            >
              <SelectTrigger className="border-none w-full h-full text-left px-4">
                <SelectValue
                  placeholder={
                    <span className="flex items-center gap-2 text-gray-600">
                      <MapPin className="w-4 h-4" />
                      Chọn Thành Phố
                    </span>
                  }
                >
                  {selectedLabel && (
                    <span className="flex items-center gap-2 text-gray-900">
                      <MapPin className="w-4 h-4" />
                      {selectedLabel}
                    </span>
                  )}
                </SelectValue>
              </SelectTrigger>
            </Button>
            <SelectContent className="mt-2">
              <Input
                className="w-full bg-transparent text-gray-700 placeholder-gray-500 border-none text-sm font-medium focus-visible:ring-0 focus-visible:outline-none mb-2"
                placeholder="Tìm kiếm..."
                onKeyDown={(e) => e.stopPropagation()}
              />
              {cityOptions.map((city) => (
                <SelectItem key={city.value} value={city.value}>
                  {city.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="bg-white rounded-sm p-2 flex-1 max-w-[600px]">
            <Input
              className="w-full bg-transparent text-gray-700 placeholder-gray-500 border-none text-xl font-medium focus-visible:ring-0 focus-visible:outline-none"
              placeholder="Nhập từ khóa tìm kiếm..."
            />
          </div>

          <Button
            variant="destructive"
            className="h-[54px] text-base bg-[#ed1b2f] w-[200px]"
          >
            <Search />
            <span>Tìm kiếm</span>
          </Button>
        </div>

        {/* Bộ lọc nâng cao */}
        <div className="bg-white rounded-md p-4 mt-4 mx-4 border border-gray-300 flex justify-between items-center shadow-sm">
          <div className="flex gap-3 items-center justify-start">
            <Select value={selectLevel} onValueChange={setSelectLevel}>
              <SelectTrigger className="rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 bg-white hover:bg-gray-100 hover:border-black">
                <SelectValue placeholder="Cấp bậc" />
              </SelectTrigger>
              <SelectContent>
                {levelOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectType} onValueChange={setSelectType}>
              <SelectTrigger className="rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 bg-white hover:bg-gray-">
                <SelectValue placeholder="Chọn Loại Hình" />
              </SelectTrigger>
              <SelectContent>
                {typeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectSalary} onValueChange={setSelectSalary}>
              <SelectTrigger className="rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 bg-white hover:bg-gray-100 hover:border-black">
                <SelectValue placeholder="Chọn Mức Lương" />
              </SelectTrigger>
              <SelectContent>
                {salaryOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectExperience} onValueChange={setSelectExperience}>
              <SelectTrigger className="rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 bg-white hover:bg-gray-100 hover:border-black">
                <SelectValue placeholder="Chọn Kinh Nghiệm" />
              </SelectTrigger>
              <SelectContent>
                {experienceOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            variant="destructive"
            className="text-base bg-[#ed1b2f] px-7 py-1 rounded-4xl"
            onClick={() => {
              setSelectLevel("");
              setSelectType("");
              setSelectSalary("");
              setSelectExperience("");
            }}
          >
            <span>Đặt lại bộ lọc</span>
          </Button>
        </div>
      </div>
    </>
  );
}
