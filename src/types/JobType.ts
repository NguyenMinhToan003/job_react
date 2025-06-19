import { Benefit } from "./benefitType";
import { Employer } from "./companyType";
import { Cv } from "./cvType";
import { Education } from "./educationType";
import { Experience } from "./experienceType";
import { LanguageJob } from "./LanguageType";
import { Level } from "./levelType";
import { LocationResponse } from "./location";
import { Field } from "./majorType";
import { Skill } from "./SkillType";
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
  fieldId?: number;
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
  isActive: number;
  expiredAt: string;
  benefits: Benefit[];
  locations: LocationResponse[];
  experience: Experience;
  skills: Skill[];
  levels: Level[];
  typeJobs: TypeJob[];
  employer: Employer;
  applyJobs: Cv[];
  education: Education;
  languageJobs: LanguageJob[];
  matchingWeights: MatchingWeightResponse;
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
  isActive?: number;
  isShow?: number;
  isExpired?: number;
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
  isActive: number;
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
  field?: Field | null;
}

export interface UpdateJobAdminRequest {
  isActive: number;
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
  isActive?: number;
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