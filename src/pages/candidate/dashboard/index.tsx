import CandidateNavbarDashboard from "@/components/elements/navbar/candidateNavbarDashboard";
import { Outlet } from "react-router-dom";

export default function CandidateSidebar() {
  return <div className='w-8xl mx-auto  flex gap-6 min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-indigo-50 p-1'>
    <CandidateNavbarDashboard/>
    <div className='flex-1 space-y-6'>
      <Outlet />
    </div>
  </div>
}
