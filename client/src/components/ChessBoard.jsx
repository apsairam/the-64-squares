import { PIECE_GLYPHS } from '../data/board';

const FILES = 'abcdefgh';

export default function ChessBoard({
  pieces,
  mateSquare = null,
  label = 'A chessboard in the classical starting position',
}) {
  return (
    <div
      className="board"
      role="img"
      aria-roledescription="chessboard"
      aria-label={label}
      data-mate-square={mateSquare ?? undefined}
    >
      {Array.from({ length: 64 }, (_, index) => {
        const file = index % 8;
        const y = Math.floor(index / 8);
        const name = `${FILES[file]}${8 - y}`;
        const isLight = (file + y) % 2 === 0;
        return (
          <div
            key={name}
            data-square={name}
            className={`square ${isLight ? 'is-light' : 'is-dark'} ${
              name === mateSquare ? 'is-mate' : ''
            }`}
          />
        );
      })}

      {pieces.map((piece) => {
        const isBlackKing = piece.side === 'b' && piece.type === 'king';
        const isMatedKing = Boolean(mateSquare) && isBlackKing;

        return (
          <div
            key={piece.id}
            className={`piece piece--${piece.side}${
              isMatedKing ? ' is-mated-king' : ''
            }`}
            data-piece-id={piece.id}
            data-piece-side={piece.side}
            data-piece-type={piece.type}
            data-file={piece.file}
            data-y={piece.y}
            style={{
              left: `${piece.file * 12.5}%`,
              top: `${piece.y * 12.5}%`,
            }}
          >
            <span className="piece__glyph" aria-hidden="true">
              {PIECE_GLYPHS[piece.type]}
            </span>
            {isBlackKing && (
              <span className="piece__mate-x" aria-hidden="true" />
            )}
            <span className="sr-only">
              {piece.side === 'w' ? 'White' : 'Black'} {piece.type}
            </span>
          </div>
        );
      })}
    </div>
  );
}
