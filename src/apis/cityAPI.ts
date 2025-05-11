import { axiosInstance } from "@/apis/index"

export const getCityList = async () => {
  const response = await axiosInstance.get('/city')
  console.log(response.data)
  return response.data
}