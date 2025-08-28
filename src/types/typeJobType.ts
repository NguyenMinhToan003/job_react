export interface TypeJob {
  id: number;
  name: string;
  status?: number;
}

export interface CreateTypeJobRequest {
  name: string;
  status?: number;
}

export interface UpdateTypeJobRequest {
  name?: string;
  status?: number;
}