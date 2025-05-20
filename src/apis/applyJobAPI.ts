import { CreateApplyRequest } from "@/types/applyJobType";
import { axiosInstance } from "./index";

export const applyJob = async (jobId: number, data: CreateApplyRequest) => {
  const response = await axiosInstance.post(`/apply-job/${jobId}`, data);
  return response.data;
}