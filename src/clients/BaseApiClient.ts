import { HmacSigner } from '../auth/HmacSigner';
import { NotificationHubError } from '../exception/NotificationHubError';

export class BaseApiClient {
    protected readonly signer: HmacSigner;
    protected readonly baseUrl: string;

    constructor(signer: HmacSigner, baseUrl: string) {
        this.signer = signer;
        this.baseUrl = baseUrl;
    }

    protected async execute<T>(method: string, endpoint: string, body?: any, extraHeaders?: Record<string, string>): Promise<T> {
        const url = `${this.baseUrl}${endpoint}`;
        const jsonPayload = body ? JSON.stringify(body) : '';
        
        const headers = this.signer.signRequest(jsonPayload);
        if (extraHeaders) {
            Object.assign(headers, extraHeaders);
        }

        try {
            const response = await fetch(url, {
                method,
                headers,
                body: method !== 'GET' && method !== 'HEAD' && body ? jsonPayload : undefined
            });

            const text = await response.text();

            if (response.ok) {
                if (method === 'DELETE' && !text) return { status: 'success' } as any;
                
                // 🟢 THE FIX: Explicitly cast the empty object as T
                return text ? JSON.parse(text) : ({} as T);
            }

            throw new NotificationHubError("API Request Failed", response.status, text);
        } catch (error: any) {
            if (error instanceof NotificationHubError) throw error;
            throw new NotificationHubError("Execution failed", 0, error.message);
        }
    }
}