import { Benefit } from "./benefitType";
import { Company } from "./companyType";
import { Experience } from "./experienceType";
import { Level } from "./levelType";
import { LocationMapResponse, LocationResponse } from "./location";
import { Skill } from "./SkillType";
import { TypeJob } from "./TypeJobType";

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
}
export interface CreateJob {
  name: string;
  locations: LocationMapResponse[] | { id: number }[];
  skills: Skill[] | { id: number }[];
  level: Level | { id: number };
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
  maxSalary: number;
  createdAt: string;
  status: number;
  expiredAt: string;
  benefits: Benefit[];
  locations: LocationResponse[];
  experience: Experience;
  skills: Skill[];
  level: Level;
  typeJobs: TypeJob[];
  company: Company;
}
export interface JobFilterRequest {
  search?: string;
  level?: number;
  experience?: number;
  typeJob?: number;
  minSalary?: number;
  maxSalary?: number;
  city?: string;
}