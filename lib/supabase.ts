import { createClient } from '@supabase/supabase-js'

// These would typically come from environment variables
// For now, they're placeholders that should be configured by the user
const supabaseUrl = process.env.PLASMO_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.PLASMO_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
