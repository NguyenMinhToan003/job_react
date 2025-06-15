
import { getEmployerInfo } from "@/apis/companyAPI";
import CompanyNavbar from "@/components/elements/navbar/CompanyNavbar";
import { Employer } from "@/types/companyType";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

export default function IndexEmployer() {
  const [account, setAccount] = useState<Employer>();
  const fetchData = async () => {
    try {
      const response = await getEmployerInfo();
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
      <div className="min-h-screen p-6 flex gap-6 bg-gradient-to-br from-green-50 via-blue-50 to-indigo-50">
        <CompanyNavbar />
        <Outlet />
      </div>
    </>
  );
}