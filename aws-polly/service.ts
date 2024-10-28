import Restack, { ServiceInput } from "@restackio/ai";
import { rpmToSecond } from "@restackio/ai/utils";
import { awsPollySpeech } from "./functions";
import { awsPollyTaskQueue } from "./taskQueue";

export async function awsPollyService({
  client,
  options = {
    rateLimit: rpmToSecond(600),
    maxConcurrentFunctionRuns: 1,
  },
}: {
  client: Restack;
  options?: ServiceInput["options"];
}) {
  await client.startService({
    taskQueue: awsPollyTaskQueue,
    functions: { awsPollySpeech },
    options,
  });
}

awsPollyService({ client: new Restack() }).catch((err) => {
  console.error("Error service:", err);
});
