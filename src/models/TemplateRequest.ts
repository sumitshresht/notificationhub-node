export class TemplateRequest {
    public readonly name: string;
    public readonly subject: string;
    public readonly content: string;

    private constructor(builder: TemplateRequestBuilder) {
        this.name = builder._name!;
        this.subject = builder._subject!;
        this.content = builder._content!;
    }

    public static builder(): TemplateRequestBuilder {
        return new TemplateRequestBuilder();
    }
}

export class TemplateRequestBuilder {
    public _name?: string;
    public _subject?: string;
    public _content?: string;

    public name(name: string): this {
        this._name = name;
        return this;
    }

    public subject(subject: string): this {
        this._subject = subject;
        return this;
    }

    public content(content: string): this {
        this._content = content;
        return this;
    }

    public build(): TemplateRequest {
        if (!this._name || this._name.trim() === '') throw new Error("Template name is required.");
        if (!this._subject || this._subject.trim() === '') throw new Error("Template default subject is required.");
        if (!this._content || this._content.trim() === '') throw new Error("Template body content is required.");
        return new (TemplateRequest as any)(this);
    }
}