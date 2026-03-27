# Technical Documentation

This doc goes a bit deeper into how the BOCRA app actually works under the hood. It's meant for developers who need to maintain or extend the codebase.

## 1. Architecture

We're using the **Next.js 16 App Router**. Most of the application relies on React Server Components (RSC) to keep the client bundle small. When we need interactivity (like charts or forms), we drop a `"use client"` directive at the top of the file.

For data mutations (like saving an admin setting or submitting a complaint), we use Next.js Server Actions (inside `src/app/admin/actions.ts`) instead of building out traditional `/api` endpoints. This makes it really easy to instantly revalidate the cache (`revalidatePath`) after a database update.

## 2. The Design System

Instead of relying on generic Tailwind colors, we defined strict CSS variables in `globals.css` that map to BOCRA's four regulatory sectors:

- `--bocra-blue`: Telecoms (Primary)
- `--bocra-yellow`: Broadcasting
- `--bocra-green`: Internet / ICT
- `--bocra-red`: Postal Services

These are registered as Tailwind theme extensions, so you can just use classes like `text-bocra-blue` or `bg-bocra-yellow`. 

**Usage rule of thumb:** 
Major page wrappers (like the Header and Footer) use a 4-color gradient strip. Inner pages typically highlight their specific sector. For example, the Domains page leans heavily on `bocra-green` because domains fall under Internet/ICT.

## 3. Database & Auth

We use **Supabase** for the database and **NextAuth** for sessions. 

### Database Schema
You can find the raw SQL in `supabase/schema.sql`. The main tables are:
- `profiles`: Holds user roles and organisation info. Tied to the auth accounts.
- `news_articles`, `public_consultations`, `cyber_alerts`: Content tables for the public site.
- `dashboard_datasets`: Stores JSON arrays that feed the public charts.
- `licence_types` & `licence_applications`: For the licensing portal.

### Security (RLS)
Security is heavily reliant on Supabase Row Level Security (RLS) policies (see `supabase/rls_policies.sql`).
- Unauthenticated users can only `SELECT` published content.
- Logged-in users can read and update their own profiles.
- Admins bypass RLS by using the Supabase Service Role Key on the server, but only after `requireAdmin()` confirms their `session.user.role` is actually 'admin'.

### NextAuth 
We use the standard Credentials/Email flow. When a user logs in, NextAuth checks the credentials, grabs their role from the `profiles` table, and stuffs it into the session JWT so that we can do quick role checks on the server.

## 4. The Admin Panel

Everything under `src/app/admin/` is the CMS.

- **Data Dashboard (`/admin/dashboard-data`)**: Instead of hardcoding chart data, this page lets admins upload raw JSON arrays for mobile growth, market share, and QoS. The `/dashboard` page just reads this JSON and dumps it straight into Recharts.
- **Licensing Approvals**: Admins can move user licence applications through their lifecycle (`submitted` -> `under_review` -> `approved`).
- **Cache Busting**: Whenever an admin saves a change (like publishing an article), the server action fires `revalidatePath('/')` to instantly flush the edge cache and show the new content to users.

## 5. Middleware & Routing

We use `src/middleware.ts` to catch requests before they hit the Node server. It handles two main things:
1. **Rate Limiting**: We have a basic token-bucket rate limiter that restricts hits to `/admin` and auth routes to stop brute-forcing.
2. **Auth Checks**: If someone tries to hit a protected route like `/profile` without a valid `authjs.session-token` cookie, the middleware intercepts it and immediately redirects them to `/login`.

## 6. Random Notes

- **High-Contrast Mode**: There's an accessibility toggle in the header. It slaps a `.high-contrast` class on the `<html>` tag, which overrides the CSS variables to force pure black/white combinations.
- **Tab Switching on Charts**: The charts on `/dashboard` are heavy to render. Instead of conditionally rendering the components in React (which unmounts and remounts them), we keep them in the DOM and use CSS `display: block` or `hidden` to toggle tabs. It makes the UI feel infinitely faster.
