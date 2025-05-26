export interface Skill {
  id: number;
  name: string;
  description: string;
  status: number;
}
export interface SkillCreateRequest {
  name: string;
  description: string;
}
export interface SkillUpdateRequest {
  name?: string;
  description?: string;
  status?: number;
}
export interface SkillResponse {
  id: number;
  name: string;
  description: string;
  status: number;
}