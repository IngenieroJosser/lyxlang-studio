import { apiRequest } from "@/shared/api";
import { UpdateEditorConfigData, EditorConfig_ } from "@/lib/type";


export async function getEditorConfig(): Promise<EditorConfig_> {
  return await apiRequest<EditorConfig_>('GET', '/users/editor-config');
}

export async function updateEditorConfig(data: UpdateEditorConfigData): Promise<EditorConfig_> {
  return await apiRequest<EditorConfig_>('PATCH', '/users/editor-config', data);
}