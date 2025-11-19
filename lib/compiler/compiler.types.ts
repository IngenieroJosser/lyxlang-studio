export interface CompileData {
  code: string;
  compilerOptions?: any;
  filePath?: string;
}

export interface CompileResponse {
  success: boolean;
  output?: string;
  error?: string;
  duration?: number;
}

export interface CompilationLog_ {
  id: string;
  projectId: string;
  filePath: string;
  success: boolean;
  output?: string;
  errors?: any[];
  warnings?: any[];
  duration?: number;
  cacheHit: boolean;
  timestamp: string;
  compiledBy?: string;
}