import { FollowResponse, RecommendedJobsFollowResponse } from "@/types/followType";
import { axiosInstance } from "."
import { JobFilterResponse } from "@/types/jobType";

export const followEmployerAPI = async (employerId: number) => {
  const response = await axiosInstance.post(`/follow/follow-employer/${employerId}`);
  return response.data;
}

export const unfollowEmployerAPI = async (employerId: number) => {
  const response = await axiosInstance.delete(`/follow/unfollow-employer/${employerId}`);
  return response.data;
}

export const getPaginatedFollowsAPI = async (page: number, limit: number) => {
  const response = await axiosInstance.get<{
    items: FollowResponse[];
    totalPage: number;
    page: number;
    limit: number;
  }>(`/follow/candidate/me/${page}/${limit}`);
  return response.data;
}

export const getRecommendedFollowsAPI = async (page:number) => {
  const response = await axiosInstance.get<{
    items: JobFilterResponse[];
    totalPage: number;
    page: number;
  }>(`/job/recommended/followed-employers?page=${page}`);
  return response.data;
}