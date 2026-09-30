-- OPTIONAL / FUTURE: admin delete for shared gallery notes.
--
-- MVP: the Vite app gates delete UI with VITE_ADMIN_PIN (client-side only —
-- NOT strong security). localStorage mode deletes work fully with PIN.
--
-- Supabase: there is intentionally NO public DELETE policy for anon.
-- Client supabase.from('notes').delete() will be blocked by RLS.
-- Prefer one of these later:
--   1) Supabase Dashboard → Table Editor → delete rows manually
--   2) Edge Function using service role (never put service key in Vite)
--   3) A secured RPC / custom claim — do NOT open delete to anon with using (true)
--
-- DO NOT enable the dangerous policy below for a public site:
--   -- create policy notes_delete_anon on public.notes
--   --   for delete to anon using (true);
--
-- This migration is documentation-only (no-op). Safe to run.

select 1;
