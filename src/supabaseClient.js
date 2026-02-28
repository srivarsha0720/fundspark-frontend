import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://atnhicltjrorhskvxyxn.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF0bmhpY2x0anJvcmhza3Z4eXhuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIwMTY4NDEsImV4cCI6MjA4NzU5Mjg0MX0.M92uMG2Nda1E6kIXNKa3vDAHtcfDYT58UO1yRKgDgHE";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);