import { CvResponse } from "./cvType";
import { Education } from "./educationType";
import { JobResponse } from "./jobType";
import { LanguageResume } from "./LanguageType";
import { Level } from "./levelType";
import { City } from "./location";
import { Major } from "./majorType";
import { ResumeVersion } from "./resumeType";
import { Skill } from "./SkillType";
import { TagResume } from "./tagResumeType";
import { APPLY_JOB_STATUS } from "./type";

export interface CreateApplyRequest {
  resumeId : number;
  candidateNote: string;
  feedback: string| null;
  email: string;
  phone: string;
}
export interface ApplyJob {
  id: number;
  userId: number;
  jobId: number;
  candidateNote: string;
  feedback: string| null;
  status: number;
  replyTime: string;
  interviewTime: string;
  viewStatus: number;
}
export interface ApplyJobResponse {
  id: number;
  jobId: number;
  candidateNote: string;
  feedback: string| null;
  status: APPLY_JOB_STATUS;
  email: string;
  phone: string;
  replyTime: string;
  interviewTime: string;
  viewStatus: number;
  job: JobResponse;
  cv: CvResponse;
  time: string;
  resumeVersion: ResumeVersion;
  matchingScore: number;
  tagResumes: TagResume[];
}

export interface ApplyJobByJobIdResponse {
  id: number;
  applyTime: string;
  status: string;
  candidateNote: string;
  phone: string;
  email: string;
  viewStatus: number;
  job: JobResponse;
  feedback: string | null;
  tagResumes: TagResume[];
  resumeVersion: ResumeVersion;
  score: {
    skillScore: number,
    educationScore: number,
    levelScore: number,
    majorScore: number,
    locationScore: number,
    total: number;
    languageScore: number;
  }
  majors: Major[];
  matchingFields: {
    skill: Skill[];
    education: Education[];
    level: Level[];
    major: Major[];
    location: City[];
    language: LanguageResume[];
  }
  rank: number;
}
export interface GetApplyJobByTags {
  jobId?: number | undefined;
  tagIds?: number[];
  status?: APPLY_JOB_STATUS;
}