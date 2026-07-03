// Core Client
export { NotificationHubClient } from './NotificationHubClient';

// Models & Enums
export { NotificationRequest, NotificationRequestBuilder } from './models/NotificationRequest';
export { TemplateRequest, TemplateRequestBuilder } from './models/TemplateRequest';
export { ChannelType, ProjectStatus } from './models/Enums'; 

// Exceptions (Exported Subclasses)
export { 
    NotificationHubError, 
    NotificationHubAuthError,
    NotificationHubValidationError,
    NotificationHubRateLimitError,
    NotificationHubServerError
} from './exception/NotificationHubError';

// Clients (Exposed for Type definitions)
export { AnalyticsApiClient } from './clients/AnalyticsApiClient';
export { NotificationApiClient, NotificationResponse, NotificationReceipt } from './clients/NotificationApiClient';
export { ProjectApiClient, ProjectResponse, ProjectCredentialsResponse, PaginatedProjects } from './clients/ProjectApiClient';
export { ProviderApiClient } from './clients/ProviderApiClient';
export { TemplateApiClient } from './clients/TemplateApiClient';