import { CreateNotiAccountRequest, FilterNotiAccountDto, NotiAccount } from '@/types/eployerNotiType';
import { axiosInstance } from './index';

export const createEmployerNotiAPI = async (data: CreateNotiAccountRequest)=>{
  const response = await axiosInstance.post('/noti-account', data);
  return response.data;
}

export const getMeNotificationAPI = async (filter : FilterNotiAccountDto) => {
  const response = await axiosInstance.get<{
    items: NotiAccount[];
    total: number;
    totalPage: number;
    unreadCount: number;
  }>('/noti-account/me', {
    params: filter
  });
  return response.data;
}
export const markAllAsReadAPI = async () => {
  const response = await axiosInstance.get<NotiAccount[]>('/noti-account/me/mark-read');
  return response.data;
}
export const countUnreadAPI = async () => {
  const response = await axiosInstance.get<number>('/noti-account/count-unread');
  return response.data;
}
export const markAsReadAPI = async (id: number) => {
  const response = await axiosInstance.get<NotiAccount>(`/noti-account/me/mark-read/${id}`);
  return response.data;
}