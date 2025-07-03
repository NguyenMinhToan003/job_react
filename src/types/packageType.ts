import { EmployerSub, EmployerSubResponse } from "./employerSubType";
import { PackageType } from "./type";

export interface PackageResponse {
  id: string;
  name: string;
  features: string;
  price: number;
  image: string;
  dayValue: number;
  type: PackageType;
  employerSubscriptions: EmployerSub[]
  sub_total?: number;
  sub_used?: number;
  sub_using?: EmployerSubResponse[];
  status: boolean;
}
export interface CreatePackage {
    name: string;
    features: string;
    price: number;
    image?: File;
    dayValue: number;
    type: PackageType;
}
export interface FilterPackage {
    type?: PackageType[];
    mini?: boolean;// filter for packages that have not been used
}