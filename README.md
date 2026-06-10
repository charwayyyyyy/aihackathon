# MENSAH — Luxury Tailored Menswear

A full-stack fashion e-commerce platform built with **Next.js 16** (frontend) and an independent **Express.js Campaign API** (backend). The storefront showcases luxury menswear with a premium, animated UI, while the admin dashboard provides CRUD-based campaign management to power promotional banners, discounts, and featured collections.

---

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Frontend (Next.js)](#frontend-nextjs)
- [Backend (Campaign API)](#backend-campaign-api)
- [How Frontend & Backend Work Together](#how-frontend--backend-work-together)
- [Admin Dashboard](#admin-dashboard)
- [API Reference](#api-reference)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)

---

## Overview

**MENSAH** is a luxury menswear e-commerce experience consisting of two independently running applications inside a single repository:

1. **Storefront** — A polished Next.js app with product browsing, shopping cart, campaigns, and a responsive mobile-first layout.
2. **Campaign API** — A standalone Express.js backend that manages marketing campaigns (banners, discounts, hero promotions) stored in an SQLite database via Prisma ORM.

The storefront fetches active campaigns from the API and renders them dynamically on the homepage. The admin dashboard lets authenticated users create, edit, and delete campaigns through a full CRUD interface.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Single Repository                        │
│                                                                 │
│  ┌──────────────────────────┐    ┌───────────────────────────┐  │
│  │   Next.js Frontend       │    │   Campaign API Backend    │  │
│  │   Port 3000               │    │   Port 3001               │  │
│  │                          │    │                           │  │
│  │  ┌────────────────────┐  │    │  ┌─────────────────────┐  │  │
│  │  │  Storefront Pages  │  │    │  │  Express.js Server  │  │  │
│  │  │  • Homepage        │  │    │  │  • REST API Routes  │  │  │
│  │  │  • Shop            │  │    │  │  • Zod Validation   │  │  │
│  │  │  • Collections     │  │    │  │  • CORS Enabled     │  │  │
│  │  │  • Campaign Page   │  │    │  └─────────┬───────────┘  │  │
│  │  └────────────────────┘  │    │            │              │  │
│  │                          │    │  ┌─────────▼───────────┐  │  │
│  │  ┌────────────────────┐  │    │  │  Prisma ORM         │  │  │
│  │  │  Admin Dashboard   │──┼────┼─▶│  • Campaign Model   │  │  │
│  │  │  • Campaign CRUD   │  │HTTP│  │  • SQLite Database   │  │  │
│  │  │  • Inventory       │  │    │  └─────────────────────┘  │  │
│  │  │  • Orders          │  │    │                           │  │
│  │  └────────────────────┘  │    └───────────────────────────┘  │
│  │                          │                                   │
│  │  ┌────────────────────┐  │                                   │
│  │  │  Service Layer     │  │                                   │
│  │  │  campaignService   │──┼── HTTP calls to localhost:3001    │
│  │  └────────────────────┘  │                                   │
│  │                          │                                   │
│  │  ┌────────────────────┐  │                                   │
│  │  │  State Management  │  │                                   │
│  │  │  Zustand Stores    │  │                                   │
│  │  │  • Cart Store      │  │                                   │
│  │  │  • Auth Store      │  │                                   │
│  │  │  • UI Store        │  │                                   │
│  │  │  • Order Store     │  │                                   │
│  │  └────────────────────┘  │                                   │
│  └──────────────────────────┘                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| [Next.js 16](https://nextjs.org/) | React framework with App Router & Turbopack |
| [React 19](https://react.dev/) | UI component library |
| [TypeScript](https://www.typescriptlang.org/) | Type safety |
| [Tailwind CSS 4](https://tailwindcss.com/) | Utility-first styling |
| [Framer Motion](https://www.framer.com/motion/) | Animations & transitions |
| [Zustand](https://zustand.docs.pmnd.rs/) | Lightweight state management |
| [TanStack React Query](https://tanstack.com/query) | Server state & data fetching |
| [Axios](https://axios-http.com/) | HTTP client |
| [Lucide React](https://lucide.dev/) | Icon library |

### Backend (Campaign API)
| Technology | Purpose |
|---|---|
| [Express.js](https://expressjs.com/) | HTTP server framework |
| [Prisma](https://www.prisma.io/) | ORM & database toolkit |
| [SQLite](https://www.sqlite.org/) | Lightweight file-based database |
| [Zod](https://zod.dev/) | Request body validation |
| [TypeScript](https://www.typescriptlang.org/) | Type safety |
| [CORS](https://www.npmjs.com/package/cors) | Cross-origin request handling |

---

## Project Structure

```
aihackathon/
├── src/                          # Next.js frontend source
│   ├── app/                      # App Router pages
│   │   ├── page.tsx              # Homepage (Hero, Campaigns, Products)
│   │   ├── layout.tsx            # Root layout
│   │   ├── globals.css           # Global styles & design tokens
│   │   ├── admin/                # Admin dashboard
│   │   │   ├── layout.tsx        # Admin sidebar layout
│   │   │   ├── page.tsx          # Dashboard overview
│   │   │   ├── login/page.tsx    # Admin login (password: admin123)
│   │   │   └── campaigns/page.tsx# Campaign management page
│   │   ├── shop/                 # Product listing & detail pages
│   │   ├── about/                # About page
│   │   ├── campaign/             # Campaign showcase page
│   │   ├── collections/          # Collections page
│   │   ├── contact/              # Contact page
│   │   ├── heritage/             # Brand heritage page
│   │   ├── new-arrivals/         # New arrivals page
│   │   ├── orders/               # Order tracking page
│   │   └── privacy/              # Privacy policy
│   ├── components/               # Reusable React components
│   │   ├── admin/                # Admin-specific components
│   │   │   ├── CampaignFormModal.tsx  # Create/Edit campaign form
│   │   │   ├── CampaignsTable.tsx     # Campaign list with actions
│   │   │   ├── DashboardStats.tsx     # Dashboard statistics cards
│   │   │   ├── InventoryTable.tsx     # Product inventory manager
│   │   │   └── Orders.tsx             # Order management view
│   │   ├── home/                 # Homepage sections
│   │   │   ├── CampaignBanner.tsx# Dynamic banner from Campaign API
│   │   │   ├── Hero.tsx          # Hero section
│   │   │   ├── Categories.tsx    # Category grid
│   │   │   ├── FeaturedProducts.tsx # Product carousel
│   │   │   ├── Campaigns.tsx     # Campaign showcase cards
│   │   │   ├── FindYourFit.tsx   # Interactive fit finder
│   │   │   └── Newsletter.tsx    # Email signup
│   │   ├── layout/               # Layout components
│   │   │   ├── Navbar.tsx        # Main navigation bar
│   │   │   ├── Footer.tsx        # Site footer
│   │   │   └── MobileBottomNav.tsx # Mobile navigation
│   │   ├── cart/                 # Shopping cart components
│   │   ├── products/             # Product display components
│   │   ├── ui/                   # Shared UI components
│   │   └── auth/                 # Auth-related components
│   ├── services/                 # API service layer
│   │   └── campaignService.ts    # Campaign API client (axios)
│   ├── store/                    # Zustand state stores
│   │   ├── useAuthStore.ts       # Authentication & roles
│   │   ├── useCartStore.ts       # Shopping cart state
│   │   ├── useOrderStore.ts      # Order tracking state
│   │   └── useUIStore.ts         # UI state (cart drawer, modals)
│   ├── hooks/                    # Custom React hooks
│   ├── types/                    # TypeScript type definitions
│   └── utils/                    # Utility functions
├── campaign-api/                 # Independent backend module
│   ├── src/
│   │   ├── server.ts             # Express app entry point
│   │   ├── routes/
│   │   │   └── campaignRoutes.ts # Route definitions
│   │   └── controllers/
│   │       └── campaignController.ts # Business logic & DB queries
│   ├── prisma/
│   │   ├── schema.prisma         # Database schema (Campaign model)
│   │   └── dev.db                # SQLite database file
│   ├── dist/                     # Compiled JS output
│   ├── package.json              # Backend dependencies
│   └── tsconfig.json             # Backend TypeScript config
├── public/                       # Static assets
├── .env.local                    # Frontend environment variables
├── package.json                  # Frontend dependencies
├── tsconfig.json                 # Frontend TypeScript config
├── next.config.ts                # Next.js configuration
└── postcss.config.mjs            # PostCSS configuration
```

---

## Getting Started

### Prerequisites

- **Node.js** 18+ installed
- **npm** (comes with Node.js)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/charwayyyyyy/aihackathon.git
cd aihackathon

# 2. Install frontend dependencies
npm install

# 3. Install backend dependencies
cd campaign-api
npm install

# 4. Set up the database
npx prisma db push
npx prisma generate

# 5. Return to the project root
cd ..
```

### Running the Application

You need **two terminals** to run the full application:

```bash
# Terminal 1 — Start the Campaign API backend
cd campaign-api
npx tsc && node dist/server.js
# Backend runs on http://localhost:3001
```

```bash
# Terminal 2 — Start the Next.js frontend
npm run dev
# Frontend runs on http://localhost:3000
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Frontend (Next.js)

### Pages & Routes

| Route | Description |
|---|---|
| `/` | Homepage — hero section, campaign banners, featured products, categories |
| `/shop` | Full product catalog with search and filtering |
| `/shop/[id]` | Individual product detail page |
| `/collections` | Curated collections page |
| `/new-arrivals` | New product arrivals |
| `/campaign` | Campaign showcase page |
| `/about` | Brand story and philosophy |
| `/heritage` | Brand heritage page |
| `/contact` | Contact information |
| `/orders` | Order tracking |
| `/privacy` | Privacy policy |
| `/admin/login` | Admin authentication (password: `admin123`) |
| `/admin` | Admin dashboard overview |
| `/admin/campaigns` | Campaign CRUD management |

### State Management (Zustand)

The frontend uses **Zustand** stores for client-side state that persists across page navigation:

- **`useCartStore`** — Shopping cart items, quantities, add/remove/clear actions, total price calculation
- **`useAuthStore`** — User authentication role (`admin`, `staff`, `viewer`, or `guest`), login/logout actions
- **`useUIStore`** — UI toggles like the cart drawer open/close state
- **`useOrderStore`** — Order tracking and history

### Key Components

- **`CampaignBanner`** — Fetches active campaigns from the backend API and renders a dynamic promotional banner at the top of the homepage
- **`Navbar`** — Fixed navigation with search, cart icon with live item count, and admin access button
- **`MobileBottomNav`** — Bottom tab bar for mobile screens
- **`CartDrawer`** — Slide-out cart panel with item management

---

## Backend (Campaign API)

The Campaign API is a **completely independent** Express.js application that manages marketing campaigns. It has its own dependencies, TypeScript configuration, and database.

### Campaign Data Model

Defined in `campaign-api/prisma/schema.prisma`:

```prisma
model Campaign {
  id                 String   @id @default(uuid())
  title              String
  description        String
  type               String   // "banner", "discount", "collection", "hero"
  status             String   // "draft", "active", "expired"
  imageUrl           String
  discountPercentage Float?
  targetProducts     String   // JSON array of product IDs stored as string
  startDate          DateTime
  endDate            DateTime
  priority           Int      @default(0)
  createdAt          DateTime @default(now())
  updatedAt          DateTime @updatedAt
}
```

### Campaign Types

| Type | Use Case |
|---|---|
| `banner` | Promotional banners displayed across the site |
| `discount` | Percentage-off sales campaigns |
| `collection` | Featured product collection promotions |
| `hero` | Full-width homepage hero campaigns |

### Campaign Statuses

| Status | Meaning |
|---|---|
| `draft` | Campaign is created but not visible to customers |
| `active` | Campaign is live and visible on the storefront (within date range) |
| `expired` | Campaign has ended and is no longer displayed |

### Request Validation

All incoming campaign data is validated using **Zod** schemas before touching the database:

```typescript
const campaignSchema = z.object({
  title: z.string().min(1),
  description: z.string(),
  type: z.enum(['banner', 'discount', 'collection', 'hero']),
  status: z.enum(['draft', 'active', 'expired']),
  imageUrl: z.string().url(),
  discountPercentage: z.number().nullable().optional(),
  targetProducts: z.array(z.string()),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  priority: z.number().int().default(0)
});
```

---

## How Frontend & Backend Work Together

### Connection

The frontend connects to the backend via the `NEXT_PUBLIC_API_URL` environment variable set in `.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

The service layer in `src/services/campaignService.ts` uses **Axios** to make HTTP requests to the Campaign API.

### Data Flow: Storefront Banner

```
User visits homepage
        │
        ▼
CampaignBanner component mounts
        │
        ▼
campaignService.getActiveCampaigns()
        │
        ▼
GET http://localhost:3001/api/campaigns
        │
        ▼
Express controller queries SQLite:
  WHERE status = 'active'
  AND startDate <= now
  AND endDate >= now
  ORDER BY priority DESC
        │
        ▼
JSON response with active campaigns
        │
        ▼
CampaignBanner renders the highest-priority
campaign with its image, title, and CTA
```

### Data Flow: Admin Campaign Management

```
Admin logs in at /admin/login
  (password: admin123)
        │
        ▼
Navigates to /admin/campaigns
        │
        ▼
CampaignsTable loads all campaigns:
  GET /api/campaigns/admin/all
        │
        ▼
Admin clicks "Create Campaign"
        │
        ▼
CampaignFormModal opens, admin fills form
        │
        ▼
On save: POST /api/campaigns
  Body: { title, description, type, status,
          imageUrl, discountPercentage,
          targetProducts, startDate, endDate,
          priority }
        │
        ▼
Backend validates with Zod, writes to SQLite
        │
        ▼
Campaign appears in the admin table
        │
        ▼
If status is "active" and dates are current,
it instantly shows on the public storefront
```

### Why They Are Separate

| Concern | Decision |
|---|---|
| **Independence** | The backend can be deployed, scaled, and updated independently of the frontend |
| **No build conflicts** | The `campaign-api/` folder is excluded from the Next.js TypeScript compilation (`tsconfig.json` excludes it) |
| **Different runtimes** | Frontend uses Turbopack/Next.js, backend uses plain Node.js + Express |
| **Database isolation** | The SQLite database lives inside `campaign-api/` and is only accessed by the backend |

---

## Admin Dashboard

### Access

1. Click the **user icon** in the top-right of the navigation bar, or visit `/admin/login`
2. Select a role (Administrator, Staff, or Viewer)
3. Enter the password: **`admin123`**
4. You'll be redirected to the admin dashboard

### Sidebar Navigation & Dynamic Modules
All options in the admin sidebar are fully functional:
- **Dashboard:** Operational center displaying live store telemetry: total product varieties, simulated customer counts, dynamic revenue metrics, and order counts.
- **Products:** Stock inventory inspector to keep track of catalog status, categories, and prices.
- **Orders:** Order management CRM detailing customer shipping information, ordered items, and order status tracking.
- **Campaigns:** Marketing management console offering full CRUD support (Create, Read, Update, Delete) to schedule storefront promotional campaigns.
- **Settings:** Full store behavior override hub (Store identity, WhatsApp targets, and storefront copy).

---

## Key Advanced Features & Custom Integrations

### 1. Conversational WhatsApp Commerce
Rather than using traditional payment gateways, **MENSAH** utilizes high-conversion conversational commerce:
- **WhatsApp Checkout:** When a user checks out from their cart drawer, their selections, sizes, and quantities are compiled into a beautifully formatted, line-by-line markdown invoice and sent directly to the vendor's WhatsApp DM. This allows the master tailors to coordinate bespoke sizing and payment directly.
- **Formal Contact Dispatch:** Submitting the form on the *Contact Us* page structures customer queries and routes them directly to the vendor's WhatsApp in a clean, formal message layout.

### 2. Live Page Content Customization
Admins have code-free control over the copywriting of customer-facing pages directly from the **Settings** panel:
- **About Page Copy:** Customize the hero title, subtitle, main story paragraph, and brand quote.
- **Contact Page Copy:** Update the title and support copy displayed to customers.
- Changes reflect **live and in real-time** across the storefront without requiring code changes, rebuilding, or static page redeployments.

### 3. Device-Native Campaign Image Uploader
- When creating or editing campaigns, admins can select images directly from their device (mobiles or desktop computers).
- The application processes the selected file, converts it to a standard base64 data URL, and saves it directly into the campaign database, ensuring that custom media displays instantly on storefront campaigns.

### 4. Serverless `/tmp` Override Storage (Vercel Compatibility)
- Because standard serverless deployment environments (such as Vercel) utilize a read-only filesystem, direct local filesystem writes fail in production.
- To resolve this, the Next.js API endpoints write configuration data to `/tmp/settings-data.json` when running in serverless mode (`process.env.VERCEL`), providing a robust database-free settings persistency layer that works perfectly out-of-the-box on Vercel deployments.

---

### Campaign Management

The Campaigns page at `/admin/campaigns` provides:

- **Table view** of all campaigns with title, type, status, dates, and actions
- **Create** new campaigns via a modal form with local file uploading
- **Edit** existing campaigns inline (including updating media files)
- **Delete** campaigns with confirmation
- **Status badges** showing Draft (gray), Active (green), and Expired (red)

---

## API Reference

Base URL: `http://localhost:3001/api`

### Health Check

```
GET /api/health
Response: { "status": "ok" }
```

### Public Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/campaigns` | Get all active campaigns (within date range, sorted by priority) |
| `GET` | `/api/campaigns/:id` | Get a single campaign by ID |

### Admin Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/campaigns/admin/all` | Get all campaigns (any status) |
| `POST` | `/api/campaigns` | Create a new campaign |
| `PUT` | `/api/campaigns/:id` | Update a campaign |
| `DELETE` | `/api/campaigns/:id` | Delete a campaign |

### Example: Create a Campaign

```bash
curl -X POST http://localhost:3001/api/campaigns \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Summer Sale 2026",
    "description": "50% off all summer collections!",
    "type": "hero",
    "status": "active",
    "imageUrl": "https://images.unsplash.com/photo-1523381210434-271e8be1f52b",
    "discountPercentage": 50,
    "targetProducts": ["prod-1", "prod-2"],
    "startDate": "2026-06-01T00:00:00.000Z",
    "endDate": "2026-08-31T23:59:59.000Z",
    "priority": 10
  }'
```

---

## Environment Variables

### Frontend (`.env.local`)

| Variable | Default | Description |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | `http://localhost:3001/api` | Campaign API base URL |

### Backend (`campaign-api/.env`)

| Variable | Default | Description |
|---|---|---|
| `PORT` | `3001` | Express server port |
| `DATABASE_URL` | `file:./dev.db` | Prisma database connection string |

---

## Deployment

### Frontend (Vercel)

The Next.js frontend deploys to **Vercel** out of the box. The `campaign-api/` directory is excluded from the build via `tsconfig.json`.

```bash
npm run build   # Creates production build
npm run start   # Starts production server
```

### Backend

The Campaign API can be deployed to any Node.js hosting platform (Railway, Render, Fly.io, etc.):

```bash
cd campaign-api
npx tsc                  # Compile TypeScript
node dist/server.js      # Start production server
```

For production, you would:
1. Replace SQLite with PostgreSQL by updating `prisma/schema.prisma`
2. Add authentication middleware to the admin routes
3. Set `NEXT_PUBLIC_API_URL` to the deployed backend URL

---

## License

This project was built for the AI Hackathon.
