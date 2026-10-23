import test from 'node:test';
import assert from 'node:assert/strict';
import { buildPosition } from '../client/src/data/scholarsMate.js';

const pieceAt = (position, square) => {
  const files = 'abcdefgh';
  const file = files.indexOf(square[0]);
  const y = 8 - Number(square[1]);
  return position.find((piece) => piece.file === file && piece.y === y);
};

test('the starting lesson position has 32 pieces and a queen on d1', () => {
  const position = buildPosition(0);
  assert.equal(position.length, 32);
  assert.equal(pieceAt(position, 'd1')?.id, 'w-q-d1');
});

test('the lesson position follows the moves through 3.Qh5', () => {
  const position = buildPosition(5);
  assert.equal(pieceAt(position, 'h5')?.id, 'w-q-d1');
  assert.equal(pieceAt(position, 'd1'), undefined);
  assert.equal(pieceAt(position, 'f7')?.id, 'b-p-f7');
});

test('the final lesson position is mate with the queen on f7', () => {
  const position = buildPosition(7);
  assert.equal(position.length, 31);
  assert.equal(pieceAt(position, 'f7')?.id, 'w-q-d1');
  assert.equal(pieceAt(position, 'f7')?.side, 'w');
  assert.equal(pieceAt(position, 'e4')?.id, 'w-p-e2');
});

test('the lesson position can be rewound from mate', () => {
  const position = buildPosition(1);
  assert.equal(position.length, 32);
  assert.equal(pieceAt(position, 'e4')?.id, 'w-p-e2');
  assert.equal(pieceAt(position, 'f7')?.id, 'b-p-f7');
});
