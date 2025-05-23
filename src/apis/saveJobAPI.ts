import { axiosInstance } from ".";

export const saveJob = async (jobId: number) => {
  const response = await axiosInstance.post(`/save-job`, { jobId });
  return response.data;
}
export const getSaveJobAPI = async () => {
  const response = await axiosInstance.post(`/save-job/me`);
  return response.data;
}