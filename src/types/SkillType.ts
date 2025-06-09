import { Major } from "./majorType";

export interface Skill {
  id: number;
  name: string;
  status: number;
  
}
export interface SkillCreateRequest {
  name: string;
  status?: number
  majorId: number;
}
export interface SkillUpdateRequest {
  id: number;
  name?: string;
  status?: number;
  majorId?: number;
}
export interface SkillResponse {
  id: number;
  name: string;
  status: number;
  major?: Major;
}

export interface SkillPaginateResponse {
  items: SkillResponse[];
  total: number;
  totalPages: number;
  page: number;
  limit: number;
}