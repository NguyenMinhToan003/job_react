import { CandidateResponse } from "@/types/accountType"
import { axiosInstance } from "./index"
import { RegisterCandidateRequest, UpdateInfoCandidateRequest } from "@/types/LoginType"
import { SignInResponse } from "@/types/authType"
 
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
export const registerCandidate = async (data: RegisterCandidateRequest) => {
  const response = await axiosInstance.post<SignInResponse>('/auth/register/candidate', data);
  return response.data;
}