import { ChannelType } from './Enums';

export class NotificationRequest {
    public readonly channels: string[];
    public readonly to: Record<string, string>;
    public readonly templateId?: string;
    public readonly subject?: string;
    public readonly message?: string;
    public readonly vars: Record<string, any>;
    public readonly scheduledFor?: string; // ISO 8601 string

    private constructor(builder: NotificationRequestBuilder) {
        this.channels = [...builder._channels];
        this.to = { ...builder._to };
        this.templateId = builder._templateId;
        this.subject = builder._subject;
        this.message = builder._message;
        this.vars = { ...builder._vars };
        this.scheduledFor = builder._scheduledFor?.toISOString();
    }

    public static builder(): NotificationRequestBuilder {
        return new NotificationRequestBuilder();
    }
}

export class NotificationRequestBuilder {
    public _channels: string[] = [];
    public _to: Record<string, string> = {};
    public _templateId?: string;
    public _subject?: string;
    public _message?: string;
    public _vars: Record<string, any> = {};
    public _scheduledFor?: Date;

    public addChannel(channel: ChannelType): this {
        if (channel) {
            this._channels.push(channel);
        }
        return this;
    }

    public toEmail(email: string): this { this._to['email'] = email; return this; }
    public toPhone(phone: string): this { this._to['phone'] = phone; return this; }
    public toWebhook(url: string): this { this._to['url'] = url; return this; }

    public toPushToken(token: string): this { this._to['token'] = token; return this; }
    public toPushTopic(topic: string): this { this._to['topic'] = topic; return this; }

    public toInApp(userId: string): this { this._to['userId'] = userId; return this; }

    public withMediaUrl(imageUrl: string): this { this._to['imageUrl'] = imageUrl; return this; }
    public withActionUrl(actionUrl: string): this { this._to['actionUrl'] = actionUrl; return this; }

    public templateId(templateId: string): this { this._templateId = templateId; return this; }
    public subject(subject: string): this { this._subject = subject; return this; }
    public message(message: string): this { this._message = message; return this; }
    public addVariable(key: string, value: any): this {
        if (key) this._vars[key] = value;
        return this;
    }
    public scheduleFor(date: Date): this { this._scheduledFor = date; return this; }

    public build(): NotificationRequest {
        if (this._channels.length === 0) {
            throw new Error("At least one dispatch channel must be specified.");
        }
        return new (NotificationRequest as any)(this);
    }
}