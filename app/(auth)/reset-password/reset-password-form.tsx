"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { resetPassword } from "@/lib/actions/users.actions";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

interface ResetPasswordFormProps {
  token: string;
}

const ResetPasswordForm = ({ token }: ResetPasswordFormProps) => {
  const [data, action] = useActionState(resetPassword, {
    success: false,
    message: "",
  });

  const ResetPasswordButton = () => {
    const { pending } = useFormStatus();

    return (
      <Button disabled={pending} className="w-full" variant="default">
        {pending ? "Resetting..." : "Reset Password"}
      </Button>
    );
  };
  return (
    <form action={action}>
      <input type="hidden" name="token" value={token} />
      <div className="space-y-6">
        <div>
          <Label htmlFor="password">New Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="new-password"
            placeholder="Enter your new password"
            minLength={8}
          />
        </div>
        <div>
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            autoComplete="new-password"
            placeholder="Confirm your new password"
            minLength={8}
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
          <ResetPasswordButton />
        </div>
      </div>
    </form>
  );
};

export default ResetPasswordForm;
