import { Experience } from "@/types/experienceType"
import { axiosInstance } from "./index"

export const getExperienceList = async () => {
  const response = await axiosInstance.get<Experience[]>('/experience')
  return response.data
}