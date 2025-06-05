import { Resume, ResumeVersion } from "@/types/resumeType";
import { axiosInstance } from "./index"

export const getAllResumeAPI = async () => {
  const response = await axiosInstance.get<Resume[]>('/resume/me');
  return response.data;
}
export const viewResumeAPI = async (resumeId: number) => {
  const response = await axiosInstance.get<ResumeVersion>(`/resume-version/view/${resumeId}`);
  return response.data;
}