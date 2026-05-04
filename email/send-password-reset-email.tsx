import { Resend } from "resend";
import { SENDER_EMAIL, APP_NAME } from "@/lib/constants";
import PasswordResetEmail from "./password-reset-email";

export async function sendPasswordResetEmail(
  email: string,
  resetUrl: string,
): Promise<void> {
  const resend = new Resend(process.env.RESEND_API_KEY);
  await resend.emails.send({
    from: `${APP_NAME} <${SENDER_EMAIL}>`,
    to: email,
    subject: `Reset your ${APP_NAME} password`,
    react: <PasswordResetEmail resetUrl={resetUrl} />,
  });
}
