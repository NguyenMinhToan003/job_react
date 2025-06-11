import { ViewJobResponse } from '@/types/jobType';
import { axiosInstance } from './index';

export const addViewJobAPI = async (jobId: number) => {
  const response = await axiosInstance.post(`/view-job/${jobId}`);
  return response.data;
}
export const getAllViewJobsAPI = async () => {
  const response = await axiosInstance.get<ViewJobResponse[]>('/view-job');
  return response.data;
}