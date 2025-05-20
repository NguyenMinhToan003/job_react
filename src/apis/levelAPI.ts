import { Level } from "@/types/levelType"
import { axiosInstance } from "./index"

export const getLevelList = async () => {
  const response = await axiosInstance.get<Level[]>('/level')
  return response.data
}