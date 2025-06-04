import { Education } from "@/types/educationType";
import { axiosInstance } from "./index";

export const getAllEducations = async () => {
  const response = await axiosInstance.get<Education[]>('/education');
  return response.data;
}