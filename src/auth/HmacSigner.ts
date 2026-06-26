import * as crypto from 'crypto';

export class HmacSigner {
    private static readonly HMAC_ALGO = 'sha256';
    private readonly apiKey: string;
    private readonly rawSecret: string;

    constructor(apiKey: string, rawSecret: string) {
        this.apiKey = apiKey;
        this.rawSecret = rawSecret;
    }

    /**
     * Generates the secure headers required for API authentication.
     */
    public signRequest(payload: string = ''): Record<string, string> {
        const timestamp = Math.floor(Date.now() / 1000).toString();
        const signature = this.generateSignature(timestamp, payload);

        return {
            'X-API-Key': this.apiKey,
            'Authorization': `Bearer ${this.rawSecret}`,
            'X-Timestamp': timestamp,
            'X-Signature': signature,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };
    }

    private generateSignature(timestamp: string, payload: string): string {
        try {
            const dataToSign = `${timestamp}.${payload}`;
            return crypto
                .createHmac(HmacSigner.HMAC_ALGO, this.rawSecret)
                .update(dataToSign, 'utf8')
                .digest('hex');
        } catch (error: any) {
            throw new Error(`Failed to generate HMAC signature: ${error.message}`);
        }
    }
}