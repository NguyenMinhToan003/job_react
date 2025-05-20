import { Company, CompanyDetailResponse } from "@/types/companyType";
import { axiosInstance } from "./index";


export const getAllCompany = async () => {
  const response = await axiosInstance.get<Company[]>('/company');
  return response.data;
}

export const getCompanyInfo = async () => {
  const response = await axiosInstance.get<Company>('/company/info');
  return response.data;
}
export const getCompanyDetailAPI = async (companyId: number) => {
  const response = await axiosInstance.get<CompanyDetailResponse>(`/company/detail/${companyId}`);
  return response.data;
}