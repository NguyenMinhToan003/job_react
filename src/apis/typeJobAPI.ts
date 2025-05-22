import { TypeJob } from '@/types/typeJobType'
import { axiosInstance } from './index'

export const getTypeJobList = async () => {
  const response = await axiosInstance.get<TypeJob[]>('/type-job')
  return response.data
}