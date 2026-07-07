import { createClient } from '@supabase/supabase-js'
const supabase = createClient('https://xxktjvsbtyouwmexsfzc.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4a3RqdnNidHlvdXdtZXhzZnpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMyNjQyODAsImV4cCI6MjA5ODg0MDI4MH0.AGYRHo03sBwU925wZEMColX7PKG05GPiP5lz87Of7mA')
async function run() {
  const { error } = await supabase.auth.signInWithPassword({ email: 'fake@example.com', password: 'password123' });
  console.log('Login error:', error?.message);
}
run();
