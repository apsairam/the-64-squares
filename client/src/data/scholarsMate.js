import { INITIAL_PIECES } from './board.js';

/**
 * Scholar's Mate, played one ply per lesson step.
 * Coordinates are 0-based board coordinates: file 0 = a, y 0 = rank 8.
 */
export const SCHOLARS_MATE = [
  {
    san: '1. e4',
    pieceId: 'w-p-e2',
    to: { file: 4, y: 4 },
  },
  {
    san: '1... e5',
    pieceId: 'b-p-e7',
    to: { file: 4, y: 3 },
  },
  {
    san: '2. Bc4',
    pieceId: 'w-b-f1',
    to: { file: 2, y: 4 },
  },
  {
    san: '2... Nc6',
    pieceId: 'b-n-b8',
    to: { file: 2, y: 2 },
  },
  {
    san: '3. Qh5',
    pieceId: 'w-q-d1',
    to: { file: 7, y: 3 },
  },
  {
    san: '3... Nf6??',
    pieceId: 'b-n-g8',
    to: { file: 5, y: 2 },
  },
  {
    san: '4. Qxf7#',
    pieceId: 'w-q-d1',
    to: { file: 5, y: 1 },
    captureId: 'b-p-f7',
    checkmate: true,
  },
];

export const START_LABEL = 'Starting position';

export const MOVE_LABELS = [
  START_LABEL,
  ...SCHOLARS_MATE.map((move) => move.san),
];

export const INITIAL_BY_ID = new Map(
  INITIAL_PIECES.map((piece) => [piece.id, piece])
);

export const MATE_SQUARE = 'f7';

export const FILES = 'abcdefgh';

export function squareFromCoords(file, y) {
  return `${FILES[file]}${8 - y}`;
}

/**
 * Returns a fresh piece list for any step in the lesson. This is the static
 * position used by reduced-motion and no-JavaScript readers, and it also keeps
 * the interactive move data honest: the board can always be rebuilt from the
 * published moves.
 */
export function buildPosition(step = 0) {
  const lastStep = Math.max(0, Math.min(SCHOLARS_MATE.length, step));
  const byId = new Map(
    INITIAL_PIECES.map((piece) => [piece.id, { ...piece }])
  );

  for (let index = 0; index < lastStep; index += 1) {
    const move = SCHOLARS_MATE[index];
    if (move.captureId) byId.delete(move.captureId);
    const piece = byId.get(move.pieceId);
    if (piece) {
      piece.file = move.to.file;
      piece.y = move.to.y;
    }
  }

  return [...byId.values()];
}

