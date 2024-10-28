# AWS Polly Integration for Restack

This package provides an integration for AWS Polly services with Restack, allowing easy text-to-speech conversion using AWS.

## Installation

To install the package, use npm or yarn:

```bash
npm install @restackio/integrations-awspolly
```

## Configuration

Before using the AWS Polly integration, you need to set up your AWS credentials. You can do this by setting environment variables or passing them directly to the functions.

1. Set up environment variables:

```bash
AWS_SECRET_ACCESS_KEY==your_aws_secret_access_key
AWS_ACCESS_KEY_ID=your_aws_access_key_id
AWS_REGION=your_aws_region
```

2. Or pass them directly when calling the functions (see Usage section).

## Usage

### Starting the AWS Polly Service

To start the AWS Polly service, use the `awsPollyService` function:

```typescript
import Restack from "@restackio/ai";
import { awsPollyService } from "@restackio/integrations-awspolly";

export async function services() {
  const client = new Restack();
  awsPollyService({ client }).catch((err) => {
    console.error("Error starting Azure Speech service:", err);
  });
}

services().catch((err) => {
  console.error("Error running services:", err);
});
```

### Using the AWS Polly Function

The main function provided by this integration is `azureSpeech`. Here's how to use it inside a workflow as part of one of its steps:

```typescript
import { log, step } from "@restackio/ai/workflow";
import * as awsFunctions from "@restackio/integrations-awspolly/functions";
import { awsPollyTaskQueue } from "@restackio/integrations-awspolly/taskQueue";

export async function awsPollyWorkflow() {
  const result = await step<typeof awsFunctions>({
    taskQueue: awsPollyTaskQueue,
  }).awsPollySpeech({
    text: "Hello, world!",
    options: {voiceId: "Joey", outputFormat: "mp3"},
    accessKeyId: "your_aws_access_key_id", // Optional if set in environment variables
    secretAccessKey: "your_aws_secret_access_key", // Optional if set in environment variables 
    region: "your_aws_region", // Optional if set in environment variables
  });
  log.info("result", { result: result.media.payload }); // Base64 encoded audio data
  return result;
}
```
