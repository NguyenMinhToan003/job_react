import { Benefit } from "./benefitType";
import { Company } from "./companyType";
import { Cv } from "./cvType";
import { Experience } from "./experienceType";
import { Level } from "./levelType";
import { LocationMapResponse, LocationResponse } from "./location";
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
  status: number;
  expiredAt: string;
  applyJobs: Cv[];
}
export interface CreateJob {
  name: string;
  isShow: number | 1;
  locations: LocationMapResponse[] | { id: number }[];
  skills: Skill[] | { id: number }[];
  levels: Level[] | [];
  types: TypeJob[] | { id: number }[];
  requirement: string;
  description: string;
  minSalary: number;
  quantity: number;
  maxSalary: number;
  benefits: Benefit[] | { id: string }[];
  experience: Experience | { id: number };
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
  status: number;
  expiredAt: string;
  benefits: Benefit[];
  locations: LocationResponse[];
  experience: Experience;
  skills: Skill[];
  levels: Level[];
  typeJobs: TypeJob[];
  company: Company;
  applyJobs: Cv[];
}
export interface JobFilterRequest {
  id: number;
  search?: string;
  levels?: string;
  experiences?: string;
  typeJobs?: number;
  minSalary?: number;
  maxSalary?: number;
  citys?: string;
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
  status: number;
  expiredAt: string;
  benefits: Benefit[];
  locations: LocationResponse[];
  experience: Experience;
  skills: Skill[];
  levels: Level[];
  typeJobs: TypeJob[];
  company: Company;
}

export interface UpdateJobAdminRequest {
  status: number;
}