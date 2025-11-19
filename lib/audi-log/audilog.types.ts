export interface AuditLog {
  id: string;
  action: string;
  resourceType: string;
  resourceId?: string;
  userId: string;
  userAgent?: string;
  ipAddress?: string;
  oldData?: any;
  newData?: any;
  differences?: any;
  createdAt: string;
  user?: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
}

export interface AuditLogsResponse {
  logs: AuditLog[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface AuditStats {
  total: number;
  actions: Array<{ action: string; count: number }>;
  resourceTypes: Array<{ resourceType: string; count: number }>;
  users: Array<{ userId: string; userName?: string; userEmail?: string; count: number }>;
  dailyActivity: Array<{ date: string; count: number }>;
}