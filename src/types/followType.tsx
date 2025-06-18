import { EmployerDetailResponse } from "./companyType";
import { JobFilterResponse } from "./jobType";

export interface FollowResponse {
  id: number;
  userId: number;
  companyId: number;
  time: string;
  employer: EmployerDetailResponse;
}

export interface RecommendedJobsFollowResponse {
  id: number;
  name: string;
  logo: string;
  introduction: string;
  taxCode: string;
  website: string | null;
  employeeScale: string;
  businessType: string;
  phone: string;
  jobs: JobFilterResponse[];
}