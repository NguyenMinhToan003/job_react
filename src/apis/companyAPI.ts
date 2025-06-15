import { Employer, EmployerDetailResponse } from "@/types/companyType";
import { axiosInstance } from "./index";
import { EmployerRegisterRequest } from "@/types/authType";


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
export const registerCompanyAPI = async (data: EmployerRegisterRequest) => {
  const formData = new FormData();
  if (data.logo) {
    formData.append('logo', data.logo);
  }
  formData.append('email', data.email);
  formData.append('password', data.password);
  formData.append('name', data.name);
  formData.append('taxCode', data.taxCode);
  formData.append('employeeScale', data.employeeScale);
  formData.append('businessType', data.businessType);
  formData.append('countryId', data.countryId.toString());
  formData.append('phone', data.phone);
  if (data.introduction) {
    formData.append('introduction', data.introduction);
  }
  const response = await axiosInstance.post<Employer>('/auth/register/employer', formData);
  return response.data;
}