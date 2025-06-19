import { Account } from "./accountType";
import { JobResponse } from "./jobType";
import { LocationResponse } from "./location";
import { Element } from "./type";

export interface Employer {
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
}

export interface EmployerDetailResponse {
  id: number;
  name: string;
  description: string;
  logo: string;
  introduction: string;
  taxCode: string;
  website?: string;
  countryId: number;
  phone: string;
  jobs: JobResponse[];
  country: {
    id: number;
    name: string;
    flag: string;
  }
  employeeScale: Element;
  businessType: Element;
  locations: LocationResponse[];
  isFollowed?: boolean;
  account: Account;
}