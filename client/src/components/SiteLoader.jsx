import { useEffect, useRef, useState } from 'react';
import { preloadSheets, preloadStills } from '../lib/pieceAssets';

const FILES = 'abcdefgh';
const START_SQUARE = 'd4';
const START_POINT = { x: 3, y: 4 };

// Every legal knight direction from d4. Each move slides two squares first,
// then one square across, and returns along exactly the same path.
const KNIGHT_DIRECTIONS = [
  { corner: { x: 3, y: 2 }, target: { x: 4, y: 2 } },
  { corner: { x: 3, y: 2 }, target: { x: 2, y: 2 } },
  { corner: { x: 1, y: 4 }, target: { x: 1, y: 3 } },
  { corner: { x: 1, y: 4 }, target: { x: 1, y: 5 } },
  { corner: { x: 3, y: 6 }, target: { x: 2, y: 6 } },
  { corner: { x: 3, y: 6 }, target: { x: 4, y: 6 } },
  { corner: { x: 5, y: 4 }, target: { x: 5, y: 5 } },
  { corner: { x: 5, y: 4 }, target: { x: 5, y: 3 } },
];

const MOVES = KNIGHT_DIRECTIONS.flatMap(({ corner, target }) => [
  { waypoints: [START_POINT, corner, target], outbound: true },
  { waypoints: [target, corner, START_POINT], outbound: false },
]);

const PRELOADER_KEY = '64-squares:preloader-seen';
const MOVE_MS = 300;
const START_DELAY = 260;
const CYCLE_MS = MOVES.length * MOVE_MS;
const MINIMUM_LOADER_MS = START_DELAY + CYCLE_MS + 300;

const squareAt = (point) =>
  `${FILES[Math.round(point.x)]}${8 - Math.round(point.y)}`;

const SQUARES = Array.from({ length: 64 }, (_, index) => {
  const file = index % 8;
  const rank = 8 - Math.floor(index / 8);
  return { name: `${FILES[file]}${rank}` };
});

function pointOnPath(waypoints, progress) {
  const lengths = waypoints.slice(1).map((point, index) => {
    const start = waypoints[index];
    return Math.hypot(point.x - start.x, point.y - start.y);
  });
  const total = lengths.reduce((sum, length) => sum + length, 0);
  let remaining = progress * total;

  for (let index = 0; index < lengths.length; index += 1) {
    const length = lengths[index];
    if (remaining <= length || index === lengths.length - 1) {
      const start = waypoints[index];
      const end = waypoints[index + 1];
      const t = length === 0 ? 0 : Math.min(1, remaining / length);
      return {
        x: start.x + (end.x - start.x) * t,
        y: start.y + (end.y - start.y) * t,
      };
    }
    remaining -= length;
  }

  return waypoints[waypoints.length - 1];
}

