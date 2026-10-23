import Reveal from './Reveal';
import SectionHead from './SectionHead';

export default function Sources({ sources }) {
  return (
    <section
      className="section sources"
      id="sources"
      aria-labelledby="sources-title"
    >
      <Reveal className="section__inner">
        <SectionHead
          kicker={sources.kicker}
          title={sources.title}
          body={sources.lede}
          titleId="sources-title"
        />

        <div className="sources__grid">
          <ol className="sources__list">
            {sources.entries.map((source) => (
              <li className="source" key={source.title}>
                {source.url ? (
                  <a
                    className="source__link"
                    href={source.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <span className="source__title">{source.title}</span>
                    <span className="source__publisher">
                      {source.publisher} <span aria-hidden="true">↗</span>
                    </span>
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                ) : (
                  <div className="source__plain">
                    <span className="source__title">{source.title}</span>
                    <span className="source__publisher">{source.publisher}</span>
                  </div>
                )}
                <p className="source__note">{source.note}</p>
              </li>
            ))}
          </ol>

          <aside className="sources__method">
            <h3 className="sources__method-title">Method & corrections</h3>
            <ul>
              {sources.method.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p className="sources__reviewed">Last reviewed October 2026.</p>
          </aside>
        </div>
      </Reveal>
    </section>
  );
}
