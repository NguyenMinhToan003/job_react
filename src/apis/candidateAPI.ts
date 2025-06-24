import { AdminFilterCandidateDto, CandidateResponse } from "@/types/accountType"
import { axiosInstance } from "./index"
import { CandidateRegisterRequest, SignInResponse, UpdateInfoCandidateRequest } from "@/types/authType"
 
export const getDataCandidate = async () => {
  const response = await axiosInstance.get<CandidateResponse>('/candidate/me')
  return response.data
}

export const updateInfoCandidate = async (data: UpdateInfoCandidateRequest) => {
  const formData = new FormData();
  if (data.avatar) {
    formData.append('avatar', data.avatar);
  }
  if (data.name) {
    formData.append('name', data.name);
  }
  if (data.phone) {
    formData.append('phone', data.phone);
  }
  const response = await axiosInstance.patch<CandidateResponse>('/candidate/me', formData)
  return response.data
}
export const registerCandidate = async (data: CandidateRegisterRequest) => {
  const formData = new FormData();
  if (data.avatar) {
    formData.append('avatar', data.avatar);
  }
  formData.append('email', data.email);
  formData.append('password', data.password);
  formData.append('name', data.name);
  formData.append('gender', data.gender);
  formData.append('phone', data.phone);
  if (data.birthday) {
    formData.append('birthday', data.birthday);
  }
  if (data.location) {
    formData.append('location', data.location);
  }
  const response = await axiosInstance.post<SignInResponse>('/auth/register/candidate', formData);
  return response.data;
}

export const allCandidate = async (params: AdminFilterCandidateDto) => {
  const response = await axiosInstance.get<{
    items: CandidateResponse[];
    total: number;
    totalPage: number;
  }>('/candidate/all', { params });
  return response.data;
}