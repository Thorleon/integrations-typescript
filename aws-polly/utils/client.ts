import { PollyClient } from "@aws-sdk/client-polly";

export function pollyClient({ accessKeyId, secretAccessKey, region }: {
  accessKeyId?: string;
  secretAccessKey?: string;
  region?: string;
}) {
  const config = {
    ...(region && { region }),
    ...(accessKeyId && secretAccessKey && {
      credentials: {
        accessKeyId,
        secretAccessKey
      }
    })
  };
  return new PollyClient(config);
}
