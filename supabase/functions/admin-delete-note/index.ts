// Supabase Edge Function · admin-delete-note
// Deploy:
//   npx supabase functions deploy admin-delete-note --project-ref ahisxvdbfjhhllysystl
// Secrets (server-side only — never put in Vite):
//   npx supabase secrets set ADMIN_PIN=... --project-ref ahisxvdbfjhhllysystl
// SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY are provided automatically to Edge Functions.
//
// POST /functions/v1/admin-delete-note
// Body: { "id": "<uuid>", "pin": "<string>" }
// Real auth: pin must match Deno.env ADMIN_PIN (or ADMIN_SECRET).

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const ALLOWED_ORIGINS = [
  'https://khotkhwam-thaen-jai.vercel.app',
  'http://localhost:5174',
]

function corsHeaders(req: Request): HeadersInit {
  const origin = req.headers.get('Origin') ?? ''
  const allow = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0]
  return {
    'Access-Control-Allow-Origin': allow,
    'Access-Control-Allow-Headers':
      'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  }
}

function json(
  req: Request,
  status: number,
  body: Record<string, unknown>,
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders(req),
      'Content-Type': 'application/json',
    },
  })
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders(req) })
  }

  if (req.method !== 'POST') {
    return json(req, 405, { error: 'method_not_allowed' })
  }

  let payload: { id?: unknown; pin?: unknown }
  try {
    payload = await req.json()
  } catch {
    return json(req, 400, { error: 'invalid_json' })
  }

  const id = typeof payload.id === 'string' ? payload.id.trim() : ''
  const pin = typeof payload.pin === 'string' ? payload.pin : ''

  if (!id) {
    return json(req, 400, { error: 'missing_id' })
  }

  const expected =
    (Deno.env.get('ADMIN_PIN') ?? Deno.env.get('ADMIN_SECRET') ?? '').trim()
  if (!expected || pin.trim() !== expected) {
    return json(req, 401, { error: 'unauthorized' })
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  if (!supabaseUrl || !serviceKey) {
    return json(req, 500, { error: 'server_misconfigured' })
  }

  const admin = createClient(supabaseUrl, serviceKey)
  const { error, count } = await admin
    .from('notes')
    .delete({ count: 'exact' })
    .eq('id', id)

  if (error) {
    console.error('admin-delete-note failed', error.message)
    return json(req, 500, { error: 'delete_failed' })
  }

  if (count === 0) {
    return json(req, 404, { error: 'not_found' })
  }

  return json(req, 200, { ok: true, id })
})
