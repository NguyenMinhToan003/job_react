import { UserResponse } from "@/types/accountType"
import { axiosInstance } from "."

export const getDataUser = async () => {
  const response = await axiosInstance.get<UserResponse>('/users/me')
  return response.data
}