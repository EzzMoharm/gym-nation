import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function AuthCallbackPage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string; next?: string }>;
}) {
  const { code, next = "/dashboard" } = await searchParams;

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
      redirect(next);
    }
  }

  // Redirect to login if there's no code or an error occurred
  redirect("/login?error=auth_callback_failed");
}
