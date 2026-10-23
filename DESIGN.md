# Design system — The 64 Squares

## Direction

**Monochrome editorial chess archive.** The site should feel like a printed
chess supplement crossed with a dark tournament hall: high-contrast type, a
full-bleed board, chrome pieces, hairline rules, and no decorative colour.
Colour is information, not decoration. The only non-greyscale accent is the
restrained red used for the mate mark and the challenge context.

The cinematic premise is simple: the board is the stage, the typography is the
commentary, and the scroll is the clock. Preserve that.

## Colour

| Token | Value | Use |
| --- | --- | --- |
| `--bg` | `#080808` | Page ground |
| `--white` | `#f5f5f2` | Primary type |
| `--muted` | `rgba(245,245,242,.72)` | Secondary prose |
| `--faint` | `rgba(245,245,242,.56)` | Metadata, captions |
| `--line` | `rgba(245,245,242,.14)` | Rules and borders |
| `--line-soft` | `rgba(245,245,242,.08)` | Quiet dividers |
| Light square | `#f2f2f2` | Board |
| Dark square | `#101010` | Board |

No gold, no warm cream, no blue links. Links inherit the text colour and are
differentiated by underline, placement, or context. Focus rings are white.

## Typography

- **Inter** (variable, 100–500): display lines, prose, navigation.
- **JetBrains Mono** (300–400): notation, labels, counters, metadata.
- **Noto Sans Symbols 2** (subset): chess glyphs only.

Display lines are light, uppercase, tightly tracked, and generous. Body prose is
16px minimum with 1.6–1.75 line-height. Labels are 12px minimum and use the mono
face. Do not use weight below 200 for long prose.

Self-host all three. Do not reintroduce a Google Fonts stylesheet; the font files
are imported through `client/src/styles.css` and hashed by Vite.

## Layout

### Desktop (>680px, normal motion)

- A 100svh pinned lesson owns the viewport.
- The board is full-bleed, with a left-to-right scrim making the text column
  legible. The text column is capped near 30rem.
- The current lesson frame sits above the board; progress ticks and Previous/Next
  controls sit at the bottom edge.
- Article content begins when the pin releases.
- The header is visible at the top, hides inside the pinned lesson, and returns
  at `#main-content`. Do not let it cover the board while the lesson is active.

### Mobile (≤680px)

- No pinned scroll trap. Use the static step-through: headline and lesson copy
  first, stacked board second, controls third.
- The content must begin within roughly one screen of the hero; currently
  ~859px at 390×844.
- Board coordinates remain visible. The board is a square, not a stretched
  viewport fill.
- Keep Previous/Next and progress ticks at 44px minimum height. The header stays
  visible on mobile.
- The mobile menu is a full-height panel; Escape closes it and returns focus to
  the toggle.

### Reduced motion

Use the same static step-through at every width. Remove the pin, the scroll
scrub, reveals, parallax, and the 3D spin. The content must remain complete and
navigable.

## The hero lesson

- Eight frames: opening plus seven move steps to Scholar’s Mate.
- The corrected line is:

```
1. e4      e5
2. Bc4     Nc6
3. Qh5     Nf6??
4. Qxf7#
```

- The final frame rotates the black king and places a red mate mark on f7.
- Desktop scrub: GSAP ScrollTrigger, one viewport of scroll per frame, with piece
  movement between steps. Keep the scrub smooth but never hide the current
  lesson copy.
- Mobile/reduced: buttons advance discrete positions; no scroll-linked board
  animation.
- “Scroll to move” is a button. Its accessible name must contain the visible
  text. The cue disappears after the user starts scrolling.

## Components

### Board

- 8×8 CSS grid, coordinates outside the squares, pieces rendered as glyphs with
  the symbols font.
- Light/dark squares stay flat and crisp. Hover states are limited to diagrams.
- The mate square uses a thin red mark; do not add a coloured overlay.

### Lesson controls

- 44×44px ticks, arrow buttons, and cue. Visible white progress line.
- Ticks are buttons with labels for each step, not decorative divs.
- The live region announces the move and frame title.

### Article sections

- `SectionHead` supplies a mono kicker, an `h2`, and optional standfirst.
- Use hairline rules and generous vertical space instead of cards-in-cards.
- Prose stays narrow; diagrams and PGN may break wider.
- Every historical claim is either linked to a source or labelled as legend.

### FAQ

Native `<details>`/`<summary>`. Answers are 16px prose, one question per item.
The visible FAQ and the `FAQPage` JSON-LD must stay in sync.

### 3D chrome pieces

- Six build-time turntable sheets, one per piece.
- Loaded only on desktop at ≥1025px, only near the viewport, and never on
  mobile/reduced motion.
- Mobile and reduced motion use the small WebP stills.
- Do not let the sheets enter the initial mobile payload.

### Header and footer

- Header is a compact fixed bar with wordmark, section links, and a challenge CTA.
- Footer repeats the section map, sources link, and API status.
- Status text is a live region only when it changes; do not announce decorative
  metadata.

## Accessibility contract

- One `h1`; `h2` for sections; no skipped levels.
- Skip link goes to `#main-content`, which is focusable.
- All interactive controls are real buttons/links with visible focus.
- 44px minimum targets; 16px body prose; 12px minimum labels.
- Images have alt text or are explicitly decorative with empty `alt`.
- No colour-only meaning. The mate state also uses shape and position.
- No-JS users receive the pre-rendered page, styled inline, with readable
  content. They lose the step controls and menu toggle, not the content.
- Test with keyboard-only navigation, reduced motion, 200% zoom, and a phone.

## Performance and asset rules

- Fonts are self-hosted, preloaded where critical, and subset to latin/chess
  glyphs.
- The extracted CSS is inlined at prerender so the first paint is styled.
- Hashed assets are immutable; HTML is `no-cache`.
- Mobile performance budget: keep the initial payload under ~700KB and block
  desktop sprite sheets.
- Do not add a heavy runtime dependency for an effect that CSS can do.
- Keep the remaining GSAP usage confined to the desktop lesson and piece
  parallax.

## Content integrity

The Immortal Game is presented as record plus legend. The move list uses
`19... Qxa1+`; the king walk and the “mate in two” framing are labelled as
legend where appropriate. Shatranj is dated to the sixth century, with later
early masters. Sources are visible in the page, not only in comments.

## Definition of done

- `npm test` passes.
- `npm run check` passes against the production server.
- Desktop Lighthouse: 100/100/100/100.
- Mobile Lighthouse: 100 accessibility, best practices, and SEO; performance
  measured honestly with the art direction enabled.
- Responsive screenshots exist for desktop, wide, mobile, and small screens.
- No console errors, no horizontal overflow, no broken internal anchors.
