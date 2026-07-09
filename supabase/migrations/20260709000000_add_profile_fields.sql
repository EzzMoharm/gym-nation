-- ============================================
-- Add Extended Profile Fields & Storage Bucket
-- Run this in your Supabase SQL Editor
-- ============================================

-- 1. Add new columns to the profiles table
alter table public.profiles add column if not exists bio text;
alter table public.profiles add column if not exists gender text;
alter table public.profiles add column if not exists date_of_birth date;
alter table public.profiles add column if not exists height numeric(5,2); -- in cm
alter table public.profiles add column if not exists weight numeric(5,2); -- in kg
alter table public.profiles add column if not exists fitness_goal text;

-- 2. Create the avatars storage bucket
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- 3. Set up RLS Policies for the avatars bucket
-- Drop existing policies if they exist to avoid duplicate conflicts
drop policy if exists "Public can view avatars" on storage.objects;
drop policy if exists "Users can manage their own avatar" on storage.objects;

-- Allow public read access to any file in the avatars bucket
create policy "Public can view avatars"
  on storage.objects for select
  using (bucket_id = 'avatars');

-- Allow authenticated users to manage files in their own folder (e.g. avatars/user_id/*)
create policy "Users can manage their own avatar"
  on storage.objects for all
  to authenticated
  using (
    bucket_id = 'avatars' 
    and auth.uid()::text = split_part(name, '/', 1)
  )
  with check (
    bucket_id = 'avatars' 
    and auth.uid()::text = split_part(name, '/', 1)
  );
