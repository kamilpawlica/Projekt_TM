import { createClient } from '@supabase/supabase-js'

// Create a single supabase client for interacting with your database
export const supabase = createClient('https://flsvwxtuwstjhpfxekqe.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZsc3Z3eHR1d3N0amhwZnhla3FlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjQ5MTQ5NjcsImV4cCI6MjA0MDQ5MDk2N30.QJIUoM3FBhwrh436fmCsq8lmtBYpNCXj-8zHKvMLiJU')
