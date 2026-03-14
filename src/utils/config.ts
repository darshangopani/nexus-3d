// ============================================================
// src/utils/config.ts
// Centralised, type-safe access to all environment variables.
// - VITE_ prefixed keys are available in the browser bundle.
// - Keys WITHOUT VITE_ are server/backend only (Express API routes).
// ============================================================

// ─── Helper ──────────────────────────────────────────────────────────────────
function requireEnv(key: string): string {
  const value = import.meta.env[key] ?? (typeof process !== "undefined" ? process.env[key] : undefined);
  if (!value || value.startsWith("YOUR_")) {
    console.warn(`[config] ⚠️  Missing env var: ${key}. Add it to your .env file.`);
    return "";
  }
  return value;
}

// ─── Google / Gemini ─────────────────────────────────────────────────────────
export const GEMINI_API_KEY = requireEnv("VITE_GEMINI_API_KEY");

// Google Document AI — server-side only
export const GOOGLE_DOC_AI = {
  projectId: import.meta.env.VITE_GOOGLE_DOCUMENT_AI_PROJECT_ID ?? "",
  location: import.meta.env.VITE_GOOGLE_DOCUMENT_AI_LOCATION ?? "us",
  processorId: import.meta.env.VITE_GOOGLE_DOCUMENT_AI_PROCESSOR_ID ?? "",
};

// ─── Anthropic Claude ────────────────────────────────────────────────────────
// ⚠️  Do NOT use ANTHROPIC_API_KEY directly in browser code.
// Call it only from your Express server routes (src/server/ or api/).
export const ANTHROPIC_API_KEY = requireEnv("VITE_ANTHROPIC_API_KEY");

// ─── OpenAI ──────────────────────────────────────────────────────────────────
// ⚠️  Server-side only.
export const OPENAI_API_KEY = requireEnv("VITE_OPENAI_API_KEY");

// ─── DeepSeek ────────────────────────────────────────────────────────────────
// Base URL: https://api.deepseek.com  (OpenAI-compatible SDK)
// ⚠️  Server-side only.
export const DEEPSEEK_API_KEY = requireEnv("VITE_DEEPSEEK_API_KEY");
export const DEEPSEEK_BASE_URL = "https://api.deepseek.com";

// ─── Adobe PDF Extract ───────────────────────────────────────────────────────
// ⚠️  Server-side only.
export const ADOBE_CLIENT_ID = requireEnv("VITE_ADOBE_CLIENT_ID");
export const ADOBE_CLIENT_SECRET = requireEnv("VITE_ADOBE_CLIENT_SECRET");

// ─── Supabase ──────────────────────────────────────────────────────────────
export const SUPABASE_URL = requireEnv("VITE_SUPABASE_URL");
export const SUPABASE_ANON_KEY = requireEnv("VITE_SUPABASE_ANON_KEY");

// ─── App ─────────────────────────────────────────────────────────────────────
export const APP_URL = import.meta.env.VITE_APP_URL ?? "http://localhost:3000";

// ─── Adsterra ────────────────────────────────────────────────────────────────
export const ADSTERRA_KEY = requireEnv("VITE_ADSTERRA_KEY");

// ─── AI Model Names (latest as of Mar 2026) ──────────────────────────────────
export const AI_MODELS = {
  gemini: "gemini-2.5-pro-preview",      // Google Gemini
  claude: "claude-3-5-sonnet-20241022",  // Anthropic — best balance
  gpt:    "gpt-4o",                      // OpenAI
  o3:     "o3",                          // OpenAI reasoning model
  deepseek: "deepseek-chat",             // DeepSeek V3
} as const;
