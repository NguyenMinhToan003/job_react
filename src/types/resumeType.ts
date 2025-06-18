import { Education } from "./educationType";
import { LanguageResume } from "./LanguageType";
import { Level } from "./levelType";
import { DistrictResponse } from "./location";
import { Major } from "./majorType";
import { Skill } from "./SkillType";
import { TypeJob } from "./TypeJobType";

export interface Resume {
  id: number;
  resumeVersions: ResumeVersion[];
  name: string;
  isDefault: boolean;
  updatedAt: string;
}

export interface ResumeVersion {
  id: number;
  avatar: string;
  username: string;
  dateOfBirth: string;
  gender: string;
  location: string;
  phone: string;
  email: string;
  about: string;
  expectedSalaryMin: number;
  expectedSalaryMax: number;
  status: number;
  createdAt: Date;
  updatedAt: Date;
  resume: Resume;
  skills: Skill[];
  education: Education;
  level: Level;
  desiredLevel: Level;
  typeJob: TypeJob;
  district: DistrictResponse;
  languageResumes: LanguageResume[];
  majors: Major[];
  experiences: ResumeVersionExp[];
  urlPdf: string;
  publicIdPdf: string;
}

export interface CreateResumeVersionDto {
  username: string;
  phone: string;
  gender: string;
  location: string;
  dateOfBirth: string;
  about: string;
  languageResumes: { languageId: number; level: number }[];
  education: number;
  level: number;
  district: string;
  email: string;
  name: string;
  skills: number[];
  avatar?: File | string;
  majors?: number[];
  resumeversionExps?: ResumeVersionExp[];
  cv?: File|null;
}
export interface EducationResume {
  educationId: number;
  schoolName: string;
  major: string;
}
export interface ResumeVersionExp {
  id?: number;
  companyName: string;
  position: string;
  startTime: string;
  endTime?: string | null;
  jobDescription: string;
  typeJob: TypeJob;
}