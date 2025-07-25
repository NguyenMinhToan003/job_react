import { ApplyJobResponse } from "@/types/applyJobType";
import { axiosInstance } from ".";
import { JobFilterResponse } from "@/types/jobType";

export const saveJob = async (jobId: number) => {
  const response = await axiosInstance.post(`/save-job`, { jobId });
  return response.data;
}

export const getSaveJobAPI = async (page: number, limit: number) => {
  const response = await axiosInstance.post<{
    items: ApplyJobResponse[];
    totalPage: number;
    page: number;
    limit: number;
    total: number;
  }>(`/save-job/me/${page}/${limit}`);
  return response.data;
}
export const getRecomendedSaveJobAPI = async () => {
  const response = await axiosInstance.get<JobFilterResponse[]>(`/save-job/recommended`);
  return response.data;
}
export const deleteSaveJobAPI = async (jobId: number) => {
  const response = await axiosInstance.delete(`/save-job/${jobId}`);
  return response.data;
}