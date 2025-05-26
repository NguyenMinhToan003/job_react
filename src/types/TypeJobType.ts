export interface TypeJob {
  id: number;
  name: string;
  status?: number;
  description?: string;
}

export interface CreateTypeJobRequest {
  name: string;
  description: string;
  status?: number;
}

export interface UpdateTypeJobRequest {
  name?: string;
  description?: string;
  status?: number;
}