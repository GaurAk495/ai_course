import axios from "axios";
import { Course_config_prompt, courseJSONSchema, courseSchema } from "./prompt";

const POLLINATIONS_TOKEN = process.env.POLLINATIONS_TOKEN;

if (!POLLINATIONS_TOKEN) {
  throw new Error("POLLINATIONS_TOKEN is not defined");
}

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
        Authorization: `Bearer ${POLLINATIONS_TOKEN}`,
        "Content-Type": "application/json",
      },
    }
  );

  return res.data.choices[0].message.content;
}
