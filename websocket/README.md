# @restackio/integrations-websocket

This package provides WebSocket integration for Restack, allowing you to easily incorporate WebSocket functionality into your Restack workflows.

## Installation

To install the package

```bash
npm install @restackio/integrations-websocket
```

## Usage

### Importing the Service

To use the WebSocket service in your Restack application, import it as follows:

```typescript
import { websocketService } from '@restackio/integrations-websocket';
import Restack from '@restackio/ai';
const client = new Restack();
websocketService({ client }).catch((err) => {
 console.error("Error starting WebSocket service:", err);
});
```

### Available Functions

This package provides two main functions:

1. `websocketListen`: Listens for WebSocket events and triggers corresponding workflow events.
2. `websocketSend`: Sends events through a WebSocket connection.

#### websocketListen

```typescript
websocketListen({
  streamSid: string,
  events?: {
  websocketEventName: string,
  workflowEventName: string,
  workflow?: SendWorkflowEvent["workflow"]
  }[],
  address?: string
})
```

#### websocketSend

```typescript
websocketSend({
  name: string,
  input: WebsocketEvent,
  address?: string
})
```