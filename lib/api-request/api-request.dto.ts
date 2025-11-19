export interface ApiErrorResponse {
  message: string;
  statusCode: number;
  error?: string;
  details?: any;
}