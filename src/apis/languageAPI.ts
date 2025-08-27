import { Language } from "@/types/languageType";
import { axiosInstance } from "./index";

export const getAllLanguages = async () => {
  const response = await axiosInstance.get<Language[]>('/language');
  return response.data;
}