import Home from '@/pages/candidate/Home';
import { Route, Routes } from 'react-router-dom';
import Index from '@/pages/candidate/Index';
import UserDashboard from '@/pages/candidate/dashboard/Index';
import Overview from '@/pages/candidate/dashboard/Overview';
import IndexAdmin from '@/pages/admin/IndexAdmin';
import OverViewAdmin from '@/pages/admin/Overview';
import JobDetail from '@/pages/candidate/JobDetail';
import CompanyPage from '@/pages/candidate/EmployerPage';
import IndexCompany from '@/pages/employer/IndexEmployer';
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
import FormUpdateResume from '@/pages/candidate/dashboard/resume/FormUpdateResume';
import FormCreateResume from '@/pages/candidate/dashboard/resume/FormCreateResume';
import Country from '@/pages/admin/country/Country';
import FieldList from '@/pages/admin/field/FieldList';
import FieldDetail from '@/pages/admin/field/FieldDetail';
import Major from '@/pages/admin/major/Major';
import ViewResumeVersionForJob from '@/pages/employer/resume/ViewResumeVersionForJob';
import CopyJob from '@/pages/employer/job/CopyJob';
import Price from '@/pages/employer/price/Price';
import Follows from '@/pages/candidate/dashboard/follow/follow';
import RecommentFollow from '@/pages/candidate/dashboard/follow/RecommentFollow';
import SearchJobInLocation from '@/pages/candidate/searchjob/SearchJobInLocation';
import SearchCandidate from '@/pages/employer/search-candidate/SearchCandidate';
import InfoEmployer from '@/pages/employer/info/Info-Employer';
import PaymentSuccess from '@/pages/employer/PaymentResult';
import Service from '@/pages/employer/servicePage/Service';
import DetailService from '@/pages/employer/servicePage/DetailService';
import SearchJob from '@/pages/candidate/searchjob/SearchJob';
import ViewResumeLastVersion from '@/pages/candidate/dashboard/resume/ViewResumeLastVersion';
import ExpiredJobs from '@/pages/employer/job/ExpiredJobs';
import EmployerJobList from '@/pages/employer/job/EmployerJobList';
import TagResume from '@/pages/employer/tag-resume/TagResume';
import CandidateList from '@/pages/admin/candidate/CandidateList';
import Packages from '@/pages/admin/package/Packages';
import Dashboard from '@/pages/employer/Dashboard';
import CandidateNoti from '@/pages/candidate/dashboard/CandidateNoti';
import EmployerList from '@/pages/candidate/search-employer/EmployerList';
import TransactionsPageAdmin from '@/pages/admin/package/TransactionsPageAdmin';
import DetailTransactionAdmin from '@/pages/admin/package/DetailTransactionAdmin';
import ServiceMe from '@/pages/employer/servicePage/ServiceMe';
import DetailCompany from '@/pages/admin/company/DetailCompany';
import Setting from '@/pages/admin/setting/Setting';
import JobDetailEmployer from '@/pages/employer/job/CandidateListByEmployer';
import CandidateListByEmployer from '@/pages/employer/job/CandidateListByEmployer';


