import { BaseApiClient } from './BaseApiClient';
import { TemplateRequest } from '../models/TemplateRequest';

export class TemplateApiClient extends BaseApiClient {
    public create(request: TemplateRequest): Promise<Record<string, any>> {
        return this.execute('POST', '/api/v1/templates', request);
    }

    public update(templateId: string, request: TemplateRequest): Promise<Record<string, any>> {
        return this.execute('PUT', `/api/v1/templates/${templateId}`, request);
    }

    public get(templateId: string): Promise<Record<string, any>> {
        return this.execute('GET', `/api/v1/templates/${templateId}`);
    }

    public list(page: number, size: number): Promise<Record<string, any>> {
        return this.execute('GET', `/api/v1/templates?page=${page}&size=${size}`);
    }

    public delete(templateId: string): Promise<void> {
        return this.execute('DELETE', `/api/v1/templates/${templateId}`);
    }

    public preview(templateId: string, variables: Record<string, any>): Promise<Record<string, string>> {
        return this.execute('POST', `/api/v1/templates/${templateId}/preview`, { variables });
    }

    public previewRaw(rawTemplateHtml: string, variables: Record<string, any>): Promise<Record<string, string>> {
        return this.execute('POST', '/api/v1/templates/preview', { rawTemplateHtml, variables });
    }
}