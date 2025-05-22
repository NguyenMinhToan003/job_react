
import { getCompanyInfo } from "@/apis/companyAPI";
import CompanyNavbar from "@/components/elements/navbar/CompanyNavbar";
import { Button } from "@/components/ui/button";
import { Company } from "@/types/companyType";
import { House } from "lucide-react";
import { useEffect, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";

export default function IndexCompany() {
  const [account, setAccount] = useState<Company>();
  const fetchData = async () => {
    try {
      const response = await getCompanyInfo();
      setAccount(response);
    }
    catch (error) {
      console.error("Error fetching data:", error);
    }
  }
  useEffect(() => {
    fetchData()
  }
  , [])
  return (
    <>
      <div className='sticky flex justify-between top-0 bg-gradient-to-r from-[#121212] to-[#53151c] text-white z-100'>
        <div className='flex justify-center items-center gap-2 px-4 '>
          <div className='bg-white rounded-sm w-12 h-12 flex items-center justify-center  border border-[#f5f3f4]'>
              <img src={account?.logo} className='w-full h-full rounded-sm' />
            </div>
            <div className='flex-1'>
              <Button variant={"link"} className='text-gray-200 hover:text-white'>
                {account?.name}
              </Button>
            </div>
          </div>
        
        <div className=' p-2 flex items-center gap-6'>
          <Button variant={"link"} className='text-gray-200 hover:text-white'>
            <House/>
            <NavLink to='/'>Trang chủ</NavLink>
          </Button>
        </div>
      </div>
      <div className="p-6 flex gap-6 bg-[#f7f7f7]">
        <CompanyNavbar />
        <Outlet />
      </div>
    </>
  );
}