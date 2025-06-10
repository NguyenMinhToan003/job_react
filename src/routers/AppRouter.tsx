import Home from '@/pages/candidate/Home';
import { Route, Routes } from 'react-router-dom';
import Index from '@/pages/candidate/Index';
import UserDashboard from '@/pages/candidate/dashboard/Index';
import Overview from '@/pages/candidate/dashboard/Overview';
import IndexAdmin from '@/pages/admin/IndexAdmin';
import OverViewAdmin from '@/pages/admin/Overview';
import JobDetail from '@/pages/candidate/JobDetail';
import CompanyPage from '@/pages/candidate/EmployerPage';
import OverViewCompany from '@/pages/employer/OverView';
import IndexCompany from '@/pages/employer/IndexEmployer';
import CompanyJob from '@/pages/employer/job/Job';
import LocationCompany from '@/pages/employer/location/Location';
import Experience from '@/pages/admin/experience/experience';
import SkillPage from '@/pages/admin/skill/skill';
import UpdateJob from '@/pages/employer/job/UpdateJob';
import BenefitPage from '@/pages/admin/benefit/benefit';
import LevelPage from '@/pages/admin/level/level';
import TypeJobPage from '@/pages/admin/typeJob/TypeJob';
import CityDistrictPage from '@/pages/admin/city/City';
import CompanyListPage from '@/pages/admin/company/Company';
import JobListPage from '@/pages/admin/job/Job';
import LoginPage from '@/pages/auth/Login';
import { useAccount } from '@/providers/UserProvider';
import { useEffect } from 'react';
import JobForMe from '@/pages/candidate/dashboard/jobforme/JobForMe';
import JobDetailCompany from '@/pages/employer/job/JobDetail';
import JobApplicationForm from '@/pages/candidate/JobApplicationForm';
import Map from '@/pages/candidate/Map';
import CreateJob from '@/pages/employer/job/CreateJob';
import ViewJob from '@/pages/employer/job/ViewJob.';
import LoginSuccess from '@/pages/auth/LoginSusscess';
import EmployerNotification from '@/pages/employer/notification/Noti';
import RegisterCandidate from '@/pages/auth/RegisterCandidate';
import UpdateInfoCandidate from '@/pages/candidate/dashboard/UpdateInfo';
import RegisterEmployer from '@/pages/auth/RegisterEmployer';
import ListResume from '@/pages/candidate/dashboard/resume/ListResume';
import Resume from '@/pages/candidate/dashboard/resume/Resume';
import FormUpdateResume from '@/pages/candidate/dashboard/resume/FormUpdateResume';
import FormCreateResume from '@/pages/candidate/dashboard/resume/FormCreateResume';
import ViewResumeVersion from '@/pages/candidate/dashboard/resume/ViewResumeVersion';
import Country from '@/pages/admin/country/Country';
import FieldList from '@/pages/admin/field/FieldList';
import FieldDetail from '@/pages/admin/field/FieldDetail';
import Major from '@/pages/admin/major/Major';


export default function AppRouter() {
  const { updateDataUser } = useAccount()
  useEffect(() => {
    updateDataUser()
  }, [])
  return (<>
    <Routes>
      <Route path='/auth/login' element={<LoginPage />} />
      <Route path='/' element={<Index />}>
        <Route path='dang-ky' element={<RegisterCandidate />} />
        <Route path='login-success' element={<LoginSuccess />} />
        <Route path='cong-viec/:id' element={<JobDetail />} />
        <Route index element={<Home />} />
        <Route path='map/:lat/:lng' element={<Map />} />
        <Route path='ung-tuyen-cong-viec/:jobId' element={<JobApplicationForm />} />
        <Route path='/tong-quat-ho-so' element={<UserDashboard />} >
          <Route index element={<Overview />} />
          <Route path='tao-ho-so' element={<FormCreateResume />} />
          <Route path='cap-nhat-thong-tin' element={<UpdateInfoCandidate />} />
          <Route path='ca-nhan' element={<Overview />} />
          <Route path='viec-lam' element={<JobForMe />} />
          <Route path='tin-nhan' element={<Overview />} />
          <Route path='thong-bao' element={<Overview />} />
          <Route path='cai-dat' element={<Overview />} />
          <Route path='chinh-sua-ho-so/:resumeId' element={<FormUpdateResume/>}/>
          <Route path='ho-so' element={<ListResume />} />
          <Route path='ho-so/:resumeId' element={<Resume />} />
          <Route path='*' element={<Overview />} />
        </Route>
        <Route path='/nha-tuyen-dung/:id'>
          <Route index element={<CompanyPage />} />
        </Route>
      </Route>

      <Route path='/admin' element={<IndexAdmin />}>
        <Route index element={<OverViewAdmin />} />
        <Route path='quyen-loi' element={<BenefitPage />} />
        <Route path='kinh-nghiem' element={<Experience />} />
        <Route path='ki-nang' element={<SkillPage />} />
        <Route path='quoc-gia' element={<Country />} />
        <Route path='cap-bac' element={<LevelPage />} />
        <Route path='hinh-thuc-lam-viec' element={<TypeJobPage />} />
        <Route path='thanh-pho' element={<CityDistrictPage />} />
        <Route path='linh-vuc' element={<FieldList />} />
        <Route path='linh-vuc/:fieldId' element={<FieldDetail />} />
        <Route path='chuyen-nganh/:majorId' element={<Major />} />
        <Route path='nha-tuyen-dung' element={<CompanyListPage />} />
        <Route path='*' element={<OverViewAdmin />} />
        <Route path='tuyen-dung'>
          <Route index element={<JobListPage />} />
          <Route path=':tab' element={<JobListPage />} />
          <Route path='review/:id' element={<ViewJob />} />
        </Route>
      </Route>
      // employer
      <Route path='/danh-cho-nha-tuyen-dung' element={<IndexCompany />} >
        <Route index element={<OverViewCompany />} />
        <Route path='dang-ky' element={<RegisterEmployer />} />
        <Route path='tuyen-dung' element={<CompanyJob />} />
        <Route path='tuyen-dung/:tab' element={<CompanyJob />} />
        <Route path='dia-diem' element={<LocationCompany />} />
        <Route path='cap-nhat-tuyen-dung/:id' element={<UpdateJob />} />
        <Route path='dang-tin-tuyen-dung' element={<CreateJob />} />
        <Route path='thong-tin-tuyen-dung/:id' element={<ViewJob />} />
        <Route path='xem-ho-so/:resumeVerId' element={<ViewResumeVersion />} />
        <Route path='danh-sach-ung-tuyen/:jobId' element={<JobDetailCompany />} />
        <Route path='thong-bao' element={<EmployerNotification />} />
        <Route path='*' element={<OverViewCompany />} />
      </Route>
    </Routes>
  </>)
}