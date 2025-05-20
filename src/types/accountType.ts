import { Company } from "./companyType";

export interface Account {
  id: number;
  email: string;
  status: number;
  role: string;
  company: Company;
}