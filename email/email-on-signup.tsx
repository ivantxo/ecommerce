import { Resend } from "resend";
import { SENDER_EMAIL, APP_NAME } from "@/lib/constants";
import SendEmailVerification from "./new-account-confirmation";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmailVerification = async (email: string, code: string) => {
  await resend.emails.send({
    from: `${APP_NAME} <${SENDER_EMAIL}>`,
    to: email,
    subject: `CreativeDS New Account Confirmation`,
    react: <SendEmailVerification email={email} code={code} />,
  });
};
