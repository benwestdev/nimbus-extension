import { createClient } from '@supabase/supabase-js'

// These would typically come from environment variables
// For now, they're placeholders that should be configured by the user
const supabaseUrl = process.env.PLASMO_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.PLASMO_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key'

// Check if we have real Supabase credentials
export const hasSupabaseConfig = 
  process.env.PLASMO_PUBLIC_SUPABASE_URL && 
  process.env.PLASMO_PUBLIC_SUPABASE_ANON_KEY &&
  !process.env.PLASMO_PUBLIC_SUPABASE_URL.includes('placeholder') &&
  !process.env.PLASMO_PUBLIC_SUPABASE_ANON_KEY.includes('placeholder')

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
