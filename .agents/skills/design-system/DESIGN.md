# DESIGN.md — The Ledger

## Creative North Star: "The Architectural Editor"

The Ledger rejects the cluttered, line-heavy density of traditional property SaaS. Its persona is a **high-end architectural journal** — breathable, editorial, organized. The interface should feel less like a database and more like a premium wealth management tool: a curated ledger of paper-thin sheets stacked with care.

**Three words:** Authoritative. Breathable. Precise.

---

## Colors

### Core Palette

| Token | Value | Role |
|---|---|---|
| `primary` | `#0f172a` | Buttons, avatar, key UI anchors |
| `primary-container` | `#131b2e` | Gradient pair to primary |
| `primary-fixed` | `#dae2fd` | Input focus tint |
| `on-primary` | `#ffffff` | Text on primary backgrounds |
| `on-surface` | `#191c1e` | All body text — soft black, never pure |
| `on-surface-muted` | `#45464d` | Secondary text, labels, metadata |
| `outline` | `#76777d` | Table headers, dividers |
| `outline-variant` | `#c6c6cd` | Ghost dividers — always at ≤45% opacity |

### Surface Hierarchy

Depth is achieved entirely through surface-level tonal shifts. **Never use drop shadows on cards.**

| Token | Value | Typical use |
|---|---|---|
| `surface-container-lowest` | `#ffffff` | Interactive cards, modal bodies |
| `surface-container-low` | `#f2f4f6` | Sidebar bg, section containers, modal zones |
| `surface` | `#f7f9fb` | Page background base |
| `surface-container` | `#eceef0` | Icon containers, hover bgs |
| `surface-container-high` | `#e6e8ea` | Chip/badge bgs, nav hover, input bg |
| `surface-container-highest` | `#e0e3e5` | Input default fill |
| `surface-bright` | `#ffffff` | Card hover lift |
| `surface-dim` | `#d8dadc` | Dimmed / inactive |

**Nesting pattern:** Place `surface-container-lowest` (white) cards on `surface-container-low` backgrounds. This "soft lift" is the primary elevation model.

### Accent Colors

| Role | Background | Text |
|---|---|---|
| Primary CTA | `linear-gradient(135deg, #0f172a, #131b2e)` | `#ffffff` |
| Emerald CTA (payment) | `#002114` | `#85f8c4` |
| Hover: menu item | `rgba(213,227,252,0.4)` (`secondary-container`) | — |
| On-time / Paid chip | `#dff5ed` | `#047857` |
| Overdue chip | `#ffe9ec` | `#9f1239` |
| Overdue amount text | — | `#be123c` |
| Error | `#ba1a1a` | `#ffffff` |
| Destructive action | `#fff4f3` (hover) | `#d44f46` |
| Online indicator / Paid | `#34d399` | — |
| Collection rate positive | — | `#059669` |
| Pending balance negative | — | `#F43F5E` |

### Page Background

The page background is a radial gradient composition — not a flat color:

```css
background:
  radial-gradient(circle at 10% 8%, rgba(236,238,240,0.92), transparent 32%),
  radial-gradient(circle at 88% 14%, rgba(213,227,252,0.26), transparent 28%),
  linear-gradient(180deg, #f7f9fb 0%, #f4f6f8 100%);
```

### The No-Line Rule
**1px solid borders are prohibited for structural separation.** Define layout zones only through:
1. Tonal surface shifts
2. Generous negative space (32px+ between major modules)

Exception: `outline-variant` at ≤15% opacity as a "ghost border" for accessibility in data-heavy tables only.

---

## Typography

### Typefaces

| Role | Font | Weight | CSS Class |
|---|---|---|---|
| Display, headlines, numbers | **Manrope** | 700 | `font-heading` / `font-family: 'Manrope'` |
| UI, body, labels | **Inter** | 400 / 500 / 600 / 700 | default `font-sans` |

Google Fonts import:
```
https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Manrope:wght@700&display=swap
```

### Type Scale

| Token | Size | Weight | Font | Use |
|---|---|---|---|---|
| Display-lg | 3.3–3.5rem | 700 | Manrope | KPI figures (revenue, occupancy) — the dramatic focal point |
| Headline | 2.25–2.5rem | 700 | Manrope | Page title ("Portfolio Overview") |
| Heading-lg | 1.75–1.85rem | 700 | Manrope | Modal H1 |
| Heading-md | 1.3–1.4rem | 700 | Manrope | Panel headings, renter names |
| Heading-sm | 1.1–1.15rem | 700 | Manrope | Card section headings, "Recent Activity" |
| Body | 14px / 0.875rem | 400 | Inter | Descriptions, paragraphs |
| Body semibold | 14px | 600 | Inter | Row data values, labels in context |
| Label | 12px / 0.75rem | 600 | Inter | ALL CAPS metadata — tracking 0.14em |
| Label-sm | 11px / 0.6875rem | 700 | Inter | Micro badges — tracking 0.16–0.20em |

