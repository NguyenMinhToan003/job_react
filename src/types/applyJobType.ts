import { CvResponse } from "./cvType";
import { JobResponse } from "./jobType";
import { ResumeVersion } from "./resumeType";

export interface CreateApplyRequest {
  resumeId : number;
  note: string;
  username: string;
  phone: string;
}
export interface ApplyJob {
  id: number;
  userId: number;
  jobId: number;
  note: string;
  status: number;
  replyTime: string;
  interviewTime: string;
  viewStatus: number;
}
export interface ApplyJobResponse {
  id: number;
  jobId: number;
  note: string;
  status: string;
  replyTime: string;
  interviewTime: string;
  viewStatus: number;
  job: JobResponse;
  cv: CvResponse;
  time: string;
  resumeVersion: ResumeVersion;
  matchingScore: number;
}