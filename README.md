# Notification Hub SDK for Node.js

The official Node.js client for the Notification Hub API. Seamlessly dispatch emails, SMS, push notifications, and webhooks with enterprise-grade HMAC security.

## Installation

```bash
npm install @notificationhub/sdk
```

## Quick Start

```typescript
import {
  NotificationHubClient,
  NotificationRequest,
} from '@notificationhub/sdk';

// Initialize the client
const client = new NotificationHubClient(
  'YOUR_API_KEY',
  'YOUR_RAW_SECRET',
  'https://api.yourdomain.com'
);

// Dispatch a notification
async function run() {
  const request = NotificationRequest.builder()
    .addChannel('EMAIL')
    .toEmail('user@example.com')
    .templateId('template-uuid-here')
    .addVariable('name', 'Sumit')
    .build();

  const response = await client.notifications().send(request);

  console.log('Notification ID:', response.notificationId);
}

run();
```

## Features

* ✅ **Strictly Typed** – Full TypeScript support with rich IDE autocomplete.
* 🔒 **Secure** – Automatic HMAC-SHA256 request signing.
* 🔄 **Reliable** – Idempotency key support for safe retries.
* 📧 **Multi-Channel** – Send Email, SMS, Push Notifications, and Webhooks.
* 📊 **Comprehensive** – Full coverage of Projects, Providers, Templates, Analytics, and Dead Letter Queue (DLQ) management.
* 🚀 **Production Ready** – Built for high-volume enterprise notification workloads.

## Documentation

For complete API documentation, integration guides, and examples, visit:

```text
https://your-domain.com/docs
```

## Requirements

* Node.js 18+
* npm, yarn, or pnpm

## License

MIT License

Copyright (c) Notification Hub

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction.
