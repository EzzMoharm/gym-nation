import Link from "next/link";
import { cn } from "@/lib/utils";
import { Dumbbell } from "lucide-react";

interface LogoProps {
  className?: string;
  iconOnly?: boolean;
}

export function Logo({ className, iconOnly = false }: LogoProps) {
  return (
    <Link
      href="/"
      className={cn(
        "flex items-center gap-2 font-bold tracking-tight transition-opacity hover:opacity-80",
        className
      )}
      aria-label="Gym Nation Home"
    >
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand text-brand-foreground">
        <Dumbbell className="h-5 w-5" />
      </div>
      {!iconOnly && (
        <span className="text-xl font-extrabold tracking-tight">
          GYM<span className="text-brand">NATION</span>
        </span>
      )}
    </Link>
  );
}