### Label Convention
All metadata labels (column headers, eyebrows, badge text) must be:
- ALL CAPS
- `font-weight: 600–700`
- `letter-spacing: 0.14em–0.20em`
- Color: `on-surface-muted` (#45464d) or `outline` (#76777d)

### Numeric Data
Use `font-variant-numeric: tabular-nums` on all figures that may change width (currency, percentages, counts).

---

## Elevation & Depth

### Tonal Layering (primary method)
Cards and sections use background-color nesting, not shadows:
- `surface-container-lowest` (white) on `surface-container-low` = "soft lift" (primary card pattern)
- `surface-container-low` on `surface-container` = section grouping

### Shadows (secondary — floating elements only)

| Name | Value | Use |
|---|---|---|
| `shadow-layer` | `0 12px 40px rgba(25,28,30,0.06)` | Ambient lift on cards that must float |
| `shadow-ghost` | `0 12px 22px rgba(15,23,42,0.08)` | Hover state lift on interactive elements |
| `shadow-modal` | `0 24px 48px -8px rgba(15,23,42,0.28), 0 8px 16px -4px rgba(15,23,42,0.12)` | Modals, profile menu |

---

## Border Radius

| Name | Value | Use |
|---|---|---|
| `rounded-sm` / `radius-sm` | 4px | Buttons, nav items, row data blocks, unit badges |
| `rounded-md` / `radius-md` | 6px | Cards, section containers, panels |
| `rounded-lg` / `radius-lg` | 8px | Login page card, input fields (login) |
| `rounded-xl` / `radius-xl` | 12px | Form inputs inside modals |
| `rounded-2xl` / `radius-2xl` | ~20px | Inner modal section cards |
| `rounded-[1.75rem]` | 28px | Modal outer shell |
| `rounded-full` | 9999px | Status chips (Paid, Overdue), avatar |

**Philosophy:** Data elements are angular (4–6px). Status chips are pills (full) — the contrast creates visual hierarchy. Modals are highly rounded (28px) to feel elevated and premium.

---

## Components

### Buttons

**Primary** — gradient CTA for the main action in any context
```css
background: linear-gradient(135deg, #0f172a, #131b2e);
color: #ffffff;
border-radius: 4px;
hover: opacity 0.90;
```

**Secondary** — secondary action, no border
```css
background: #e6e8ea; /* surface-container-high */
color: #191c1e;
border-radius: 4px;
hover: background #eceef0;
```

**Emerald** — exclusively for payment-related CTAs ("Receive Payment")
```css
background: #002114;
color: #85f8c4;
border-radius: 4px;
hover: opacity 0.90;
```

**Destructive** — sign-out, delete
```css
background: transparent (hover: #fff4f3);
color: #d44f46;
```

### Input Fields

Default state — no visible border, solid fill:
```css
background: #e0e3e5; /* surface-container-highest */
border: none;
border-radius: 12px; /* inside modals */
```

Focus state:
```css
background: #ffffff;
box-shadow: 0 0 0 2px rgba(15,23,42,0.15), inset 0 0 0 1px rgba(15,23,42,0.18);
```

Label: ALL CAPS · 10–11px · `letter-spacing: 0.14em` · `on-surface-muted`

### Cards (Renter)

- Background: `surface-container-lowest` (#fff)
- Radius: `rounded-md` (6px)
- No border by default
- Selected: `ring-1 ring-outline-variant/15` + `shadow-layer`
- Hover: `scale(1.01)` + background lifts to `surface-bright`
- Data block inside: `surface-container-low` background, `rounded-sm`

### Status Chips

| State | Background | Text | Radius |
|---|---|---|---|
| Paid / On-time | `#dff5ed` | `#047857` | full |
| Overdue | `#ffe9ec` | `#9f1239` | full |
| Unit badge (Apt #) | `#e6e8ea` | `#191c1e` | 4px |
| Scaffolded / Soon | `#e6e8ea` | `#45464d` at 70% | full |

### Modals

Structure (no dividers — zones defined by color shift):
1. **Header** — `surface-container-low` bg · Manrope title + muted description · close button
2. **Body** — `surface-container-low` bg · white section cards nested inside (`rounded-[1.35rem]`)
3. **Footer** — `surface-container-low` bg · right-aligned Cancel + Primary CTA

Backdrop: `rgba(15,23,42,0.50)` + `backdrop-blur(2px)` — subtle, not dramatic.

Modal shell: `border-radius: 28px` · `shadow-modal` · solid white body.

### Navigation

**Desktop sidebar** (272px fixed):
- Background: `surface-container-low`
- Active item: `surface-container-high` bg · `#059669` text+icon · `scale(1.01)` · `shadow-layer`
- Inactive item: transparent → `surface-container` on hover · `scale(1.01)`
- "Soon" label: 9px ALL CAPS · `opacity: 0.70`
- Add Renter CTA: full-width primary gradient button at bottom

**Mobile bottom nav** (fixed, 4 tabs):
- Background: `surface-container-lowest/95` + `backdrop-blur-xl`
- Active: `#dff5ed` bg · `#047857` text (emerald tint, not primary)
- Top border: `outline-variant` at 20% opacity

---

## Animation & Motion

### Easing Variables
```css
--ease-out-quart: cubic-bezier(0.25, 1, 0.5, 1);   /* standard UI transitions */
--ease-out-quint: cubic-bezier(0.22, 1, 0.36, 1);   /* snappy interactions */
--ease-out-expo:  cubic-bezier(0.16, 1, 0.3, 1);    /* modals, sheets */
```

### Key Animations

| Name | Duration | Easing | Movement |
|---|---|---|---|
| `modal-shell-in` | 420ms | ease-out-expo | scale(0.972) + translateY(18px) → identity |
| `modal-shell-out` | 220ms | ease-out-quart | identity → scale(0.985) + translateY(10px) |
| `modal-backdrop-in` | 320ms | ease-out-quart | opacity 0→1 |
| `modal-backdrop-out` | 220ms | ease-out-quart | opacity 1→0 |
| `modal-sheet-in` | 380ms | ease-out-expo | translateY(28px) → 0 (mobile bottom sheet) |
| `reveal-up` | 400ms | ease-out | translateY(10px) + opacity 0 → identity |
| `modal-pop-in` | 360ms | ease-out-quint | scale(0.92) → 1 (icon/avatar inside modal) |
| `modal-flow-in` | 460ms | ease-out-quart | translateY(12px) → 0, staggered 70/130/190ms |

### The "Soft Scale" Hover
The signature interaction for cards and nav items:
```css
transition: transform 300ms, background-color 300ms;
hover: transform: scale(1.01);
```
Mimics the tactile feel of a physical ledger being pulled forward from a stack. Do not use on buttons — use opacity instead.

### Button Hover/Press
- Primary / Emerald: `opacity: 0.9` on hover. No scale.
- Profile button: `translateY(-1px)` on hover, `translateY(0) scale(0.985)` on press.
- Menu items: `scale(1.01)` hover, `scale(0.99)` press.

---

## Iconography

**System: Lucide** (exclusively)
- Style: Stroke-based, 2px default stroke weight
- Sizes: 13–18px in most contexts (13px inline, 16px nav, 17px header, 18px modal)
- Never use emoji as icons
- Never use PNG icons
- No icon font — always inline SVG via `lucide-react` (npm) or Lucide UMD bundle

CDN (for HTML artifacts):
```html
<script src="https://unpkg.com/lucide@latest/dist/umd/lucide.min.js"></script>
```

---

## Layout

### Page Structure
```
[Sidebar 272px fixed] | [Main content — flex column]
                           [Header sticky top]
                           [Main px-4→px-10, space-y-6→8]
                             [Portfolio Overview section]
                             [Ledger + Detail grid: 1.55fr / 1fr]
```

### Spacing Scale (key values)
- Section gap: `space-y-6` (24px) mobile · `space-y-8` (32px) desktop
- Card grid gap: `gap-3` (12px) → `gap-4` (16px)
- Card inner padding: `p-4` (16px) → `p-5/p-6` (20–24px)
- Main horizontal padding: `px-4` → `px-6` → `px-10`
- Modal content padding: `px-5 py-5` → `px-6`

### Responsive Breakpoints (Tailwind defaults)
- `sm`: 640px — padding/spacing bump
- `lg`: 1024px — sidebar appears, bottom nav hides
- `xl`: 1280px — detail panel column appears beside ledger

---

## Do's and Don'ts

### Do
- Use `display-lg` (Manrope 3.3rem+) for single impactful data points — KPI figures
- Use tonal surface shifts to group related content, never borders
- Allow 32px+ margins between major modules
- Use emerald (#002114/#85f8c4) sparingly — payment CTAs only
- Use `tabular-nums` on all financial figures
- Apply `scale(1.01)` hover on cards and nav items
- Use `rounded-full` for status chips; `rounded-sm` for data badges

### Don't
- Don't use 1px borders to separate sections — use background color shift
- Don't use pure black — use `on-surface` (#191c1e) for all text
- Don't use drop shadows on cards — use tonal layering
- Don't use gradients decoratively — only on primary buttons
- Don't use emoji anywhere
- Don't use heavy backdrop blur on modals — `blur(2px)` only, barely perceptible
- Don't cram data — if a table is tight, move columns into a drawer
- Don't use `inter` for display numbers — always Manrope

---

## Voice & Copy

- **Sentence case** for descriptions and body copy
- **ALL CAPS** for labels, column headers, badges, eyebrows
- **Terse CTAs:** "Add Renter" not "Add a New Renter"
- **Third-person object references:** "the renter," "the ledger," "the workspace" — not "your renter"
- **Honest about roadmap:** Label unbuilt features "Scaffolded" or "Soon" — don't hide them
- **No emoji** — anywhere
- **Numbers formatted:** `$1,850` via `toLocaleString()` — always `$` prefix, no K/M abbreviations
