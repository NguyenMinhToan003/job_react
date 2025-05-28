import { Employer, EmployerDetailResponse } from "@/types/companyType";
import { axiosInstance } from "./index";


export const getAllEmployers = async () => {
  const response = await axiosInstance.get<Employer[]>('/employer');
  return response.data;
}

export const getEmployerInfo = async () => {
  const response = await axiosInstance.get<Employer>('/employer/info');
  return response.data;
}
export const getCompanyDetailAPI = async (companyId: number) => {
  const response = await axiosInstance.get<EmployerDetailResponse>(`/employer/detail/${companyId}`);
  return response.data;
}
export const registerCompanyAPI = async (data: {name:string, password: string, email: string, logo: string }) => {
  const response = await axiosInstance.post<Employer>('/auth/register/employer', data);
  return response.data;
}