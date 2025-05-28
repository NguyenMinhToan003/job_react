import { axiosInstance } from "."

export const followEmployerAPI = async (employerId: number) => {
  const response = await axiosInstance.post(`/follow/follow-employer/${employerId}`);
  return response.data;
}

export const candidateGetAllFollowsAPI = async () => {
  const response = await axiosInstance.get('/follow/candidate/me');
  return response.data;
}