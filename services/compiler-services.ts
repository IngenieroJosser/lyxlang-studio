import { apiRequest } from "@/shared/api";
import { CompileData, CompileResponse, CompilationLog_ } from "@/lib/type";

export async function compileCode(projectId: string, data: CompileData): Promise<CompileResponse> {
  return await apiRequest<CompileResponse>('POST', `/compiler/project/${projectId}/compile`, data);
}

export async function getCompilationLogs(projectId: string): Promise<CompilationLog_[]> {
  return await apiRequest<CompilationLog_[]>('GET', `/compiler/project/${projectId}/logs`);
}