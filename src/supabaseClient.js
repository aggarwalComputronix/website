import { createClient } from '@supabase/supabase-js';

// Replace these with your actual Supabase project URL and public key
const supabaseUrl = 'https://iwcrpoekwcoozximlcpg.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml3Y3Jwb2Vrd2Nvb3p4aW1sY3BnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkwNjExMjUsImV4cCI6MjA3NDYzNzEyNX0.v4XsWWYIK8mJo372dxJfqyZxlZxaIlEUa4rYnBMdiYA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);