import { Benefit } from "@/types/benefitType"
import { axiosInstance } from "./index"

export const getBenefit = async () => {
  const response = await axiosInstance.get<Benefit[]>('/benefit')
  return response.data
}
export const createBenefit = async (benefit: Benefit) => {
  const response = await axiosInstance.post<Benefit>('/benefit', benefit)
  return response.data
}
export const updateBenefit = async (id: string, benefit: Benefit) => {
  const response = await axiosInstance.patch<Benefit>(`/benefit/${id}`, benefit)
  return response.data
}
export const deleteBenefit = async (id: string) => {
  const response = await axiosInstance.delete(`/benefit/${id}`)
  return response.data
}