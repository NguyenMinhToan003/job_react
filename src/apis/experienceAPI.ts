import { CreateExperienceDto, Experience, UpdateExperienceDto } from "@/types/experienceType"
import { axiosInstance } from "./index"

export const getExperienceList = async () => {
  const response = await axiosInstance.get<Experience[]>('/experience');
  return response.data;
}
export const getExperienceListAdmin = async () => {
  const response = await axiosInstance.get<Experience[]>('/experience/admin');
  return response.data;
}

export const createExperience = async (experience: CreateExperienceDto) => {
  const response = await axiosInstance.post<Experience>('/experience', experience);
  return response.data;
}

export const updateExperience = async (id: number, experience: UpdateExperienceDto) => {
  const response = await axiosInstance.patch<Experience>(`/experience/${id}`, experience);
  return response.data;
}

export const deleteExperience = async (id: number) => {
  const response = await axiosInstance.delete(`/experience/${id}`);
  return response.data;
}
