import axios from "axios";
import { Course_config_prompt, courseJSONSchema } from "./courseGeneratePrompt";
import { pollinationsToken } from "@/lib/polai";

export async function aiCourseGenerate(userInput: string) {
  const res = await axios.post(
    "https://gen.pollinations.ai/v1/chat/completions",
    {
      model: "openai",
      messages: [
        {
          role: "system",
          content: Course_config_prompt,
        },
        {
          role: "user",
          content: "this is the course topic is: " + userInput,
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "CourseConfigSchema",
          schema: courseJSONSchema,
        },
      },
    },
    {
      headers: {
        Authorization: `Bearer ${pollinationsToken}`,
        "Content-Type": "application/json",
      },
    }
  );

  return res.data.choices[0].message.content;
}
