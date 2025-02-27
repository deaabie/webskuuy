
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vgxewywkaetxpjgzhxee.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZneGV3eXdrYWV0eHBqZ3poeGVlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA2NTg1MDUsImV4cCI6MjA1NjIzNDUwNX0.qkoWMH7E4_KsoFDM9bBIvQCsquNYCHS0M8PhbPuLIRU';

export const supabase = createClient(supabaseUrl, supabaseKey);
