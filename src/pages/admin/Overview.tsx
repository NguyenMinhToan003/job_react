import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function OverViewAdmin() {
  return (
    <>
      <div className="bg-[#f7f7f7] min-h-screen">
        <div className="h-[400px] bg-gradient-to-r from-[#121212] to-[#53151c] flex gap-2 items-center justify-center px-4">

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

        <div className="bg-white rounded-md p-4 mt-4 mx-4 border border-gray-300 flex justify-between items-center shadow-sm"> 
          <h3 className="font-semibold text-lg text-gray-800">
            54 việc làm ai tại Việt Nam
          </h3>
        </div>
        <div className="bg-white rounded-md p-4 mt-4 mx-4 border border-gray-300 flex justify-between items-center shadow-sm"> 
          <h3 className="font-semibold text-lg text-gray-800">
            54 việc làm ai tại Việt Nam
          </h3>
        </div>
        <div className="bg-white rounded-md p-4 mt-4 mx-4 border border-gray-300 flex justify-between items-center shadow-sm"> 
          <h3 className="font-semibold text-lg text-gray-800">
            54 việc làm ai tại Việt Nam
          </h3>
        </div>
        <div className="bg-white rounded-md p-4 mt-4 mx-4 border border-gray-300 flex justify-between items-center shadow-sm"> 
          <h3 className="font-semibold text-lg text-gray-800">
            54 việc làm ai tại Việt Nam
          </h3>
        </div>
      </div>
    </>
  );
}
