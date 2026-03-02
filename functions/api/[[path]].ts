import { Hono } from 'hono';
import { handle } from 'hono/cloudflare-pages';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

type Bindings = {
  VITE_SUPABASE_URL: string;
  VITE_SUPABASE_ANON_KEY: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  RESEND_API_KEY: string;
};

const app = new Hono<{ Bindings: Bindings }>().basePath('/api');

// Helper to get Supabase client
const getSupabase = (env: Bindings) => {
  const supabaseUrl = env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
  const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY || env.VITE_SUPABASE_ANON_KEY || 'placeholder';
  return createClient(supabaseUrl, supabaseKey);
};

// Auth Login
app.post('/auth/login', async (c) => {
  const { email, password } = await c.req.json();
  const supabase = getSupabase(c.env);
  
  try {
    const { data: admin, error } = await supabase
      .from('admins')
      .select('*')
      .eq('email', email?.toLowerCase())
      .single();

    if (!error && admin && admin.password === password) {
      return c.json({ success: true });
    } else {
      return c.json({ error: "ACCESS_DENIED :: CREDENTIAL_MISMATCH" }, 401);
    }
  } catch (err) {
    return c.json({ error: "SERVER_ERROR" }, 500);
  }
});

// Forgot Password
app.post('/auth/forgot-password', async (c) => {
  const { email } = await c.req.json();
  const supabase = getSupabase(c.env);
  
  if (!email) {
    return c.json({ error: "EMAIL_REQUIRED" }, 400);
  }

  try {
    const { data: admin, error: adminError } = await supabase
      .from('admins')
      .select('id')
      .eq('email', email.toLowerCase())
      .single();

    if (adminError || !admin) {
      return c.json({ error: "ADMIN_ID_NOT_FOUND" }, 404);
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    await supabase
      .from('password_resets')
      .insert([{ email: email.toLowerCase(), code, expires }]);

    const resendKey = c.env.RESEND_API_KEY;
    
    if (!resendKey) {
      console.warn("RESEND_API_KEY not found. Code is:", code);
      return c.json({ 
        success: true, 
        message: "Simulation: Check server logs for the code.",
        simulated: true,
        code: code 
      });
    }

    const resend = new Resend(resendKey);
    await resend.emails.send({
      from: 'Zentriq Logistics <onboarding@resend.dev>',
      to: [email],
      subject: 'SECURE_VERIFICATION_CODE :: Zentriq Nexus',
      html: `
        <div style="font-family: monospace; background-color: #050505; color: #ffffff; padding: 40px; border: 1px solid #A61A1A;">
          <h1 style="color: #A61A1A; text-transform: uppercase; letter-spacing: 0.5em;">Verification Required</h1>
          <p style="letter-spacing: 0.1em; line-height: 1.6;">A password reset has been requested. Use the following tactical code to verify your identity:</p>
          <div style="background-color: #111; padding: 20px; border-left: 4px solid #A61A1A; margin: 20px 0;">
            <p style="margin: 0; font-size: 32px; font-weight: bold; letter-spacing: 0.3em; color: #A61A1A;">${code}</p>
          </div>
          <p style="font-size: 10px; color: #444; margin-top: 40px;">SECURED BY ZENTRIQ CIPHER-8 // CODE EXPIRES IN 10 MINUTES</p>
        </div>
      `,
    });

    return c.json({ success: true });
  } catch (err) {
    console.error("Server error:", err);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// Verify Code
app.post('/auth/verify-code', async (c) => {
  const { email, code } = await c.req.json();
  const supabase = getSupabase(c.env);
  
  try {
    const { data: stored, error } = await supabase
      .from('password_resets')
      .select('*')
      .eq('email', email?.toLowerCase())
      .eq('code', code)
      .gt('expires', new Date().toISOString())
      .order('createdAt', { ascending: false })
      .limit(1)
      .single();

    if (!error && stored) {
      return c.json({ success: true });
    } else {
      return c.json({ error: "INVALID_OR_EXPIRED_CODE" }, 400);
    }
  } catch (err) {
    return c.json({ error: "SERVER_ERROR" }, 500);
  }
});

// Reset Password
app.post('/auth/reset-password', async (c) => {
  const { email, code, newPassword } = await c.req.json();
  const supabase = getSupabase(c.env);
  
  try {
    const { data: stored, error: verifyError } = await supabase
      .from('password_resets')
      .select('*')
      .eq('email', email?.toLowerCase())
      .eq('code', code)
      .gt('expires', new Date().toISOString())
      .order('createdAt', { ascending: false })
      .limit(1)
      .single();

    if (!verifyError && stored) {
      const { error: updateError } = await supabase
        .from('admins')
        .update({ password: newPassword })
        .eq('email', email.toLowerCase());

      if (updateError) throw updateError;

      await supabase
        .from('password_resets')
        .delete()
        .eq('email', email.toLowerCase());

      return c.json({ success: true });
    } else {
      return c.json({ error: "VERIFICATION_FAILED" }, 400);
    }
  } catch (err) {
    return c.json({ error: "SERVER_ERROR" }, 500);
  }
});

// Test Env
app.get('/test-env', async (c) => {
  return c.json({
    VITE_SUPABASE_URL: !!c.env.VITE_SUPABASE_URL,
    VITE_SUPABASE_ANON_KEY: !!c.env.VITE_SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_ROLE_KEY: !!c.env.SUPABASE_SERVICE_ROLE_KEY,
    RESEND_API_KEY: !!c.env.RESEND_API_KEY
  });
});

export const onRequest = handle(app);
