import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;

if (!resendApiKey) {
  throw new Error("Missing API key. Pass it to the constructor `new Resend('your-api-key')`");
}

export const resend = new Resend(resendApiKey);
