
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// Helper function to sanitize input and prevent XSS
function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocols
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim()
    .slice(0, 1000); // Limit length
}

// Helper function to validate email
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
}

// Helper function to validate and sanitize form data
function validateAndSanitizeFormData(data: any): ContactFormData | null {
  if (!data || typeof data !== 'object') {
    return null;
  }

  const { name, email, subject, message } = data;

  // Validate required fields
  if (!name || !email || !subject || !message) {
    return null;
  }

  // Validate email format
  if (!isValidEmail(email)) {
    return null;
  }

  // Sanitize all inputs
  return {
    name: sanitizeInput(name),
    email: sanitizeInput(email).toLowerCase(),
    subject: sanitizeInput(subject),
    message: sanitizeInput(message)
  };
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Parse the request body
    const requestData = await req.json()
    
    // Validate and sanitize form data
    const formData = validateAndSanitizeFormData(requestData);
    
    if (!formData) {
      return new Response(
        JSON.stringify({ 
          error: 'Invalid form data',
          message: 'Please provide valid name, email, subject, and message'
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      )
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Log the contact form submission (optional)
    console.log(`Contact form submission from: ${formData.email}`)

    // Here you would typically send an email using a service like SendGrid, Resend, etc.
    // For now, we'll just return a success response
    
    // You can also store the contact form submission in a database table if needed
    // const { error } = await supabase
    //   .from('contact_submissions')
    //   .insert([formData])

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Thank you for your message. We will get back to you soon!'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Contact form error:', error)
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        message: 'Something went wrong. Please try again later.'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})
