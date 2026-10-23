import test from 'node:test';
import assert from 'node:assert/strict';
import { chessContent } from '../client/src/data/chessContent.js';

test('the introduction is an eight-step Scholar’s Mate lesson', () => {
  assert.equal(chessContent.lesson.length, 8);
  assert.match(chessContent.lesson[7].title, /checkmate/i);
  assert.equal(chessContent.lesson[7].meta[0], '4. Qxf7#');
});

test('the Immortal Game uses the correct move number and check symbol', () => {
  const moves = chessContent.immortal.moments.map((moment) => moment.move);
  assert.ok(moves.includes('19... Qxa1+'));
  assert.ok(!moves.includes('20... Qxa1'));
  assert.match(chessContent.immortal.pgn, /19\. e5 Qxa1\+/);
});

test('the Immortal Game separates record from legend', () => {
  assert.match(chessContent.immortal.legend, /tradition|later|not a contemporary/i);
  assert.doesNotMatch(chessContent.immortal.legacy, /showered the table with gold coins/i);
});

test('Shatranj is dated to the sixth century with later early masters', () => {
  const chapter = chessContent.chapters.find((item) => item.id === 'shatranj');
  assert.equal(chapter.facts.find((fact) => fact.label === 'Persia').value, '6th century');
  assert.match(chapter.body.join(' '), /9th|ninth/i);
});

test('the legacy chapter includes a modern timeline', () => {
  const chapter = chessContent.chapters.find((item) => item.id === 'legacy');
  assert.ok(chapter.timeline.length >= 5);
  assert.ok(chapter.timeline.some((entry) => entry.year === '1997'));
});

test('the Learn reference covers rules, special moves and notation', () => {
  assert.ok(chessContent.learn.rules.length >= 4);
  assert.ok(chessContent.learn.specialMoves.length >= 3);
  assert.ok(chessContent.learn.notation.length >= 6);
});

test('the beginner FAQ is present and substantial', () => {
  assert.ok(chessContent.faq.items.length >= 4);
  assert.ok(
    chessContent.faq.items.every(
      (item) => item.question.length > 15 && item.answer.length > 60
    )
  );
  assert.ok(
    chessContent.faq.items.some((item) => /notation/i.test(item.question))
  );
});

test('the sources section is real and substantial', () => {
  assert.ok(chessContent.sources.entries.length >= 4);
  assert.ok(
    chessContent.sources.entries.every(
      (entry) => entry.title && entry.publisher && entry.note
    )
  );
  assert.match(chessContent.sources.method.join(' '), /uncertain|legend|source/i);
});
