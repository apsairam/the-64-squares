import { PieceStill } from './Piece3D';

export default function GuidePieceGallery({ pieces }) {
  return (
    <ul className="guide-piece-gallery">
      {pieces.map((piece) => (
        <li className="guide-piece-card" key={piece.id}>
          <div className="guide-piece-card__media">
            <PieceStill piece={piece.id} className="guide-piece-card__image" />
          </div>
          <div className="guide-piece-card__content">
            <div className="guide-piece-card__head">
              <h3 className="guide-piece-card__name">{piece.name}</h3>
              <span
                className="guide-piece-card__value"
                aria-label={`Value ${piece.value}`}
              >
                {piece.value}
              </span>
            </div>
            <p className="guide-piece-card__label">{piece.label}</p>
            <p className="guide-piece-card__movement">{piece.movement}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
