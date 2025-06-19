import { Element } from "@/types/type";
import { axiosInstance } from "./index";

export const getAllBusinessTypes = async () => {
  const response = await axiosInstance.get<Element[]>('/business-type');
  return response.data;
}