# Notification Hub Node.js SDK

[![npm version](https://img.shields.io/npm/v/@sumitshresht/notificationhub-sdk.svg?style=flat-square)](https://www.npmjs.com/package/@sumitshresht/notificationhub-sdk)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue.svg?style=flat-square)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

The official enterprise-grade Node.js client for the **Notification Hub API**. 

Build reliable, omni-channel notification workflows (Email, SMS, Push, In-App, and Webhooks) with built-in cryptographic security, strict TypeScript definitions, and robust dead-letter queue (DLQ) management.

## 📖 Documentation

Comprehensive documentation, API reference, guides, and examples are available at:

👉 **https://docs.notificationhub.dev-space.dev**

---

## ✨ Features

* **Omni-Channel Dispatch:** Send messages across Email, SMS, Push, Webhooks, and In-App through a unified API.
* **Cryptographic Security:** Every request is automatically signed using HMAC SHA-256 to guarantee payload integrity.
* **Idempotency Support:** Prevent duplicate dispatches during network retries with built-in idempotency keys.
* **Strict TypeScript:** Full type safety with native Enums, Interfaces, and Fluent Builder patterns.
* **Multi-Tenant Management:** Provision, suspend, and manage API keys for child projects dynamically.
* **Advanced Analytics:** Track open rates, click rates, and automatically manage failed deliveries via the Dead Letter Queue (DLQ).

---

## 📦 Installation

Install the package using your preferred package manager:

```bash
npm install notificationhub-sdk
# or
yarn add notificationhub-sdk
# or
pnpm add notificationhub-sdk

```

---

## 🚀 Quick Start

### 1. Initialize the Client

Initialize the client using the secure Builder pattern. Your `apiSecret` is never transmitted over the network; it is used locally to generate HMAC signatures.

```typescript
import { NotificationHubClient } from 'notificationhub-sdk';

const client = new NotificationHubClient.Builder()
    .apiKey(process.env.NH_API_KEY)
    .apiSecret(process.env.NH_API_SECRET)
    .baseUrl("process.env.NH_BASE_URL") // Optional: Defaults to production
    .build();

```

### 2. Send an Omni-Channel Notification

Use the Fluent Builder to construct complex, multi-channel notification requests.

```typescript
import { NotificationRequest, ChannelType } from 'notificationhub-sdk';

async function sendAlert() {
    const request = NotificationRequest.builder()
        .addChannel(ChannelType.EMAIL)
        .addChannel(ChannelType.PUSH)
        .toEmail("user@example.com")
        .toPushToken("device_token_xyz")
        .templateId("welcome_template_uuid")
        .addVariable("name", "Sumit")
        .build();

    const response = await client.notifications().send(request);
    console.log(`Dispatched! Notification ID: ${response.notificationId}`);
}

```

---

## 📚 API Reference

### 📨 Notifications

Send, schedule, and track notifications across all providers.

```typescript
import * as crypto from 'crypto';

// Idempotent Send (Prevents duplicates on retry)
const idempotencyKey = crypto.randomUUID();
await client.notifications().sendWithIdempotency(request, idempotencyKey);

// Bulk Send
await client.notifications().sendBulk([req1, req2, req3]);

// Cancel a Scheduled Notification
await client.notifications().cancelSchedule("task_uuid");

// Track Email Opens (Returns a transparent 1x1 pixel buffer)
const trackingPixel = await client.notifications().trackOpen("notification_uuid");

```

### 🎨 Templates

Manage rich HTML templates with dynamic variable injection.

```typescript
import { TemplateRequest } from 'notificationhub-sdk';

// Create a Template
const templateReq = TemplateRequest.builder()
    .name("Order Confirmation")
    .subject("Your order {{orderId}} is confirmed!")
    .content("<h1>Thank you!</h1><p>Order ID: {{orderId}}</p>")
    .build();

const template = await client.templates().create(templateReq);

// Preview Template Rendering (Without saving)
const preview = await client.templates().previewRaw(
    "<h1>Hi {{name}}</h1>", 
    { name: "Alice" }
);
console.log(preview.renderedHtml);

```

### 🔌 Providers

Dynamically configure downstream infrastructure (SendGrid, Twilio, Firebase, etc.).

```typescript
import { ChannelType } from 'notificationhub-sdk';

// Configure a Webhook Provider
await client.providers().configure(ChannelType.WEBHOOK, "PRIMARY_HOOK", {
    url: "https://your-domain.com/webhook"
});

// Test Connection (Validates credentials with the downstream provider)
await client.providers().testConnection(ChannelType.EMAIL, {
    host: "smtp.example.com",
    port: "587",
    user: "admin",
    pass: "secure_password"
});

```

### 🏢 Project Management (Multi-Tenancy)

Manage child projects, rotate secrets, and suspend access programmatically.

```typescript
import { ProjectStatus } from 'notificationhub-sdk';

// Create a new Tenant/Project
const newProject = await client.projects().create("Client_A_Production");
console.log(`API Key: ${newProject.apiKey}, Secret: ${newProject.rawSecret}`);

// Suspend a Project
await client.projects().updateStatus(newProject.id, ProjectStatus.SUSPENDED);

// Rotate Compromised API Keys
const rotated = await client.projects().rotateApiKey(newProject.id);
console.log(`New Key: ${rotated.newApiKey}`);

```

### 📊 Analytics & Dead Letter Queue (DLQ)

Monitor system health and recover failed deliveries.

```typescript
// Fetch System Metrics
const metrics = await client.analytics().getMetrics();

// Fetch Dead Letter Queue (Failed Notifications)
const dlq = await client.analytics().getDeadLetterQueue(50, 0);

// Retry a Failed Notification
if (dlq.length > 0) {
    await client.analytics().retryFailedNotification(dlq[0].id);
}

```

---

## 🛡️ Error Handling

The SDK throws highly specific exception subclasses, allowing you to gracefully handle different failure states (e.g., Rate Limits vs. Validation Errors).

```typescript
import { 
    NotificationHubError, 
    NotificationHubRateLimitError, 
    NotificationHubValidationError 
} from 'notificationhub-sdk';

try {
    await client.notifications().send(request);
} catch (error) {
    if (error instanceof NotificationHubRateLimitError) {
        console.error("Slow down! Hit rate limits.");
    } else if (error instanceof NotificationHubValidationError) {
        console.error(`Invalid Payload (HTTP ${error.statusCode}): ${error.responseBody}`);
    } else if (error instanceof NotificationHubError) {
        console.error(`General API Error: ${error.message}`);
    } else {
        console.error("An unexpected runtime error occurred.");
    }
}

```

---

## 🔐 Security Architecture

This SDK does **not** transmit your `apiSecret` over the network. Instead, it utilizes an internal `HmacSigner` to cryptographically hash the request payload and timestamp using HMAC SHA-256.

The resulting signature is attached to the `X-Signature` header, guaranteeing that:

1. The request originated from an authorized client.
2. The payload was not tampered with in transit (Man-in-the-Middle protection).
3. The request is immune to replay attacks via strict `X-Timestamp` validation on the server.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.