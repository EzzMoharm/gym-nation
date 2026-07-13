export function isAdminEmail(email?: string | null): boolean {
  return email?.toLowerCase().startsWith("admin") ?? false;
}

export function isAdminUser(
  user: { email?: string | null },
  profile: { role?: string } | null | undefined
): boolean {
  return isAdminEmail(user.email) || profile?.role === "admin";
}
