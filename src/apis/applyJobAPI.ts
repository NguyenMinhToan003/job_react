import { ApplyJobByJobIdResponse, ApplyJobResponse, CreateApplyRequest } from "@/types/applyJobType";
import { axiosInstance } from "./index";
import { APPLY_JOB_STATUS } from "@/types/type";

export const applyJob = async (jobId: number, data: CreateApplyRequest) => {
  const response = await axiosInstance.post(`/apply-job/${jobId}`, data);
  return response.data;
}

export const getApplyByStatus = async (status: string) => {
  const response = await axiosInstance.get<ApplyJobResponse[]>(`/apply-job/me/status/${status}`);
  return response.data;
}

export const getApplyJobByJobId = async (jobId: number) => {
  const response = await axiosInstance.get<ApplyJobResponse[]>(`/apply-job/employer/job/${jobId}`);
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

export const unApplyJob = async (jobId: number) => {
  const response = await axiosInstance.post(`/apply-job/un-apply/${jobId}`);
  return response.data;
}

export const markViewed = async (applyId: number) => {
  const response = await axiosInstance.get(`/apply-job/mark-view/${applyId}`);
  return response.data;
}

export const analysResumeVersion = async (applyId: number) => {
  const response = await axiosInstance.get<ApplyJobByJobIdResponse>(`/apply-job/employer/analys/${applyId}`);
  return response.data;
}
export const updateApplyJobStatus = async (applyId: number, status: APPLY_JOB_STATUS) => {
  const response = await axiosInstance.post(`/apply-job/status/${applyId}`, { status });
  return response.data;
}