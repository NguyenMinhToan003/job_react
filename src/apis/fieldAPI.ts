import { Field } from "@/types/majorType";
import { axiosInstance } from "./index";

export const getFieldList = async () => {
  const response = await axiosInstance.get<Field[]>('/field');
  return response.data;
}

export const getFieldById = async (id: number) => {
  const response = await axiosInstance.get<Field>(`/field/${id}`);
  return response.data;
}
export const createFieldAPI = async (field: { name: string }) => {
  const response = await axiosInstance.post<Field>('/field', field);
  return response.data;
} 
export const updateFieldAPI = async (id: number, field: { name: string }) => {
  const response = await axiosInstance.patch<Field>(`/field/${id}`, field);
  return response.data;
}

export const deleteFieldAPI = async (id: number) => {
  const response = await axiosInstance.delete(`/field/${id}`);
  return response.data;
}