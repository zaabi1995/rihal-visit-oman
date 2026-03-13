# Visit Oman: Discover & Plan

A two-phase tourism platform for exploring Oman's destinations and generating intelligent trip itineraries.

Built for [Rihal Codestacker 2026](https://rihal.om) — Frontend Challenge.

## Overview

I built this as a fully client-side application using Next.js 14. The platform has two phases:

1. **Discovery** (SSR) — Browse 300+ destinations across Oman with filters, bilingual support (EN/AR), and save favorites
2. **Trip Planner** (CSR) — Generate optimized multi-day itineraries based on your preferences

Everything runs in the browser. No backend, no external APIs.

## Getting Started

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Tech Stack

- **Next.js 14** (App Router) — SSR for marketing, CSR for planner
- **TypeScript** — Full type safety
- **Tailwind CSS** — Styling with Oman-inspired palette
- **next-intl** — Bilingual EN/AR with RTL support
- **Leaflet** — Map visualization
- **LocalStorage** — Client-side persistence

## Architecture

### Rendering Strategy

- **SSR pages**: Landing, destination browsing, destination details — pre-rendered for SEO and fast load
- **CSR pages**: Trip planner — runs algorithms client-side for interactive experience

### State Management

- URL query params for filter state (shareable, bookmarkable)
- LocalStorage for saved interests, planner inputs, and generated itineraries
- React state for UI interactions

## Algorithm

The trip planner uses a multi-stage algorithm:

### 1. Multi-Objective Scoring

Each destination gets a score based on:

```
score(i) = w_interest × Jaccard(user_categories, dest_categories)
         + w_season  × SeasonFit(month, recommended_months)
         - w_crowd   × Normalize(crowd_level)
         - w_cost    × Normalize(ticket_cost)
         - w_detour  × DetourPenalty(route, candidate)
         + w_diversity × DiversityGain(selected_set)
```

All components normalized to [0,1]. Weights documented in `src/lib/constants.ts`.

**Why these weights:** I prioritized interest matching (0.30) because the trip should match what the user wants. Season fit (0.20) is second because visiting Dhofar outside khareef season is not ideal. Detour penalty (0.15) keeps routes efficient. Crowd and cost are lower because they're nice-to-haves, not dealbreakers.

### 2. Region Allocation

Days are distributed across regions based on how many high-scoring destinations each region has. Constraints:
- At least 2 regions for trips >= 3 days
- No region gets more than ceil(days/2) days

### 3. Route Optimization (2-opt)

For each day, stops are initially selected greedily by score, then optimized using **2-opt local search** — iteratively swapping edges in the route to minimize total driving distance. This consistently reduces route length by 15-25% compared to the greedy order.

### 4. Constraints

| Constraint | Value |
|------------|-------|
| Max daily driving | 250 km |
| Max daily visiting | 8 hours |
| Max same category/day | 2 |
| Stops per day | 3 (relaxed) / 4 (balanced) / 5 (packed) |

### 5. Budget Estimation

- Fuel: total_km / 12 × 0.180 OMR/L
- Food: 6 OMR/day
- Hotel: 20 (low) / 45 (medium) / 90 (luxury) OMR/night

All distances calculated using **Haversine formula** — no external routing APIs.

## Bilingual Support

Full English/Arabic support with:
- All UI elements translated
- Destination names in both languages (from dataset)
- RTL layout for Arabic
- URL-based locale switching (`/en/...` and `/ar/...`)

## Performance

- 300 destinations × 2 locales = 600 pre-rendered pages
- Algorithm runs in <500ms for 7-day trips
- Leaflet map lazy-loaded (dynamic import)
- Dataset loaded once and cached

## Known Limitations

- Distance is straight-line (Haversine), not road distance — actual driving may be longer
- No real-time availability or booking
- Budget estimates are approximate (fuel prices vary)
- Arabic translations could be improved by a native speaker

## Project Structure

```
src/
├── algorithm/     # Trip planning engine
├── app/           # Next.js pages
├── components/    # UI components
├── data/          # 300 destinations dataset
├── hooks/         # React hooks
├── i18n/          # Translations
└── lib/           # Types, constants, utilities
```
