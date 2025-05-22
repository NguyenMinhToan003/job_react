import { Skill } from "@/types/skillType"
import { axiosInstance } from "./index"

export const getSkillList = async () => {
  const response = await axiosInstance.get<Skill[]>('/skill')
  return response.data
}