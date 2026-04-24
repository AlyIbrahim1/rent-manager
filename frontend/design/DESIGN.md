```markdown
# Design System Strategy: The Ledger

## 1. Overview & Creative North Star
**Creative North Star: "The Architectural Editor"**
In the world of property and rent management, "professionalism" is often mistaken for "stiffness." This design system rejects the cluttered, line-heavy density of traditional SaaS. Instead, we adopt the persona of a high-end architectural journal. 

We break the "template" look through **intentional asymmetry** and **breathable white space**. By leveraging a sophisticated interplay of deep charcoals and emerald accents, we create a "Curated Ledger"—an interface that feels less like a database and more like a premium wealth management tool. We use high-contrast typography scales and overlapping surface containers to suggest a sense of organized, tactile layers rather than a flat digital grid.

---

## 2. Colors & Tonal Depth
Our palette is rooted in stability. We use deep blues and greys to establish trust, while the emerald green (`tertiary`) acts as a precise surgical tool for success states and calls to action.

### The "No-Line" Rule
To achieve a high-end editorial feel, **1px solid borders are strictly prohibited for sectioning.** Structural boundaries must be defined solely through:
- **Tonal Shifts:** Moving from `surface` (#f7f9fb) to `surface-container-low` (#f2f4f6).
- **Negative Space:** Using the spacing scale to create mental boundaries without visual clutter.

### Surface Hierarchy & Nesting
Think of the UI as a series of stacked, fine-paper sheets. 
- Use `surface-container-lowest` (#ffffff) for the primary interactive cards.
- Place these cards on `surface-container` (#eceef0) backgrounds.
- This "nesting" creates natural depth and directs the eye toward high-priority data without the need for heavy shadows or lines.

### The "Solid Surface" Rule
For floating elements like modals or pop-overs, use solid surfaces with meaningful elevation:
- **Color:** `surface-container-lowest` (#ffffff) at full opacity — no transparency.
- **Overlay:** `bg-[#0f172a]/50` with `backdrop-blur-[2px]` — barely perceptible blur focuses context without being dramatic.
- **Shadow:** `shadow-modal` — `0 24px 48px -8px rgba(15,23,42,0.28), 0 8px 16px -4px rgba(15,23,42,0.12)`.
- **Structure:** Tonal header (`surface-container-low`) + white body (`surface-container-lowest`) + tonal footer (`surface-container-low`). Zone separation by color shift, no divider lines.
- **CTA Soul:** Apply a subtle linear gradient from `primary` (#0f172a) to `primary-container` (#131b2e) for hero buttons. This adds a "weighted" feel that flat color lacks.

---

## 3. Typography
We use a dual-typeface system to balance editorial character with functional precision.

*   **Display & Headlines (Manrope):** Use Manrope for all `display` and `headline` tokens. Its geometric yet warm proportions feel modern and authoritative.
*   **UI & Body (Inter):** Use Inter for `title`, `body`, and `label` tokens. Inter’s tall x-height ensures that complex rental data remains legible at small sizes.

**Editorial Scale:**
- **Display-lg (3.5rem):** Use for "Big Numbers" (e.g., Total Portfolio Value) to create a dramatic focal point.
- **Label-sm (0.6875rem):** Use for metadata, always in `on-surface-variant` (#45464d) to maintain a hierarchy of "quiet" information.

---

## 4. Elevation & Depth
Depth is conveyed through **Tonal Layering**, not structural scaffolding.

*   **The Layering Principle:** A `surface-container-lowest` card sitting on a `surface-container-low` section creates a "soft lift." This is our primary method of elevation.
*   **Ambient Shadows:** If an element must float (e.g., a notification), use an extra-diffused shadow: `box-shadow: 0 12px 40px rgba(25, 28, 30, 0.06)`. Note the low opacity—we want the shadow to feel like ambient light, not a dark smudge.
*   **The "Ghost Border" Fallback:** If a divider is required for accessibility in data-heavy tables, use `outline-variant` (#c6c6cd) at **15% opacity**. It should be felt, not seen.

---

## 5. Components

### Buttons (The Anchor)
- **Primary:** Gradient from `primary` to `primary-container`. `rounded-md` (0.375rem). Text: `on-primary` (#ffffff).
- **Secondary:** Surface-only. Use `surface-container-high` (#e6e8ea) with `on-surface` text. No border.
- **Tertiary (Emerald):** Use `tertiary-container` (#002114) with `tertiary-fixed` (#85f8c4) text for high-signal actions like "Receive Payment."

### Data Tables (The Ledger)
- **Forbid Dividers:** Do not use horizontal lines between rows. Use a 4px vertical gap between row containers.
- **Row Styling:** Rows should be `surface-container-lowest`. On hover, shift the row to `secondary-container` (#d5e3fc) with a 2% opacity increase.
- **Typography:** Header labels must be `label-md` in `outline` (#76777d), all-caps with 0.05em letter spacing.

### Input Fields
- **State:** Instead of a border, use `surface-container-highest` (#e0e3e5) as a solid background.
- **Focus:** Transition the background to `primary-fixed` (#dae2fd) and add a 2px "Ghost Border" of `primary` at 20% opacity.

### Chips
- **Status Chips:** Use `tertiary-container` for "Paid" and `error-container` for "Overdue." Use `full` (9999px) roundedness to contrast against the architectural squareness of the dashboard.

---

## 6. Do's and Don'ts

### Do
- **Do** use `display-lg` for single, impactful data points.
- **Do** use "surface-container" shifts to group related rental properties.
- **Do** allow for generous margins (32px+) between major modules to let the design breathe.
- **Do** use `tertiary` (Emerald) sparingly—it is a beacon, not a primary paint.

### Don't
- **Don't** use 1px borders to separate the sidebar from the main content. Use a background color shift.
- **Don't** use pure black for text. Use `on-surface` (#191c1e) to keep the "ink" feeling soft and readable.
- **Don't** use standard "drop shadows" on cards. Use tonal layering (`surface` levels) instead.
- **Don't** cram data. If a table feels tight, move less important columns into a "detail" drawer.

---

## 7. Signature Interaction: The "Soft Scale"
When a user hovers over a property card or a navigation item, do not just change the color. Apply a subtle `scale(1.01)` transform and shift the background from `surface-container-lowest` to `surface-bright`. This mimics the tactile feel of a physical ledger being pulled slightly forward from a stack.```