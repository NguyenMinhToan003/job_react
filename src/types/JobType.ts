import { Benefit } from "./benefitType";
import { Employer } from "./companyType";
import { Cv } from "./cvType";
import { Experience } from "./experienceType";
import { Level } from "./levelType";
import { LocationResponse } from "./location";
import { Skill } from "./skillType";
import { TypeJob } from "./typeJobType";

export interface Job {
  id: number;
  name: string;
  description: string;
  quantity: number;
  requirement: string;
  minSalary: number;
  maxSalary: number;
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
  minSalary: number;
  maxSalary: number;
  description: string;
}

export interface JobResponse {
  id: number;
  name: string;
  description: string;
  quantity: number;
  requirement: string;
  minSalary: number;
  isShow: number;
  maxSalary: number;
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
  applyJobs: Cv[];
}
export interface JobFilterRequest {
  id: number;
  search?: string;
  levels?: string[];
  experience?: number[];
  typeJobs?: number[];
  minSalary?: number;
  maxSalary?: number;
  citys?: string;
  benefits?: string[];
  skills?: number[];
}

export interface JobFilterResponse {
  id: number;
  name: string;
  description: string;
  quantity: number;
  requirement: string;
  minSalary: number;
  maxSalary: number;
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
  minSalary?: number;
  maxSalary?: number;
  locations?: number[];
  benefits?: string[];
  skills?: string[];
  isActive?: number;
  isShow?: number;
  isExpired?: number;
}
