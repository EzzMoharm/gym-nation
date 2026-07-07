"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Mail, ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";

const schema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type Values = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const supabase = createClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data: Values) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: `${location.origin}/auth/update-password`,
      });

      if (error) throw error;

      setIsSubmitted(true);
      toast.success("Password reset link sent to your email.");
    } catch (error: unknown) {
      toast.error((error as Error).message || "Failed to send reset link.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="p-8 text-center space-y-6">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
          <CheckCircle2 className="h-8 w-8 text-success" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Check your email</h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          We&apos;ve sent a password reset link to your email address. Please
          check your inbox and spam folder.
        </p>
        <Link href="/login" className={buttonVariants({ variant: "outline", className: "mt-4 w-full h-11 rounded-xl" })}>
          Return to login
        </Link>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <Link
          href="/login"
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to login
        </Link>
        <h1 className="text-2xl font-bold tracking-tight">Reset password</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Enter your email address and we&apos;ll send you a link to reset your
          password.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              className="pl-10 h-11"
              {...register("email")}
              disabled={isLoading}
            />
          </div>
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full h-11 bg-brand hover:bg-brand-light text-brand-foreground font-semibold rounded-xl"
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : null}
          Send Reset Link
        </Button>
      </form>
    </div>
  );
}
