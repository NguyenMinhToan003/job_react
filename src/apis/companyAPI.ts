import { AdminFilterEmployer, Employer, EmployerDetailResponse } from "@/types/companyType";
import { axiosInstance } from "./index";
import { EmployerRegisterRequest } from "@/types/authType";
import { EmployerResponse } from "@/types/accountType";


export const getAllEmployers = async () => {
  const response = await axiosInstance.get<Employer[]>('/employer');
  return response.data;
}

export const getEmployerInfo = async () => {
  const response = await axiosInstance.get<EmployerResponse>('/employer/info');
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
  formData.append('employeeScaleId', data.employeeScaleId.toString());
  formData.append('businessTypeId', data.businessTypeId.toString());
  formData.append('countryId', data.countryId.toString());
  formData.append('phone', data.phone);
  if (data.introduction) {
    formData.append('introduction', data.introduction);
  }
  const response = await axiosInstance.post<Employer>('/auth/register/employer', formData);
  return response.data;
}

export const getMeEmployer = async () => {
  const response = await axiosInstance.get<EmployerDetailResponse>('/employer/me');
  return response.data;
}
export const updateMeEmployer = async (data: EmployerRegisterRequest) => {
  const formData = new FormData();
  if (data.logo) {
    formData.append('logo', data.logo);
  }
  formData.append('name', data.name);
  formData.append('taxCode', data.taxCode);
  formData.append('employeeScaleId', data.employeeScaleId.toString());
  formData.append('businessTypeId', data.businessTypeId.toString());
  formData.append('countryId', data.countryId.toString());
  formData.append('website', data.website || '');
  formData.append('phone', data.phone);
  if (data.introduction) {
    formData.append('introduction', data.introduction);
  }
  const response = await axiosInstance.patch<EmployerDetailResponse>('/employer/me', formData);
  return response.data;
}

export const allEmployer = async (params: AdminFilterEmployer) => {
  const response = await axiosInstance.get<{
    items: EmployerDetailResponse[];
    total: number;
    totalPages: number;
  }>('/employer/all', { params });
  return response.data;
}