import { useEffect, useRef } from 'react';
import { useMediaQuery } from '../hooks/useMediaQuery';
import pawnSheet from '../assets/pieces/pawn.webp';
import knightSheet from '../assets/pieces/knight.webp';
import bishopSheet from '../assets/pieces/bishop.webp';
import rookSheet from '../assets/pieces/rook.webp';
import queenSheet from '../assets/pieces/queen.webp';
import kingSheet from '../assets/pieces/king.webp';
import pawnStill from '../assets/pieces/set-pawn.webp';
import knightStill from '../assets/pieces/set-knight.webp';
import bishopStill from '../assets/pieces/set-bishop.webp';
import rookStill from '../assets/pieces/set-rook.webp';
import queenStill from '../assets/pieces/set-queen.webp';
import kingStill from '../assets/pieces/set-king.webp';

const SHEETS = {
  pawn: pawnSheet,
  knight: knightSheet,
  bishop: bishopSheet,
  rook: rookSheet,
  queen: queenSheet,
  king: kingSheet,
};

const STILLS = {
  pawn: pawnStill,
  knight: knightStill,
  bishop: bishopStill,
  rook: rookStill,
  queen: queenStill,
  king: kingStill,
};

const FRAMES = 72;
const COLS = 6;
const CELL_W = 420;
const CELL_H = 525;
const SCROLL_PX_PER_FRAME = 12;

const sheetCache = new Map();

function sheetFor(piece) {
  if (sheetCache.has(piece)) return sheetCache.get(piece);

  const entry = {
    image: new Image(),
    ready: false,
    failed: false,
    waiters: new Set(),
  };
  entry.image.decoding = 'async';
  entry.image.onload = () => {
    entry.ready = true;
    entry.waiters.forEach((waiter) => waiter());
    entry.waiters.clear();
  };
  entry.image.onerror = () => {
    entry.failed = true;
    entry.waiters.clear();
  };
  entry.image.src = SHEETS[piece] ?? SHEETS.queen;
  sheetCache.set(piece, entry);
  return entry;
}

function whenSheetReady(piece, callback) {
  const entry = sheetFor(piece);
  if (entry.ready) {
    callback();
    return () => {};
  }
  if (entry.failed) return () => {};

  let active = true;
  const waiter = () => {
    if (active) callback();
  };
  entry.waiters.add(waiter);
  return () => {
    active = false;
    entry.waiters.delete(waiter);
  };
}

export function PieceStill({ piece = 'queen', className = '' }) {
  return (
    <span className={`piece3d piece3d--still ${className}`.trim()}>
      <img
        src={STILLS[piece] ?? STILLS.queen}
        alt=""
        loading="lazy"
        decoding="async"
      />
    </span>
  );
}

export default function Piece3D({
  piece = 'queen',
  className = '',
  phase = 0,
}) {
  const frameRef = useRef(null);
  const canvasRef = useRef(null);
  const smallViewport = useMediaQuery('(max-width: 1024px)');
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  useEffect(() => {
    // The sprite sheets are for the desktop spin only. Check the media query
    // directly so a phone never downloads them during the hydration frame
    // before useMediaQuery has updated.
    if (
      smallViewport ||
      reducedMotion ||
      typeof window === 'undefined' ||
      !window.matchMedia('(min-width: 1025px)').matches
    ) {
      return undefined;
    }

    const frame = frameRef.current;
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!frame || !canvas || !context) return undefined;

    let entry = null;
    let readyCleanup = null;
    const baseFrame = ((phase % FRAMES) + FRAMES) % FRAMES;

    let currentFrame = -1;
    let framePosition = baseFrame;
    let onScreen = false;
    let lastScrollY = window.scrollY;
    let scrollFrame = 0;

    const draw = (rawFrame, force = false) => {
      if (!entry?.ready || entry.failed) return;
      const wrapped = ((rawFrame % FRAMES) + FRAMES) % FRAMES;
      const frameIndex = Math.floor(wrapped);
      if (frameIndex === currentFrame && !force) return;

      const bounds = canvas.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return;

      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.round(bounds.width * ratio);
      const height = Math.round(bounds.height * ratio);

      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }

      const column = frameIndex % COLS;
      const row = Math.floor(frameIndex / COLS);
      context.clearRect(0, 0, width, height);
      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = 'high';
      context.drawImage(
        entry.image,
        column * CELL_W,
        row * CELL_H,
        CELL_W,
        CELL_H,
        0,
        0,
        width,
        height
      );

      currentFrame = frameIndex;
      canvas.dataset.frame = String(frameIndex);
      canvas.dataset.ready = 'true';
      frame.classList.add('is-ready');
    };

    const ensureReady = () => {
      if (!entry) entry = sheetFor(piece);
      if (readyCleanup) return;
      readyCleanup = whenSheetReady(piece, () => {
        if (onScreen) draw(reducedMotion ? 0 : framePosition, true);
      });
    };

    const resizeObserver = new ResizeObserver(() => {
      if (entry?.ready) {
        draw(reducedMotion ? 0 : framePosition, true);
      }
    });
    resizeObserver.observe(frame);

    const syncScrollSpin = () => {
      scrollFrame = 0;
      const scrollY = window.scrollY;
      const delta = scrollY - lastScrollY;
      lastScrollY = scrollY;

      const bounds = frame.getBoundingClientRect();
      const near =
        bounds.bottom > -320 && bounds.top < window.innerHeight + 320;
      const screen = bounds.bottom > 0 && bounds.top < window.innerHeight;
      const entered = screen && !onScreen;

      if (near) ensureReady();

      if (reducedMotion) {
        if (screen && entry?.ready) draw(0, entered);
        onScreen = screen;
        return;
      }

      if (screen) {
        if (entered) {
          if (entry?.ready) draw(framePosition, true);
        } else if (delta !== 0) {
          framePosition += delta / SCROLL_PX_PER_FRAME;
          if (entry?.ready) draw(framePosition);
        }
      }

      onScreen = screen;
    };
    const onScroll = () => {
      if (!scrollFrame) {
        scrollFrame = window.requestAnimationFrame(syncScrollSpin);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    const initialSync = window.requestAnimationFrame(syncScrollSpin);

    return () => {
      if (readyCleanup) readyCleanup();
      resizeObserver.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (scrollFrame) window.cancelAnimationFrame(scrollFrame);
      if (initialSync) window.cancelAnimationFrame(initialSync);
    };
  }, [piece, phase, reducedMotion, smallViewport]);

  if (smallViewport || reducedMotion) {
    return <PieceStill piece={piece} className={className} />;
  }

  return (
    <span ref={frameRef} className={`piece3d ${className}`.trim()}>
      <canvas
        ref={canvasRef}
        data-piece3d="true"
        data-piece={piece}
        aria-hidden="true"
      />
    </span>
  );
}
