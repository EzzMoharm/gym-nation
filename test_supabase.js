const url = "https://xxktjvsbtyouwmexsfzc.supabase.co/rest/v1/training_plans?select=*&is_active=eq.true";
const anonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4a3RqdnNidHlvdXdtZXhzZnpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMyNjQyODAsImV4cCI6MjA5ODg0MDI4MH0.AGYRHo03sBwU925wZEMColX7PKG05GPiP5lz87Of7mA";

async function test() {
  console.log("Fetching...");
  try {
    const res = await fetch(url, {
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${anonKey}`,
      },
      signal: AbortSignal.timeout(5000)
    });
    console.log("Status:", res.status);
    const text = await res.text();
    console.log("Response:", text);
  } catch (err) {
    console.error("Error:", err);
  }
}

test();
