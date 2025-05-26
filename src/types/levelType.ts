export interface Level {
  id: string;
  name: string;
  description: string;
  status?: number;
}
export interface CreateLevelRequest {
  id: string;
  name: string;
  description: string;
}

export interface UpdateLevelRequest {
  id: string;
  name?: string;
  description?: string;
  status?: number;
}