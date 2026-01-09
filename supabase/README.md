CardPulse Supabase setup

1) Create a new Supabase project (region: Singapore if available).
2) In the Supabase SQL editor, run `supabase/schema.sql`.
3) Grab keys from Project Settings -> API:
   - Project URL -> NEXT_PUBLIC_SUPABASE_URL
   - anon public key -> NEXT_PUBLIC_SUPABASE_ANON_KEY
   - service role key -> SUPABASE_SERVICE_ROLE_KEY (server-only)
4) Set secrets locally in `.env.local` and in Vercel:

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
CARDPULSE_ADMIN_PASSWORD=

Notes:
- Service role is used on the server to bypass RLS for admin/interest operations.
- Public reads are allowed only for PUBLISHED events.
