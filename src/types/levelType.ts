export interface Level {
  id: number;
  name: string;
  status?: number;

  }
export interface CreateLevelRequest {
  name: string;
  status?: number;
}

export interface UpdateLevelRequest {
  id: number;
  name?: string;
  status?: number;
}