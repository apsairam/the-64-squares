import { useEffect, useState } from 'react';
import BoardParallax from './components/BoardParallax';
import Faq from './components/Faq';
import HistoryScroll from './components/HistoryScroll';
import LearnGuide from './components/LearnGuide';
import ModernTimeline from './components/ModernTimeline';
import Piece3D from './components/Piece3D';
import PieceGuide from './components/PieceGuide';
import Reveal from './components/Reveal';
import SectionHead from './components/SectionHead';
import SiteFooter from './components/SiteFooter';
import SiteHeader from './components/SiteHeader';
import SiteLoader from './components/SiteLoader';
import Sources from './components/Sources';
import StructuredData from './components/StructuredData';
import GuidePage from './pages/GuidePage';
import swordsImage from './assets/swords.webp';
import { chessContent as localContent } from './data/chessContent';
import { getGuidePage } from './data/guidePages';

function Facts({ facts }) {
  return (
    <dl className="stat-row chapter__stats">
      {facts.map((fact) => (
        <div className="stat" key={fact.label}>
          <dt>{fact.label}</dt>
          <dd>{fact.value}</dd>
        </div>
      ))}
    </dl>
  );
}

function LawsGrid({ laws }) {
  return (
    <div className="three-grid">
      {laws.map((law, index) => (
        <article className="rule-card" key={law.title}>
          <span className="rule-card__index">
            {String(index + 1).padStart(2, '0')}
          </span>
          <h3 className="rule-card__title">{law.title}</h3>
          <p className="rule-card__notation">{law.tag}</p>
          <p className="rule-card__text">{law.text}</p>
        </article>
      ))}
    </div>
  );
}

function PhasesGrid({ phases }) {
  return (
    <div className="three-grid phases">
      {phases.map((phase, index) => (
        <article className="phase-card" key={phase.phase}>
          <span className="phase-card__index">
            {String(index + 1).padStart(2, '0')}.
          </span>
          <h3 className="phase-card__title">{phase.phase}</h3>
          <p className="phase-card__text">{phase.text}</p>
        </article>
      ))}
    </div>
  );
}

function Challenge({ challenge }) {
  return (
    <section
      className="section challenge"
      id="challenge"
      aria-labelledby="challenge-title"
    >
      <div className="challenge__swords" aria-hidden="true">
        <img
          src={swordsImage}
          alt=""
          width="1059"
          height="1059"
        />
      </div>
      <Reveal className="section__inner">
        <SectionHead
          kicker={challenge.kicker}
          title={challenge.title}
          body={challenge.body}
          titleId="challenge-title"
        />
        <a
          className="challenge-card"
          href={challenge.url}
          target="_blank"
          rel="noreferrer"
          aria-label={`Challenge ${challenge.username} on Chess.com (opens in a new tab)`}
        >
          <span className="challenge-card__identity">
            <span className="challenge-card__label">{challenge.label}</span>
            <span className="challenge-card__username">
              {challenge.username}
            </span>
          </span>
          <span className="challenge-card__action">
            Challenge me <span aria-hidden="true">↗</span>
          </span>
        </a>
      </Reveal>
    </section>
  );
}

