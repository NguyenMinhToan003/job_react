import { Employer } from "./companyType";
import { ACCOUNT_STATUS } from "./type";

export interface Account {
  id: number;
  email: string;
  role: string;
  status: ACCOUNT_STATUS;
  candidate?: Candidate;
  employer?: Employer;
}
export interface CandidateResponse {
  id: number;
  name: string;
  avatar: string;
  gender: string;
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
export interface ChangeStatusDto {
  status: ACCOUNT_STATUS
  accountId: number;
}