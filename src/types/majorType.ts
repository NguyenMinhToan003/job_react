import { Skill } from "./SkillType";

export interface MajorResponse {
  id: number;
  name: string;
  skills: Skill[];
}
export interface Major{
  id: number;
  name: string;
  field: Field;
}
export interface Field {
  id: number;
  name: string;
  majors?: MajorResponse[];
}
export interface MajorRequest {
  name: string;
  fieldId: number;
}