export default function SiteLoader() {
  const [phase, setPhase] = useState('loading');
  const gridRef = useRef(null);
  const knightRef = useRef(null);
  const failsafeRef = useRef(null);
  const skipRef = useRef(false);
  const initialisedRef = useRef(false);

  useEffect(() => {
    if (initialisedRef.current) return;
    initialisedRef.current = true;

    let seen = false;
    try {
      seen = window.sessionStorage.getItem(PRELOADER_KEY) === '1';
    } catch (error) {
      seen = false;
    }

    if (!seen) {
      try {
        window.sessionStorage.setItem(PRELOADER_KEY, '1');
      } catch (error) {
        // Private browsing can reject writes; the loader still works.
      }
      return;
    }

    skipRef.current = true;
    setPhase('done');
  }, []);

  useEffect(() => {
    if (skipRef.current) return undefined;
    let cancelled = false;
    const desktop = window.matchMedia('(min-width: 1025px)').matches;
    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    const stills = preloadStills();
    const fonts = document.fonts?.ready ?? Promise.resolve();
    const sheets =
      desktop && !reducedMotion ? preloadSheets() : Promise.resolve([]);
    const sheetWindow = new Promise((resolve) => setTimeout(resolve, 4200));
    const minimum = new Promise((resolve) =>
      setTimeout(resolve, reducedMotion ? 1600 : MINIMUM_LOADER_MS)
    );

    Promise.allSettled([
      stills,
      fonts,
      Promise.race([sheets, sheetWindow]),
      minimum,
    ]).then(() => {
      if (!cancelled) setPhase('closing');
    });

    failsafeRef.current = setTimeout(() => {
      if (!cancelled) setPhase('closing');
    }, 12000);

    return () => {
      cancelled = true;
      clearTimeout(failsafeRef.current);
    };
  }, []);

  useEffect(() => {
    if (phase !== 'closing') return undefined;
    clearTimeout(failsafeRef.current);
    const timer = setTimeout(() => setPhase('done'), 550);
    return () => clearTimeout(timer);
  }, [phase]);

  useEffect(() => {
    if (phase === 'done') clearTimeout(failsafeRef.current);
  }, [phase]);

  useEffect(() => {
    if (skipRef.current) return undefined;
    const knight = knightRef.current;
    const grid = gridRef.current;
    if (!knight || !grid || typeof window === 'undefined') return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return undefined;
    }

    const tiles = new Map(
      [...grid.querySelectorAll('[data-square]')].map((tile) => [
        tile.dataset.square,
        tile,
      ])
    );
    const setLit = (square, lit) => {
      tiles.get(square)?.classList.toggle('is-lit', lit);
    };
    // The lit squares are a trail, not a cursor: once a square is crossed it
    // stays white until the loader leaves. Only the knight returns to d4.
    const centreKnight = () => {
      knight.style.setProperty('--knight-x', '300%');
      knight.style.setProperty('--knight-y', '400%');
    };

    let frame = 0;
    const start = performance.now() + START_DELAY;
    const easeInOut = (value) =>
      value < 0.5
        ? 4 * value ** 3
        : 1 - (-2 * value + 2) ** 3 / 2;

    const tick = (now) => {
      const elapsed = Math.max(0, now - start);

      if (elapsed >= CYCLE_MS) {
        centreKnight();
        return;
      }

      const moveIndex = Math.floor(elapsed / MOVE_MS);
      const progress = easeInOut((elapsed % MOVE_MS) / MOVE_MS);
      const move = MOVES[moveIndex];

      const point = pointOnPath(move.waypoints, progress);

      if (move.outbound) {
        setLit(squareAt(point), true);
      }

      knight.style.setProperty('--knight-x', `${point.x * 100}%`);
      knight.style.setProperty('--knight-y', `${point.y * 100}%`);

      frame = window.requestAnimationFrame(tick);
    };

    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (skipRef.current) return undefined;
    const loading = phase !== 'done';
    document.documentElement.classList.toggle('is-preloading', loading);
    const regions = document.querySelectorAll(
      'main, .site-header, .site-footer'
    );
    regions.forEach((region) => {
      region.inert = loading;
    });

    return () => {
      document.documentElement.classList.remove('is-preloading');
      regions.forEach((region) => {
        region.inert = false;
      });
    };
  }, [phase]);

  if (phase === 'done') return null;

  return (
    <div
      className={`site-loader${phase === 'closing' ? ' is-closing' : ''}`}
      role="status"
      aria-live="polite"
      aria-busy={phase === 'loading'}
      data-site-loader="true"
    >
      <div className="site-loader__stage">
        <div className="site-loader__grid" ref={gridRef} aria-hidden="true">
          {SQUARES.map((square) => (
            <span
              key={square.name}
              className={`site-loader__tile${
                square.name === START_SQUARE ? ' is-lit' : ''
              }`}
              data-square={square.name}
            />
          ))}

          <span
            className="site-loader__knight"
            ref={knightRef}
            style={{
              '--knight-x': '300%',
              '--knight-y': '400%',
            }}
          >
            <span className="site-loader__knight-piece" aria-hidden="true">
              <svg
                className="site-loader__knight-svg"
                viewBox="4 1 16 22"
                role="presentation"
                focusable="false"
              >
                <path
                  d="M19 22H5V20H19V22M13 2C11.75 2 10.58 2.62 9.89 3.66L7 8L9 10L11.06 8.63C11.5 8.32 12.14 8.44 12.45 8.9L12.5 9C12.8 9.59 12.69 10.3 12.22 10.77L7.42 15.57C6.87 16.13 6.87 17.03 7.43 17.58C7.69 17.84 8.05 18 8.42 18H17V6A4 4 0 0 0 13 2Z"
                  fill="#f5f5f2"
                  stroke="#000"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                  paintOrder="stroke"
                />
              </svg>
            </span>
          </span>
        </div>
      </div>

      <span className="sr-only">Loading the chess archive.</span>
    </div>
  );
}
