export interface Level {
  id: string;
  name: string;
  status?: number;
}
export interface CreateLevelRequest {
  id: string;
  name: string;
}

export interface UpdateLevelRequest {
  id: string;
  name?: string;
  status?: number;
}