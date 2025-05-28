export interface RegisterCandidateRequest {
  email: string;
  password: string;
  name: string;
  gender?: string;
  phone?: string;
}
export interface UpdateInfoCandidateRequest {
  name?: string;
  email?: string;
  password?: string;
  avatar?: File | undefined;
  gender?: string;
  phone?: string;
}