// ─────────────────────────────────────────────────────────────────────────────
//  SUPABASE CONFIGURATION
//  See SETUP.md for step-by-step instructions.
//
//  1. Go to https://supabase.com → create a free account + project
//  2. Project Settings → API → copy "Project URL" and "anon / public" key
//  3. Paste them below
// ─────────────────────────────────────────────────────────────────────────────
const SUPABASE_URL      = "https://tmqarlsaokfzalduezdf.supabase.co";   // e.g. "https://abcxyz.supabase.co"
const SUPABASE_ANON_KEY = "sb_publishable_DAtMk7ZAzJRnkLsHygfF2Q_NuGxqlel";   // your anon/public API key


// ─────────────────────────────────────────────────────────────────────────────
//  SITE-WIDE SETTINGS
//  Events are now managed in the Supabase database (see admin.html).
//  Only edit this file when you want to change global site settings.
// ─────────────────────────────────────────────────────────────────────────────
const SITE = {
  name:        "Seattle Tour De Pints",
  tagline:     "Seattle's friendliest cycling & craft beer crawl. Free to join, always fun.",
  contactEmail:"hello@tourdeseattle.example.com",   // ← update this

  // Global donate links shown on the homepage donate section.
  // Per-event donate links are stored in the database.
  donateLinks: [
    { label: "PayPal",   icon: "💳", url: "" },   // ← paste your PayPal.me URL
    { label: "Venmo",    icon: "📱", url: "" },   // ← paste your Venmo profile URL
    { label: "GoFundMe", icon: "🚀", url: "" },   // ← paste your GoFundMe URL
  ],
};
