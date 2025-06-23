import { ApplyJobResponse } from "./applyJobType";
import { Employer } from "./companyType";

export interface TagResumeRequest {
  name: string;
  color: string;
}
export interface TagResume {
  id: number;
  name: string;
  color: string;
}
export interface TagResumeResponse {
  id: number;
  name: string;
  color: string;
  employer: Employer;
  applyJobs?: ApplyJobResponse[];
}