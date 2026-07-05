import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex min-h-dvh items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        {/* Animated logo placeholder */}
        <div className="relative">
          <Skeleton className="h-12 w-12 rounded-xl" />
          <div className="absolute inset-0 animate-ping rounded-xl bg-brand/20" />
        </div>
        <Skeleton className="h-4 w-32 rounded-md" />
      </div>
    </div>
  );
}
