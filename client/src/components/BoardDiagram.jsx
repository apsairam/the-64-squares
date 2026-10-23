import { PIECE_GLYPHS } from '../data/board';

const FILES = 'abcdefgh';

export default function BoardDiagram({
  pieces = [],
  highlight = [],
  coordinates = false,
  label = 'Chess board diagram',
}) {
  const highlightSet = new Set(highlight);
  const pieceBySquare = new Map(pieces.map((piece) => [piece.square, piece]));

  const squares = Array.from({ length: 64 }, (_, index) => {
    const file = index % 8;
    const y = Math.floor(index / 8);
    const name = `${FILES[file]}${8 - y}`;
    return {
      name,
      isLight: (file + y) % 2 === 0,
      isHighlighted: highlightSet.has(name),
      piece: pieceBySquare.get(name),
    };
  });

  const board = (
    <div className="diagram__board" role="img" aria-label={label}>
      {squares.map((square) => (
        <div
          key={square.name}
          className={`diagram__square ${
            square.isLight ? 'is-light' : 'is-dark'
          } ${square.isHighlighted ? 'is-target' : ''} ${
            square.piece ? 'is-occupied' : ''
          }`}
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
    </div>
  );

  if (!coordinates) return board;

  return (
    <div className="diagram diagram--coords">
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
