import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.VUE_APP_SUPABASE_URL || process.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey =
  process.env.VUE_APP_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || ''
const supabaseFunctionAnonKey =
  process.env.VUE_APP_SUPABASE_FUNCTION_ANON_KEY ||
  process.env.VITE_SUPABASE_FUNCTION_ANON_KEY ||
  ''

export const supabaseConfig = {
  supabaseUrl,
  supabaseAnonKey,
  supabaseFunctionAnonKey
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
