import { useEffect, useRef, useState } from 'react';

const LINKS = [
  { href: '#learn', label: 'Learn' },
  { href: '#chaturanga', label: 'Story' },
  { href: '#immortal', label: 'Immortal' },
  { href: '#pieces', label: 'Pieces' },
  { href: '#sources', label: 'Sources' },
];

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const toggleRef = useRef(null);

  useEffect(() => {
    const update = () => {
      const isScrolled = window.scrollY > 12;
      setScrolled(isScrolled);

      const lesson = document.querySelector('.lesson:not(.lesson--static)');
      const content = document.getElementById('main-content');
      let insideLesson = false;

      if (lesson && content) {
        const contentTop = content.getBoundingClientRect().top + window.scrollY;
        insideLesson = isScrolled && window.scrollY < contentTop - 1;
      }

      setHidden(insideLesson);
      if (insideLesson) setOpen(false);
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open]);

  return (
    <header
      className={`site-header${scrolled ? ' is-scrolled' : ''}${
        open ? ' is-open' : ''
      }${hidden ? ' is-hidden' : ''}`}
      aria-hidden={hidden ? 'true' : undefined}
    >
      <div className="site-header__inner">
        <a
          className="site-header__brand"
          href="#top"
          aria-label="The 64 Squares — back to top"
          onClick={() => setOpen(false)}
        >
          <span className="site-header__mark" aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
          </span>
          <span className="site-header__wordmark">The 64 Squares</span>
        </a>

        <nav
          className="site-header__nav"
          id="site-menu"
          aria-label="Primary navigation"
        >
          {LINKS.map((link) => (
            <a key={link.href} href={link.href} onClick={() => setOpen(false)}>
              {link.label}
            </a>
          ))}
          <a
            className="site-header__cta"
            href="#challenge"
            onClick={() => setOpen(false)}
          >
            Challenge me <span aria-hidden="true">↗</span>
          </a>
        </nav>

        <button
          ref={toggleRef}
          type="button"
          className="site-header__toggle"
          aria-expanded={open}
          aria-controls="site-menu"
          onClick={() => setOpen((value) => !value)}
        >
          <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
          <span className="site-header__toggle-lines" aria-hidden="true">
            <span />
            <span />
          </span>
        </button>
      </div>
    </header>
  );
}
