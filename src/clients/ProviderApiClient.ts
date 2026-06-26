import { BaseApiClient } from './BaseApiClient';

export class ProviderApiClient extends BaseApiClient {
    public configure(channelType: string, providerName: string, config: Record<string, string>): Promise<Record<string, string>> {
        const payload = { channelType: channelType.toUpperCase(), providerName: providerName.toUpperCase(), config };
        return this.execute('POST', '/api/v1/providers/configure', payload);
    }

    public update(channelType: string, providerName: string, config: Record<string, string>): Promise<Record<string, any>> {
        const payload = { channelType: channelType.toUpperCase(), providerName: providerName.toUpperCase(), config };
        return this.execute('PUT', `/api/v1/providers/${channelType.toUpperCase()}`, payload);
    }

    public delete(channelType: string): Promise<void> {
        return this.execute('DELETE', `/api/v1/providers/${channelType.toUpperCase()}`);
    }

    public testConnection(channelType: string, config: Record<string, string>): Promise<Record<string, any>> {
        const payload = { channelType: channelType.toUpperCase(), config };
        return this.execute('POST', '/api/v1/providers/test', payload);
    }

    public list(): Promise<Record<string, any>[]> {
        return this.execute('GET', '/api/v1/providers');
    }
}