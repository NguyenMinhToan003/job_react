import { CvResponse } from "./cvType";
import { Education } from "./educationType";
import { JobResponse } from "./jobType";
import { LanguageJob, LanguageResume } from "./LanguageType";
import { Level } from "./levelType";
import { City } from "./location";
import { Major } from "./majorType";
import { ResumeVersion } from "./resumeType";
import { Skill } from "./SkillType";

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
export interface ApplyJobByJobIdResponse {
  id: number;
  applyTime: string;
  status: string;
  note: string;
  viewStatus: number;
  job: JobResponse;
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