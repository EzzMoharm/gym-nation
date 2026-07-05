import type { Metadata } from "next";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = {
  title: "Create an Account",
  description: "Join Gym Nation to unlock premium training plans and nutrition.",
};

export default function RegisterPage() {
  return (
    <div className="p-8">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold tracking-tight">Create an account</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Join Gym Nation and fuel your greatness
        </p>
      </div>
      <RegisterForm />
    </div>
  );
}
