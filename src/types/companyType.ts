import { JobResponse } from "./JobType";
import { LocationResponse } from "./location";

export interface Company {
  id: number;
  name: string;
  description: string;
  logo: string;
  introduction: string;
  taxCode: string;
}

export interface CompanyDetailResponse {
  id: number;
  name: string;
  description: string;
  logo: string;
  introduction: string;
  taxCode: string;
  jobs: JobResponse[];
  locations: LocationResponse[];
}