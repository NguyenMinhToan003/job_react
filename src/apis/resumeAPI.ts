import { Resume } from "@/types/resumeType";
import { axiosInstance } from "./index"

export const getMeResumeAPI = async (resumeId: number) => {
  const response = await axiosInstance.get<Resume>(`/resume/me/${resumeId}`);
  return response.data;
}
export const getAllResumeAPI = async () => {
  const response = await axiosInstance.get<Resume[]>('/resume/me');
  return response.data;
}