import { CreateLevelRequest, Level, UpdateLevelRequest } from "@/types/levelType"
import { axiosInstance } from "./index"

export const getLevelList = async () => {
  const response = await axiosInstance.get<Level[]>('/level')
  return response.data
}

export const getLevelListByAdmin = async () => {
  const response = await axiosInstance.get<Level[]>('/level/admin')
  return response.data
}

export const createLevel = async (level: CreateLevelRequest) => {
  const response = await axiosInstance.post<Level>('/level', level)
  return response.data
}
export const updateLevel = async (id: string, level: UpdateLevelRequest) => {
  const response = await axiosInstance.patch<Level>(`/level/${id}`, level)
  return response.data
}
export const deleteLevel = async (id: string) => {
  const response = await axiosInstance.delete(`/level/${id}`)
  return response.data
}
export const toggleLevelStatus = async (id: string) => {
  const response = await axiosInstance.patch<Level>(`/level/toggle-status/${id}`)
  return response.data
}