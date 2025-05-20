import { Benefit } from "@/types/benefitType"
import { axiosInstance } from "./index"

export const getBenefit = async () => {
  const response = await axiosInstance.get<Benefit[]>('/benefit')
  return response.data
}