import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://rgbkippzdzrcaemzpdeg.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJnYmtpcHB6ZHpyY2FlbXpwZGVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYwNjEyODgsImV4cCI6MjA2MTYzNzI4OH0.ImM_0XtiJQTSsViDpR3JvBQigMJ6-avpcGp0QceFCRM'

export const supabase = createClient(supabaseUrl, supabaseKey)
