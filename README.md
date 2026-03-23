# Residency Rotation Scheduler

An interactive anesthesia residency rotation scheduling tool built as a static web app.

## Usage

Open via the GitHub Pages URL or clone and open `index.html` locally. State auto-loads from Firestore on startup and can be saved back to the cloud with the Save button.

## Features

- Weekly and daily rotation views
- 17 configurable rotation rows with drag-and-drop reordering
- Resident management with class (Intern, CA-1 through CA-4) sorting
- Color-coded cells (grey/yellow/blue) with configurable rules
- Conference schedule overlay with sticky-note tabs above the calendar
- Weekly → daily auto-population with manual override support
- Firebase Firestore cloud sync — shared state across all users
- Export/import JSON for backup

## Stack

Vanilla JS + HTML + CSS. No build step. Firebase Firestore for cloud sync, localStorage as local fallback.

## GitHub Pages

Hosted as a GitHub Pages static site.
