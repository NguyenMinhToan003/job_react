import { CountryResponse } from "@/types/countryType";
import { axiosInstance } from "./index";

export const getAllCountries = async () => {
  const response = await axiosInstance.get<CountryResponse[]>('/countries');
  return response.data;
}
export const createCountry = async (name: string, flag: File| null) => {
  const formData = new FormData();
  formData.append('name', name);
  if (flag) {
    formData.append('flag', flag);
  }
  const response = await axiosInstance.post<CountryResponse>('/countries', formData);
  return response.data;
}
export const updateCountry = async (
  id: number, name?: string, flag?: File | null) => {
  const formData = new FormData();
  if (name) {
    formData.append('name', name);
  }
  if (flag) {
    formData.append('flag', flag);
  }
  const response = await axiosInstance.patch<CountryResponse>(`/countries/${id}`, formData);
  return response.data;
}
export const deleteCountry = async (id: number) => {
  const response = await axiosInstance.delete(`/countries/${id}`);
  return response.data;
}
export const toggleHiden = async (id: number) => {
  const response = await axiosInstance.post<string>(`/countries/toggle-hiden/${id}`);
  return response.data;
}