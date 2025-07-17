export interface Level {
  id: number;
  name: string;
  status?: number;

}
export interface CreateLevelRequest {
  name: number;
  status?: number;
}

export interface UpdateLevelRequest {
  id: number;
  name?: string;
  status?: number;
}