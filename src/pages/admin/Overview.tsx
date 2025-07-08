/* eslint-disable @typescript-eslint/no-explicit-any */
import { adminGetDashboardData } from '@/apis/jobAPI';
import { Card, CardContent } from '@/components/ui/card';
import {
  Activity,
  AlertTriangle,
  Clock,
  Lock,
  FileText,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import BarChartCompo from '@/components/elements/charts/BarChartCompo';
import { adminGetAccountDashboardData } from '@/apis/authAPI';


export default function OverViewAdmin() {
  const [dataJobs, setDataJobs] = useState({
    totalJobs: 0,
    activeJobs: 0,
    pendingJobs: 0,
    expiredJobs: 0,
    blockedJobs: 0,
  });
  const [accounts, setAccounts] = useState({
    employers: 0,
    candidates: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await adminGetDashboardData();
      const accountAPI = await adminGetAccountDashboardData();
      setDataJobs(response);
      setAccounts(accountAPI);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Có lỗi xảy ra khi tải dữ liệu tổng quan');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);
  return (
    <div className='min-h-screen bg-[#F6F6F6]'>
      <div className='p-6 -mt-8 relative z-10'>
        {/* Statistics Cards */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8'>
          {[
            {
              title: 'Tổng công việc',
              value: dataJobs.totalJobs,
              icon: FileText,
              color: 'from-blue-500 to-blue-600',
              text: 'text-blue-100',
            },
            {
              title: 'Đang hoạt động',
              value: dataJobs.activeJobs,
              icon: Activity,
              color: 'from-emerald-500 to-emerald-600',
              text: 'text-emerald-100',
            },
            {
              title: 'Chờ duyệt',
              value: dataJobs.pendingJobs,
              icon: Clock,
              color: 'from-amber-500 to-amber-600',
              text: 'text-amber-100',
            },
            {
              title: 'Đã hết hạn',
              value: dataJobs.expiredJobs,
              icon: AlertTriangle,
              color: 'from-red-500 to-red-600',
              text: 'text-red-100',
            },
            {
              title: 'Bị khóa',
              value: dataJobs.blockedJobs,
              icon: Lock,
              color: 'from-slate-500 to-slate-600',
              text: 'text-slate-100',
            },
          ].map(({ title, value, icon: Icon, color, text }) => (
            <Card
              key={title}
              className={`bg-gradient-to-r ${color} text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105`}
            >
              <CardContent className='p-6'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className={`${text} text-sm font-medium`}>{title}</p>
                    <p className='text-3xl font-bold'>{loading ? '...' : value}</p>
                  </div>
                  <div className='bg-white/20 p-3 rounded-full'>
                    <Icon className='w-6 h-6' />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Section */}
        <div className='grid grid-cols-2  gap-6 mb-8'>

          <BarChartCompo barData={[
            { name: 'Đang hoạt động', value: dataJobs.activeJobs, color: '#10b981' },
            { name: 'Chờ duyệt', value: dataJobs.pendingJobs, color: '#f59e0b' },
            { name: 'Đã hết hạn', value: dataJobs.expiredJobs, color: '#ef4444' },
            { name: 'Bị khóa', value: dataJobs.blockedJobs, color: '#6b7280' },
          ]} title='thong ke' />
          <BarChartCompo barData={[
            { name: 'Nhà tuyển dụng', value: accounts.employers, color: '#3b82f6' },
            { name: 'Ứng viên', value: accounts.candidates, color: '#10b981' },
          ]} title='thong ke tai khoan' />
        </div>
      </div>
    </div>
  );
}
