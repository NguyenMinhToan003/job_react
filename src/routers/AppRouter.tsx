import Home from '@/pages/user/Home';
import { Route, Routes } from 'react-router-dom';
import Index from '@/pages/user/Index';
import UserDashboard from '@/pages/user/dashboard/Index';
import Overview from '@/pages/user/dashboard/Overview';
import IndexAdmin from '@/pages/admin/IndexAdmin';
import OverViewAdmin from '@/pages/admin/Overview';
import JobDetail from '@/pages/user/JobDetail';
import CompanyPage from '@/pages/user/CompanyPage';
import OverViewCompany from '@/pages/company/OverView';
import IndexCompany from '@/pages/company/IndexCompany';
import CompanyJob from '@/pages/company/job/Job';
import LocationCompany from '@/pages/company/location/Location';
import Experience from '@/pages/admin/experience/experience';
import SkillPage from '@/pages/admin/skill/skill';
import UpdateJob from '@/pages/company/job/UpdateJob';
import BenefitPage from '@/pages/admin/benefit/benefit';
import LevelPage from '@/pages/admin/level/level';
import TypeJobPage from '@/pages/admin/typeJob/TypeJob';
import CityDistrictPage from '@/pages/admin/city/City';
import CompanyListPage from '@/pages/admin/company/Company';
import JobListPage from '@/pages/admin/job/Job';
import LoginPage from '@/pages/auth/Login';
import { useAccount } from '@/providers/UserProvider';
import { useEffect } from 'react';
import JobForMe from '@/pages/user/dashboard/jobforme/JobForMe';
import JobDetailCompany from '@/pages/company/job/JobDetail';
import JobApplicationForm from '@/pages/user/JobApplicationForm';
import Map from '@/pages/user/Map';
import CreateJob from '@/pages/company/job/CreateJob';

export default function AppRouter() {
  const { updateDataUser } = useAccount()
  useEffect(() => {
    updateDataUser()
  }, [])
  return (<>
    <Routes>
      <Route path='/auth/login' element={<LoginPage />} />
      <Route path='/' element={<Index />}>
        <Route index element={<Home />} />
        <Route path='map/:lat/:lng' element={<Map />} />
        <Route path='ung-tuyen-cong-viec/:jobId' element={<JobApplicationForm />} />
        <Route path='/tong-quat-ho-so' element={<UserDashboard />} >
          <Route index element={<Overview />} />
          <Route path='ca-nhan' element={<Overview />} />
          <Route path='viec-lam' element={<JobForMe />} />
          <Route path='tin-nhan' element={<Overview />} />
          <Route path='thong-bao' element={<Overview />} />
          <Route path='cai-dat' element={<Overview />} />
          <Route path='ho-so' element={<Overview />} />
        </Route>
        <Route path='/nha-tuyen-dung/:id'>
          <Route index element={<CompanyPage />} />
        </Route>
        <Route path='cong-viec' element={<JobDetail />} />
      </Route>
      // admin
      <Route path='/admin' element={<IndexAdmin />}>
        <Route index element={<OverViewAdmin />} />
        <Route path='quyen-loi' element={<BenefitPage />} />
        <Route path='kinh-nghiem' element={<Experience />} />
        <Route path='ki-nang' element={<SkillPage />} />
        <Route path='cap-bac' element={<LevelPage />} />
        <Route path='hinh-thuc-lam-viec' element={<TypeJobPage />} />
        <Route path='thanh-pho' element={<CityDistrictPage />} />
        <Route path='nha-tuyen-dung' element={<CompanyListPage />} />
        <Route path='*' element={<OverViewAdmin />} />
        <Route path='tuyen-dung' element={<JobListPage />} />
      </Route>
      // company
      <Route path='/danh-cho-nha-tuyen-dung' element={<IndexCompany />} >
        <Route index element={<OverViewCompany />} />
        <Route path='tuyen-dung' element={<CompanyJob />} />
        <Route path='tuyen-dung/:tab' element={<CompanyJob />} />
        <Route path='dia-diem' element={<LocationCompany />} />
        <Route path='cap-nhat-tuyen-dung/:id' element={<UpdateJob />} />
        <Route path='dang-tin-tuyen-dung' element={<CreateJob/>} />
        <Route path='danh-sach-ung-tuyen/:jobId' element={<JobDetailCompany />} />
        <Route path='*' element={<OverViewCompany />} />
      </Route>
    </Routes>
  </>)
}