export interface Experience {
  id: number;
  name: string;
  description: string;
  status?: number;
}
export interface CreateExperienceDto {
  name: string;
  description: string;
  status?: number;
}
export interface UpdateExperienceDto {
  name?: string;
  description?: string;
  status?: number;
}