import Reveal from './Reveal';
import SectionHead from './SectionHead';

export default function Faq({ faq }) {
  return (
    <section className="section faq" id="faq" aria-labelledby="faq-title">
      <Reveal className="section__inner">
        <SectionHead
          kicker={faq.kicker}
          title={faq.title}
          body={faq.lede}
          titleId="faq-title"
        />

        <div className="faq__list">
          {faq.items.map((item) => (
            <details className="faq__item" key={item.question}>
              <summary>{item.question}</summary>
              <p className="faq__answer">{item.answer}</p>
            </details>
          ))}
        </div>

        <div className="faq__links">
          <a className="text-link" href="#learn">
            Read the rules <span aria-hidden="true">→</span>
          </a>
          <a className="text-link" href="#sources">
            See the sources <span aria-hidden="true">→</span>
          </a>
        </div>
      </Reveal>
    </section>
  );
}
