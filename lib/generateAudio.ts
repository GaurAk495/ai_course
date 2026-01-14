"use server";
import axios from "axios";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { r2, R2_PUBLIC_URL } from "./r2";

export interface TextToSpeechParams {
  text: string;
  key: string;
}

type MurfResponse = {
  audioFile: string;
  audioLengthInSeconds: number;
  remainingCharacterCount: number;
  wordDurations: [
    {
      endMs: number;
      startMs: number;
      word: string;
      pitchScaleMaximum: number;
      pitchScaleMinimum: number;
      sourceWordIndex: number;
    }
  ];
  encodedAudio: string;
  warning: string;
  consumedCharacterCount: number;
};

export interface TextToSpeechResult {
  success: boolean;
  url: string;
  captions: MurfResponse["wordDurations"];
}

const R2_BUCKET = process.env.R2_BUCKET;
if (!R2_BUCKET) {
  throw new Error("R2_BUCKET not found");
}

export async function textToSpeech(
  params: TextToSpeechParams
): Promise<TextToSpeechResult> {
  const { text, key } = params;

  try {
    const data = {
      voiceId: "en-US-phoebe",
      style: "Conversational",
      text,
      multiNativeLocale: "en-US",
    };
    const response = await axios.post<MurfResponse>(
      "https://api.murf.ai/v1/speech/generate",
      data,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "api-key": process.env.MURF_API_KEY!,
        },
      }
    );
    const keyName = `tts/${key}`;
    const audioUrl = response.data.audioFile;
    const audioRes = await axios.get(audioUrl, {
      responseType: "arraybuffer",
    });

    await r2.send(
      new PutObjectCommand({
        Bucket: R2_BUCKET,
        Key: keyName,
        Body: Buffer.from(audioRes.data),
        ContentType: "audio/wav",
      })
    );
    return {
      success: true,
      url: `${R2_PUBLIC_URL}/${keyName}`,
      captions: response.data.wordDurations,
    };
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("MURF TTS Error:", error?.response?.data || error);
    } else {
      console.error("MURF TTS Error:", error);
    }
    throw error;
  }
}
