# The 64 Squares

A source-backed, accessible chess reference with a cinematic opening. The home
page starts on a full-screen monochrome board, teaches Scholar's Mate move by
move, then opens into the rules, history, Immortal Game analysis, piece guide,
phases of play, timeline, sources, and FAQ.

A six-page beginner path sits alongside the home page: learn chess, the complete
rules, how the pieces move, the three special moves, Scholar's Mate, and chess
notation. Every guide is pre-rendered as its own URL with unique metadata,
canonical URL, breadcrumbs, FAQ schema, and internal links.

The design stays deliberately black-and-white: typography, the board, the chrome
piece stills, and the scroll choreography carry the art direction.

## What is on the page

- **Interactive opening lesson** — eight steps from the starting position to
  `4. Qxf7#`, with keyboard-accessible controls, progress ticks, and a live
  announcement for the current move.
- **Learn** — rules, special moves, notation, and a five-question beginner FAQ.
- **Story** — Chaturanga, Shatranj, the Immortal Game, the old laws, the modern
  game, and a compact timeline.
- **Pieces and phases** — movement diagrams, piece anatomy, and the opening,
  middlegame, and endgame.
- **Sources and legend notes** — historical claims are linked to sources, while
  disputed or legendary material is explicitly marked as legend.
- **Challenge** — a direct Chess.com challenge card.

## Beginner guide URLs

- `/learn-chess/` — the path overview and first study plan
- `/chess-rules/` — setup, turns, checkmate, draws, and the rules beginners miss
- `/how-chess-pieces-move/` — every piece, its value, and the mistakes to avoid
- `/special-moves/` — castling, en passant, promotion, and check
- `/scholars-mate/` — the four-move mate, its defences, and an interactive lesson link
- `/chess-notation/` — squares, piece letters, captures, checkmate, and annotations

## Stack

- **React 18 + Vite 6** client
- **Node.js + Express** production server
- **GSAP + ScrollTrigger** for the desktop pinned lesson only
- **Three.js at build time** for the six chrome-piece turntable sheets
- **Self-hosted fonts** — Inter, JetBrains Mono, and a small Noto Sans Symbols 2
  chess-glyph subset. No Google Fonts request is made at runtime.
- **WebP** stills and sprite sheets

There is no database. The pages are stateless and the content is versioned in
`client/src/data/chessContent.js` and `client/src/data/guidePages.js`.

## Run locally

```bash
npm install
npm --prefix client install
npm --prefix server install
npm run dev
```

Open `http://localhost:5173`. Vite proxies `/api` requests to the Express server
on `http://localhost:4000`.

## Production build

```bash
SITE_URL=https://your-domain.example npm run build
npm start
```

On Windows PowerShell:

```powershell
$env:SITE_URL = 'https://your-domain.example'
npm run build
npm start
```

`SITE_URL` is required for production because it is used for the canonical URL,
Open Graph/Twitter image URLs, `sitemap.xml`, and `robots.txt`. If it is omitted,
the build uses `http://localhost:4000` as a safe local default.

The build runs three stages:

1. Vite builds the client into `client/dist`.
2. Vite builds the server entry into `client/dist-ssr`.
3. `client/scripts/prerender.mjs` renders the React tree for the home page and
   all six guide routes, injects each route into `#root`, applies per-page
   metadata, inlines the extracted CSS, and writes `sitemap.xml` and
   `robots.txt`.

The browser then hydrates the pre-rendered markup. The page is readable and
fully styled before JavaScript loads.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Run the Express API and Vite dev server together |
| `npm run dev:client` | Run only the React app on port 5173 |
| `npm run dev:server` | Run only the API on port 4000 |
| `npm run build` | Build, server-render, inline CSS, and generate crawl files |
| `npm start` | Serve `client/dist` and the API on port 4000 |
| `npm test` | Run the content, lesson, SEO/SSG, and guide test suites |
| `npm run check` | Playwright smoke test against the local production server |
| `npm run preview` | Write desktop, wide, mobile, and small-screen screenshots to `shots/` |
| `npm run build:pieces` | Re-render the 3D piece sheets and stills |

`npm run check` and `npm run preview` expect `npm start` to be running on
`http://localhost:4000`.

## Responsive behavior

