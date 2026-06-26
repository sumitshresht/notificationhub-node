import { BaseApiClient } from './BaseApiClient';
import { NotificationRequest } from '../models/NotificationRequest';
import { NotificationHubError } from '../exception/NotificationHubError';

export class NotificationApiClient extends BaseApiClient {
    public send(request: NotificationRequest): Promise<Record<string, any>> {
        return this.sendWithIdempotency(request);
    }

    public sendWithIdempotency(request: NotificationRequest, idempotencyKey?: string): Promise<Record<string, any>> {
        const headers = idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : undefined;
        return this.execute('POST', '/api/v1/notifications', request, headers);
    }

    public sendBulk(requests: NotificationRequest[]): Promise<Record<string, any>> {
        return this.execute('POST', '/api/v1/notifications/bulk', requests);
    }

    public search(channel: string | null, status: string | null, limit: number, offset: number): Promise<Record<string, any>[]> {
        let endpoint = `/api/v1/notifications?limit=${limit}&offset=${offset}`;
        if (channel) endpoint += `&channel=${channel}`;
        if (status) endpoint += `&status=${status}`;
        return this.execute('GET', endpoint);
    }

    public get(notificationId: string): Promise<Record<string, any>> {
        return this.execute('GET', `/api/v1/notifications/${notificationId}`);
    }

    public getReceipts(notificationId: string): Promise<Record<string, any>> {
        return this.execute('GET', `/api/v1/notifications/${notificationId}/receipts`);
    }

    public cancelSchedule(taskId: string): Promise<Record<string, string>> {
        return this.execute('DELETE', `/api/v1/notifications/schedule/${taskId}`);
    }

    // Binary response requires a manual fetch wrapper
    public async trackOpen(notificationId: string): Promise<ArrayBuffer> {
        try {
            const url = `${this.baseUrl}/track/open/${notificationId}`;
            const response = await fetch(url, { method: 'GET' });
            if (response.ok) {
                return await response.arrayBuffer();
            }
            throw new NotificationHubError("Tracking Pixel Failed", response.status, await response.text());
        } catch (error: any) {
            if (error instanceof NotificationHubError) throw error;
            throw new NotificationHubError("Network error", 0, error.message);
        }
    }
}