# The Ledger — Design System

## Overview

**The Ledger** is a property management dashboard built for landlords and portfolio managers. It provides a clean, organized interface for tracking renters, monitoring rent collection, recording payments, and gaining portfolio-level insights across active units. The product's guiding philosophy is **"The Architectural Editor"** — rejecting the cluttered, line-heavy density of traditional SaaS in favor of a premium editorial feel reminiscent of a wealth management tool or high-end architectural journal.

### Sources
- **Codebase**: `frontend/` — React + TypeScript + Vite, Tailwind CSS, Supabase auth, TanStack Query
- **Design spec**: `frontend/design/DESIGN.md` — full design system strategy document
- **Tailwind config**: `frontend/tailwind.config.ts` — canonical color/shadow/font tokens
- **Global CSS**: `frontend/src/shared/styles/index.css` — animation keyframes, easing vars, body background

---

## Products

| Surface | Description |
|---|---|
| **Dashboard App** | Single-page React app. Login → Portfolio Overview → Renters Ledger → Renter Detail Panel. Desktop sidebar + mobile bottom nav. |

---

## Content Fundamentals

### Tone & Voice
- **Professional but warm.** Not stiff. Reads like a premium tool, not a government form.
- **Direct and data-forward.** Copy is minimal — labels are short, descriptive, never verbose.
- **First person avoided.** Uses third-person object references: "the renter", "the ledger", "the workspace" — not "your renter" or "my dashboard."
- **Sentence case** for body copy and descriptions. **ALL CAPS with wide letter-spacing** (0.14–0.20em) for metadata labels, badges, and section eyebrows.

### Specific Copy Patterns
- Labels: `"MONTHLY RENT"`, `"BALANCE DUE"`, `"COLLECTION RATE"` — all caps, wide tracking
- Descriptions: `"Status summary and current renter ledger across active units."` — lowercase, factual
- CTAs: Short verbs. `"Add Renter"`, `"Receive Payment"`, `"Save renter"`, `"Export Report"`
- Error messages: plain, non-alarmist. `"Passwords do not match."`
- Empty states: informational with a next step: `"Select a card from the ledger to inspect payment and due status."`
- Scaffolded features use `"Scaffolded"` / `"Soon"` badges — honest about roadmap, not hidden

### Emoji
**Never used.** Zero emoji anywhere in the product.

### Numbers
Formatted with `toLocaleString()` — e.g. `$1,850`, `$12,400`. Currency always uses `$` prefix, no abbreviations (K, M).

---

## Visual Foundations

### Color System
The palette is rooted in **deep navy/charcoal for primary** and **cool grays for surfaces**, with **emerald green as a precision accent** for success/payment actions.

| Token | Hex | Role |
|---|---|---|
| `primary` | `#0f172a` | Buttons, avatar bg, strong emphasis |
| `primary-container` | `#131b2e` | Gradient endpoint (paired with primary) |
| `primary-fixed` | `#dae2fd` | Input focus background |
| `on-primary` | `#ffffff` | Text on primary bg |
| `on-surface` | `#191c1e` | Primary body text (soft black, not pure) |
| `on-surface-variant` | `#45464d` | Secondary text, muted labels |
| `outline` | `#76777d` | Table header labels |
| `outline-variant` | `#c6c6cd` | Ghost dividers (used at 15–45% opacity only) |
| `tertiary` / `tertiary-container` | `#002114` | Emerald CTA background |
| `tertiary-fixed` | `#85f8c4` | Emerald CTA text |
| `secondary-container` | `#d5e3fc` | Hover state on menu items |
| `error-container` | `#ba1a1a` | Error states |
| `surface` | `#f7f9fb` | Page background |
| `surface-container-lowest` | `#ffffff` | Cards, modal bodies |
| `surface-container-low` | `#f2f4f6` | Card footers, sidebar bg, section containers |
| `surface-container` | `#eceef0` | Hover backgrounds, icon containers |
| `surface-container-high` | `#e6e8ea` | Chips, badge backgrounds, input backgrounds |
| `surface-container-highest` | `#e0e3e5` | Input default background |
| `surface-bright` | `#ffffff` | Hover lift on cards |
| `surface-dim` | `#d8dadc` | Dimmed surfaces |

**Overdue/error accent (inline)**: `#ffe9ec` bg / `#9f1239` text / `#be123c` for balance amounts
**Success accent (inline)**: `#dff5ed` bg / `#047857` or `#059669` text

