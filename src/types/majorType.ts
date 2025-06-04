import { Skill } from "./SkillType";

export interface MajorResponse {
  id: number;
  name: string;
  skills: Skill[];
}