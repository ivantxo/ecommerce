import { APP_NAME } from "@/lib/constants";

interface PasswordResetEmailProps {
  resetUrl: string;
}

const PasswordResetEmail = ({ resetUrl }: PasswordResetEmailProps) => {
  return (
    <div style={{ fontFamily: "Arial, sans-serif", lineHeight: "1.6" }}>
      <h2>Password Reset Request</h2>
      <p>Hello,</p>
      <p>You requested to reset your password for your {APP_NAME} account.</p>
      <p>Click the button below to reset your password:</p>
      <div style={{ margin: "30px 0" }}>
        <a
          href={resetUrl}
          style={{
            display: "inline-block",
            padding: "12px 24px",
            backgroundColor: "#007bff",
            color: "white",
            textDecoration: "none",
            borderRadius: "5px",
            fontWeight: "bold",
          }}
        >
          Reset Password
        </a>
      </div>
      <p>Or copy and paste this link in your browser:</p>
      <p style={{ wordBreak: "break-all" }}>{resetUrl}</p>
      <p style={{ color: "#666", fontSize: "12px" }}>
        This link will expire in 24 hours.
      </p>
      <p style={{ color: "#666", fontSize: "12px" }}>
        If you didn&apos;t request this, please ignore this email and your
        password will remain unchanged.
      </p>
    </div>
  );
};

export default PasswordResetEmail;
