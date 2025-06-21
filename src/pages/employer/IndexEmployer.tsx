
import CompanyNavbar from "@/components/elements/navbar/CompanyNavbar";
import UserNavbar from "@/components/elements/navbar/UserNavbar";
import { Outlet } from "react-router-dom";

export default function IndexEmployer() {

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