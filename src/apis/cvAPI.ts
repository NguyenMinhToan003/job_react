import { Cv } from "@/types/cvType"
import { axiosInstance } from "./index"

export const getCvMe = async () => {
  const response = await axiosInstance.get<Cv[]>('/cv/me')
  return response.data
}

export const uploadCv = async (cv: File) => {
  const formData = new FormData()
  formData.append('cv', cv)
  const response = await axiosInstance.post<Cv>('/cv', formData)
  return response.data
}