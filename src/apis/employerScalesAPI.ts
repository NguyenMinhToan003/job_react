import { Element } from '@/types/type';
import { axiosInstance } from './index'

export const getAllEmployerScales = async () => {
  const response = await axiosInstance.get<Element[]>('/employer-scales');
  return response.data;
}