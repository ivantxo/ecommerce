import { Resend } from "resend";
import { SENDER_EMAIL, APP_NAME } from "@/lib/constants";
import PasswordResetEmail from "./password-reset-email";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendPasswordResetEmail(
  email: string,
  resetUrl: string,
): Promise<void> {
  await resend.emails.send({
    from: `${APP_NAME} <${SENDER_EMAIL}>`,
    to: email,
    subject: `Reset your ${APP_NAME} password`,
    react: <PasswordResetEmail resetUrl={resetUrl} />,
  });
}
