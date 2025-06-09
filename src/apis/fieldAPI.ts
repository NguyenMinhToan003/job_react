import { Field } from "@/types/majorType";
import { axiosInstance } from "./index";

export const getFieldList = async () => {
  const response = await axiosInstance.get<Field[]>('/field');
  return response.data;
}