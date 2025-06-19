export interface SignInResponse {
  accessToken: string;
  role: string;
}
export interface CandidateRegisterRequest {
  email: string;
  password: string;
  name: string;
  gender: string;
  phone: string;
  birthday?: string;
  location?: string;
  avatar?: File | null;
}
export interface UpdateInfoCandidateRequest {
  name?: string;
  email?: string;
  password?: string;
  avatar?: File | undefined;
  gender?: string;
  phone?: string;
}
export interface EmployerRegisterRequest {
  email: string;
  password: string;
  name: string;
  logo?: File | null;
  website?: string;
  taxCode: string;
  employeeScaleId: number;
  businessTypeId: number;
  countryId: number;
  phone: string;
  introduction?: string;
}