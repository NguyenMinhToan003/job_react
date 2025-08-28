import Navigate from "@/components/elements/navbar/userNavbar";
import { Outlet } from "react-router-dom";

export default function Index() {
  return (
    <>
      <Navigate/>
      <div className="bg-[#f7f7f7] min-h-[calc(100vh-65px)]">
        <Outlet />
        
      </div>
    </>
  )
}