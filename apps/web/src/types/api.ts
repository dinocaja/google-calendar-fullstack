interface ApiResponse<T> {
  data: T;
}

interface ApiError {
  error: {
    code: string;
    message: string;
    details?: unknown;
    requestId?: string;
  };
}

interface SyncResult {
  fetched: number;
  upserted: number;
  deleted: number;
}

export type { ApiResponse, ApiError, SyncResult };
