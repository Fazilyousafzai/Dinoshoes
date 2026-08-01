# HALFSPACE Football Store

A mobile-first Next.js 16 ecommerce starter for football studs, grippers, socks, and footballs. It includes a customer storefront, favourites, kit builder, cart, pending-order checkout, moderated reviews, and a mobile-ready admin panel with multi-image library and camera upload.

The application runs immediately in local demo mode. Add Supabase to turn on shared data, authentication, storage, and row-level security.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. The admin panel is available at `http://localhost:3000/admin`.

## Connect Supabase

1. Create a Supabase project.
2. Run `supabase/migrations/202608010001_initial.sql` in the SQL editor or through the Supabase CLI.
3. Optionally run `supabase/seed.sql` for four starter products.
4. Copy `.env.example` to `.env.local` and add the project URL and publishable key.
5. Create an authentication user in Supabase.
6. Promote that user to admin in the SQL editor:

```sql
update public.profiles
set role = 'admin'
where id = 'YOUR_AUTH_USER_UUID';
```

Once the environment variables exist, `/admin` requires sign-in. Database row-level security remains the final authority for all catalog and moderation writes.

## Security model

- Public users can read active products and approved reviews.
- Public users can submit only pending reviews.
- Only profiles with `role = 'admin'` can create, edit, archive, or delete products and moderate reviews.
- Product image uploads are restricted to admins and capped at 10 MB per file.
- Checkout calls `place_order`, which locks product rows, validates size and stock, recalculates prices in the database, and then reduces stock.
- The service role key is never used by the browser.
- The admin page verifies the role on the server. Supabase RLS verifies it again for every write.

Add rate limiting or CAPTCHA to public review submission before a high-traffic launch. Connect a payment provider, tax rules, shipping rules, transactional email, legal policy pages, and production analytics before accepting real orders.

## Deploy to Vercel

1. Import the repository into Vercel.
2. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` to the project environment variables.
3. Deploy.

The generated product imagery under `public/images` is demonstration material. Replace it with the client catalog before launch.

## Commands

```bash
npm run dev
npm run lint
npm run build
npm run start
```
