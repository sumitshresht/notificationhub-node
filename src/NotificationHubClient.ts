import { HmacSigner } from './auth/HmacSigner';
import { NotificationApiClient } from './clients/NotificationApiClient';
import { TemplateApiClient } from './clients/TemplateApiClient';
import { AnalyticsApiClient } from './clients/AnalyticsApiClient';
import { ProjectApiClient } from './clients/ProjectApiClient';
import { ProviderApiClient } from './clients/ProviderApiClient';

// The integrated production URL defaults here.
const DEFAULT_BASE_URL = "https://api.notification-server.dev-space.dev";

export class NotificationHubClient {
    private readonly baseUrl: string;
    private readonly signer: HmacSigner;

    // Sub-clients
    private readonly _notifications: NotificationApiClient;
    private readonly _templates: TemplateApiClient;
    private readonly _analytics: AnalyticsApiClient;
    private readonly _projects: ProjectApiClient;
    private readonly _providers: ProviderApiClient;

    // Private constructor forces users to use the Builder
    private constructor(apiKey: string, apiSecret: string, baseUrl: string) {
        this.baseUrl = baseUrl;
        this.signer = new HmacSigner(apiKey, apiSecret);

        // Initialize the sub-clients, passing the shared instances down
        this._notifications = new NotificationApiClient(this.signer, this.baseUrl);
        this._templates = new TemplateApiClient(this.signer, this.baseUrl);
        this._analytics = new AnalyticsApiClient(this.signer, this.baseUrl);
        this._projects = new ProjectApiClient(this.signer, this.baseUrl);
        this._providers = new ProviderApiClient(this.signer, this.baseUrl);
    }

    // --- Getters for the sub-clients ---
    public notifications(): NotificationApiClient { return this._notifications; }
    public templates(): TemplateApiClient { return this._templates; }
    public analytics(): AnalyticsApiClient { return this._analytics; }
    public projects(): ProjectApiClient { return this._projects; }
    public providers(): ProviderApiClient { return this._providers; }
}

// Using TypeScript namespace merging to mimic Java's static nested classes
export namespace NotificationHubClient {
    export class Builder {
        private _apiKey?: string;
        private _apiSecret?: string;
        private _baseUrl?: string;

        public apiKey(apiKey: string): this {
            this._apiKey = apiKey;
            return this;
        }

        public apiSecret(apiSecret: string): this {
            this._apiSecret = apiSecret;
            return this;
        }

        public baseUrl(baseUrl: string): this {
            // Basic security check to ensure developers don't accidentally use HTTP in production
            if (baseUrl && baseUrl.startsWith("http://") && !baseUrl.includes("localhost")) {
                throw new Error("Base URL must use HTTPS for production environments.");
            }
            // Strip trailing slashes to prevent // in routes later
            this._baseUrl = baseUrl && baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
            return this;
        }

        public build(): NotificationHubClient {
            if (!this._apiKey || this._apiKey.trim() === '') {
                throw new Error("API Key is required.");
            }
            if (!this._apiSecret || this._apiSecret.trim() === '') {
                throw new Error("API Secret is required for HMAC signatures.");
            }

            const finalBaseUrl = this._baseUrl || DEFAULT_BASE_URL;

            // @ts-ignore - Bypassing private constructor to enforce builder usage
            return new NotificationHubClient(this._apiKey, this._apiSecret, finalBaseUrl);
        }
    }
}