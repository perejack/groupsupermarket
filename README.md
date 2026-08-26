# Supermarket Hiring App

## Supabase setup

1. Open Supabase **SQL Editor** and run:
   - `supabase_schema.sql`

2. Create a `.env` file (see `.env.example`) and add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

3. Create an admin user (Supabase **Authentication → Users**) and then add them to `admin_users`:

```sql
insert into public.admin_users (user_id)
select id from auth.users where email = 'YOUR_ADMIN_EMAIL';
```

## Admin dashboard

Open:
- `/admin`

This project currently has `/admin` set to **public access** (no password) by allowing anonymous SELECT on the `applications` table via RLS policy in `supabase_schema.sql`.

## Email forwarding (optional)

The **Apply** page tries to forward an application to the hiring manager via `POST /api/forward-application`.

- If server-side email is **not configured**, the app falls back to opening the user's email composer (`mailto:`). Browsers do not allow auto-sending email from the client without user interaction.
- To enable auto-send on Vercel, set these **server-side** environment variables (no `VITE_` prefix):
  - `SMTP_HOST` (e.g. `smtp.gmail.com`)
  - `SMTP_PORT` (e.g. `587` or `465`)
  - `SMTP_USER`
  - `SMTP_PASS` (for Gmail this should be an App Password; paste it without spaces)
  - Optional: `SMTP_FROM`, `FORWARD_TO_EMAIL`

Local dev note: `npm run dev` runs only the Vite frontend. To test `/api/forward-application` locally, run the project through Vercel dev tooling (or deploy to Vercel).

## Delayed auto-reply (optional)

If you want the applicant to receive automatic confirmation emails **after delays** (default: **6 hours**, then **48 hours**, then **72 hours**), this project supports it using:

- A Supabase table: `pending_auto_replies`
- A scheduled HTTP call to: `GET /api/process-auto-replies`

Setup:

1. In Supabase SQL Editor, re-run `supabase_schema.sql` (it creates `pending_auto_replies`).
2. In Vercel Environment Variables (server-side), set:
   - `SUPABASE_SERVICE_ROLE_KEY` (required — from Supabase → Settings → API → service_role secret)
   - `SUPABASE_URL` (optional — defaults to the same project URL as the frontend if omitted or malformed)
   - `CRON_TOKEN` (recommended)
   - Optional: `AUTO_REPLY_DELAY_HOURS` (default 6), `AUTO_REPLY_DELAY_MINUTES` (default 0)
   - Optional: `AUTO_SELECTION_DELAY_HOURS` (default 48), `AUTO_SELECTION_DELAY_MINUTES` (default 0)
   - Optional: `AUTO_ONBOARDING_DELAY_HOURS` (default 72), `AUTO_ONBOARDING_DELAY_MINUTES` (default 0)
   - Optional: `EMPLOYEE_PORTAL_URL`, `SUPPORT_EMAIL`
   - Optional: `AUTO_REPLY_SUBJECT`
3. Deploy. Then visiting `/api/forward-application` should still show `configured: true`.

### Vercel Hobby note

Vercel Hobby accounts only allow **daily** cron schedules. For testing (e.g. every 1 minute), use an external cron service (like cron-job.org) to call:

`https://YOUR_DOMAIN/api/process-auto-replies?token=YOUR_CRON_TOKEN`

### Admin view for auto-replies

Open `/admin` → **Auto Emails** tab to view pending/sent/failed confirmation emails.

If the list is empty or shows a permission error, run the latest `supabase_schema.sql` in Supabase SQL Editor (it adds a read policy for `pending_auto_replies`).

Optional: set `ADMIN_DASHBOARD_TOKEN` on Vercel if you want to require a token for manual resend/queue API calls. If unset, those actions work without pasting a token (same as the public `/admin` dashboard).
