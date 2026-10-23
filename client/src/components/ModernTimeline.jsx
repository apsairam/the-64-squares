export default function ModernTimeline({ entries }) {
  return (
    <ol className="timeline" aria-label="Modern chess timeline">
      {entries.map((entry) => (
        <li className="timeline__item" key={entry.year}>
          <time className="timeline__year" dateTime={entry.year}>
            {entry.year}
          </time>
          <div className="timeline__content">
            <h3 className="timeline__title">{entry.title}</h3>
            <p className="timeline__text">{entry.text}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
