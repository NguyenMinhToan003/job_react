import { Skill, SkillCreateRequest, SkillUpdateRequest } from "@/types/skillType"
import { axiosInstance } from "./index"

export const getSkillList = async () => {
  const response = await axiosInstance.get<Skill[]>('/skill')
  return response.data
}

export const getSkillByAdmin = async () => {
  const response = await axiosInstance.get<Skill[]>('/skill/admin')
  return response.data
}

export const createSkill = async (skill: SkillCreateRequest) => {
  const response = await axiosInstance.post<Skill>('/skill', skill)
  return response.data
}

export const updateSkill = async (id: number, skill: SkillUpdateRequest) => {
  const response = await axiosInstance.patch<Skill>(`/skill/${id}`, skill)
  return response.data
}

export const deleteSkill = async (id: number) => {
  const response = await axiosInstance.delete(`/skill/${id}`)
  return response.data
}

export const toggleSkillStatus = async (id: number) => {
  const response = await axiosInstance.post<Skill>(`/skill/toggle-status/${id}`)
  return response.data
}