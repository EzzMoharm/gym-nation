-- Fix for infinite recursion in "Admins can view all profiles" policy

-- 1. Create a security definer function to check for admin role safely
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- 2. Drop the recursive policy
drop policy if exists "Admins can view all profiles" on profiles;

-- 3. Create a new safe policy
create policy "Admins can view all profiles" on profiles
  for select using (public.is_admin());
