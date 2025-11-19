import { apiRequest } from "@/shared/api";
import { Project_, CreateProjectData, UpdateProjectData } from "@/lib/type";

export async function getProjects(organizationId?: string): Promise<Project_[]> {
  const query = organizationId ? `?organizationId=${organizationId}` : '';
  return await apiRequest<Project_[]>('GET', `/projects${query}`);
}

export async function getProject(projectId: string): Promise<Project_> {
  return await apiRequest<Project_>('GET', `/projects/${projectId}`);
}

export async function createProject(data: CreateProjectData): Promise<Project_> {
  return await apiRequest<Project_>('POST', '/projects', data);
}

export async function updateProject(projectId: string, data: UpdateProjectData): Promise<Project_> {
  return await apiRequest<Project_>('PATCH', `/projects/${projectId}`, data);
}

export async function deleteProject(projectId: string): Promise<void> {
  return await apiRequest<void>('DELETE', `/projects/${projectId}`);
}