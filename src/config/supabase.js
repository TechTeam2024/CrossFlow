import { createClient } from '@supabase/supabase-js'

// Supabase configuration
// Get these from: https://app.supabase.com/project/_/settings/api

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Validate environment variables
if (!supabaseUrl || supabaseUrl === 'YOUR_SUPABASE_URL') {
  console.error('❌ VITE_SUPABASE_URL is not set in environment variables')
  console.log('Available env vars:', import.meta.env)
  throw new Error('Missing VITE_SUPABASE_URL environment variable. Please check your Vercel environment settings.')
}

if (!supabaseAnonKey || supabaseAnonKey === 'YOUR_SUPABASE_ANON_KEY') {
  console.error('❌ VITE_SUPABASE_ANON_KEY is not set in environment variables')
  throw new Error('Missing VITE_SUPABASE_ANON_KEY environment variable. Please check your Vercel environment settings.')
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database table schema for reference:
// 
// Table: access_keys
// Columns:
//   - id: uuid (primary key)
//   - key: text (unique, indexed)
//   - user_id: text
//   - is_used: boolean (default: false)
//   - used_at: timestamp
//   - used_by_device: text (device fingerprint)
//   - created_at: timestamp (default: now())
//
// Create this table in Supabase SQL Editor:
/*
CREATE TABLE access_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  user_id TEXT NOT NULL,
  is_used BOOLEAN DEFAULT false,
  used_at TIMESTAMP,
  used_by_device TEXT,
  created_at TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_access_keys_key ON access_keys(key);
CREATE INDEX idx_access_keys_is_used ON access_keys(is_used);

-- Insert sample access keys
INSERT INTO access_keys (key, user_id) VALUES
  ('ACCESS-123', 'temp1-11'),
  ('ACCESS-456', 'temp4-2'),
  ('ACCESS-789', 'temp2'),
  ('CFK-2024-M3N4O5P6', 'user-demo'),
  ('CFK-2024-Q7R8S9T0', 'test-user');
*/
