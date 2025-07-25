import { JobFilterResponse, ViewJobResponse } from '@/types/jobType';
import { axiosInstance } from './index';

export const addViewJobAPI = async (jobId: number) => {
  const response = await axiosInstance.post(`/view-job/${jobId}`);
  return response.data;
}
export const getAllViewJobsAPI = async (page: number, limit: number) => {
  const response = await axiosInstance.get<{
    items: ViewJobResponse[];
    totalPage: number;
    page: number;
    limit: number;
    total: number;
  }>(`/view-job/me/${page}/${limit}`);
  return response.data;
}
export const getRecomendedViewJobAPI = async () => {
  const response = await axiosInstance.get<JobFilterResponse[]>(`/view-job/recommended`);
  return response.data;
}
export const getViewJobByIdAPI = async (id: number) => {
  const response = await axiosInstance.get<number>(`/view-job/getViews/${id}`);
  return response.data;
}
export const getViewDashboardAPI = async () => {
  const response = await axiosInstance.get<number>(`/view-job/dashboard/employer`);
  return response.data;
}