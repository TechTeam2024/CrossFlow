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

