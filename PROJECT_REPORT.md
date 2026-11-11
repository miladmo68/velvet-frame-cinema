# Velvet Frame · release report

## Product

Domain: independent cinema discovery and illustrative seat planning. Primary user: filmgoer. Stack: Next.js 16 / React 19 / TypeScript / static GitHub Pages. Distinctive skill: stateful seat-map interaction with deterministic inventory and accessible booking-preview flow.

## Acceptance inventory

- Navigation: brand/top, Films, Showtimes, The cinema, Plan a night, Back to top.
- Discovery: all genre controls, search by title/director, zero-result recovery, all film cards and detail dialogs.
- Schedule: five date selectors, showtime selection, film detail to screening transition.
- Seats: occupied disabled, accessible/companion positions, up to six chosen seats, deselection, mobile scroll hint.
- Tickets: adult/student/senior steppers, seat-count cap, totals, name/email validation.
- Plans: local preview creation, drawer, reload recovery, removal and empty state.
- Accessibility: skip link, visible focus, dialog focus trap/return, Escape, keyboard buttons, reduced-motion behavior.
- Responsive: desktop 1440×900 and phone 390×844 journeys, no page-level horizontal overflow.

## Verification

The factory publisher runs `npm ci`, `npm run validate` (`lint`, `typecheck`, domain tests and production build), `PLAYWRIGHT_USE_SYSTEM_CHROME=1 npm run qa:browser` on the runner's preinstalled Google Chrome before publication. `qa:browser` captures `public/screenshots/desktop.png` and `public/screenshots/mobile.png` from the running production export. Run results and public Pages status must be verified from the relevant GitHub Actions runs before this report is considered complete. No unverified pass is claimed here.

Public links: [repository](https://github.com/miladmo68/velvet-frame-cinema) · [live demo](https://miladmo68.github.io/velvet-frame-cinema/).
