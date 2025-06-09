export interface Level {
  id: string;
  name: string;
  status?: number;

}
export interface CreateLevelRequest {
  name: string;
  status?: number;
}

export interface UpdateLevelRequest {
  id: string;
  name?: string;
  status?: number;
}