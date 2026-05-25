# Blorp Atelier _(blorp)_

[![standard-readme compliant](https://img.shields.io/badge/readme%20style-standard-brightgreen.svg)](https://github.com/RichardLitt/standard-readme)
[![Next.js](https://img.shields.io/badge/Next.js-16.2.6-black?logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19.2.4-61DAFB?logo=react)](https://react.dev)
[![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E?logo=supabase)](https://supabase.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-06B6D4?logo=tailwindcss)](https://tailwindcss.com)

A modern, full-stack luxury e-commerce boutique with curated style drops.

Blorp Atelier is a premium online shopping platform built with Next.js 16, React 19, and Supabase. It delivers a curated shopping experience across six product categories — handbags, watches, jewelry, accessories, clothing, and shoes — featuring a dark-mode-first UI, real-time notifications, infinite scroll pagination, and a complete admin dashboard with analytics, inventory management, and order fulfillment.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [Security](#security)
- [Install](#install)
- [Usage](#usage)
- [Deployment](#deployment)
- [Maintainers](#maintainers)
- [Contributing](#contributing)
- [License](#license)

## Features

### Shopping Experience

- **Hero Carousel** — Showcases newly arrived products with smooth auto-play animations powered by Embla Carousel.
- **Product Categories** — Browse six curated categories (Handbags, Watches, Jewelry, Accessories, Clothing, Shoes) with representative product imagery.
- **Product Detail Pages** — Full product view with image gallery, pricing (with sale price support), stock availability, size/variant selection, and related products.
- **Infinite Scroll Pagination** — Products page loads 20 items at a time with seamless infinite scroll for a smooth browsing experience.
- **Add to Cart** — Instant client-side cart with stock-aware quantity clamping, powered by Zustand state management.
- **Cart Drawer** — Slide-out cart sheet with real-time quantity adjustments, price calculations, and checkout CTA.
- **Product Reviews** — Authenticated users who completed an order can leave star ratings and comments on products.

### Authentication & Accounts

- **Supabase Auth** — Email/password authentication with session management via `@supabase/ssr`.
- **Global Auth Context** — React context provider ensures flicker-free, synchronous auth state across all client components.
- **Role-Based Access** — Admin and user roles enforced at both the UI and database (RLS) levels.
- **User Profiles** — Manage saved shipping addresses (Philippine address cascading selector) and payment methods.
- **Order History** — View past orders with status tracking.

### Real-Time Notifications

- **User Notifications** — Order status updates, new product announcements, and discount alerts.
- **Admin Notifications** — Automated alerts for new product reviews via database triggers.
- **Notification Dropdown** — Bell icon in the header with unread badge and mark-as-read functionality.

### Admin Dashboard

- **Analytics Overview** — Revenue metrics, order counts, and product statistics at a glance.
- **Product Inventory Management** — Full CRUD operations for products with image upload to Supabase Storage.
  - **Add Product Modal** — Create new products via a polished pop-up dialog with image preview.
  - **Edit Product Modal** — In-line editing with category, pricing, stock, and sale price controls.
  - **Delete Products** — Remove products with confirmation.
- **Order Fulfillment** — View and manage customer orders, update order statuses.
- **Stock Management** — Database-level stock deduction triggers with insufficient inventory validation.

### Design & UX

- **Dark Mode** — Full dark/light theme toggle with system preference detection and `localStorage` persistence.
- **Premium Typography** — Playfair Display for headings, Geist Sans for body text.
- **Responsive Design** — Fully responsive layout from mobile to desktop.
- **Mobile Navigation Drawer** — Comprehensive slide-out menu with all navigation links, account controls, and category browsing.
- **Micro-Animations** — Framer Motion powered transitions and hover effects throughout the UI.
- **Glassmorphism & Gradients** — Modern visual aesthetic with backdrop blur effects and smooth color gradients.

## Tech Stack

| Layer          | Technology                                                                        |
| -------------- | --------------------------------------------------------------------------------- |
| **Framework**  | [Next.js 16](https://nextjs.org) (App Router, Turbopack)                         |
| **UI Library** | [React 19](https://react.dev)                                                    |
| **Language**   | [TypeScript 5](https://www.typescriptlang.org)                                   |
| **Styling**    | [Tailwind CSS 4](https://tailwindcss.com) + Custom CSS Variables                 |
| **Components** | [shadcn/ui](https://ui.shadcn.com) + [Radix UI](https://radix-ui.com) Primitives |
| **Backend**    | [Supabase](https://supabase.com) (Auth, Database, Storage, RLS)                  |
| **State**      | [Zustand](https://zustand.docs.pmnd.rs) (Cart)                                   |
| **Animations** | [Framer Motion](https://www.framer.com/motion/)                                  |
| **Carousel**   | [Embla Carousel](https://www.embla-carousel.com)                                 |
| **Icons**      | [Lucide React](https://lucide.dev)                                               |
| **Linting**    | [ESLint 9](https://eslint.org) with `eslint-config-next`                         |

## Project Structure

```
blorp/
├── app/                              # Next.js App Router pages
│   ├── admin/                        # Admin dashboard (analytics, products, orders)
│   │   ├── page.tsx                  # Admin tabs layout
│   │   ├── actions.ts                # Server actions (CRUD products, orders)
│   │   ├── product-list.tsx          # Product inventory with edit/add modals
│   │   ├── create-product-form.tsx   # New product form (standalone & modal)
│   │   ├── admin-analytics.tsx       # Revenue & metrics dashboard
│   │   └── orders-fulfillment.tsx    # Order management panel
│   ├── auth/                         # Auth callback handling
│   ├── checkout/                     # Checkout flow & payment
│   │   ├── page.tsx                  # Checkout page
│   │   ├── checkout-form.tsx         # Multi-step checkout form
│   │   └── actions.ts               # Order placement server actions
│   ├── login/                        # Login/signup page
│   ├── order-success/                # Post-checkout confirmation
│   ├── products/                     # Product catalog
│   │   ├── page.tsx                  # All products with infinite scroll
│   │   ├── actions.ts               # Product fetching server actions
│   │   └── [id]/                    # Dynamic product detail page
│   │       ├── page.tsx             # Product detail view
│   │       ├── add-to-cart-button.tsx # Cart interaction component
│   │       ├── review-form.tsx      # Product review submission
│   │       └── actions.ts          # Product-specific server actions
│   ├── profile/                      # User profile & settings
│   ├── layout.tsx                    # Root layout with AuthProvider
│   ├── page.tsx                      # Home page
│   └── globals.css                   # Global styles & design tokens
├── components/                       # Shared React components
│   ├── ui/                           # shadcn/ui base components
│   ├── auth-context.tsx              # Global auth state provider
│   ├── site-header.tsx               # Navigation bar + mobile drawer
│   ├── site-footer.tsx               # Footer with links & branding
│   ├── cart-sheet.tsx                # Slide-out cart drawer
│   ├── hero-carousel.tsx             # Home page hero section
│   ├── product-categories-section.tsx # Category grid
│   ├── handbag-category-section.tsx  # Featured handbags
│   ├── call-to-action-section.tsx    # CTA banner
│   ├── notifications-dropdown.tsx    # Notification bell dropdown
│   ├── infinite-scroll-products.tsx  # Infinite scroll product grid
│   └── philippine-address-cascader.tsx # PH address picker
├── store/                            # Client-side state
│   └── cart.ts                       # Zustand cart store
├── utils/                            # Utility functions
│   └── supabase/                     # Supabase client helpers (server & client)
├── types/                            # TypeScript type definitions
│   └── supabase.ts                   # Auto-generated Supabase types
├── supabase/                         # Database management
│   └── migrations/                   # SQL migration files
├── public/                           # Static assets (logos, favicons)
├── package.json
├── tsconfig.json
└── next.config.ts
```

## Database Schema

The app uses **Supabase (PostgreSQL)** with the following core tables:

| Table             | Description                                                    |
| ----------------- | -------------------------------------------------------------- |
| `categories`      | Product categories (handbags, watches, jewelry, etc.)          |
| `products`        | Product catalog with pricing, stock, images, and sale prices   |
| `orders`          | Customer orders with status tracking and shipping info         |
| `order_items`     | Individual items within an order                               |
| `reviews`         | Product reviews with star ratings (1–5) and comments           |
| `notifications`   | User and admin notifications with read status                  |
| `profiles`        | User profiles with role-based access (user/admin)              |
| `saved_addresses` | Saved Philippine shipping addresses per user                   |
| `saved_payments`  | Saved payment methods per user                                 |

Key database features:

- Row Level Security (RLS) on all tables.
- Database triggers for admin notifications on new reviews.
- Stock deduction trigger with insufficient inventory validation.
- Supabase Storage bucket for product images.

## Security

- **Row Level Security (RLS)** — All database tables enforce access control at the Supabase/Postgres level.
- **Server Actions** — Secure form submissions and data mutations via Next.js Server Actions.
- **Defensive Queries** — User-scoped database queries to prevent data leakage.
- **Stock Integrity** — Database trigger (`fn_deduct_product_stock`) validates and deducts inventory atomically.

## Install

### Prerequisites

- [Node.js](https://nodejs.org) 18.17 or later
- [npm](https://www.npmjs.com/), [yarn](https://yarnpkg.com/), or [pnpm](https://pnpm.io/)
- A [Supabase](https://supabase.com) project

### Steps

1. Clone the repository:

```bash
git clone https://github.com/JakeNLelis/blorp.git
cd blorp
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Run the SQL migration files in order from `supabase/migrations/` against your Supabase project, either through the Supabase SQL Editor or using the Supabase CLI:

```bash
supabase db push
```

## Usage

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app in your browser.

### Available Scripts

| Command         | Description                  |
| --------------- | ---------------------------- |
| `npm run dev`   | Start the development server |
| `npm run build` | Build the production bundle  |
| `npm run start` | Start the production server  |
| `npm run lint`  | Run ESLint checks            |

## Deployment

The easiest way to deploy Blorp Atelier is on [Vercel](https://vercel.com):

1. Push your code to GitHub.
2. Import the repository on [Vercel](https://vercel.com/new).
3. Add the environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`).
4. Deploy.

For other platforms, refer to the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying).

## Maintainers

- **Jake & Lelis** — [@JakeNLelis](https://github.com/JakeNLelis)

## Contributing

This project is not currently accepting external contributions. If you find a bug or have a feature request, please [open an issue](https://github.com/JakeNLelis/blorp/issues).

## License

This project is private and not currently licensed for public distribution.