#### The "No-Line" Rule
**1px solid borders are strictly prohibited for layout separation.** Structure is defined only by:
1. Tonal shifts between surface levels
2. Generous negative space (32px+ between major modules)

#### Page Background
Not a flat color — a radial gradient composition:
```css
radial-gradient(circle at 10% 8%, rgba(236,238,240,0.92), transparent 32%),
radial-gradient(circle at 88% 14%, rgba(213,227,252,0.26), transparent 28%),
linear-gradient(180deg, #f7f9fb 0%, #f4f6f8 100%)
```

### Typography

**Dual typeface system:**
| Role | Font | Usage |
|---|---|---|
| Display & Headlines | **Manrope** (700) | `font-heading` class. All display numbers, section titles, modal headings, logo wordmark |
| UI & Body | **Inter** (400–700) | Default sans. All labels, body text, inputs, metadata |

**Scale (key sizes):**
| Token | Size | Weight | Usage |
|---|---|---|---|
| Display-lg | 3.3–3.5rem | 700, Manrope | Big stat numbers (revenue, occupancy) |
| Headline | 2.25–2.5rem | 700, Manrope | Page title ("Portfolio Overview") |
| Section title | 1.15–1.4rem | 700, Manrope | Card/panel headings |
| Body | 0.875rem (14px) | 400–500, Inter | Descriptions, paragraph copy |
| Label-sm | 0.6875–0.75rem | 600–700, Inter | Metadata, ALL CAPS, tracking 0.14–0.20em |

**Numeric data**: Uses `font-variant-numeric: tabular-nums` for alignment.

### Spacing & Layout
- Page padding: `px-4 sm:px-6 lg:px-10`
- Between major sections: `space-y-6 sm:space-y-8` (24–32px)
- Cards gap: `gap-3 sm:gap-4` (12–16px)
- Sidebar width: 288px (`w-72`)

### Borders & Rounding
- Cards: `rounded-md` (6px) — the primary rounding for all cards
- Buttons (standard): `rounded-sm` (4px)
- Buttons (pill/chip): `rounded-full`
- Modals: `rounded-[1.75rem]` (28px) outer shell; `rounded-[1.35rem]` inner sections
- Input fields: `rounded-xl` (12px) in modals; `rounded-[8px]` in login
- Avatar: `rounded-full`
- Badges/chips: `rounded-sm` for unit labels; `rounded-full` for status pills

**Corner radius philosophy**: Angular squareness (`rounded-sm`) for dashboard data elements. Pill roundness (`rounded-full`) for status chips to contrast. High radius on modals (`rounded-[1.75rem]`) to feel elevated and premium.

### Elevation & Depth
No traditional drop shadows on cards. Use **Tonal Layering**:
- `surface-container-lowest` (white) cards on `surface-container-low` background = "soft lift"
- Shadow only for floating/ambient: `box-shadow: 0 12px 40px rgba(25,28,30,0.06)` (`shadow-layer`)
- Modal shadow: `0 24px 48px -8px rgba(15,23,42,0.28), 0 8px 16px -4px rgba(15,23,42,0.12)` (`shadow-modal`)

### Animations & Easing
Custom easing vars:
```css
--ease-out-quart: cubic-bezier(0.25, 1, 0.5, 1)
--ease-out-quint: cubic-bezier(0.22, 1, 0.36, 1)
--ease-out-expo:  cubic-bezier(0.16, 1, 0.3, 1)
```
- `modal-shell-in`: 420ms ease-out-expo — scale(0.972) + translateY(18px) → identity
- `modal-backdrop-in`: 320ms ease-out-quart — fade
- `modal-sheet-in`: 380ms ease-out-expo — translateY(28px) → 0
- `reveal-up`: 400ms ease-out — translateY(10px) → 0 (staggered on stat cards, 30/80/130ms delays)
- Spinner: 700ms linear infinite

### Hover & Press States
- **Cards**: `scale(1.01)` + background shift to `surface-bright`. Duration: 300ms.
- **Nav items**: `scale(1.01)` + bg to `surface-container`. Duration: 200ms.
- **Profile button**: `-translate-y-[1px]` + elevated shadow on hover; `translate-y-0 scale(0.985)` on active.
- **Primary buttons**: `opacity: 0.90` on hover (no color change).
- **Menu items**: `scale(1.01)` + `secondary-container/40` bg on hover; `scale(0.99)` on active.
- **Destructive items**: bg → `#fff4f3` on hover.

