# Importing this project into Lovable

This archive contains the complete app source for **The 64 Squares**, a React +
Vite chess-history landing page with an optional Express content API.

## What is inside

```
client/            React + Vite frontend (this is the app)
  src/assets/      Board and generated piece resources
  src/components/  Board, scroll story, 3D pieces, piece guide
server/            Optional Express API (GET /api/content)
scripts/           Offline 3D piece renderer and Playwright checks
shots/             Preview screenshots and clean 1920×1080 board renders
code.html          Original Stitch export (reference only)
DESIGN.md          Original design notes (reference only)
screen.png         Original Stitch screen (reference only)
```

`node_modules`, build output (`client/dist`) and environment files are not
included. The five turned-piece source PNGs live under `chess pieces/`, and the
three knight reference views (`knight-hero.png`, `knight-profile.png` and
`knight-rear.png`) live under `kniight 3d/` in the full workspace. The app itself
uses the generated `set-*.webp` stills and turntable sheets, not the source
renders.

## Import

1. In Lovable, open the dashboard, click **+**, and choose
   **Import project to Lovable**.
2. Under **Code & web**, choose **Upload code**, then upload this ZIP.
3. Let Lovable inspect and rebuild the app.

Lovable rebuilds imports as a new project, so it may reorganize the code. The
frontend lives in `client/`; the page itself does not require the API because
`client/src/App.jsx` falls back to the bundled content in
`client/src/data/chessContent.js` when `/api/content` is unavailable.

## Run locally

```bash
npm install
npm --prefix client install
npm --prefix server install
npm run dev
```

Frontend: `http://localhost:5173` — API: `http://localhost:4000`

Production build:

```bash
npm run build
npm start
```

## Reusable resources

- **3D piece turntable sheets:** `client/src/assets/pieces/*.webp` — six 6×12
  sprite sheets, 72 frames each, 420×525 per cell.
- **Supplied-set stills:** `client/src/assets/pieces/set-*.webp` — trimmed,
  de-fringed versions of the supplied dark-chrome renders (the knight still uses
  `knight-hero.png`), used by the anatomy portraits and mobile fallbacks.
- **Knight reference views:** `kniight 3d/` — the hero, profile and rear renders
  used as visual references for the procedural knight geometry.
- **Preview screenshots:** `shots/` — desktop, wide and mobile views, anatomy
  detail, and clean board renders.
- **Design tokens and notes:** `DESIGN.md` and `client/src/styles.css`.
- **All copy:** `client/src/data/chessContent.js`.
- **Regeneration tools:** `scripts/build-pieces.mjs`,
  `scripts/pieces/gen.js`, `scripts/pieces/extract-set.py` and
  `scripts/pieces/set-profiles.js`.

The original Stitch files (`code.html`, `DESIGN.md`, `screen.png`) are included
untouched for reference.
