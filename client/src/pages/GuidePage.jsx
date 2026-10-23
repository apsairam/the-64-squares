import GuideStructuredData from '../components/GuideStructuredData';
import SiteFooter from '../components/SiteFooter';
import SiteHeader from '../components/SiteHeader';
import {
  guideBySlug,
  guidePages,
  guidePath,
} from '../data/guidePages';

function Table({ table }) {
  const isWide = table.head.length > 3;

  return (
    <div
      className={`guide-table-wrap${isWide ? ' guide-table-wrap--wide' : ''}`}
      role={isWide ? 'region' : undefined}
      aria-label={isWide ? table.caption : undefined}
      tabIndex={isWide ? 0 : undefined}
    >
      <table className="guide-table">
        {table.caption && <caption>{table.caption}</caption>}
        <thead>
          <tr>
            {table.head.map((cell) => (
              <th key={cell} scope="col">
                {cell}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row) => (
            <tr key={row[0]}>
              {row.map((cell, index) =>
                index === 0 ? (
                  <th key={cell} scope="row">
                    {cell}
                  </th>
                ) : (
                  <td key={`${row[0]}-${cell}`}>{cell}</td>
                )
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function GuideSection({ section }) {
  return (
    <section
      className="guide-section"
      id={section.id}
      aria-labelledby={`${section.id}-title`}
    >
      <h2 id={`${section.id}-title`}>{section.title}</h2>

      {section.paragraphs?.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}

      {section.list && (
        <ul className="guide-list">
          {section.list.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      )}

      {section.table && <Table table={section.table} />}

      {section.note && <aside className="guide-note">{section.note}</aside>}

      {section.links?.length > 0 && (
        <p className="guide-section__links">
          {section.links.map((link) => (
            <a key={link.slug} href={guidePath(link.slug)}>
              {link.label} <span aria-hidden="true">→</span>
            </a>
          ))}
        </p>
      )}
    </section>
  );
}

export default function GuidePage({ page }) {
  const index = guidePages.findIndex((item) => item.slug === page.slug);
  const previous = index > 0 ? guidePages[index - 1] : null;
  const next = index < guidePages.length - 1 ? guidePages[index + 1] : null;
  const related = page.related
    .map((slug) => guideBySlug.get(slug))
    .filter(Boolean);

  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <SiteHeader home={false} />

      <main id="top">
        <header className="guide-hero">
          <div className="guide-hero__inner">
            <nav className="breadcrumb" aria-label="Breadcrumb">
              <a href="/">Home</a>
              <span aria-hidden="true">/</span>
              {page.slug === 'learn-chess' ? (
                <span aria-current="page">Beginner path</span>
              ) : (
                <>
                  <a href={guidePath('learn-chess')}>Beginner path</a>
                  <span aria-hidden="true">/</span>
                  <span aria-current="page">{page.navLabel}</span>
                </>
              )}
            </nav>

            <p className="kicker">{page.kicker}</p>
            <h1>{page.h1}</h1>
            <p className="guide-hero__lede">{page.lede}</p>

            <div className="guide-hero__meta">
              <span>{page.readingTime}</span>
              <span>Reviewed {page.reviewed}</span>
              <span>Source-backed</span>
            </div>
          </div>
        </header>

        <div className="guide-layout" id="main-content" tabIndex={-1}>
          <div className="guide-main">
            <dl className="guide-facts">
              {page.keyFacts.map((fact) => (
                <div className="guide-fact" key={fact.label}>
                  <dt>{fact.label}</dt>
                  <dd>{fact.value}</dd>
                </div>
              ))}
            </dl>

            <nav className="guide-toc" aria-label="On this page">
              <p className="guide-toc__title">On this page</p>
              <ol>
                {page.sections.map((section, sectionIndex) => (
                  <li key={section.id}>
                    <a href={`#${section.id}`}>
                      <span>{String(sectionIndex + 1).padStart(2, '0')}</span>
                      {section.title}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>

            <article className="guide-article">
              {page.sections.map((section) => (
                <GuideSection key={section.id} section={section} />
              ))}

              <section
                className="guide-faq"
                aria-labelledby="guide-faq-title"
              >
                <h2 id="guide-faq-title">Beginner questions</h2>
                <div className="faq__list">
                  {page.faqs.map((item) => (
                    <details className="faq__item" key={item.question}>
                      <summary>{item.question}</summary>
                      <p className="faq__answer">{item.answer}</p>
                    </details>
                  ))}
                </div>
              </section>

              <section
                className="guide-sources"
                aria-labelledby="guide-sources-title"
              >
                <h2 id="guide-sources-title">Source & review</h2>
                <p className="guide-sources__lede">
                  Rules are checked against the FIDE Laws of Chess (2023). This
                  page is a beginner’s explanation, not a substitute for the
                  official laws.
                </p>
                <ul className="guide-sources__list">
                  {page.sources.map((source) => (
                    <li key={source.title}>
                      <a href={source.url} target="_blank" rel="noreferrer">
                        {source.title}
                        <span aria-hidden="true"> ↗</span>
                        <span className="sr-only">
                          {' '}
                          (opens in a new tab)
                        </span>
                      </a>
                      <span className="guide-sources__publisher">
                        {source.publisher}
                      </span>
                      <p>{source.note}</p>
                    </li>
                  ))}
                </ul>
                <p className="guide-reviewed">
                  Last reviewed {page.reviewed}.
                </p>
              </section>

              <nav className="guide-pager" aria-label="Guide pagination">
                {previous ? (
                  <a className="guide-pager__card" href={guidePath(previous.slug)}>
                    <span>Previous</span>
                    <strong>{previous.navLabel}</strong>
                    <span aria-hidden="true">←</span>
                  </a>
                ) : (
                  <a className="guide-pager__card" href="/">
                    <span>Back to</span>
                    <strong>The 64 Squares</strong>
                    <span aria-hidden="true">←</span>
                  </a>
                )}

                {next ? (
                  <a
                    className="guide-pager__card guide-pager__card--next"
                    href={guidePath(next.slug)}
                  >
                    <span>Next</span>
                    <strong>{next.navLabel}</strong>
                    <span aria-hidden="true">→</span>
                  </a>
                ) : (
                  <a
                    className="guide-pager__card guide-pager__card--next"
                    href={guidePath('learn-chess')}
                  >
                    <span>Back to</span>
                    <strong>The beginner path</strong>
                    <span aria-hidden="true">→</span>
                  </a>
                )}
              </nav>

              {related.length > 0 && (
                <section
                  className="guide-related"
                  aria-labelledby="guide-related-title"
                >
                  <h2 id="guide-related-title">Keep reading</h2>
                  <div className="guide-related__grid">
                    {related.map((relatedPage) => (
                      <a
                        className="guide-related__card"
                        href={guidePath(relatedPage.slug)}
                        key={relatedPage.slug}
                      >
                        <span>{relatedPage.kicker}</span>
                        <strong>{relatedPage.navLabel}</strong>
                        <span aria-hidden="true">↗</span>
                      </a>
                    ))}
                  </div>
                </section>
              )}
            </article>
          </div>

          <aside className="guide-aside" aria-label="Beginner path">
            <div className="guide-aside__panel">
              <p className="guide-aside__kicker">Beginner path</p>
              <ol className="guide-aside__list">
                {guidePages.map((item) => {
                  const isCurrent = item.slug === page.slug;
                  return (
                    <li key={item.slug}>
                      {isCurrent ? (
                        <span aria-current="page">
                          <span>{String(item.order).padStart(2, '0')}</span>
                          {item.navLabel}
                        </span>
                      ) : (
                        <a href={guidePath(item.slug)}>
                          <span>{String(item.order).padStart(2, '0')}</span>
                          {item.navLabel}
                        </a>
                      )}
                    </li>
                  );
                })}
              </ol>
            </div>

            <div className="guide-aside__panel guide-aside__panel--dark">
              <p className="guide-aside__kicker">See it on the board</p>
              <p>
                Follow the Scholar’s Mate one move at a time in the interactive
                archive lesson.
              </p>
              <a className="text-link" href="/#history">
                Open the lesson <span aria-hidden="true">→</span>
              </a>
            </div>
          </aside>
        </div>
      </main>

      <SiteFooter variant="guide" />
      <GuideStructuredData page={page} />
    </>
  );
}
