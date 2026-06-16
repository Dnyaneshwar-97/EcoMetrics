# EcoMetrics - Carbon Footprint Awareness Platform

A production-quality, fully client-side carbon footprint awareness platform built for India using React + Vite.

**Live demo:** https://ecometrics-42c8c.web.app

---

## Chosen Vertical

**Environmental sustainability — carbon footprint awareness for India.**

EcoMetrics targets individuals and households who want to understand their personal environmental impact but lack a simple, India-relevant tool to do so. Most global carbon calculators use Western emission benchmarks and English-only interfaces. This project fills that gap by:

- Using **India-specific emission factors** (electricity grid, transport, diet, waste)
- Translating the full experience into **13 Indian languages**
- Translating abstract CO₂ numbers into **relatable equivalents** (trees, km driven, coal burned)
- Encouraging long-term behaviour change through **tracking, planning, and gamified badges**

---

## Approach and Logic

### Architecture

The app is a **fully client-side SPA** (Single Page Application). There is no backend server or user authentication. All calculations run in the browser; all user data is stored in **localStorage**. This keeps the app fast, free to host, and privacy-friendly — no personal data leaves the device.

Business logic is separated from UI:

| Layer | Responsibility |
|-------|----------------|
| `services/` | Footprint calculation, badge evaluation, planner generation, recommendations |
| `constants/` | Emission factors, badge definitions, UI config |
| `hooks/` | Data persistence and language state |
| `pages/` | Route-level views (Calculator, Dashboard, Tracker, Planner, Badges) |

### Carbon footprint calculation

User inputs (electricity, transport, flights, diet, waste, household size) are converted to **monthly kg CO₂** per category:

- **Electricity** — kWh × 0.82 kg CO₂/kWh, divided by household size
- **Transportation** — monthly km × vehicle-specific factor (petrol car, diesel, EV, motorcycle, public transport)
- **Flights** — annual domestic/international flight counts amortised to monthly
- **Food** — daily diet factor (vegan → high meat) converted to monthly
- **Waste** — weekly kg × 52 weeks, amortised to monthly, divided by household size

Monthly totals are annualised to compute a **carbon score (0–100)**:

```
score = 100 − (annualFootprintTonnes / 1.9) × 50
```

The baseline **1.9 tonnes CO₂/year** represents an approximate average Indian per-capita footprint. Lower footprint → higher score. Categories: Excellent (≥80), Good (≥60), Moderate (≥40), High (≥20), Critical (below 20).

### Recommendations

After calculation, category emissions are compared against thresholds in `RECOMMENDATION_RULES`. High-emitting categories trigger personalised tips (e.g. switch to LEDs, use public transport) with estimated CO₂ and cost savings.

### Badges (gamification)

Five badges are evaluated on every page load from stored calculations and planner progress:

| Badge | Criteria |
|-------|----------|
| Green Starter | Complete 1 calculation |
| Eco Learner | Carbon score ≥ 60 |
| Eco Warrior | Complete 50% of planner tasks |
| Climate Champion | Reduce footprint ≥ 10% vs. first calculation |
| Earth Guardian | Score ≥ 80 (Excellent) + 100% planner tasks done |

### Reduction planner

Users pick a target reduction percentage. The app generates an 8-task weekly plan (scaled to the target) with expected kg CO₂ and trees saved. Task completion is tracked locally and feeds badge progress.

---

## How the Solution Works

### User journey

```
Home → Calculator → Save result → Dashboard / Tracker
                                      ↓
                              Planner → Badges → PDF export
```

1. **Calculator** — User enters lifestyle inputs. The app computes category breakdown, annual footprint, carbon score, and environmental equivalents. Results can be saved to local storage.

2. **Tracker** — Lists all saved calculations with score, footprint (daily/weekly/monthly/yearly views), and period-over-period improvement percentage.

3. **Dashboard** — Visual analytics (Recharts): monthly trend, category pie chart, annual progress, reduction trend, and carbon score history. Includes smart recommendations and a link to badges. Supports **PDF export** of the full report with charts and logo.

4. **Planner** — Generates a personalised multi-week reduction plan from the latest calculation. Users check off tasks as they complete them.

5. **Badges** — Carousel view of all five badges with earned/locked status. Earned badges can be downloaded as **PNG or SVG** share cards.

6. **Language selector** — Switches UI across 13 languages; preference persists in localStorage. Script-appropriate fonts load per language.

### Data persistence

| Key | Stores |
|-----|--------|
| `ecometrics_calculations` | Array of saved calculation records |
| `ecometrics_planner` | Active reduction plan and task states |
| `ecometrics_language` | Selected UI language code |
| `ecometrics_theme` | Light / dark mode preference |

### Deployment

Built with Vite and deployed to **Firebase Hosting** (`npm run deploy`). The production bundle is static — no server runtime required.

---

## Assumptions

