"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { forgotPassword } from "@/lib/actions/users.actions";

interface ForgotPasswordFormProps {
  callbackUrl?: string;
}

const ForgotPasswordForm = ({ callbackUrl = "/" }: ForgotPasswordFormProps) => {
  const [data, action] = useActionState(forgotPassword, {
    success: false,
    message: "",
  });

  const ForgotPasswordButton = () => {
    const { pending } = useFormStatus();

    return (
      <Button disabled={pending} className="w-full" variant="default">
        {pending ? "Sending..." : "Send Reset Link"}
      </Button>
    );
  };

  return (
    <form action={action}>
      <input type="hidden" name="callbackUrl" value={callbackUrl} />
      <div className="space-y-6">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="Enter your email address"
          />
        </div>
        {data.message && (
          <div
            className={`text-sm ${data.success ? "text-green-600" : "text-red-600"}`}
          >
            {data.message}
          </div>
        )}
        <div>
          <ForgotPasswordButton />
        </div>
      </div>
    </form>
  );
};

export default ForgotPasswordForm;
