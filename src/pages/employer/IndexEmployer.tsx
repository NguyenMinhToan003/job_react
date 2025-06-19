
import { getEmployerInfo } from "@/apis/companyAPI";
import CompanyNavbar from "@/components/elements/navbar/CompanyNavbar";
import UserNavbar from "@/components/elements/navbar/UserNavbar";
import { Employer } from "@/types/companyType";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

export default function IndexEmployer() {
  const [setAccount] = useState<Employer>();
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
      <UserNavbar/>
      <div className="min-h-screen flex gap-6 bg-gradient-to-br from-green-50 via-blue-50 to-indigo-50">
        <CompanyNavbar />
        <Outlet />
      </div>
    </>
  );
}