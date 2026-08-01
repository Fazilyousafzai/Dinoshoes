# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Next.js 16, TypeScript, Tailwind CSS 4, Supabase, and Vercel.

## Users

Primary users are mobile-first football players and buyers shopping for match and training gear. A store administrator manages products, stock, imagery, and customer reviews from mobile or desktop.

## Product Purpose

Sell football studs, grippers, socks, and footballs through a fast storefront. Success means shoppers can discover products, choose options, add items to a cart, and leave reviews, while the administrator can keep the catalog current without developer help.

## Positioning

The store treats buying gear like preparing for match day: category-first discovery, useful product detail, and a direct path from browsing to a ready kit.

## Operating Context

Customers commonly browse on phones. The administrator may create products from a phone and must be able to select multiple library images or use the camera. Customer reviews enter a moderation queue before appearing publicly.

## Capabilities and Constraints

- Four catalog categories: Football Studs, Grippers, Socks, and Footballs.
- Product create, edit, archive or delete, image upload, stock, price, category, sizes, and featured status.
- Multiple product images selected from a device library or captured with a camera.
- Customer review submission with admin approval or rejection.
- Mobile-first responsive storefront and admin panel.
- Fast, secure deployment on Vercel with Supabase as the data, authentication, and storage layer.
- Currency, shipping regions, payment provider, tax rules, and production brand name remain open commercial decisions. Demo content must not be mistaken for final commercial data.

## Evidence on Hand

No logo, product photography, catalog data, testimonials, prices, payment credentials, or legal copy were supplied. All seeded catalog content and generated imagery are demonstration material to replace before launch.

## Product Principles

- Make the next useful action obvious on a phone.
- Keep catalog operations possible without a laptop.
- Show real product context before asking for purchase.
- Treat moderation, permissions, and row-level security as launch requirements.
- Preserve speed through server rendering, optimized images, and small client interaction islands.

## Accessibility & Inclusion

Target WCAG 2.2 AA, keyboard-complete operation, visible focus states, reduced-motion support, readable contrast, and touch targets of at least 44 by 44 pixels.
