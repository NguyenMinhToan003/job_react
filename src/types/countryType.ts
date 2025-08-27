import { Employer } from "./companyType";

export interface CountryResponse {
  id: number;
  name: string;
  flag: string;
  publicId: string;
  employees?: Employer[];
  hideAt?: string;
}
export interface CountryRequest {
  id?: number;
  name: string;
  flag?: File;
}