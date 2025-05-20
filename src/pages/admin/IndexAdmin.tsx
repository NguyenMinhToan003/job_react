import AdminNavbar from "@/components/elements/navbar/AdminNavbar";
import { Outlet } from "react-router-dom";

export default function IndexAdmin() {
  return (
    <>
      <div className="p-6 flex gap-6 bg-[#f7f7f7]">
        <AdminNavbar />
        <div className="flex-1">
          <Outlet />
        </div>
      </div>
    </>
  );
}