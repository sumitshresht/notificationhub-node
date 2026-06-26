import { BaseApiClient } from './BaseApiClient';

export class AnalyticsApiClient extends BaseApiClient {
    public getMetrics(): Promise<Record<string, any>> {
        return this.execute('GET', '/api/v1/analytics');
    }

    public getAuditLogs(limit: number, offset: number): Promise<Record<string, any>[]> {
        return this.execute('GET', `/api/v1/audit?limit=${limit}&offset=${offset}`);
    }

    public getDeadLetterQueue(limit: number, offset: number): Promise<Record<string, any>[]> {
        return this.execute('GET', `/api/v1/dlq?limit=${limit}&offset=${offset}`);
    }

    public getDlqEntry(dlqId: string): Promise<Record<string, any>> {
        return this.execute('GET', `/api/v1/dlq/${dlqId}`);
    }

    public retryFailedNotification(dlqId: string): Promise<Record<string, string>> {
        return this.execute('POST', `/api/v1/dlq/${dlqId}/retry`);
    }
}