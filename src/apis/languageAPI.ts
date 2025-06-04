import { Language } from "@/types/LanguageType";
import { axiosInstance } from "./index";

export const getAllLanguages = async () => {
  const response = await axiosInstance.get<Language[]>('/language');
  return response.data;
}