# Design System: Editorial Authority

## 1. Overview & Creative North Star: "The Architectural Curator"
This design system moves away from the cluttered, "widget-heavy" aesthetic of traditional dashboards toward a high-end, editorial experience. The Creative North Star is **"The Architectural Curator."** 

Like a modern gallery or a premium architectural firm, the UI prioritizes structural integrity, vast "white space" (breathing room), and a hierarchy defined by tonal depth rather than decorative lines. We break the "template" look by using intentional asymmetry—placing high-contrast typography against soft, layered surfaces. Every element should feel intentional, permanent, and authoritative.

---

## 2. Brand Identity & Logo
The brand identity serves as the foundation of trust and precision within the system.

*   **Logo Design:** A minimalist architectural icon—composed of clean, geometric lines representing a structure or pillar—paired with the wordmark **"THE LEDGER"**. Can be found at `frontend/src/assets/logo.svg`.
*   **Typography:** The wordmark is set in **Manrope**, Extra-Bold weight. To achieve a premium, authoritative feel, apply a wide letter-spacing (tracking) of +5% to +10%.
*   **Color Application:** 
    *   **Light Mode:** Use **Slate 900 (#0F172A)** for the icon and wordmark to ensure maximum contrast and gravitas.
    *   **Dark Mode:** Use **White (#FFFFFF)**.
*   **Placement Strategy:**
    *   **Authentication/Entry:** On login and splash screens, the logo must be centered and prominent, acting as a "seal of quality."
    *   **Operational Context:** Within internal dashboards, the logo scales down and integrates into the top-left of the navigation bar or the header of the sidebar, maintaining brand presence without competing with user data.

---

## 3. Colors & Surface Philosophy
Our palette is rooted in stability. We use deep blues and greys to establish trust, while the emerald green (`tertiary`) acts as a precise surgical tool for success states and calls to action.

### The "No-Line" Rule
**Prohibit 1px solid borders for sectioning.** Boundaries must be defined solely through background color shifts. Use `surface-container-low` sections sitting on a `surface` background to define areas of interest. Lines are artifacts of the past; tonal transitions are the future.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers—like stacked sheets of fine paper.
*   **Level 0 (Base):** `surface` (#faf8ff) – The canvas.
*   **Level 1 (Sections):** `surface-container-low` (#f2f3ff) – Large content blocks.
*   **Level 2 (Interaction):** `surface-container` (#eaedff) – Cards and active areas.
*   **Level 3 (Elevation):** `surface-container-highest` (#dae2fd) – Floating menus or high-priority callouts.

### The "Glass & Signature" Rule
*   **Glassmorphism:** For floating modals or navigation overlays, use a semi-transparent `surface` color with a `backdrop-blur` (20px–30px). This allows the colors of the underlying "architecture" to bleed through.
*   **Signature Textures:** For primary CTAs, use a subtle gradient transitioning from `primary` (#000000) to `primary_container` (#131b2e) to provide a "sheen" that flat color lacks.

---

## 4. Typography
We use **Manrope** exclusively to maintain a monolinear, modern, yet technical feel.

| Role | Token | Size | Weight / Note |
| :--- | :--- | :--- | :--- |
| **Display** | `display-lg` | 3.5rem | Light/Regular weight, tight leading for impact. |
| **Headline**| `headline-md` | 1.75rem | Bold. Used for section starts. |
| **Title**   | `title-lg` | 1.375rem | Medium. Used for card headers. |
| **Body**    | `body-lg` | 1rem | Regular. Optimized for readability. |
| **Label**   | `label-md` | 0.75rem | All-caps with wide tracking for "THE LEDGER" sub-branding. |

**Editorial Intent:** Use `display-sm` for empty states or welcome messages to create an "editorial splash" rather than a standard system notification.

---

## 5. Elevation & Depth
Depth is achieved through **Tonal Layering** rather than shadows.

*   **The Layering Principle:** Place a `surface-container-lowest` (#ffffff) card on a `surface-container-low` (#f2f3ff) section. This creates a soft, natural lift.
*   **Ambient Shadows:** If an element must "float" (e.g., a dropdown), use a shadow with a 32px blur, 0% spread, and 6% opacity using a tint of `on-surface` (#131b2e). It should feel like an environmental occlusion, not a "drop shadow."
*   **The "Ghost Border" Fallback:** If accessibility requires a stroke, use `outline-variant` (#c6c6cd) at **15% opacity**. It should be felt, not seen.

---

## 6. Components

### Buttons
*   **Primary:** Solid `primary` (#000000) with `on-primary` (#ffffff) text. Corner radius: `md` (0.375rem).
*   **Secondary:** `surface-container-high` (#e2e7ff) background. No border.
*   **Tertiary (Emerald):** Use `tertiary-container` (#002114) with `tertiary-fixed` (#85f8c4) text for high-signal actions like "Receive Payment."

### Input Fields
*   **Styling:** Use a "filled" style using `surface-container-highest`. 
*   **Focus:** Transition the background to `surface-container-lowest` and add a 2px bottom-bar in `primary`. Avoid full-perimeter focus rings.

### Cards & Lists
*   **The No-Divider Rule:** Never use horizontal lines to separate list items. Use 16px–24px of vertical white space or alternate row colors using `surface` and `surface-container-low`.

### Signature Component: The "Ledger Stat"
A large `display-md` value paired with a `label-sm` descriptor in all-caps, placed within a `surface-container-lowest` card. This emphasizes the data-heavy nature of the system with an editorial flair.

---

## 7. Do's & Don'ts

### Do
*   **Do** use wide letter-spacing on labels to evoke a sense of luxury.
*   **Do** embrace asymmetry. A left-heavy layout with wide right margins feels custom and professional.
*   **Do** use `surface-dim` for inactive or "backgrounded" content to pull it away from the user's focus.

### Don't
*   **Don't** use pure black (#000000) for long-form body text; use `on-surface` (#131b2e) for a softer, premium read.
*   **Don't** use standard "Material" shadows. If it looks like a default shadow, it is too heavy.
*   **Don't** use "Alert Red" for anything but critical errors. Use `error_container` for a more sophisticated, muted warning.
*   **Don't** use standard "drop shadows" on cards. Use tonal layering (`surface` levels) instead.

---

## 8. Signature Interaction: The "Soft Scale"
When a user hovers over a property card or a navigation item, do not just change the color. Apply a subtle `scale(1.01)` transform and shift the background from `surface-container-lowest` to `surface-bright`. This mimics the tactile feel of a physical ledger being pulled slightly forward from a stack.