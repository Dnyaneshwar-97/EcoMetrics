# EcoMetrics - Carbon Footprint Awareness Platform

A production-quality, fully client-side carbon footprint awareness platform built for India using React + Vite.

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

# Build for production
npm run build

# Preview production build
npm run preview
```

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
