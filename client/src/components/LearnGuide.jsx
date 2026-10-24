import BoardDiagram from './BoardDiagram';
import Reveal from './Reveal';
import SectionHead from './SectionHead';
import { STARTING_POSITION } from '../data/board';

export default function LearnGuide({ learn }) {
  return (
    <section className="section learn" id="learn" aria-labelledby="learn-title">
      <Reveal className="section__inner">
        <SectionHead
          kicker={learn.kicker}
          title={learn.title}
          body={learn.lede}
          titleId="learn-title"
        />

        <div className="learn__grid">
          <div className="learn__board">
            <BoardDiagram
              pieces={STARTING_POSITION}
              coordinates
              label="The starting position: White on ranks one and two, Black on ranks seven and eight"
            />
            <p className="learn__caption">{learn.boardText}</p>
          </div>

          <div className="learn__rules">
            {learn.rules.map((rule, index) => (
              <article className="learn-rule" key={rule.title}>
                <span className="learn-rule__index">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div className="learn-rule__content">
                  <h3 className="learn-rule__title">{rule.title}</h3>
                  <p className="learn-rule__text">{rule.text}</p>
                </div>
                <span className="learn-rule__tag">{rule.tag}</span>
              </article>
            ))}
          </div>
        </div>

        <div className="learn__special">
          <h3 className="learn__subhead">The moves that surprise beginners</h3>
          <div className="learn__special-grid">
            {learn.specialMoves.map((move) => (
              <article className="special-card" key={move.title}>
                <div className="special-card__head">
                  <h4 className="special-card__title">{move.title}</h4>
                  <code className="special-card__code">{move.notation}</code>
                </div>
                <p className="special-card__text">{move.text}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="notation learn__notation">
          <div>
            <h3 className="learn__subhead">Reading a move</h3>
            <p className="learn__body">
              Chess notation is a compact address book. The piece letter comes
              first, then the destination square. Captures use <code>x</code>,
              check uses <code>+</code>, and mate uses <code>#</code>.
            </p>
          </div>
          <dl className="notation__list">
            {learn.notation.map((row) => (
              <div className="notation__row" key={row.code}>
                <dt>
                  <code>{row.code}</code>
                </dt>
                <dd>{row.meaning}</dd>
              </div>
            ))}
          </dl>
        </div>

        <p className="learn__source">
          {learn.sourceNote}{' '}
          <a href={learn.sourceUrl} target="_blank" rel="noreferrer">
            Read the official FIDE Laws <span aria-hidden="true">↗</span>
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </p>

        <div className="learn__links">
          <a className="text-link" href="/learn-chess/">
            Full beginner path <span aria-hidden="true">→</span>
          </a>
          <a className="text-link" href="#faq">
            Common questions <span aria-hidden="true">→</span>
          </a>
          <a className="text-link" href="#chaturanga">
            Continue to the origins <span aria-hidden="true">→</span>
          </a>
        </div>
      </Reveal>
    </section>
  );
}
