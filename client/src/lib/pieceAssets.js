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

export const PIECE_SHEETS = Object.freeze({
  pawn: pawnSheet,
  knight: knightSheet,
  bishop: bishopSheet,
  rook: rookSheet,
  queen: queenSheet,
  king: kingSheet,
});

export const PIECE_STILLS = Object.freeze({
  pawn: pawnStill,
  knight: knightStill,
  bishop: bishopStill,
  rook: rookStill,
  queen: queenStill,
  king: kingStill,
});

const imageCache = new Map();

function entryFor(src) {
  if (imageCache.has(src)) return imageCache.get(src);

  const entry = {
    image: new Image(),
    ready: false,
    failed: false,
    waiters: new Set(),
  };

  const settle = (ready) => {
    entry.ready = ready;
    entry.failed = !ready;
    entry.waiters.forEach((waiter) => waiter(entry));
    entry.waiters.clear();
  };

  entry.image.decoding = 'async';
  entry.image.onload = () => {
    if (typeof entry.image.decode === 'function') {
      entry.image.decode().then(
        () => settle(true),
        () => settle(true)
      );
    } else {
      settle(true);
    }
  };
  entry.image.onerror = () => settle(false);
  entry.image.src = src;
  imageCache.set(src, entry);
  return entry;
}

export function sheetEntry(piece) {
  return entryFor(PIECE_SHEETS[piece] ?? PIECE_SHEETS.queen);
}

export function whenEntryReady(entry, callback) {
  if (entry.ready) {
    callback(entry);
    return () => {};
  }
  if (entry.failed) return () => {};

  let active = true;
  const waiter = () => {
    if (active) callback(entry);
  };
  entry.waiters.add(waiter);
  return () => {
    active = false;
    entry.waiters.delete(waiter);
  };
}

export function preloadImage(src) {
  return new Promise((resolve) => {
    const entry = entryFor(src);
    if (entry.ready || entry.failed) {
      resolve(entry);
      return;
    }
    entry.waiters.add(function waiter() {
      resolve(entry);
    });
  });
}

export function preloadStills() {
  return Promise.all(Object.values(PIECE_STILLS).map(preloadImage));
}

export function preloadSheets() {
  return Promise.all(Object.values(PIECE_SHEETS).map(preloadImage));
}
