import BoardDiagram from './BoardDiagram';

function GuideDiagram({ diagram }) {
  return (
    <figure className="guide-diagram">
      <BoardDiagram
        pieces={diagram.pieces}
        highlight={diagram.highlight}
        arrows={diagram.arrows}
        marks={diagram.marks}
        coordinates={diagram.coordinates}
        label={diagram.label}
      />
      <figcaption>{diagram.caption}</figcaption>
    </figure>
  );
}

export default function GuideDiagrams({ diagrams }) {
  return (
    <div
      className={`guide-diagrams${
        diagrams.length === 1 ? ' guide-diagrams--single' : ''
      }`}
    >
      {diagrams.map((diagram) => (
        <GuideDiagram key={diagram.label} diagram={diagram} />
      ))}
    </div>
  );
}
