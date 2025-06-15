import AdminNavbar from '@/components/elements/navbar/AdminNavbar';
import { Outlet } from 'react-router-dom';

export default function IndexAdmin() {
  return (
    <>
      <div className='p-6 flex gap-6 bg-gradient-to-br from-green-50 via-blue-50 to-indigo-50'>
        <AdminNavbar />
        <div className='flex-1'>
          <Outlet />
        </div>
      </div>
    </>
  );
}