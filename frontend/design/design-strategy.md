# Design System Strategy: The Curated Ledger

## 1. Overview & Creative North Star
**Creative North Star: "The Architectural Editor"**
In the world of property and rent management, professional reliability meets architectural precision. "The Curated Ledger" is designed to feel like a high-end architectural firm's internal tool: clean, structured, and authoritative, yet accessible and modern.

## 2. Visual Principles
- **Structured Clarity:** Use a rigorous grid system. Information should be compartmentalized into clear, logical containers to reduce cognitive load for property managers handling complex data.
- **Intentional Negative Space:** Generous padding and margins are essential. The UI should breathe, avoiding the "cluttered spreadsheet" feel often found in legacy financial tools.
- **Refined Materiality:** Use subtle shadows and tonal shifts rather than heavy borders. The "Material" of the UI should feel like premium paper or polished stone—substantial but light.
- **Data as Hero:** Numbers and status indicators should be high-contrast and easy to scan. Use typography to create a clear hierarchy within data sets.

## 3. Design Tokens

### Color Palette
- **Primary (Slate 900):** `#0F172A` - Used for primary text, main buttons, and high-emphasis elements. Represents stability and authority.
- **Secondary/Accent (Emerald 600):** `#059669` - Used for positive growth metrics, "Paid" statuses, and subtle interactive highlights. Represents prosperity and health.
- **Surface (White/Slate 50):** `#FFFFFF` / `#F8FAFC` - Used for card backgrounds and the main application background.
- **Warning/Error (Rose 500):** `#F43F5E` - Used for "Overdue" statuses and critical maintenance alerts.

### Typography
- **Headlines (Manrope):** Bold, geometric, and modern. Used for page titles and large metrics to convey confidence.
- **Body & Data (Inter):** Highly legible, neutral sans-serif. Used for all labels, table data, and secondary text.
- **Scale:**
  - H1: 24px/32px (Bold)
  - H2: 20px/28px (Semibold)
  - Body: 14px/20px (Regular)
  - Caption/Label: 12px/16px (Medium, Uppercase for section headers)

### Shape & Elevation
- **Border Radius:** `4px` (Small) for a precise, architectural feel. Avoid overly rounded corners.
- **Shadows:** `0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)` (Small) for cards. Most elements should feel flat and integrated into the surface.

## 4. UI Components & Patterns

### Navigation Shell
- **Side Nav:** A fixed, light-gray column (`Slate 50`) on the left. Icons should be minimal (Outline style). The active state uses the accent color (`Emerald 600`) with a vertical bar indicator.
- **Top Bar:** A transparent or white header with a search bar and user profile. Minimalist and unobtrusive.

### Cards & Containers
- Cards should have a white background, a very subtle border (`Slate 200`), and minimal padding (usually `24px`).
- Use "Status Pills" for data states (e.g., Paid, Overdue, Pending) with soft background colors and high-contrast text.

### Data Visualization
- Line charts should be clean with minimal grid lines.
- Use primary colors for primary metrics and neutral tones for comparison data.

## 5. Tone & Voice
The interface should "speak" with professional brevity. Use clear, nouns-first labels (e.g., "Total Revenue" instead of "Your total revenue this month"). The goal is efficiency and accuracy.
