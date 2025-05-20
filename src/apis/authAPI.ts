import { SignInResponse } from "@/types/authType";
import { axiosInstance } from "./index";

export const login = async (data: { email: string; password: string }) => {
  const response = await axiosInstance.post<SignInResponse>('/auth/login', data);
  return response.data;
}