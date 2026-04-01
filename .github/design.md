# Design System

> Fill this file per-project. UI/UX skills reference it for brand consistency.
> Keep it minimal — tokens, libraries, and key design decisions only.

---

## Brand Identity

| Token             | Value              | Notes                        |
|-------------------|--------------------|------------------------------|
| Primary Color     | `#10B981` (Emerald 500) | Main CTAs, active states |
| Primary Dark      | `#059669` (Emerald 600) | Hover states             |
| Accent            | `#6366F1` (Indigo 500)  | Secondary actions        |
| Text Primary      | `#1E293B` (Slate 800)   | Body text                |
| Text Secondary    | `#64748B` (Slate 500)   | Subtitles, labels        |
| Background        | `#F8FAFC` (Slate 50)    | Page background          |
| Surface           | `#FFFFFF`               | Cards, modals            |
| Border            | `#E2E8F0` (Slate 200)   | Dividers, card borders   |
| Error             | `#EF4444` (Red 500)     | Validation errors        |
| Warning           | `#F59E0B` (Amber 500)   | Warning states           |
| Success           | `#10B981` (Emerald 500) | Success states           |

## Typography

| Role         | Font           | Size         | Weight |
|--------------|----------------|--------------|--------|
| Heading H1   | Inter          | 3xl / 30px   | 700    |
| Heading H2   | Inter          | 2xl / 24px   | 600    |
| Heading H3   | Inter          | xl / 20px    | 600    |
| Body Large   | Inter          | base / 16px  | 400    |
| Body Small   | Inter          | sm / 14px    | 400    |
| Caption      | Inter          | xs / 12px    | 400    |
| Code         | JetBrains Mono | sm / 14px    | 400    |

## Spacing Scale

Uses Tailwind default scale. Key conventions:
- Card padding: `p-4 sm:p-6 md:p-8`
- Section gap: `gap-4 sm:gap-6`
- Page padding: `p-4 sm:p-6 md:p-8 lg:p-10`
- Max content width: `max-w-6xl mx-auto`

## Component Library

- **Base Components**: `@repo/ui` (shadcn/ui wrapped)
- **Form**: react-hook-form + Zod + shadcn/ui Form primitives
- **Icons**: Lucide React
- **Date/Time**: DateTimePicker from `@repo/ui/datetime-picker`
- **Charts**: <!-- add when applicable -->
- **Tables**: <!-- add when applicable -->

## Animation & Motion

- **Transitions**: `transition-all duration-300` for hover states
- **Hover Scale**: `hover:scale-105 active:scale-95` for primary buttons
- **Recommended Libraries**:
  - `framer-motion` — page transitions, complex animations
  - `auto-animate` — list transitions (add/remove items)
  - `tailwindcss-animate` — CSS-only micro-interactions (already via shadcn)

## Landing Page / Marketing Assets

> For landing pages, UI skills will ask for Cloudinary video paths.
> Store public asset paths here when available.

- Hero Video: <!-- cloudinary path -->
- Feature Animations: <!-- cloudinary paths -->
- Brand Images: <!-- cloudinary paths -->

## Responsive Breakpoints

| Breakpoint | Tailwind prefix | Min-width |
|------------|-----------------|-----------|
| Mobile     | (default)       | 0px       |
| Small      | `sm:`           | 640px     |
| Medium     | `md:`           | 768px     |
| Large      | `lg:`           | 1024px    |
| X-Large    | `xl:`           | 1280px    |

## Accessibility Standards

- WCAG 2.1 AA compliance minimum
- All interactive elements must have keyboard focus styles
- Color contrast ratio ≥ 4.5:1 for normal text
- All images require `alt` text
- Form inputs must have associated labels

## Key UI Patterns

- **Cards**: White background, `rounded-xl`, `border border-gray-200`, `shadow-sm`
- **Primary Button**: Emerald gradient, `rounded-xl`, `h-11`/`h-12`, icon + text
- **Form Layout**: Sections in white cards, grid cols 1→2→3 based on breakpoint
- **Section Headers**: `text-lg sm:text-xl font-semibold text-slate-800`
- **Input Style**: `h-11 rounded-lg border-gray-300 focus:border-emerald-500`
