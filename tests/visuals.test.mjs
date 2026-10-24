import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { guidePages } from '../client/src/data/guidePages.js';

const root = path.resolve(import.meta.dirname, '..');
const dist = path.join(root, 'client', 'dist');
const SQUARE = /^[a-h][1-8]$/;
const PIECE_TYPES = new Set(['pawn', 'knight', 'bishop', 'rook', 'queen', 'king']);
const SIDES = new Set(['w', 'b']);

const page = (slug) => guidePages.find((item) => item.slug === slug);
const section = (slug, id) =>
  page(slug).sections.find((item) => item.id === id);

test('guide diagrams cover setup, the three king states, draws, and special moves', () => {
  const setup = section('chess-rules', 'setup');
  assert.equal(setup.diagrams?.length, 1, 'setup needs one starting-position board');
  assert.equal(setup.diagrams[0].pieces.length, 32);
  assert.ok(setup.diagrams[0].coordinates, 'the setup board needs coordinates');

  const kings = section('chess-rules', 'checkmate');
  assert.equal(kings.diagrams?.length, 3, 'check, mate, and stalemate each need a board');
  assert.deepEqual(
    kings.diagrams.map((diagram) => diagram.marks?.[0]?.type),
    ['check', 'mate', 'stalemate']
  );

  const draws = section('chess-rules', 'draws');
  assert.equal(draws.diagrams?.length, 2, 'king vs king and king+bishop vs king need boards');

  const castling = section('special-moves', 'castling');
  assert.equal(castling.diagrams?.length, 2, 'kingside and queenside castling need boards');

  assert.equal(section('special-moves', 'en-passant').diagrams?.length, 1);
  assert.equal(section('special-moves', 'promotion').diagrams?.length, 1);
});

test('every diagram uses real, non-overlapping squares and valid annotations', () => {
  for (const guide of guidePages) {
    for (const item of guide.sections) {
      const labels = new Set();
      for (const diagram of item.diagrams ?? []) {
        assert.ok(diagram.label, `${guide.slug}/${item.id} diagram label`);
        assert.ok(diagram.caption, `${guide.slug}/${item.id} diagram caption`);
        assert.ok(!labels.has(diagram.label), `${guide.slug}/${item.id} duplicate diagram label`);
        labels.add(diagram.label);

        const occupied = new Set();
        for (const piece of diagram.pieces ?? []) {
          assert.match(piece.square, SQUARE, `${guide.slug}/${item.id} square`);
          assert.ok(SIDES.has(piece.side), `${guide.slug}/${item.id} side`);
          assert.ok(PIECE_TYPES.has(piece.type), `${guide.slug}/${item.id} type`);
          assert.ok(
            !occupied.has(piece.square),
            `${guide.slug}/${item.id} has two pieces on ${piece.square}`
          );
          occupied.add(piece.square);
        }

        for (const square of diagram.highlight ?? []) {
          assert.match(square, SQUARE, `${guide.slug}/${item.id} highlight`);
        }
        for (const arrow of diagram.arrows ?? []) {
          assert.match(arrow.from, SQUARE, `${guide.slug}/${item.id} arrow start`);
          assert.match(arrow.to, SQUARE, `${guide.slug}/${item.id} arrow end`);
        }
        for (const mark of diagram.marks ?? []) {
          assert.match(mark.square, SQUARE, `${guide.slug}/${item.id} mark square`);
          assert.ok(
            ['check', 'mate', 'stalemate'].includes(mark.type),
            `${guide.slug}/${item.id} mark type`
          );
        }
      }
    }
  }
});

test('the setup board is the legal starting position', () => {
  const pieces = section('chess-rules', 'setup').diagrams[0].pieces;
  const at = new Map(pieces.map((piece) => [piece.square, piece]));
  assert.equal(pieces.filter((piece) => piece.side === 'w').length, 16);
  assert.equal(pieces.filter((piece) => piece.side === 'b').length, 16);
  assert.deepEqual(at.get('d1'), { square: 'd1', side: 'w', type: 'queen' });
  assert.deepEqual(at.get('e1'), { square: 'e1', side: 'w', type: 'king' });
  assert.deepEqual(at.get('d8'), { square: 'd8', side: 'b', type: 'queen' });
  assert.deepEqual(at.get('e8'), { square: 'e8', side: 'b', type: 'king' });
  assert.equal(at.get('a1').type, 'rook');
  assert.equal(at.get('h1').type, 'rook');
  assert.equal(at.get('a8').type, 'rook');
  assert.equal(at.get('h8').type, 'rook');
});

test('the beginner path shows all six chrome pieces', () => {
  const pieces = section('learn-chess', 'the-pieces').pieceGallery;
  assert.equal(pieces?.length, 6);
  assert.deepEqual(
    pieces.map((piece) => piece.id),
    ['pawn', 'knight', 'bishop', 'rook', 'queen', 'king']
  );
  for (const piece of pieces) {
    assert.ok(piece.name, 'piece name');
    assert.ok(piece.label, 'piece label');
    assert.ok(piece.value, 'piece value');
    assert.ok(piece.movement, 'piece movement');
  }
});

test('the build renders every diagram and chrome piece still', () => {
  const read = (slug) =>
    fs.readFileSync(path.join(dist, slug, 'index.html'), 'utf8');
  const rules = read('chess-rules');
  const special = read('special-moves');
  const learn = read('learn-chess');

  assert.equal((rules.match(/class="guide-diagram"/g) ?? []).length, 6);
  assert.equal((special.match(/class="guide-diagram"/g) ?? []).length, 4);
  assert.match(rules, /diagram__arrows/);
  assert.match(rules, /is-check/);
  assert.match(rules, /is-mate/);
  assert.match(rules, /is-stalemate/);
  assert.match(special, /diagram__arrows/);
  assert.match(special, /is-target/);

  assert.equal((learn.match(/class="guide-piece-card"/g) ?? []).length, 6);
  assert.equal((learn.match(/class="piece3d piece3d--still/g) ?? []).length, 6);
  for (const piece of ['pawn', 'knight', 'bishop', 'rook', 'queen', 'king']) {
    assert.match(
      learn,
      new RegExp(`set-${piece}-[^"]+\\.webp`),
      `missing the ${piece} still`
    );
  }
});

test('the built home preloads the archive behind an accessible loader', () => {
  const home = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');

  assert.match(home, /data-site-loader="true"/);
  assert.match(home, /class="site-loader__grid"/);
  assert.equal((home.match(/class="site-loader__tile/g) ?? []).length, 64);
  assert.match(
    home,
    /class="site-loader__tile is-lit" data-square="d4"/
  );
  assert.match(home, /site-loader__knight/);
  assert.match(home, /site-loader__knight-svg/);
  assert.match(home, /fill="#f5f5f2"/);
  assert.match(home, /stroke="#000"/);
  assert.match(home, /role="status"/);
  assert.match(home, /aria-busy="true"/);
  assert.match(home, /64-squares:preloader-seen/);
  assert.match(home, /is-preloaded/);
  assert.match(home, /board-shell/);
  assert.doesNotMatch(home, /piece3d__poster/);
  assert.doesNotMatch(home, /site-loader__board/);
  assert.doesNotMatch(home, /Preparing the pieces/);
  assert.match(
    home,
    /<noscript>[\s\S]*?\.site-loader[\s\S]*?display: none !important;[\s\S]*?<\/noscript>/
  );

  for (const guide of guidePages) {
    const guideHtml = fs.readFileSync(
      path.join(dist, guide.slug, 'index.html'),
      'utf8'
    );
    assert.doesNotMatch(guideHtml, /data-site-loader/);
  }
});
