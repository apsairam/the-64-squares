import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import BoardDiagram from './BoardDiagram';
import { PieceStill } from './Piece3D';
import { FILES } from '../data/board';
import useIsomorphicLayoutEffect from '../hooks/useIsomorphicLayoutEffect';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const ORIGIN = { file: 3, y: 4 };

function patternFor(piece) {
  const squares = new Set();
  const add = (file, y) => {
    if (file >= 0 && file < 8 && y >= 0 && y < 8) {
      squares.add(`${FILES[file]}${8 - y}`);
    }
  };

  if (piece.moveType === 'slide') {
    piece.directions.forEach(([dx, dy]) => {
      let file = ORIGIN.file + dx;
      let y = ORIGIN.y + dy;
      while (file >= 0 && file < 8 && y >= 0 && y < 8) {
        add(file, y);
        file += dx;
        y += dy;
      }
    });
  } else if (piece.moveType === 'jump' || piece.moveType === 'step') {
    piece.offsets.forEach(([dx, dy]) => add(ORIGIN.file + dx, ORIGIN.y + dy));
  } else if (piece.moveType === 'pawn') {
    add(ORIGIN.file, ORIGIN.y - 1);
    add(ORIGIN.file - 1, ORIGIN.y - 1);
    add(ORIGIN.file + 1, ORIGIN.y - 1);
  }

  return [...squares];
}

export default function PieceGuide({ pieces }) {
  const gridRef = useRef(null);

  useIsomorphicLayoutEffect(() => {
    const grid = gridRef.current;
    if (!grid) return undefined;

    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (
      reducedMotion ||
      window.matchMedia('(max-width: 680px)').matches
    ) {
      return undefined;
    }

    const triggers = [];

    grid.querySelectorAll('.piece-card').forEach((card) => {
      const diagram = card.querySelector(
        '.piece-card__media .diagram__board'
      );
      const portrait = card.querySelector('.piece-card__piece');

      triggers.push(
        ScrollTrigger.create({
          trigger: card,
          start: 'top bottom',
          end: 'bottom top',
          onUpdate: (self) => {
            if (diagram) {
              const offset = (self.progress - 0.5) * 58;
              diagram.style.transform = `translate3d(0, ${offset.toFixed(2)}px, 0)`;
            }
            if (portrait) {
              const drift = (self.progress - 0.5) * -102;
              portrait.style.transform = `translate3d(0, ${drift.toFixed(2)}px, 0)`;
            }
          },
        })
      );
    });

    return () => triggers.forEach((trigger) => trigger.kill());
  }, [pieces]);

  return (
    <div ref={gridRef} className="piece-grid">
      {pieces.map((piece) => (
        <article key={piece.id} className="piece-card">
          <div className="piece-card__head">
            <PieceStill piece={piece.id} className="piece-card__piece" />
            <div className="piece-card__heading">
              <h3 className="piece-card__name">
                {piece.name}
                <span className="piece-card__label"> · {piece.label}</span>
              </h3>
              <p className="piece-card__tagline">
                {piece.abilityLabel}: {piece.ability}
              </p>
            </div>
            <span className="piece-card__value" aria-label={`Value ${piece.value}`}>
              {piece.value}
            </span>
          </div>

          <div className="piece-card__media">
            <BoardDiagram
              pieces={[{ square: 'd4', side: 'w', type: piece.id }]}
              highlight={patternFor(piece)}
              label={`${piece.name} movement pattern from d4`}
            />
          </div>

          <p className="piece-card__body">{piece.body}</p>
        </article>
      ))}
    </div>
  );
}
