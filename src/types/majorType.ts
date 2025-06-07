import { Skill } from "./SkillType";

export interface MajorResponse {
  id: number;
  name: string;
  skills: Skill[];
}
export interface Major{
  id: number;
  name: string;
}