import { JobResponse } from "./jobType";
import { LocationResponse } from "./location";

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
  jobs: JobResponse[];
  locations: LocationResponse[];
  isFollowed?: boolean;
}