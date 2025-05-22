import { User } from "./accountType";

export interface Cv {
  id: number;
  publicId: string;
  name: string;
  url: string;
  typeFile: string;
  updatedAt: Date;
}

export interface CvResponse {
  id: number;
  publicId: string;
  name: string;
  url: string;
  typeFile: string;
  updatedAt: Date;
  user: User
}