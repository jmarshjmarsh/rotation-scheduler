# Rotation Scheduler

An anesthesia residency rotation scheduling web app. Built for Jacob's personal use as chief resident.

## Repo
`github.com/jmarshjmarsh/rotation-scheduler` — public, hosted on GitHub Pages.

## Stack
- Vanilla JS + HTML + CSS (no build step, no framework)
- Firebase Firestore for cloud sync (shared state across browsers/users)
- localStorage as local fallback/cache
- Three files: `index.html`, `style.css`, `app.js`, `firebase.js`

## Before working on this
1. `git pull` — always pull first. The other machine may have committed changes.
2. The local clone path is machine-specific. On any machine, clone to a convenient location and work from there.

## Architecture
- `app.js` — all state, rendering, and UI logic
- `firebase.js` — Firestore init, auto-load on startup, manual Save button (`cloudSave()`)
- State is a single `window.state` object, persisted to both localStorage and Firestore
- Storage key: `rotScheduler3` (migrated from `rotScheduler2`)

## Key state structure
- `rotations[]` — ordered list of 17 rotation row names (drag-and-drop reorderable in Settings)
- `rotationSlots{}` — weekly assignments: `{ rowIdx: { weekKey: residentName } }`
- `dailyRotationSlots{}` — manual daily overrides only (falls back to weekly if absent)
- `residents[]` — `{ name, cls }` objects, cls = Intern | CA-1 | CA-2 | CA-3 | CA-4
- `conferences[]` — `{ id, name, start, end }` with MM-DD dates (year-relative)
- `colorRules[]` — `{ id, color, label, start?, end?, rows }` with MM-DD dates

## Date convention
Color rule and conference dates stored as `MM-DD` (not full YYYY-MM-DD). Month ≥ 7 → `academicYearStart`; month < 7 → `academicYearStart + 1`. See `resolveRuleDate()` in app.js.

## Academic year
Default start: 2026 (July 6, 2026 = first Monday). Configurable via year selector in header.
