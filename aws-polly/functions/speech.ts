import { FunctionFailure, log } from "@restackio/ai/function";
import { pollyClient } from "../utils/client";
import { SynthesizeSpeechCommand, SynthesizeSpeechCommandOutput } from "@aws-sdk/client-polly";
import type { Engine, LanguageCode, OutputFormat, SpeechMarkType, TextType, VoiceId } from "@aws-sdk/client-polly";
import { Buffer } from "node:buffer";

export async function awsPollySpeech({
  text,
  options = {
    voiceId: "Joey",
    outputFormat: "mp3",
  },
  accessKeyId,
  secretAccessKey,
  region
}: {
  text: string;
  options?: {
    engine?: Engine,
    languageCode?: LanguageCode,
    lexiconNames?: string[],
    outputFormat: OutputFormat;
    sampleRate?: string,
    speechMarkTypes?: SpeechMarkType[],
    textType?: TextType,
    voiceId: VoiceId
  };
  accessKeyId?: string;
  secretAccessKey?: string;
  region?: string;
}): Promise<{
  media: {
    payload: string;
  };
}> {
  if (!text.length) {
    log.error("Text is empty");
    throw FunctionFailure.nonRetryable("Text is empty");
  }
  const awsPollyClient = pollyClient({ accessKeyId, secretAccessKey, region });
  const synthesizeSpeechCommand = {
    Text: text,
    VoiceId: options.voiceId,
    OutputFormat: options.outputFormat,
    ...(options?.engine && { Engine: options.engine }),
    ...(options?.languageCode && { LanguageCode: options.languageCode }),
    ...(options?.lexiconNames && { Lexicon: options.lexiconNames }),
    ...(options?.sampleRate && { SampleRate: options.sampleRate }),
    ...(options?.speechMarkTypes && { SpeechMarkType: options.speechMarkTypes }),
    ...(options?.textType && { TextType: options.textType }),
  };
  let result: SynthesizeSpeechCommandOutput
  try {
     result = await awsPollyClient.send(
        new SynthesizeSpeechCommand(synthesizeSpeechCommand)
    );
  } catch (error) {
    log.error("AWS Polly error", { error });
    throw new Error(`AWS Polly error ${error}`);
  }
  if (!result || !result.AudioStream) {
    log.error("No audio stream in AWS Polly result");
    throw new Error("No audio stream in AWS Polly result");
  }
  const audioData = Buffer.from(await result.AudioStream.transformToByteArray());
  const base64String = audioData.toString("base64");
  log.info("awsPolly: ", { audioLength: base64String.length });
  return {
    media: {
      payload: base64String
    }
  }
}