export default function AppRouter() {
  const { updateDataUser } = useAccount()
  useEffect(() => {
    updateDataUser()
  }, [])

  return (<>
    <Routes>
      <Route path='/payment-result' element={<PaymentSuccess/>}/>
      <Route path='/auth/login' element={<LoginPage />} />
      <Route path='/nha-tuyen-dung/dang-ky' element={<RegisterEmployer />} />
      <Route path='dang-ky' element={<RegisterCandidate />} />
      <Route path='/' element={<Index />}>
        <Route path='nha-tuyen-dung-tiem-nang' element={<EmployerList />} />
        <Route path='login-success' element={<LoginSuccess />} />
        <Route path='cong-viec/:id' element={<JobDetail />} />
        <Route path='tim-theo-vi-tri' element={<SearchJobInLocation />} />
        <Route path='tim-kiem-cong-viec' element={<SearchJob />} />
        <Route index element={<Home />} />
        <Route path='map/:lat/:lng' element={<Map />} />
        <Route path='ung-tuyen-cong-viec/:jobId' element={<JobApplicationForm />} />
        <Route path='/tong-quat-ho-so' element={<UserDashboard />} >
          <Route path='thong-bao' element={<CandidateNoti />} />
          <Route index element={<Overview />} />
          <Route path='tao-ho-so' element={<FormCreateResume />} />
          <Route path='cap-nhat-thong-tin' element={<UpdateInfoCandidate />} />
          <Route path='ca-nhan' element={<Overview />} />
          <Route path='goi-y-tu-nha-tuyen-dung' element={<RecommentFollow />} />
          <Route path='viec-lam' element={<JobForMe />} />
          <Route path='tin-nhan' element={<Overview />} />
          <Route path='thong-bao' element={<Overview />} />
          <Route path='cai-dat' element={<Overview />} />
          <Route path='follow-nha-tuyen-dung' element={<Follows />} />
          <Route path='cong-ty-goi-y' element={<RecommentFollow />} />
          <Route path='chinh-sua-ho-so/:resumeId' element={<FormUpdateResume/>}/>
          <Route path='ho-so' element={<ListResume />} />
          <Route path='ho-so/:resumeId' element={<ViewResumeLastVersion />} />
          <Route path='*' element={<Overview />} />
        </Route>
        <Route path='/nha-tuyen-dung/:id'>
          <Route index element={<CompanyPage />} />
        </Route>
      </Route>

      <Route path='/admin' element={<IndexAdmin />}>
        <Route index element={<OverViewAdmin />} />
        <Route path='goi-dich-vu' element={<Packages />} />
        <Route path='giao-dich' element={<TransactionsPageAdmin />} />
        <Route path='giao-dich/:id' element={<DetailTransactionAdmin />} />
        <Route path='quyen-loi' element={<BenefitPage />} />
        <Route path='kinh-nghiem' element={<Experience />} />
        <Route path='ki-nang' element={<SkillPage />} />
        <Route path='quoc-gia' element={<Country />} />
        <Route path='ung-vien' element={<CandidateList />} />
        <Route path='cap-bac' element={<LevelPage />} />
        <Route path='hinh-thuc-lam-viec' element={<TypeJobPage />} />
        <Route path='thanh-pho' element={<CityDistrictPage />} />
        <Route path='linh-vuc' element={<FieldList />} />
        <Route path='linh-vuc/:fieldId' element={<FieldDetail />} />
        <Route path='chuyen-nganh/:majorId' element={<Major />} />
        <Route path='nha-tuyen-dung' element={<CompanyListPage />} />
        <Route path='cai-dat' element={<Setting />} />
        <Route path='nha-tuyen-dung/:id' element={<DetailCompany />} />
        <Route path='*' element={<OverViewAdmin />} />
        <Route path='tuyen-dung'>
          <Route index element={<JobListPage />} />
          <Route path=':tab' element={<JobListPage />} />
          <Route path='review/:id' element={<ViewJob />} />
        </Route>
      </Route>
      // employer
      <Route path='/danh-cho-nha-tuyen-dung' element={<IndexCompany />} >
        <Route path='bang-gia' element={<Price />} />
        <Route path='tim-kiem-ung-vien' element={<SearchCandidate />} />
        <Route index element={<Dashboard />} />
        <Route path='quan-ly-the' element={<TagResume />} />
        <Route path='tuyen-dung' element={<EmployerJobList />} />
        <Route path='tuyen-dung/het-han' element={<ExpiredJobs />} />
        <Route path='dich-vu-cua-toi' element={<ServiceMe />} />
        <Route path='lich-su-mua-hang' element={<Service />} />
        <Route path='lich-su-mua-hang/:id' element={<DetailService />} />
        <Route path='dia-diem' element={<LocationCompany />} />
        <Route path='cap-nhat-tuyen-dung/:id' element={<UpdateJob />} />
        <Route path='dang-tin-tuyen-dung' element={<CreateJob />} />
        <Route path='thong-tin-tuyen-dung/:id' element={<ViewJob />} />
        <Route path='nhan-ban/:id' element={<CopyJob />} />
        <Route path='quan-ly-thong-tin' element={<InfoEmployer />} />
        <Route path='danh-gia-ho-so-cong-viec/:applyId'
          element={<ViewResumeVersionForJob />} />
        <Route path='danh-sach-ung-tuyen/:jobId' element={<JobDetailEmployer />} />
        <Route path='ung-vien' element={<CandidateListByEmployer />} />
        <Route path='thong-bao' element={<EmployerNotification />} />
        <Route path='*' element={<Dashboard />} />
      </Route>
    </Routes>
  </>)
}