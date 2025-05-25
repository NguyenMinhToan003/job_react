import { CandidateResponse } from "@/types/accountType"
import { axiosInstance } from "./index"
 
export const getDataCandidate = async () => {
  const response = await axiosInstance.get<CandidateResponse>('/candidate/me')
  return response.data
}

export const updateInfoCandidate = async (data: Partial<CandidateResponse>) => {
  const response = await axiosInstance.patch<CandidateResponse>('/candidate/me', data)
  return response.data
}