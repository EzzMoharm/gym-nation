-- Enable authenticated users to delete their own training plan subscriptions
CREATE POLICY "Users can delete own subscriptions"
  ON public.subscriptions FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
