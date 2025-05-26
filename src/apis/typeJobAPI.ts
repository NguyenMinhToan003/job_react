import { CreateTypeJobRequest, TypeJob, UpdateTypeJobRequest } from '@/types/typeJobType'
import { axiosInstance } from './index'

export const getTypeJobList = async () => {
  const response = await axiosInstance.get<TypeJob[]>('/type-job')
  return response.data
}

export const createTypeJob = async (typeJob: CreateTypeJobRequest) => {
  const response = await axiosInstance.post<TypeJob>('/type-job', typeJob)
  return response.data
}
export const updateTypeJob = async (id: number, typeJob: UpdateTypeJobRequest) => {
  const response = await axiosInstance.patch<TypeJob>(`/type-job/${id}`, typeJob)
  return response.data
}
export const deleteTypeJob = async (id: number) => {
  const response = await axiosInstance.delete(`/type-job/${id}`)
  return response.data
}
