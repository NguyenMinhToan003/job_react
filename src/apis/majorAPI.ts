import { MajorResponse } from "@/types/majorType";
import { axiosInstance } from "./index";

export const getListMajorAPI = async () => {
  const response = await axiosInstance.get<MajorResponse[]>('/major');
  return response.data;
}