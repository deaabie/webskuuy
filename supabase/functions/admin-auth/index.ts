import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import * as bcrypt from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const { action, username, password } = await req.json();

    if (action === 'login') {
      // Fetch admin user with service role key
      const { data: adminUser, error } = await supabaseClient
        .from('admin_users')
        .select('*')
        .eq('username', username.trim())
        .maybeSingle();

      if (error) {
        console.error('Database error:', error);
        return new Response(
          JSON.stringify({ success: false, error: 'Database error' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        );
      }

      if (!adminUser) {
        return new Response(
          JSON.stringify({ success: false, error: 'Invalid credentials' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
        );
      }

      // Verify password using bcrypt
      const passwordMatch = await bcrypt.compare(password.trim(), adminUser.password);

      if (!passwordMatch) {
        return new Response(
          JSON.stringify({ success: false, error: 'Invalid credentials' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
        );
      }

      // Generate session token
      const sessionToken = crypto.randomUUID();
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          sessionToken,
          username: adminUser.username 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    if (action === 'create') {
      // Check if any admin exists
      const { count } = await supabaseClient
        .from('admin_users')
        .select('*', { count: 'exact', head: true });

      if (count && count > 0) {
        return new Response(
          JSON.stringify({ success: false, error: 'Admin already exists' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        );
      }

      // Hash password with bcrypt
      const hashedPassword = await bcrypt.hash(password);

      // Create admin user
      const { error: createError } = await supabaseClient
        .from('admin_users')
        .insert({
          username: username.trim(),
          password: hashedPassword
        });

      if (createError) {
        console.error('Create error:', createError);
        return new Response(
          JSON.stringify({ success: false, error: 'Failed to create admin' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        );
      }

      return new Response(
        JSON.stringify({ success: true }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    if (action === 'check-exists') {
      const { count } = await supabaseClient
        .from('admin_users')
        .select('*', { count: 'exact', head: true });

      return new Response(
        JSON.stringify({ exists: count !== null && count > 0 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    return new Response(
      JSON.stringify({ success: false, error: 'Invalid action' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});