import { EmployerResponse } from "./accountType";
import { Benefit } from "./benefitType";
import { Employer } from "./companyType";
import { Cv } from "./cvType";
import { Education } from "./educationType";
import { EmployerSubResponse } from "./employerSubType";
import { Experience } from "./experienceType";
import { LanguageJob } from "./LanguageType";
import { Level } from "./levelType";
import { LocationResponse } from "./location";
import { Major } from "./majorType";
import { Skill } from "./SkillType";
import { JOB_STATUS } from "./type";
import { TypeJob } from "./TypeJobType";

export interface Job {
  id: number;
  name: string;
  description: string;
  quantity: number;
  requirement: string;
  minSalary: number | null;
  maxSalary: number | null;
  createdAt: string;
  isActive: number;
  expiredAt: string;
  applyJobs: Cv[];
}
export interface CreateJobRequest {
  name: string;
  quantity: number;
  benefits: string[];
  skills: number[];
  locations: number[];
  experience: number;
  levels: string[];
  types: number[];
  requirement: string;
  minSalary: number | null;
  maxSalary: number | null;
  description: string;
  education?: number;
  languages?: LanguageJob[];
  expiredAt: Date | null;
  majors: number[];
}

export interface ViewJobResponse {
  job: JobResponse;
  viewDate: string;
}

export interface JobResponse {
  id: number;
  name: string;
  description: string;
  quantity: number;
  requirement: string;
  minSalary: number | null;
  maxSalary: number | null;
  isShow: number;
  createdAt: string;
  updatedAt: string;
  isActive: JOB_STATUS;
  expiredAt: string;
  benefits: Benefit[];
  locations: LocationResponse[];
  experience: Experience;
  skills: Skill[];
  levels: Level[];
  typeJobs: TypeJob[];
  employer: EmployerResponse;
  applyJobs: Cv[];
  education: Education;
  languageJobs: LanguageJob[];
  matchingWeights: MatchingWeightResponse;
  majors: Major[];
}
export interface JobFilterRequest {
  id?: number;
  search?: string;
  levels?: string[];
  experience?: number[];
  typeJobs?: number[];
  minSalary?: number| null;
  maxSalary?: number| null;
  citys?: string;
  benefits?: string[];
  skills?: number[];
  page?: number;
  limit?: number;
  fieldId?: number;
  majorId?: number;
}
export interface JobFilterAdminRequest {
  search?: string;
  levels?: string[];
  experience?: number[];
  typeJobs?: number[];
  minSalary?: number | null;
  maxSalary?: number | null;
  locations?: number[];
  benefits?: string[];
  skills?: number[];
  isActive?: JOB_STATUS[];
  isShow?: number;
  isExpired?: number;
  limit?: number;
  page?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface JobFilterResponse {
  id: number;
  name: string;
  description: string;
  quantity: number;
  requirement: string;
  minSalary: number | null;
  maxSalary: number | null;
  createdAt: string;
  isActive: JOB_STATUS;
  expiredAt: string;
  benefits: Benefit[];
  locations: LocationResponse[];
  experience: Experience;
  skills: Skill[];
  levels: Level[];
  typeJobs: TypeJob[];
  employer: Employer;
  isApplied: boolean;
  isSaved: boolean;
  languageJobs: LanguageJob[];
  education: Education;
  matchingWeights: MatchingWeightResponse | null;
  distanceKm?: number | null;
  majors: Major[];
  isActiveSubscription?: boolean;
}

export interface JobDetailResponse {
  id: number;
  name: string;
  description: string;
  quantity: number;
  requirement: string;
  minSalary: number | null;
  maxSalary: number | null;
  createdAt: string;
  isActive: JOB_STATUS;
  expiredAt: string;
  benefits: Benefit[];
  locations: LocationResponse[];
  experience: Experience;
  skills: Skill[];
  levels: Level[];
  typeJobs: TypeJob[];
  employer: Employer;
  isApplied: boolean;
  isSaved: boolean;
  isShow: number;
  languageJobs: LanguageJob[];
  education: Education;
  matchingWeights: MatchingWeightResponse | null;
  distanceKm?: number | null;
  majors: Major[];
  employerSubscription: EmployerSubResponse[];
}

export interface UpdateJobAdminRequest {
  isActive: JOB_STATUS;
}

export interface CompanyFilterJob {
  id?: number;
  search?: string;
  levels?: string[];
  experience?: string;
  typeJobs?: number[];
  minSalary?: number | null;
  maxSalary?: number | null;
  locations?: number[];
  benefits?: string[];
  skills?: string[];
  isActive?: JOB_STATUS[];
  isShow?: number;
  isExpired?: number;
  page?: number;
  limit?: number;
}
export interface MatchingWeightRequest {
  locationWeight: number;
  skillWeight: number;
  majorWeight: number;
  languageWeight: number;
  educationWeight: number;
  levelWeight: number;
}
export interface MatchingWeightResponse {
  jobId: number;
  locationWeight: number;
  skillWeight: number;
  majorWeight: number;
  languageWeight: number;
  educationWeight: number;
  levelWeight: number;
}