import { useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ChessBoard from './ChessBoard';
import { INITIAL_PIECES } from '../data/board';
import { useMediaQuery } from '../hooks/useMediaQuery';
import useIsomorphicLayoutEffect from '../hooks/useIsomorphicLayoutEffect';
import {
  INITIAL_BY_ID,
  MATE_SQUARE,
  MOVE_LABELS,
  SCHOLARS_MATE,
  buildPosition,
} from '../data/scholarsMate';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const FILES = 'abcdefgh';
const RANKS = [8, 7, 6, 5, 4, 3, 2, 1];

export default function HistoryScroll({ lesson = [] }) {
  const sectionRef = useRef(null);
  const triggerRef = useRef(null);
  const stepRef = useRef(0);
  const [step, setStep] = useState(0);
  const [isScrollCueHidden, setIsScrollCueHidden] = useState(false);
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const isMobile = useMediaQuery('(max-width: 680px)');
  const isStatic = reducedMotion || isMobile;

  const frames = lesson;
  const frameCount = frames.length;
  const activeFrame = frames[step] ?? frames[0] ?? {};
  const isMate = frameCount > 0 && step === frameCount - 1;
  const pieces = useMemo(
    () => (isStatic ? buildPosition(step) : INITIAL_PIECES),
    [isStatic, step]
  );

  useEffect(() => {
    const hideScrollCue = () => {
      if (window.scrollY > 8) setIsScrollCueHidden(true);
    };

    hideScrollCue();
    window.addEventListener('scroll', hideScrollCue, { passive: true });
    return () => window.removeEventListener('scroll', hideScrollCue);
  }, []);

  useEffect(() => {
    setStep((current) => Math.min(current, Math.max(0, frameCount - 1)));
    stepRef.current = Math.min(stepRef.current, Math.max(0, frameCount - 1));
  }, [frameCount]);

  useIsomorphicLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section || isStatic || frameCount < 2) return undefined;

    // On the hydration frame useMediaQuery can still hold its server
    // snapshot. Do not briefly pin the lesson on a phone or reduced-motion
    // device; that creates a costly reflow and a misleading layout.
    if (
      window.matchMedia('(max-width: 680px)').matches ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return undefined;
    }

    const board = section.querySelector('.board');
    const pieceEls = new Map(
      [...(board?.querySelectorAll('[data-piece-id]') ?? [])].map((el) => [
        el.dataset.pieceId,
        el,
      ])
    );
    const kingGlyph = board?.querySelector(
      '[data-piece-id="b-k-e8"] .piece__glyph'
    );
    const kingX = board?.querySelector(
      '[data-piece-id="b-k-e8"] .piece__mate-x'
    );

    if (kingGlyph) {
      gsap.set(kingGlyph, {
        transformOrigin: '50% 50%',
        rotation: 0,
        yPercent: -1,
      });
    }
    if (kingX) {
      gsap.set(kingX, { opacity: 0, scale: 0.6 });
    }

    pieceEls.forEach((el, id) => {
      const initial = INITIAL_BY_ID.get(id);
      if (!initial) return;
      gsap.set(el, {
        left: `${initial.file * 12.5}%`,
        top: `${initial.y * 12.5}%`,
        opacity: 1,
        zIndex: 2,
        clearProps: 'transform',
      });
    });

    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: `+=${(frameCount - 1) * 100}%`,
        pin: true,
        anticipatePin: 1,
        scrub: 0.55,
        onUpdate: (self) => {
          const next = Math.min(
            frameCount - 1,
            Math.floor(self.progress * frameCount + 0.0001)
          );
          if (next !== stepRef.current) {
            stepRef.current = next;
            setStep(next);
          }
        },
      },
    });

    // Keep the timeline exactly as long as the number of lesson frames.
    const playhead = { value: 0 };
    timeline.to(
      playhead,
      { value: frameCount, duration: frameCount, ease: 'none' },
      0
    );

    SCHOLARS_MATE.forEach((move, index) => {
      const piece = pieceEls.get(move.pieceId);
      if (!piece) return;

      const at = index + 1;

      timeline.set(piece, { zIndex: 4 }, at);
      timeline.to(
        piece,
        {
          left: `${move.to.file * 12.5}%`,
          top: `${move.to.y * 12.5}%`,
          duration: 0.55,
          ease: 'power2.inOut',
        },
        at + 0.1
      );
      timeline.set(piece, { zIndex: 2 }, at + 0.65);

      if (move.captureId) {
        const captured = pieceEls.get(move.captureId);
        if (captured) {
          timeline.to(
            captured,
            {
              opacity: 0,
              scale: 0.45,
              duration: 0.22,
              ease: 'power1.in',
            },
            at + 0.42
          );
        }
      }

      if (move.checkmate) {
        if (kingGlyph) {
          timeline.to(
            kingGlyph,
            {
              rotation: 180,
              duration: 0.3,
              ease: 'power2.inOut',
            },
            at + 0.7
          );
        }
        if (kingX) {
          timeline.fromTo(
            kingX,
            { opacity: 0, scale: 0.6 },
            {
              opacity: 1,
              scale: 1,
              duration: 0.15,
              ease: 'back.out(1.7)',
            },
            at + 0.85
          );
        }
      }
    });

    triggerRef.current = timeline.scrollTrigger;

    const refresh = () => ScrollTrigger.refresh();
    if (document.fonts?.ready) {
      document.fonts.ready.then(refresh);
    } else {
      window.setTimeout(refresh, 250);
    }

    return () => {
      timeline.scrollTrigger?.kill();
      timeline.kill();
      triggerRef.current = null;
    };
  }, [frameCount, isStatic]);

  const jumpToFrame = (index) => {
    const next = Math.max(0, Math.min(frameCount - 1, index));
    if (isStatic) {
      stepRef.current = next;
      setStep(next);
      return;
    }

    const trigger = triggerRef.current;
    if (!trigger) {
      sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    const progress =
      next === frameCount - 1 ? 0.999 : (next + 0.82) / frameCount;
    const top = trigger.start + (trigger.end - trigger.start) * progress;
    window.scrollTo({ top, behavior: 'smooth' });
  };

  if (frameCount === 0) return null;

  return (
    <section
      ref={sectionRef}
      className={`lesson ${isStatic ? 'lesson--static' : ''}`}
      id="history"
      aria-label="Scholar’s Mate interactive lesson"
    >
      <div className="lesson__pin">
        <div className="lesson__board-wrap">
          <div className="board-frame">
            <div className="board-frame__ranks" aria-hidden="true">
              {RANKS.map((rank) => (
                <span key={rank}>{rank}</span>
              ))}
            </div>
            <div className="board-frame__board">
              <ChessBoard
                pieces={pieces}
                mateSquare={isMate ? MATE_SQUARE : null}
                label={`Scholar’s Mate lesson, step ${step + 1} of ${frameCount}: ${
                  MOVE_LABELS[step]
                }`}
              />
            </div>
            <div className="board-frame__files" aria-hidden="true">
              {FILES.split('').map((file) => (
                <span key={file}>{file}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="lesson__scrim" aria-hidden="true" />

        <div className="lesson__overlay">
          <div className="lesson__frames">
            {frames.map((item, index) => (
              <article
                key={`${item.title}-${index}`}
                className={`lesson__frame ${
                  step === index ? 'is-active' : ''
                }`}
                aria-hidden={step !== index}
              >
                <span className="lesson__kicker">{item.kicker}</span>
                {index === 0 ? (
                  <h1 className="lesson__headline">{item.title}</h1>
                ) : (
                  <h2 className="lesson__headline">{item.title}</h2>
                )}
                {item.subtitle && (
                  <p className="lesson__subtitle">{item.subtitle}</p>
                )}
                <p className="lesson__desc">{item.lede}</p>
                {item.note && <p className="lesson__note">{item.note}</p>}
                {item.meta && (
                  <ul className="lesson__meta">
                    {item.meta.map((entry) => (
                      <li key={entry}>{entry}</li>
                    ))}
                  </ul>
                )}
                {item.actions && (
                  <div className="lesson__actions">
                    {item.actions.map((action, actionIndex) => (
                      <a
                        key={action.href}
                        className={`button ${
                          actionIndex > 0 ? 'button--ghost' : ''
                        }`}
                        href={action.href}
                      >
                        {action.label}
                      </a>
                    ))}
                  </div>
                )}
              </article>
            ))}
          </div>
        </div>

        <p className="sr-only" aria-live="polite">
          {activeFrame.title} — {MOVE_LABELS[step]}
        </p>

        <div
          className="lesson__progress"
          aria-label="Scholar’s Mate progress"
        >
          <div className="lesson__readout">
            <span className="lesson__study">Scholar’s Mate</span>
            <span className="lesson__move">{MOVE_LABELS[step]}</span>
          </div>

          <div className="lesson__nav">
            <span className="lesson__count">
              {String(step + 1).padStart(2, '0')} /{' '}
              {String(frameCount).padStart(2, '0')}
            </span>
            <div
              className="lesson__ticks"
              role="group"
              aria-label="Lesson steps"
            >
              {frames.map((item, index) => (
                <button
                  key={`${item.title}-tick`}
                  type="button"
                  className={`tick ${index <= step ? 'is-done' : ''}`}
                  onClick={() => jumpToFrame(index)}
                  aria-label={`Go to step ${index + 1}: ${item.title} — ${
                    MOVE_LABELS[index]
                  }`}
                  aria-current={step === index ? 'step' : undefined}
                />
              ))}
            </div>
            <div className="lesson__controls">
              <button
                type="button"
                className="lesson__arrow"
                onClick={() => jumpToFrame(step - 1)}
                disabled={step === 0}
                aria-label="Previous lesson step"
              >
                ←
              </button>
              <button
                type="button"
                className="lesson__arrow"
                onClick={() => jumpToFrame(step + 1)}
                disabled={step === frameCount - 1}
                aria-label="Next lesson step"
              >
                →
              </button>
            </div>
          </div>
        </div>

        {!isStatic && frames[0]?.hint !== false && (
          <button
            type="button"
            className={`lesson__scroll-cue${
              isScrollCueHidden ? ' is-hidden' : ''
            }`}
            onClick={() => {
              setIsScrollCueHidden(true);
              jumpToFrame(1);
            }}
            tabIndex={isScrollCueHidden ? -1 : 0}
          >
            <span>
              Scroll to move
              <span className="sr-only"> to the first lesson step</span>
            </span>
            <svg
              className="lesson__scroll-cue-icon"
              viewBox="0 0 12 16"
              aria-hidden="true"
              focusable="false"
            >
              <path d="M6 1v12M1.5 8.5 6 13l4.5-4.5" />
            </svg>
          </button>
        )}
      </div>
    </section>
  );
}
