import { CompanyFilterJob, CreateJobRequest, JobDetailResponse, JobFilterAdminRequest, JobFilterRequest, JobFilterResponse, JobResponse, MatchingWeightRequest, UpdateJobAdminRequest } from '@/types/jobType';
import { axiosInstance } from './index';
import { toast } from 'sonner';
import { UseSubscriptionRequest } from '@/types/employerSubType';

export const createJob = async (data: CreateJobRequest) => {
  const response = await axiosInstance.post('/job', data);
  return response.data;
}

export const getJobByCompanyId = async (data: CompanyFilterJob) => {
  const response = await axiosInstance.post<JobDetailResponse[]>('/job/employer', data);
  return response.data;
}

export const updateJob = async (jobId: number, data: CreateJobRequest) => {
  const response = await axiosInstance.patch<JobResponse>(`/job/${jobId}`, data);
  return response.data;
}

export const jobUseSubscription = async (data: UseSubscriptionRequest) => {
  const response = await axiosInstance.post('/job/use-subscription', data);
  return response.data;
}

export const filterJobAdmin = async (filter: JobFilterAdminRequest) => {
  const response = await axiosInstance.post<{
    total: number;
    data: JobDetailResponse[];
    page: number;
    limit: number;
    totalPages: number;
  }>('/job/admin/filter', filter);
  return response.data;
}

export const deleteJob = async (jobId: number) => {
  const response = await axiosInstance.delete(`/job/${jobId}`);
  return response.data;
}

export const publishJob = async (jobId: number) => {
  const response = await axiosInstance.post<JobResponse>(`/job/employer/request-publish/${jobId}`);
  return response.data;
}

export const filterJob = async (data: JobFilterRequest) => {
  const response = await axiosInstance.get<{
    total: number;
    data: JobFilterResponse[];
    page: number;
    limit: number;
    totalPage: number;
  }>('/job/filter/search', {
    params:data
  });
  return response.data;
}

export const getDetailJobById = async (jobId: number) => {
  const response = await axiosInstance.get<JobFilterResponse>(`/job/${jobId}`);
  return response.data;
}

export const updateJobAdmin = async (jobId: number, data: UpdateJobAdminRequest) => {
  const response = await axiosInstance.patch<JobResponse>(`/job/admin/${jobId}`, data);
  return response.data;
}

export const toggleJobStatus = async (jobId: number) => {
  const response = await axiosInstance.patch<JobResponse>(`/job/employer/toggle-is-show/${jobId}`);
  return response.data;
}

export const viewJobAPI = async (jobId: number) => {
  const response = await axiosInstance.get<JobResponse>(`/job/view-all-element-job/${jobId}`);
  return response.data;
}

export const createMatchingWeightJob = async (jobId: number | null, data: MatchingWeightRequest) => {
  if (!jobId) toast.error('Sảy ra lỗi khi tạo trọng số phù hợp cho công việc');
  const response = await axiosInstance.post(`/matching-weight/trigger-job-create/${jobId}`, data);
  return response.data;
}

export const updateMatchingWeightJob = async (jobId: number, data: MatchingWeightRequest) => {
  const response = await axiosInstance.patch(`/matching-weight/${jobId}`, data);
  return response.data;
}
export const filterJobByMajor = async (majorId: number) => {
  const response = await axiosInstance.get<JobFilterResponse[]>(`/job/major/${majorId}`);
  return response.data;
}

export const getJobBanner = async () => {
  const response = await axiosInstance.post<JobFilterResponse[]>('/job/banner');
  return response.data;
}
export const getJobByLocation = async (map: {
  latitude: number;
  longitude: number;
  radius: number;
}) => {
  const response = await axiosInstance.post<JobFilterResponse[]>(`/job/job-map`, map);
  return response.data;
}

export const getCountJobDashboard = async () => {
  const response = await axiosInstance.get<{
    total: number,
    active: number,
    pending: number,
    expired: number,
  }>(`/job/dashboard/employer/count`);
  return response.data;
}
export const extendJob = async (jobId: number, expiredAt: Date) => {
  const response = await axiosInstance.patch<JobResponse>(`/job/extend/${jobId}`, { expiredAt });
  return response.data;
}
export const refreshJobInPackage = async () => {
  const response = await axiosInstance.post('/job/refresh-job');
  return response.data;
}
export const adminGetDashboardData = async () => {
  const response = await axiosInstance.get<{
    totalJobs: number;
    activeJobs: number;
    pendingJobs: number;
    expiredJobs: number;
    blockedJobs: number;
  }>('/job/admin/get-dashboard');
  return response.data;
}
export const getRecommendJobsByFollowedEmployers = async () => {
  const response = await axiosInstance.get<JobFilterResponse[]>('/job/recommend-jobs-by-followed-employers');
  return response.data;
}