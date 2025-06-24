import { Employer } from "./companyType";

export interface Account {
  id: number;
  email: string;
  role: string;
  status: number;
  candidate?: Candidate;
  employer?: Employer;
}
export interface CandidateResponse {
  id: number;
  name: string;
  avatar: string;
  gender: number;
  account: Account;
  phone: string;
}
export interface EmployerResponse {
  id: number;
  name: string;
  description: string;
  logo: string;
  introduction: string;
  taxCode: string;
  website?: string;
  employeeScale: string;
  businessType: string;
  countryId: number;
  phone: string;
  account: Account;
}

export interface Candidate {
  id: number;
  name: string;
  avatar: string;
  gender: number;
  phone: string;
}

export interface AdminFilterCandidateDto {
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}