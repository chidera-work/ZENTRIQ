import express from "express";
import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase for Server-side
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || 'placeholder';
const supabase = createClient(supabaseUrl, supabaseKey);

const app = express();
app.use(express.json());

// API Routes
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const { data: admin, error } = await supabase
      .from('admins')
      .select('*')
      .eq('email', email?.toLowerCase())
      .single();

    if (!error && admin && admin.password === password) {
      res.json({ success: true });
    } else {
      res.status(401).json({ error: "ACCESS_DENIED :: CREDENTIAL_MISMATCH" });
    }
  } catch (err) {
    res.status(500).json({ error: "SERVER_ERROR" });
  }
});

app.post("/api/auth/forgot-password", async (req, res) => {
  const { email } = req.body;
  
  if (!email) {
    return res.status(400).json({ error: "EMAIL_REQUIRED" });
  }

  try {
    // Check if admin exists
    const { data: admin, error: adminError } = await supabase
      .from('admins')
      .select('id')
      .eq('email', email.toLowerCase())
      .single();

    if (adminError || !admin) {
      return res.status(404).json({ error: "ADMIN_ID_NOT_FOUND" });
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    // Store reset code in DB
    await supabase
      .from('password_resets')
      .insert([{ email: email.toLowerCase(), code, expires }]);

    const resendKey = process.env.RESEND_API_KEY;
    
    if (!resendKey) {
      console.warn("RESEND_API_KEY not found. Code is:", code);
      return res.json({ 
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

    res.json({ success: true });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/auth/verify-code", async (req, res) => {
  const { email, code } = req.body;
  
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
      res.json({ success: true });
    } else {
      res.status(400).json({ error: "INVALID_OR_EXPIRED_CODE" });
    }
  } catch (err) {
    res.status(500).json({ error: "SERVER_ERROR" });
  }
});

app.post("/api/auth/reset-password", async (req, res) => {
  const { email, code, newPassword } = req.body;
  
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
      // Update admin password
      const { error: updateError } = await supabase
        .from('admins')
        .update({ password: newPassword })
        .eq('email', email.toLowerCase());

      if (updateError) throw updateError;

      // Clean up reset codes
      await supabase
        .from('password_resets')
        .delete()
        .eq('email', email.toLowerCase());

      res.json({ success: true });
    } else {
      res.status(400).json({ error: "VERIFICATION_FAILED" });
    }
  } catch (err) {
    res.status(500).json({ error: "SERVER_ERROR" });
  }
});

export default app;
