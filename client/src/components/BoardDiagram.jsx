import { useId } from 'react';
import { FILES, PIECE_GLYPHS } from '../data/board';

const FILE_LIST = FILES.split('');

function pointFor(square) {
  const file = FILE_LIST.indexOf(square[0]);
  const rank = Number(square[1]);
  return [file + 0.5, 8 - rank + 0.5];
}

export default function BoardDiagram({
  pieces = [],
  highlight = [],
  arrows = [],
  marks = [],
  coordinates = false,
  label = 'Chess board diagram',
}) {
  const markerId = `diagram-arrow-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
  const highlightSet = new Set(highlight);
  const markBySquare = new Map(marks.map((mark) => [mark.square, mark.type]));
  const pieceBySquare = new Map(pieces.map((piece) => [piece.square, piece]));

  const squares = Array.from({ length: 64 }, (_, index) => {
    const file = index % 8;
    const y = Math.floor(index / 8);
    const name = `${FILES[file]}${8 - y}`;
    return {
      name,
      isLight: (file + y) % 2 === 0,
      isHighlighted: highlightSet.has(name),
      mark: markBySquare.get(name),
      piece: pieceBySquare.get(name),
    };
  });

  const board = (
    <div
      className={`diagram__board${
        coordinates ? '' : ' board-shell'
      }${arrows.length ? ' has-arrows' : ''}`}
      role="img"
      aria-label={label}
    >
      {squares.map((square) => (
        <div
          key={square.name}
          className={`diagram__square ${
            square.isLight ? 'is-light' : 'is-dark'
          } ${square.isHighlighted ? 'is-target' : ''} ${
            square.piece ? 'is-occupied' : ''
          }${square.mark ? ` is-${square.mark}` : ''}`}
        >
          {square.isHighlighted && !square.piece && (
            <span className="diagram__dot" aria-hidden="true" />
          )}
          {square.piece && (
            <span
              className={`diagram__piece piece--${square.piece.side}`}
              aria-hidden="true"
            >
              {PIECE_GLYPHS[square.piece.type]}
            </span>
          )}
        </div>
      ))}

      {arrows.length > 0 && (
        <svg
          className="diagram__arrows"
          viewBox="0 0 8 8"
          aria-hidden="true"
          focusable="false"
        >
          <defs>
            <marker
              id={markerId}
              viewBox="0 0 8 8"
              refX="6.5"
              refY="4"
              markerWidth="7"
              markerHeight="7"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 8 4 L 0 8 z" className="diagram__arrowhead" />
            </marker>
          </defs>
          {arrows.map((arrow, index) => {
            const [x1, y1] = pointFor(arrow.from);
            const [x2, y2] = pointFor(arrow.to);
            return (
              <line
                key={`${arrow.from}-${arrow.to}-${index}`}
                className="diagram__arrow"
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                markerEnd={`url(#${markerId})`}
              />
            );
          })}
        </svg>
      )}
    </div>
  );

  if (!coordinates) return board;

  return (
    <div className="diagram diagram--coords board-shell">
      <div className="diagram__ranks" aria-hidden="true">
        {[8, 7, 6, 5, 4, 3, 2, 1].map((rank) => (
          <span key={rank}>{rank}</span>
        ))}
      </div>
      {board}
      <div className="diagram__files" aria-hidden="true">
        {FILES.split('').map((file) => (
          <span key={file}>{file}</span>
        ))}
      </div>
    </div>
  );
}
