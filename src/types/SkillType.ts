export interface Skill {
  id: number;
  name: string;
  status: number;
}
export interface SkillCreateRequest {
  name: string;
  status?: string
}
export interface SkillUpdateRequest {
  name?: string;
  status?: number;
}
export interface SkillResponse {
  id: number;
  name: string;
  status: number;
}