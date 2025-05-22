import { ApplyJobResponse, CreateApplyRequest } from "@/types/applyJobType";
import { axiosInstance } from "./index";
import { Job } from "@/types/jobType";

export const applyJob = async (jobId: number, data: CreateApplyRequest) => {
  const response = await axiosInstance.post(`/apply-job/${jobId}`, data);
  return response.data;
}

export const getApplyJobs = async () => {
  const response = await axiosInstance.get<ApplyJobResponse[]>('/apply-job/me');
  return response.data;
}

export const getApplyByStatus = async (status: string) => {
  const response = await axiosInstance.get<ApplyJobResponse[]>(`/apply-job/me/status/${status}`);
  return response.data;
}

export const getApplyJobByJobId = async (job: Job) => {
  const response = await axiosInstance.get<ApplyJobResponse[]>(`/apply-job/company/job/${job.id}`);
  return response.data;
}