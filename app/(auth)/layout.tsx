import { Logo } from "@/components/layout/logo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-muted/30 p-4 sm:p-8">
      {/* Background decoration */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-brand/5 rounded-full blur-[100px]" />
        <div className="absolute top-[60%] -right-[10%] w-[40%] h-[40%] bg-brand/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>
        
        {/* The auth card container */}
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-xl shadow-brand/5">
          {children}
        </div>
      </div>
    </div>
  );
}
