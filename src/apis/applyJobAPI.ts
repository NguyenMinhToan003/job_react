import { ApplyJobResponse, CreateApplyRequest } from "@/types/applyJobType";
import { axiosInstance } from "./index";
import { Job } from "@/types/jobType";

export const applyJob = async (jobId: number, data: CreateApplyRequest) => {
  const response = await axiosInstance.post(`/apply-job/${jobId}`, data);
  return response.data;
}

export const getApplyByStatus = async (status: string) => {
  const response = await axiosInstance.get<ApplyJobResponse[]>(`/apply-job/me/status/${status}`);
  return response.data;
}

export const getApplyJobByJobId = async (job: Job) => {
  const response = await axiosInstance.get<ApplyJobResponse[]>(`/apply-job/employer/job/${job.id}`);
  return response.data;
}
export const applyJobWithNewCv = async (jobId: number, data: CreateApplyRequest, cv: File ) => {
  const formData = new FormData();
  formData.append('cv', cv);
  formData.append('username', data.username);
  formData.append('phone', data.phone);
  formData.append('note', data.note);
  const response = await axiosInstance.post(`/apply-job/apply-new-cv/${jobId}`, formData);
  return response.data;
}