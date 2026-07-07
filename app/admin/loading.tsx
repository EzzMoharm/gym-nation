import { Loader2 } from "lucide-react";

export default function AdminLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
      <Loader2 className="h-12 w-12 text-brand animate-spin mb-4" />
      <h2 className="text-xl font-bold tracking-tight mb-2">Loading data...</h2>
      <p className="text-muted-foreground text-sm">Please wait while we fetch the latest records.</p>
    </div>
  );
}
