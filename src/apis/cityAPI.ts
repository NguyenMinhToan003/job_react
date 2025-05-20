import { axiosInstance } from "@/apis/index"
import { City } from "@/types/location"

export const getCityList = async () => {
  const response = await axiosInstance.get<City[]>('/city')
  return response.data
}