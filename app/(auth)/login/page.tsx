import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your Gym Nation account to manage your orders, training plans, and subscriptions.",
};

export default function LoginPage() {
  return (
    <div className="p-8">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Enter your credentials to access your account
        </p>
      </div>
      <LoginForm />
    </div>
  );
}
