import { BaseApiClient } from './BaseApiClient';
import { ProjectStatus } from '../models/Enums';

export interface ProjectResponse {
    id: string;
    name: string;
    status: ProjectStatus;
    createdAt: string;
}

export interface ProjectCredentialsResponse {
    id: string;
    name: string;
    apiKey: string;
    rawSecret: string;
    message: string;
}

export interface PaginatedProjects {
    content: ProjectResponse[];
    totalPages: number;
    totalElements: number;
}

export class ProjectApiClient extends BaseApiClient {
    public create(projectName: string): Promise<ProjectCredentialsResponse> {
        return this.execute<ProjectCredentialsResponse>('POST', '/api/v1/projects', { name: projectName });
    }

    public get(projectId: string): Promise<ProjectResponse> {
        return this.execute<ProjectResponse>('GET', `/api/v1/projects/${projectId}`);
    }

    public list(page: number, size: number): Promise<PaginatedProjects> {
        return this.execute<PaginatedProjects>('GET', `/api/v1/projects?page=${page}&size=${size}`);
    }

    public updateStatus(projectId: string, status: ProjectStatus): Promise<ProjectResponse> {
        return this.execute<ProjectResponse>('PATCH', `/api/v1/projects/${projectId}/status?status=${status}`);
    }

    public updateName(projectId: string, newName: string): Promise<ProjectResponse> {
        return this.execute<ProjectResponse>('PUT', `/api/v1/projects/${projectId}`, { name: newName });
    }

    public delete(projectId: string): Promise<void> {
        return this.execute<void>('DELETE', `/api/v1/projects/${projectId}`);
    }

    public rotateSecret(projectId: string): Promise<ProjectCredentialsResponse> {
        return this.execute<ProjectCredentialsResponse>('POST', `/api/v1/projects/${projectId}/rotate-secret`);
    }

    public rotateApiKey(projectId: string): Promise<Record<string, string>> {
        return this.execute<Record<string, string>>('POST', `/api/v1/projects/${projectId}/rotate-api-key`);
    }
}