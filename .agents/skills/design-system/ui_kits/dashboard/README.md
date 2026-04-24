# The Ledger — Dashboard UI Kit

## Overview
High-fidelity interactive recreation of the Renter Dashboard app.
Covers all primary surfaces: Login, Portfolio Overview, Renter Ledger, Renter Detail Panel, Add Renter Modal.

## Design Width
1280px desktop (responsive down to 375px mobile)

## Files
| File | Description |
|---|---|
| `index.html` | Full interactive prototype — start here |
| `Sidebar.jsx` | Desktop sidebar with nav items + Add Renter CTA |
| `Header.jsx` | Sticky top header, search, profile menu |
| `PortfolioStats.jsx` | KPI stat cards (revenue, occupancy, pending) |
| `RenterCard.jsx` | Ledger row card — default, selected, overdue |
| `RenterDetails.jsx` | Right-panel renter detail + payment history |
| `LoginPage.jsx` | Auth screen |

## Usage
Open `index.html` in any browser. No build step required — uses React + Babel from CDN.

## Icons
Lucide (CDN). All icons are 16–18px, strokeWidth=2, inline SVG via the lucide UMD bundle.

## Fonts
Manrope 700 (headings) + Inter 400/500/600/700 (body) — Google Fonts.