### Modals
- Backdrop: `bg-[#0f172a]/50 backdrop-blur-[2px]` — barely perceptible blur
- Shell: solid `surface-container-lowest` — NO transparency in modal body
- Structure: tonal header (`surface-container-low`) + white body + tonal footer — zone separation by color, no dividers
- CTA button: gradient `from-primary to-primary-container`

### Input Fields
- Default: `bg-surface-container-highest` solid fill, no border
- Focus: `bg-surface-container-lowest` + `ring-2 ring-primary/15`
- Label: ALL CAPS, 0.14em tracking, `on-surface-muted`

### Status Chips
- **Paid / on-time**: `bg-[#dff5ed] text-[#047857]`
- **Overdue**: `bg-[#ffe9ec] text-[#9f1239]`
- **Scaffolded/Soon**: `bg-surface-container-high text-on-surface-muted`

### Imagery & Backgrounds
No photography used. No illustrations. Purely typographic and geometric. The logo mark itself is a skewed grid of lines evoking a physical ledger book. Background uses a subtle radial gradient composition rather than a flat fill.

### Iconography
**Lucide React** — exclusively used throughout. Stroke-based, 2px default stroke weight. Size varies 14–18px in most contexts. See ICONOGRAPHY section below.

---

## Iconography

**Icon system: Lucide React** (CDN: `https://unpkg.com/lucide@latest`)

All icons are **stroke-based**, **2px stroke weight** (strokeWidth={2}), rendered inline as React components. No icon fonts, no sprite sheets, no PNG icons.

Common icons in use:
| Icon | Usage |
|---|---|
| `LayoutDashboard` | Dashboard / Portfolio nav item |
| `Building2` | Properties nav; Occupancy stat |
| `Users2` | Tenants / Ledger nav |
| `HandCoins` | Payments nav |
| `BarChart3` | Reports / Insight nav |
| `Settings` | Settings nav |
| `Plus` | Add Renter button |
| `Wallet` | Receive Payment button |
| `Bell` | Notifications (header) |
| `CircleHelp` | Help & Support (header) |
| `UserRound` | View Profile (menu) |
| `LogOut` | Sign Out (menu) |
| `Search` | Search input |
| `AlertTriangle` | Overdue warning |
| `AlertCircle` | Pending balance |
| `ArrowUpRight` | Revenue card indicator |
| `DollarSign` | Payment / monthly rent |
| `Calendar` | Last paid date |
| `X` | Close / dismiss |
| `Eye` / `EyeOff` | Password visibility toggle |
| `Mail` / `Lock` | Login form fields |
| `ArrowRight` | Submit / CTA arrow |
| `Loader2` | Loading spinner (animated) |
| `WalletCards` | Ledger preview label |
| `CalendarClock` | Payment tracking section |

**CDN usage for design system artifacts:**
```html
<script src="https://unpkg.com/lucide@latest/dist/umd/lucide.min.js"></script>
```
Or via ES module: `import { createIcons, icons } from 'lucide'`

---

## File Index

```
README.md                    ← This file
SKILL.md                     ← Agent skill descriptor
colors_and_type.css          ← All CSS custom properties (colors, type, spacing, shadows)
assets/
  logo.svg                   ← The Ledger logomark + wordmark (SVG)
preview/
  colors-primary.html        ← Primary & surface color swatches
  colors-semantic.html       ← Semantic / status color swatches
  type-scale.html            ← Manrope display + Inter body type scale
  type-labels.html           ← ALL CAPS label specimens
  spacing-tokens.html        ← Border radius + shadow tokens
  elevation-system.html      ← Surface tonal layering system
  components-buttons.html    ← Button variants
  components-chips.html      ← Status chips + badges
  components-inputs.html     ← Input field states
  components-cards.html      ← Renter card variants
  components-nav.html        ← Sidebar nav + mobile nav
  components-modals.html     ← Modal shell pattern
  brand-logo.html            ← Logo lockup variants
ui_kits/
  dashboard/
    README.md                ← UI kit overview
    index.html               ← Full interactive dashboard prototype
    Sidebar.jsx              ← Desktop sidebar component
    Header.jsx               ← Top header + search + profile menu
    PortfolioStats.jsx       ← KPI stat cards
    RenterCard.jsx           ← Renter ledger card
    RenterDetails.jsx        ← Detail panel + payment history
    LoginPage.jsx            ← Auth screen
```