function ImmortalExtras({ immortal }) {
  const [copied, setCopied] = useState(false);

  const copyPgn = async () => {
    try {
      await navigator.clipboard.writeText(immortal.pgn);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  return (
    <>
      <div className="moment-list">
        {immortal.moments.map((moment, index) => (
          <article className="moment" key={moment.move}>
            <span className="moment__index">
              {String(index + 1).padStart(2, '0')}
            </span>
            <code className="moment__move">{moment.move}</code>
            <div className="moment__content">
              <h3 className="moment__title">{moment.title}</h3>
              <p className="moment__text">{moment.text}</p>
            </div>
          </article>
        ))}
      </div>

      <blockquote className="quote quote--wide">{immortal.quote}</blockquote>
      <p className="legend-note">
        <strong>Fact vs. legend.</strong> {immortal.legend}
      </p>
      <p className="legacy-note">{immortal.legacy}</p>

      <div className="pgn">
        <div className="pgn__head">
          <span>Portable Game Notation · Anderssen–Kieseritzky, 1851</span>
          <button type="button" onClick={copyPgn}>
            {copied ? 'Copied' : 'Copy PGN'}
          </button>
          <span className="sr-only" aria-live="polite">
            {copied ? 'PGN copied to clipboard' : ''}
          </span>
        </div>
        <pre>{immortal.pgn}</pre>
      </div>
    </>
  );
}

function Chapter({ chapter, content, index, nextChapter }) {
  return (
    <section
      className="section"
      id={chapter.id}
      aria-labelledby={`${chapter.id}-title`}
    >
      <Piece3D
        piece={chapter.piece}
        className="chapter__piece"
        phase={index * 4}
      />

      <Reveal className="section__inner">
        <SectionHead
          kicker={chapter.kicker}
          title={chapter.title}
          body={chapter.lede}
          titleId={`${chapter.id}-title`}
        />

        <div className="chapter__body">
          {chapter.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>

        {chapter.facts && <Facts facts={chapter.facts} />}

        {chapter.note && <p className="chapter__note">{chapter.note}</p>}

        {chapter.link && (
          <a
            className="text-link"
            href={chapter.link.href}
            target="_blank"
            rel="noreferrer"
          >
            {chapter.link.label} <span aria-hidden="true">↗</span>
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        )}

        {chapter.quote && (
          <blockquote className="quote">{chapter.quote.text}</blockquote>
        )}

        {chapter.id === 'immortal' && (
          <ImmortalExtras immortal={content.immortal} />
        )}

        {chapter.id === 'laws' && <LawsGrid laws={content.laws} />}

        {chapter.id === 'pieces' && <PieceGuide pieces={content.pieces} />}

        {chapter.id === 'phases' && <PhasesGrid phases={content.phases} />}

        {chapter.timeline && <ModernTimeline entries={chapter.timeline} />}

        {nextChapter && (
          <a className="text-link chapter__next" href={`#${nextChapter.id}`}>
            Next — {nextChapter.title} <span aria-hidden="true">→</span>
          </a>
        )}

        {chapter.id === 'legacy' && (
          <a className="button" href="#chaturanga">
            Read the archive from the beginning
          </a>
        )}
      </Reveal>
    </section>
  );
}

function HomePage() {
  const content = localContent;
  const [apiStatus, setApiStatus] = useState('static');

  useEffect(() => {
    let cancelled = false;

    fetch('/api/health')
      .then((response) => {
        if (!response.ok) throw new Error('API unavailable');
        return response.json();
      })
      .then(() => {
        if (!cancelled) setApiStatus('live');
      })
      .catch(() => {
        if (!cancelled) setApiStatus('static');
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <SiteLoader />
      <BoardParallax />
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <SiteHeader />
      <main id="top">
        <HistoryScroll lesson={content.lesson} />

        <div className="content" id="main-content" tabIndex={-1}>
          <LearnGuide learn={content.learn} />

          {content.faq && <Faq faq={content.faq} />}

          {content.chapters.map((chapter, index) => (
            <Chapter
              key={chapter.id}
              chapter={chapter}
              content={content}
              index={index}
              nextChapter={
                content.chapters[index + 1] ?? {
                  id: 'sources',
                  title: 'Where this comes from.',
                }
              }
            />
          ))}

          <Sources sources={content.sources} />

          {content.challenge && <Challenge challenge={content.challenge} />}

          <SiteFooter apiStatus={apiStatus} />
        </div>
      </main>
      <StructuredData content={content} />
    </>
  );
}

export default function App({ path = '/' }) {
  const guide = getGuidePage(path);

  if (guide) return <GuidePage page={guide} />;

  return <HomePage />;
}
