import { Education } from "./educationType";
import { Language } from "./LanguageType";
import { Level } from "./levelType";
import { DistrictResponse } from "./location";
import { Skill } from "./SkillType";
import { TypeJob } from "./TypeJobType";

export interface Resume {
  id: number;
  resumeName: string;
  candidateId: number;
  resumeVers: ResumeVersion[];
}

export interface ResumeVersion {
  id: number;
  imageResume: string;
  userName: string;
  dateOfBirth: string;
  phoneNumber: string;
  email: string;
  career: string;
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
  languages: Language[];
}
