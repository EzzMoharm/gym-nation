"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="flex min-h-dvh items-center justify-center px-4">
      <div className="flex max-w-md flex-col items-center text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-destructive/10 mb-8">
          <AlertTriangle className="h-10 w-10 text-destructive" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">
          Something went wrong
        </h1>
        <p className="mt-4 text-muted-foreground leading-relaxed">
          We apologize for the inconvenience. An unexpected error occurred.
          Please try again or return to the homepage.
        </p>
        <div className="mt-8 flex gap-3">
          <Button variant="outline" onClick={reset} className="gap-2">
            <RotateCcw className="h-4 w-4" />
            Try Again
          </Button>
          <Link href="/" className={buttonVariants({ className: "gap-2" })}>
            <Home className="h-4 w-4" />
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
