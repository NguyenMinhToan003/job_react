import { Education } from "./educationType";
import { Language } from "./LanguageType";
import { Level } from "./levelType";
import { DistrictResponse } from "./location";
import { Skill } from "./SkillType";
import { TypeJob } from "./TypeJobType";

export interface Resume {
  id: number;
  resumeVers: ResumeVersion[];
  name: string;
  updatedAt: string;
}

export interface ResumeVersion {
  id: number;
  avatar: string;
  username: string;
  dateOfBirth: string;
  gender: string;
  location: string;
  phone: string;
  email: string;
  about: string;
  expectedSalaryMin: number;
  expectedSalaryMax: number;
  status: number;
  createdAt: Date;
  updatedAt: Date;
  resume: Resume;
  skills: Skill[];
  education: Education;
  level: Level;
  desiredLevel: Level;
  typeJob: TypeJob;
  district: DistrictResponse;
  languageResumes: Language[];
}
