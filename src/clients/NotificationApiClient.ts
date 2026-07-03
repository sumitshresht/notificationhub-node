import { BaseApiClient } from './BaseApiClient';
import { NotificationRequest } from '../models/NotificationRequest';
import { NotificationHubError } from '../exception/NotificationHubError';
import { ChannelType } from '../models/Enums';

export interface NotificationResponse {
    notificationId: string;
    idempotencyKey: string;
    status: string;
    dispatchedChannels: Record<string, string>[];
}

export interface NotificationReceipt {
    notificationId: string;
    tenantId: string;
    channel: string;
    currentStatus: string;
    firstOpenedAt: string;
    lastOpenedAt: string;
    openCount: number;
    createdAt: string;
    updatedAt: string;
    clickCount: number;
    lastClickedAt: string;
}

export class NotificationApiClient extends BaseApiClient {
    public send(request: NotificationRequest): Promise<NotificationResponse> {
        return this.sendWithIdempotency(request);
    }

    public sendWithIdempotency(request: NotificationRequest, idempotencyKey?: string): Promise<NotificationResponse> {
        const headers = idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : undefined;
        return this.execute<NotificationResponse>('POST', '/api/v1/notifications', request, headers);
    }

    public sendBulk(requests: NotificationRequest[]): Promise<Record<string, any>> {
        return this.execute<Record<string, any>>('POST', '/api/v1/notifications/bulk', requests);
    }

    public search(channel: ChannelType | null, status: string | null, limit: number, offset: number): Promise<NotificationReceipt[]> {
        let endpoint = `/api/v1/notifications?limit=${limit}&offset=${offset}`;
        if (channel) endpoint += `&channel=${channel}`;
        if (status) endpoint += `&status=${status}`;
        return this.execute<NotificationReceipt[]>('GET', endpoint);
    }

    public get(notificationId: string): Promise<NotificationReceipt> {
        return this.execute<NotificationReceipt>('GET', `/api/v1/notifications/${notificationId}`);
    }

    public getReceipts(notificationId: string): Promise<Record<string, any>> {
        return this.execute<Record<string, any>>('GET', `/api/v1/notifications/${notificationId}/receipts`);
    }

    public cancelSchedule(taskId: string): Promise<Record<string, string>> {
        return this.execute<Record<string, string>>('DELETE', `/api/v1/notifications/schedule/${taskId}`);
    }

    public async trackOpen(notificationId: string): Promise<ArrayBuffer> {
        try {
            const url = `${this.baseUrl}/track/open/${notificationId}`;
            const response = await fetch(url, { method: 'GET' });
            if (response.ok) {
                return await response.arrayBuffer();
            }
            throw NotificationHubError.create("Tracking Pixel Failed", response.status, await response.text());
        } catch (error: any) {
            if (error instanceof NotificationHubError) throw error;
            throw NotificationHubError.create("Network error", 0, error.message);
        }
    }
}