- **Desktop (> 680px, normal motion):** the board is pinned and the Scholar's
  Mate timeline is scrubbed by scroll. The header hides only while the user is
  inside the pinned lesson and returns as soon as the article content begins.
- **Mobile (≤ 680px):** the pinned intro is replaced by a static, one-screen
  step-through with Previous/Next buttons, progress ticks, and a labelled board.
  The article content starts immediately below it. No five-screen scroll trap.
- **Reduced motion:** the static step-through is used at every width, animations
  are disabled, and the native reduced-motion preference is respected.
- **No JavaScript:** the pre-rendered lesson, home content, and all six guide
  pages remain readable and styled; the pages fall back safely to content rather
  than an empty root.

## Accessibility

- Skip link, one `h1`, non-skipping heading order, and section landmarks.
- Visible focus styles and 44px minimum targets for controls.
- 16px body prose and 12px minimum labels, with contrast checked in the
  monochrome palette.
- Board coordinates, diagram labels, descriptive image alternatives, and
  `aria-live` move announcements.
- FAQ built with native `<details>`/`<summary>` elements.
- Mobile navigation supports Escape, `aria-expanded`, and `aria-controls`.
- Tests assert single `h1`, resolved internal anchors, no duplicate IDs, alt
  attributes, metadata lengths, and structured-data types.

## SEO and structured data

- Pre-rendered HTML for every route with a unique title and a 120–160 character
  description.
- Canonical, Open Graph, Twitter cards, favicon, Apple touch icon, and a
  generated `og-image.png` on every page.
- `sitemap.xml` with the home page and all six guide URLs, `robots.txt`, and
  clean 404 behavior.
- JSON-LD: `WebSite`, `Article`, `BreadcrumbList`, `FAQPage`, and `HowTo`.
- Source links and a visible FAQ that match the structured data.
- Internal links from the home page, the guide sidebar, the previous/next pager,
  and the footer.

## Project layout

```
client/
  index.html                 # base metadata and font preload
  scripts/prerender.mjs      # SSG injection, inline CSS, sitemap/robots
  src/
    components/
      ChessBoard.jsx         # board, pieces, mate state, coordinates
      HistoryScroll.jsx      # pinned desktop scrub + static mobile lesson
      SiteHeader.jsx         # navigation and mobile menu
      SiteFooter.jsx         # shared footer and guide index
      LearnGuide.jsx         # rules, special moves, notation
      Faq.jsx                # native accessible FAQ
      PieceGuide.jsx         # piece cards, diagrams, portraits
      ModernTimeline.jsx     # modern chess timeline
      Sources.jsx            # source list and further reading
      StructuredData.jsx     # home-page JSON-LD
      GuideStructuredData.jsx # guide Article/Breadcrumb/FAQ/HowTo JSON-LD
      Reveal.jsx             # reduced-motion-aware reveal
    pages/
      GuidePage.jsx          # shared beginner-guide article shell
    assets/fonts/            # self-hosted woff2 files
    assets/pieces/           # generated sheets and stills
    data/
      board.js               # files, glyphs, starting pieces
      scholarsMate.js        # eight lesson positions and labels
      chessContent.js        # home page copy and source-backed claims
      guidePages.js          # six guide routes, copy, FAQs, and sources
    App.jsx                  # home page and guide route switch
    styles.css
server/
  index.js                   # API, security headers, caching, SPA fallback
tests/
  content.test.mjs
  lesson.test.mjs
  seo.test.mjs
  guides.test.mjs            # guide data, SSG, schema, links, sitemap
scripts/
  check.mjs                  # Playwright smoke test
  preview.mjs                # responsive screenshot generation
  build-pieces.mjs           # Three.js piece sheet pipeline
```

## Verification snapshot

- `npm test`: 25/25 passing.
- `npm run check`: 41/41 passing.
- Lighthouse desktop: 100 performance, 100 accessibility, 100 best practices,
  100 SEO.
- Lighthouse mobile home: 96 performance, 100 accessibility, 100 best practices,
  100 SEO.
- Lighthouse desktop and mobile guides: 100/98 performance, with 100
  accessibility, best practices, and SEO.

Mobile performance is intentionally measured with the full art direction
enabled. The remaining opportunity is the desktop-only GSAP/ScrollTrigger code
sharing the initial bundle with the static mobile lesson; the 3D sprite sheets
themselves are blocked from loading on phones and reduced-motion devices.
