import { CompanyFilterJob, CreateJobRequest, JobFilterAdminRequest, JobFilterRequest, JobFilterResponse, JobResponse, UpdateJobAdminRequest } from '@/types/jobType';
import { axiosInstance } from './index';

export const createJob = async (data: CreateJobRequest) => {
  const response = await axiosInstance.post('/job', data);
  return response.data;
}

export const getJobByCompanyId = async (data: CompanyFilterJob) => {
  const response = await axiosInstance.post<JobResponse[]>('/job/employer', data);
  return response.data;
}

export const updateJob = async (jobId: number, data: CreateJobRequest) => {
  const response = await axiosInstance.patch<JobResponse>(`/job/${jobId}`, data);
  return response.data;
}

export const filterJobAdmin = async (filter: JobFilterAdminRequest) => {
  const response = await axiosInstance.post<JobResponse[]>('/job/admin/filter', filter);
  return response.data;
}

export const deleteJob = async (jobId: number) => {
  const response = await axiosInstance.delete(`/job/${jobId}`);
  return response.data;
}

export const filterJob = async (data: JobFilterRequest) => {
  const response = await axiosInstance.post<{
    total: number;
    data: JobFilterResponse[];
  }>('/job/filter', data);
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
  const response = await axiosInstance.get<JobResponse>(`/job/view-all-job/${jobId}`);
  return response.data;
}