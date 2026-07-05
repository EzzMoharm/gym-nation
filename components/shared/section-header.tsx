import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeader({
  title,
  subtitle,
  align = "center",
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "mb-12 md:mb-16",
        align === "center" && "text-center",
        className
      )}
    >
      <h2
        className={cn(
          "text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl"
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  );
}
