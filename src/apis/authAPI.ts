import { SignInResponse } from "@/types/authType";
import { axiosInstance } from "./index";
import { ChangeStatusDto } from "@/types/accountType";

export const login = async (data: { email: string; password: string }) => {
  const response = await axiosInstance.post<SignInResponse>('/auth/login', data);
  return response.data;
}

export const changeStatus = async (data: ChangeStatusDto) =>{
  const response = await axiosInstance.patch('/account/change-status', data);
  return response.data;
}
export const adminGetAccountDashboardData = async () => {
  const response = await axiosInstance.get<{
    employers: number;
    candidates: number;
  }>('/account/admin/get-dashboard-data');
  return response.data;
}