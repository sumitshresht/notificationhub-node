export class NotificationHubError extends Error {
    public readonly statusCode: number;
    public readonly responseBody: string;

    constructor(message: string, statusCode: number, responseBody: string) {
        super(`${message} (HTTP ${statusCode}): ${responseBody}`);
        this.name = 'NotificationHubError';
        this.statusCode = statusCode;
        this.responseBody = responseBody;
        Object.setPrototypeOf(this, NotificationHubError.prototype);
    }
}