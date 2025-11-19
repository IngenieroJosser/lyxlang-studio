import { apiRequest } from "@/shared/api";
import { AuditLogsResponse, AuditStats } from "@/lib/audi-log/audilog.types";

export async function getMyAuditLogs(
  page: number = 1,
  limit: number = 50,
  resourceType?: string,
  action?: string,
  startDate?: Date,
  endDate?: Date
): Promise<AuditLogsResponse> {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(resourceType && { resourceType }),
    ...(action && { action }),
    ...(startDate && { startDate: startDate.toISOString() }),
    ...(endDate && { endDate: endDate.toISOString() }),
  });

  return await apiRequest<AuditLogsResponse>('GET', `/audit-logs/my-logs?${params}`);
}

export async function getResourceAuditLogs(
  resourceType: string,
  resourceId: string,
  page: number = 1,
  limit: number = 50,
  action?: string,
  startDate?: Date,
  endDate?: Date
): Promise<AuditLogsResponse> {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(action && { action }),
    ...(startDate && { startDate: startDate.toISOString() }),
    ...(endDate && { endDate: endDate.toISOString() }),
  });

  return await apiRequest<AuditLogsResponse>(
    'GET', 
    `/audit-logs/resource/${resourceType}/${resourceId}?${params}`
  );
}

export async function getAuditStats(
  startDate?: Date,
  endDate?: Date,
  userId?: string,
  resourceType?: string
): Promise<AuditStats> {
  const params = new URLSearchParams({
    ...(startDate && { startDate: startDate.toISOString() }),
    ...(endDate && { endDate: endDate.toISOString() }),
    ...(userId && { userId }),
    ...(resourceType && { resourceType }),
  });

  return await apiRequest<AuditStats>('GET', `/audit-logs/stats?${params}`);
}