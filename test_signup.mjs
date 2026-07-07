import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://xxktjvsbtyouwmexsfzc.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4a3RqdnNidHlvdXdtZXhzZnpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMyNjQyODAsImV4cCI6MjA5ODg0MDI4MH0.AGYRHo03sBwU925wZEMColX7PKG05GPiP5lz87Of7mA'
const supabase = createClient(supabaseUrl, supabaseKey)

async function testSignup() {
  console.log('Attempting signup...');
  const { data, error } = await supabase.auth.signUp({
    email: 'test_user_12345@gmail.com',
    password: 'password12345',
    options: {
      data: {
        full_name: 'Test User'
      }
    }
  });

  if (error) {
    console.error('Error:', error.message);
  } else {
    console.log('Success!', data);
  }
}

testSignup();
