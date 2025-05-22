import { CreateJob, JobFilterRequest, JobFilterResponse, JobResponse, UpdateJobAdminRequest } from "@/types/jobType";
import { axiosInstance } from "./index";

export const createJob = async (data: CreateJob) => {
  const response = await axiosInstance.post("/job", data);
  return response.data;
}

export const getJobByCompanyId = async () => {
  const response = await axiosInstance.post<JobResponse[]>('/job/company');
  return response.data;
}

export const updateJob = async (jobId: number, data: CreateJob) => {
  const response = await axiosInstance.patch<JobResponse>(`/job/${jobId}`, data);
  return response.data;
}

export const getAllJob = async () => {
  const response = await axiosInstance.get<JobResponse[]>("/job");
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
  }>("/job/filter", data);
  return response.data;
}

export const getDetailJobById = async (jobId: number) => {
  const response = await axiosInstance.get<JobResponse>(`/job/${jobId}`);
  return response.data;
}

export const updateJobAdmin = async (jobId: number, data: UpdateJobAdminRequest) => {
  const response = await axiosInstance.patch<JobResponse>(`/job/admin/${jobId}`, data);
  return response.data;
}