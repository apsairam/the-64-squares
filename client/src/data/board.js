export const FILES = 'abcdefgh';

export const PIECE_GLYPHS = {
  king: '♚',
  queen: '♛',
  rook: '♜',
  bishop: '♝',
  knight: '♞',
  pawn: '♟',
};

const BACK_RANK = [
  'rook',
  'knight',
  'bishop',
  'queen',
  'king',
  'bishop',
  'knight',
  'rook',
];

const LETTER = {
  king: 'k',
  queen: 'q',
  rook: 'r',
  bishop: 'b',
  knight: 'n',
  pawn: 'p',
};

export const INITIAL_PIECES = [
  ...BACK_RANK.map((type, file) => ({
    id: `w-${LETTER[type]}-${FILES[file]}1`,
    side: 'w',
    type,
    file,
    y: 7,
  })),
  ...FILES.split('').map((file, index) => ({
    id: `w-p-${file}2`,
    side: 'w',
    type: 'pawn',
    file: index,
    y: 6,
  })),
  ...BACK_RANK.map((type, file) => ({
    id: `b-${LETTER[type]}-${FILES[file]}8`,
    side: 'b',
    type,
    file,
    y: 0,
  })),
  ...FILES.split('').map((file, index) => ({
    id: `b-p-${file}7`,
    side: 'b',
    type: 'pawn',
    file: index,
    y: 1,
  })),
];

export function squareName(file, y) {
  return `${FILES[file]}${8 - y}`;
}
