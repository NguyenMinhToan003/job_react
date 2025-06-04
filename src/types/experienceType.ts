export interface Experience {
  id: number;
  name: string;
  status?: number;
}
export interface CreateExperienceDto {
  name: string;
  status?: number;
}
export interface UpdateExperienceDto {
  name?: string;
  status?: number;
}