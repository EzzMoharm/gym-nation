import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh items-center justify-center px-4">
      <div className="flex max-w-lg flex-col items-center text-center">
        {/* Large 404 */}
        <div className="relative mb-8">
          <span className="text-[10rem] font-black leading-none tracking-tighter text-muted/20 select-none">
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-5xl font-black tracking-tight text-gradient">
              LOST?
            </span>
          </div>
        </div>

        <h1 className="text-2xl font-bold tracking-tight">
          Page not found
        </h1>
        <p className="mt-3 text-muted-foreground leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Let&apos;s get you back on track.
        </p>

        <div className="mt-8 flex gap-3">
          <Link href="javascript:history.back()" className={buttonVariants({ variant: "outline", className: "gap-2" })}>
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Link>
          <Link href="/" className={buttonVariants({ className: "gap-2" })}>
            <Home className="h-4 w-4" />
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}
