import { Skill } from "@/types/SkillType"
import { axiosInstance } from "./index"

export const getSkillList = async () => {
  const response = await axiosInstance.get<Skill[]>('/skill')
  return response.data
}