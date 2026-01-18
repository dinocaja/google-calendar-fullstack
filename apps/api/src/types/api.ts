export interface ApiResponse<T> {
  data: T;
}

export interface ApiError {
  error: {
    code: string;
    message: string;
    details?: unknown;
    requestId?: string;
  };
}

export interface SyncResult {
  fetched: number;
  upserted: number;
  deleted: number;
}
