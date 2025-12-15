import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ionzuufgafcabubozgwj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlvbnp1dWZnYWZjYWJ1Ym96Z3dqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU3Njk3MTAsImV4cCI6MjA4MTM0NTcxMH0.VCZb4e_JJtKUeuddLFCtHMb6y-nCK9Ok0On7J4Z02jg';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
