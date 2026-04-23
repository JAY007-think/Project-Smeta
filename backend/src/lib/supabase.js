const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

let supabase;

if (supabaseUrl && supabaseUrl.startsWith("http")) {
  supabase = createClient(supabaseUrl, supabaseKey);
} else {
  console.warn("⚠️ [Supabase Proxy]: Invalid or missing URL. Persistent storage is DISABLED.");
  // Mock object to prevent crashes in controllers
  supabase = {
    from: () => ({
      insert: () => Promise.resolve({ error: null }),
      select: () => ({ order: () => Promise.resolve({ data: [], error: null }) }),
      update: () => ({ eq: () => ({ select: () => Promise.resolve({ data: null, error: null }) }) }),
    })
  };
}

module.exports = { supabase };
