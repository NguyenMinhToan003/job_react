import { Candidate } from "./accountType";

export interface Cv {
  id: number;
  publicId: string;
  name: string;
  url: string;
  typeFile: string;
  updatedAt: string;
}

export interface CvResponse {
  id: number;
  publicId: string;
  name: string;
  url: string;
  typeFile: string;
  updatedAt: string;
  candidate: Candidate;
}