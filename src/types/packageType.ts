import { EmployerSub } from "./employerSubType";

export interface PackageResponse {
  id: string;
  name: string;
  features: string;
  price: number;
  image: string;
  dayValue: number;
  type: string;
  employerSubscriptions: EmployerSub[]
  sub_total?: number;
  sub_used?: number;
}