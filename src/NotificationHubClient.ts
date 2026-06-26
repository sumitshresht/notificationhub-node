import { HmacSigner } from './auth/HmacSigner';
import { NotificationApiClient } from './clients/NotificationApiClient';
import { TemplateApiClient } from './clients/TemplateApiClient';
import { AnalyticsApiClient } from './clients/AnalyticsApiClient';
import { ProjectApiClient } from './clients/ProjectApiClient';
import { ProviderApiClient } from './clients/ProviderApiClient';

export class NotificationHubClient {
    private readonly baseUrl: string;
    private readonly signer: HmacSigner;

    private readonly _notifications: NotificationApiClient;
    private readonly _templates: TemplateApiClient;
    private readonly _analytics: AnalyticsApiClient;
    private readonly _projects: ProjectApiClient;
    private readonly _providers: ProviderApiClient;

    constructor(apiKey: string, rawSecret: string, baseUrl: string) {
        this.baseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
        this.signer = new HmacSigner(apiKey, rawSecret);

        this._notifications = new NotificationApiClient(this.signer, this.baseUrl);
        this._templates = new TemplateApiClient(this.signer, this.baseUrl);
        this._analytics = new AnalyticsApiClient(this.signer, this.baseUrl);
        this._projects = new ProjectApiClient(this.signer, this.baseUrl);
        this._providers = new ProviderApiClient(this.signer, this.baseUrl);
    }

    public notifications(): NotificationApiClient { return this._notifications; }
    public templates(): TemplateApiClient { return this._templates; }
    public analytics(): AnalyticsApiClient { return this._analytics; }
    public projects(): ProjectApiClient { return this._projects; }
    public providers(): ProviderApiClient { return this._providers; }
}