import { Container } from "@/components/shared/container";
import { Dumbbell } from "lucide-react";

export default function PlansLoading() {
  return (
    <div className="min-h-screen pt-28 pb-12">
      <Container>
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-brand/20 blur-xl rounded-full animate-pulse" />
            <Dumbbell className="h-12 w-12 text-brand relative z-10 animate-spin" style={{ animationDuration: '3s' }} />
          </div>
          <h2 className="text-2xl font-bold tracking-tight mb-2">Loading Training Plans</h2>
          <p className="text-muted-foreground">Getting the best workouts ready for you...</p>
        </div>
      </Container>
    </div>
  );
}
