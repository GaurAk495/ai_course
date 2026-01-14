const POLLINATIONS_TOKEN = process.env.POLLINATIONS_TOKEN;

if (!POLLINATIONS_TOKEN) {
  throw new Error("POLLINATIONS_TOKEN is not defined");
}

export const pollinationsToken = POLLINATIONS_TOKEN;
