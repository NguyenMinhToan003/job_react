import { Employer } from "./companyType";
import { CvResponse } from "./cvType";

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
  cv: CvResponse[];
}

export interface Candidate {
  id: number;
  name: string;
  avatar: string;
  gender: number;
  phone: string;
}