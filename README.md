# Zentriq Logistics - Netlify Deployment Guide

This project is optimized for deployment on [Netlify](https://www.netlify.com/).

## Prerequisites

1.  A Netlify account.
2.  The following environment variables (set them in the Netlify Dashboard under **Site settings > Build & deploy > Environment variables**):

### Build-time Variables (Required for the frontend build)
*   `GEMINI_API_KEY`: Your Google Gemini API key (used by Vite to bundle into the frontend).
*   `VITE_SUPABASE_URL`: Your Supabase project URL.
*   `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key.

### Runtime Variables (Required for the backend functions)
*   `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key.
*   `RESEND_API_KEY`: Your Resend API key for sending emails.
*   `VITE_SUPABASE_URL`: (Also needed by the backend).
*   `VITE_SUPABASE_ANON_KEY`: (Also needed by the backend).

## Deployment Steps

### Option 1: Netlify CLI (Recommended for fast deployment)

1.  Install Netlify CLI: `npm install -g netlify-cli`
2.  Login: `netlify login`
3.  Initialize: `netlify init`
4.  Deploy: `netlify deploy --build --prod`

### Option 2: Git Integration (Continuous Deployment)

1.  Push your code to a Git repository (GitHub, GitLab, or Bitbucket).
2.  Connect your repository to Netlify.
3.  Netlify will automatically detect the `netlify.toml` file and configure the build settings:
    *   **Build command:** `npm run build`
    *   **Publish directory:** `dist`
    *   **Functions directory:** `netlify/functions`

## Architecture

*   **Frontend:** React + Vite (served as static files from `dist`).
*   **Backend:** Express.js (running as a Netlify Function via `serverless-http`).
*   **Routing:** 
    *   `/api/*` is routed to the Netlify Function.
    *   All other routes are handled by the React SPA.
