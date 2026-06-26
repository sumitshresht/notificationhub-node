import { BaseApiClient } from './BaseApiClient';

export class ProjectApiClient extends BaseApiClient {
    public create(projectName: string): Promise<Record<string, any>> {
        return this.execute('POST', '/api/v1/projects', { name: projectName });
    }

    public get(projectId: string): Promise<Record<string, any>> {
        return this.execute('GET', `/api/v1/projects/${projectId}`);
    }

    public list(page: number, size: number): Promise<Record<string, any>> {
        return this.execute('GET', `/api/v1/projects?page=${page}&size=${size}`);
    }

    public updateStatus(projectId: string, status: string): Promise<Record<string, any>> {
        return this.execute('PATCH', `/api/v1/projects/${projectId}/status?status=${status.toUpperCase()}`);
    }

    public updateName(projectId: string, newName: string): Promise<Record<string, any>> {
        return this.execute('PUT', `/api/v1/projects/${projectId}`, { name: newName });
    }

    public delete(projectId: string): Promise<void> {
        return this.execute('DELETE', `/api/v1/projects/${projectId}`);
    }

    public rotateSecret(projectId: string): Promise<Record<string, any>> {
        return this.execute('POST', `/api/v1/projects/${projectId}/rotate-secret`);
    }

    public rotateApiKey(projectId: string): Promise<Record<string, any>> {
        return this.execute('POST', `/api/v1/projects/${projectId}/rotate-api-key`);
    }
}