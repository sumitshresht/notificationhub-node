export class NotificationHubError extends Error {
    public readonly statusCode: number;
    public readonly responseBody: string;

    constructor(message: string, statusCode: number, responseBody: string) {
        super(`${message} (HTTP ${statusCode}): ${responseBody}`);
        this.name = this.constructor.name;
        this.statusCode = statusCode;
        this.responseBody = responseBody;
        Object.setPrototypeOf(this, new.target.prototype);
    }

    // Factory method to automatically throw the correct specific subclass
    public static create(message: string, statusCode: number, body: string): NotificationHubError {
        if (statusCode === 401 || statusCode === 403) return new NotificationHubAuthError(message, statusCode, body);
        if (statusCode === 429) return new NotificationHubRateLimitError(message, statusCode, body);
        if (statusCode >= 400 && statusCode < 500) return new NotificationHubValidationError(message, statusCode, body);
        if (statusCode >= 500) return new NotificationHubServerError(message, statusCode, body);
        return new NotificationHubError(message, statusCode, body);
    }
}

// --- Specific Exception Subclasses ---
export class NotificationHubAuthError extends NotificationHubError {}
export class NotificationHubValidationError extends NotificationHubError {}
export class NotificationHubRateLimitError extends NotificationHubError {}
export class NotificationHubServerError extends NotificationHubError {}