import { CvResponse } from "./cvType";

export interface Account {
  id: number;
  email: string;
  role: string;
  status: number;
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