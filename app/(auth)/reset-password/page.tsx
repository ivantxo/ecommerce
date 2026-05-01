import { auth } from "@/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { APP_NAME } from "@/lib/constants";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import ResetPasswordForm from "./reset-password-form";

export const metadata: Metadata = {
  title: "Reset your password | " + APP_NAME,
  description: "Create a new password for your account",
};

const ResetPasswordPage = async (props: {
  searchParams: Promise<{
    token?: string;
  }>;
}) => {
  const { token } = await props.searchParams;

  const session = await auth();

  if (session) {
    return redirect("/");
  }

  if (!token) {
    return redirect("/forgot-password");
  }
  return (
    <div className="w-full max-w-md mx-auto">
      <Card>
        <CardHeader className="space-y-4">
          <Link href="/" className="flex-center">
            <Image
              src="/images/logo.png"
              width={100}
              height={100}
              alt={`${APP_NAME} logo`}
              priority
            />
          </Link>
          <CardTitle className="text-center">Reset your password</CardTitle>
          <CardDescription className="text-center">
            Enter your new password below to reset your account password.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ResetPasswordForm token={token} />
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPasswordPage;
