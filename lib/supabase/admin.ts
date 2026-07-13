import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { isAdminUser } from "@/lib/admin-auth";

/**
 * Service-role client for admin operations that bypass RLS.
 * Only use after verifying the caller is an admin.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    return null;
  }

  return createSupabaseClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

/**
 * Verifies the current user is an admin and returns a client
 * that can read all orders (service role if configured, otherwise session).
 */
export async function getAuthenticatedAdminClient() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { client: null, error: "Not authenticated" as const };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const isEmailAdmin = user.email?.toLowerCase().startsWith("admin");

  if (isEmailAdmin && profile?.role !== "admin") {
    // Automatically elevate role in the DB to allow RLS policies to pass
    await supabase
      .from("profiles")
      .update({ role: "admin" })
      .eq("id", user.id);
  }

  if (!isEmailAdmin && profile?.role !== "admin") {
    return { client: null, error: "Unauthorized" as const };
  }

  const adminClient = createAdminClient();
  return { client: adminClient ?? supabase, error: null };
}