1. **India-specific context** — Emission factors (e.g. 0.82 kg CO₂/kWh for electricity) reflect approximate Indian averages, not global IPCC defaults. They are suitable for awareness/education, not regulatory reporting.

2. **Average footprint baseline** — The score formula uses **1.9 tonnes CO₂/year** as the reference average Indian per-capita footprint. Users below this score higher; users above score lower.

3. **Per-capita allocation** — Electricity and waste emissions are divided by household size. Transport and flights are attributed to the individual entering data.

4. **No backend / no accounts** — All data lives in the browser's localStorage. Clearing browser data or switching devices loses history. No cloud sync or multi-user support.

5. **Self-reported inputs** — Calculations depend on user-provided estimates (monthly km, kWh, flights, etc.). There is no verification against utility bills or GPS data.

6. **Recommendation savings are estimates** — CO₂ reduction and money saved figures in tips are illustrative, based on static rules — not personalised engineering calculations.

7. **Planner tasks are generic** — The 8-task plan template is the same for all users; only reduction percentages are scaled to the chosen target.

8. **Language coverage** — UI strings are translated in 13 locales. Some dynamic content (e.g. certain recommendation titles) may remain in English where not yet localised.

9. **Fonts loaded from CDN** — Indian script fonts (Noto family) are loaded from Google Fonts at runtime for correct rendering across scripts.

10. **Client-side PDF / badge export** — PDF and badge image generation runs entirely in the browser using jsPDF, html2canvas, and canvas APIs. Export quality depends on the user's browser and device.

---

## Features

- **Carbon Footprint Calculator** - India-specific emission factors
- **Smart Recommendations** - Personalized reduction suggestions
- **Environmental Impact Conversion** - Trees, km driven, coal equivalents
- **Carbon Tracker** - Save and track calculations over time
- **Analytics Dashboard** - Charts for trends, categories, and progress
- **Reduction Planner** - Weekly personalized action plans
- **Badge System** - Gamified sustainability journey with animated milestone roadmap
- **PDF Export** - Download comprehensive reports
- **Dark Mode** - Full theme support
- **Responsive Design** - Mobile-first layout
- **Multi-language** - 13 Indian languages (English, Hindi, Marathi, Gujarati, Bengali, Tamil, Telugu, Kannada, Malayalam, Punjabi, Odia, Assamese, Urdu)

## Languages

Use the language selector in the navbar to switch UI text. Preference is saved in `localStorage` (`ecometrics_language`). Locale files live in `src/i18n/locales/`. Script-specific fonts (Noto family) load from Google Fonts for proper rendering of Devanagari, Gujarati, Bengali, Tamil, and other scripts.

## Tech Stack

- React 18+ with Vite
- Tailwind CSS
- React Router
- Recharts
- Lucide React Icons
- jsPDF
- Framer Motion
- Local Storage

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Run linter
npm run lint

# Build for production
npm run build

# Preview production build
npm run preview
```

## Testing

Automated tests use **Vitest** and **React Testing Library**. Coverage includes core utilities, services, validation, UI components, and persistence.

```bash
npm test          # run once
npm run test:watch  # watch mode
```

| Test file | What it validates |
|-----------|-------------------|
| `src/test/calculations.test.js` | Score, categories, environmental impact, clamp |
| `src/test/validators.test.js` | Calculator and planner input validation |
| `src/test/carbonCalculatorService.test.js` | Footprint calculation and record creation |
| `src/test/plannerService.test.js` | Plan generation, task toggle/update, progress |
| `src/test/badgeService.test.js` | Badge earned/locked criteria for all five badges |
| `src/test/recommendationService.test.js` | Recommendation rules and savings totals |
| `src/test/storageService.test.js` | localStorage save, delete, clear |
| `src/test/languages.test.js` | Language list, Urdu RTL flag, font mapping |
| `src/components/ui/Badge.test.jsx` | Score badge renders with accessible label |
| `src/components/ui/Button.test.jsx` | Button click and disabled state |

## Accessibility

- **Skip link** — “Skip to main content” appears on keyboard focus
- **RTL** — Urdu sets `dir="rtl"` on the document
- **Modal** — Escape to close, focus trap, translated close label
- **Screen reader chart data** — Score history chart includes an sr-only data table
- **i18n aria labels** — Planner tasks, navbar home link, and common controls use translated labels

---

## Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/          # Route pages
├── services/       # Business logic
├── hooks/          # Custom React hooks
├── constants/      # Configuration & constants
├── utils/          # Helper functions
└── context/        # React context providers
```

## Deploy to Firebase

Default Firebase project: **ecometrics-42c8c** (EcoMetrics)

```bash
# 1. Log in to Firebase (opens browser)
npx firebase login

# 2. Build and deploy to ecometrics-42c8c
npm run deploy
```

Your site will be live at `https://ecometrics-42c8c.web.app`.

## License

MIT
