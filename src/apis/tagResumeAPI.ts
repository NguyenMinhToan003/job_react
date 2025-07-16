import { TagResumeRequest, TagResumeResponse } from "@/types/tagResumeType";
import { axiosInstance } from "."

export const createTagResumeAPI = async (data: TagResumeRequest) =>{
  const response = await axiosInstance.post('/tag-resume', data);
  return response.data;
}
export const getAllTagResumeAPI = async () => {
  const response = await axiosInstance.get<TagResumeResponse[]>('/tag-resume');
  return response.data;
}
export const deleteTagResumeAPI = async (id: number) => {
  const response = await axiosInstance.delete(`/tag-resume/${id}`);
  return response.data;
}
export const updateTagResumeAPI = async (id: number, data: TagResumeRequest) => {
  const response = await axiosInstance.patch(`/tag-resume/${id}`, data);
  return response.data;
}
