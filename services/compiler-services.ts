import { apiRequest } from '@/shared/api';

export interface CompileDto {
  code: string;
  filePath?: string;
  compilerOptions?: any;
}

export interface CompileResult {
  success: boolean;
  output?: string;
  error?: string;
  duration?: number;
}

export interface CompilationLog {
  id: string;
  projectId: string;
  filePath: string;
  success: boolean;
  output: string;
  duration: number;
  errors?: string[];
  timestamp: string;
  compiledBy: string;
}

// Compilar código TypeScript
export async function compileCode(projectId: string, compileDto: CompileDto): Promise<CompileResult> {
  return await apiRequest<CompileResult>('POST', `/compiler/project/${projectId}/compile`, compileDto);
}

// Obtener logs de compilación
export async function getCompilationLogs(projectId: string): Promise<CompilationLog[]> {
  return await apiRequest<CompilationLog[]>('GET', `/compiler/project/${projectId}/logs`);
}