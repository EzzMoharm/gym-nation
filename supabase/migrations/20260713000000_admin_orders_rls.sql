-- Allow admins to view and manage all customer orders.
-- Safe to re-run: drops existing policies before recreating them.

DROP POLICY IF EXISTS "Admins can select all orders" ON public.orders;
CREATE POLICY "Admins can select all orders"
ON public.orders
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

DROP POLICY IF EXISTS "Admins can update all orders" ON public.orders;
CREATE POLICY "Admins can update all orders"
ON public.orders
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- Allow admins to read customer profiles when listing orders.
DROP POLICY IF EXISTS "Admins can select all profiles" ON public.profiles;
CREATE POLICY "Admins can select all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (
  id = auth.uid()
  OR EXISTS (
    SELECT 1 FROM public.profiles AS admin_profile
    WHERE admin_profile.id = auth.uid()
    AND admin_profile.role = 'admin'
  )
);
