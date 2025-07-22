import { ApplyJobByJobIdResponse, ApplyJobResponse, CreateApplyRequest, GetApplyJobByTags } from "@/types/applyJobType";
import { axiosInstance } from "./index";
import { APPLY_JOB_STATUS } from "@/types/type";
import { ResumeVersion } from "@/types/resumeType";

export const applyJob = async (jobId: number, data: CreateApplyRequest) => {
  const response = await axiosInstance.post(`/apply-job/${jobId}`, data);
  return response.data;
}

export const getApplyByStatus = async (status: string) => {
  const response = await axiosInstance.get<ApplyJobResponse[]>(`/apply-job/me/status/${status}`);
  return response.data;
}

export const getApplyJobByJobId = async (jobId?: number) => {
  const response = await axiosInstance.get<ApplyJobResponse[]>(`/apply-job/employer/job`, {
    params: { jobId }
  });
  return response.data;
}
export const applyJobWithNewCv = async (jobId: number, data: CreateApplyRequest, cv: File ) => {
  const formData = new FormData();
  formData.append('cv', cv);
  formData.append('username', data.username);
  formData.append('phone', data.phone);
  formData.append('candidateNode', data.candidateNote);
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

export const addTagToApplyJob = async (applyId: number, tags: { tagIds: number[] }) => {
  const response = await axiosInstance.post(`/apply-job/addTag/${applyId}`, tags);
  return response.data;
}
export const removeTagToApplyJob = async (applyId: number, tags : { tagIds: number[] }) => {
  const response = await axiosInstance.patch(`/apply-job/removeTag/${applyId}`, tags);
  return response.data;
}
export const feedbackApplyJob = async (applyId: number, feedback: string) => {
  const response = await axiosInstance.post(`/apply-job/feedback/${applyId}`, { feedback });
  return response.data;
}

export const getApplyJobByCandidateId = async () => {
  const response = await axiosInstance.get<ApplyJobResponse[]>(`/apply-job/candidate`);
  return response.data;
}
export const sendEmailToCandidate = async (applyId: number, subject: string, content: string) => {
  const response = await axiosInstance.post(`/apply-job/send-mail-to-candidate/${applyId}`, { subject, content });
  return response.data;
}
export const getApplyJobDashboard = async () => {
  const response = await axiosInstance.get<{
    totalApply: number,
    notViewed: number,
    penddingApply: number,
    hiredApply: number,
    interviewApply: number,
    qualifiedApply: number
  }>(`/apply-job/dashboard/employer`);
  return response.data;
}
export const getApplyJobByTags = async (data: GetApplyJobByTags) => {
  const response = await axiosInstance.get<ApplyJobResponse[]>(`/apply-job/apply-job-by-tags`, {
    params: data
  });
  return response.data;
}
export const viewApplyJobByCandidate = async (jobId: number) => {
  const response = await axiosInstance.get<ResumeVersion>(`/apply-job/view-apply/candidate/${jobId}`);
  return response.data;
}