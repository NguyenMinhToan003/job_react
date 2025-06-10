import { MajorRequest, MajorResponse } from "@/types/majorType";
import { axiosInstance } from "./index";

export const getListMajorAPI = async () => {
  const response = await axiosInstance.get<MajorResponse[]>('/major');
  return response.data;
}

export const createMajorAPI = async (major: MajorRequest) => {
  const response = await axiosInstance.post<MajorResponse>('/major', major);
  return response.data;
}
export const updateMajorAPI = async (id: number, major: MajorRequest) => {
  const response = await axiosInstance.patch<MajorResponse>(`/major/${id}`, major);
  return response.data;
}

export const deleteMajorAPI = async (id: number) => {
  const response = await axiosInstance.delete(`/major/${id}`);
  return response.data;
}
export const getMajorByIdAPI = async (id: number) => {
  const response = await axiosInstance.get<MajorResponse>(`/major/${id}`);
  return response.data;
}
  