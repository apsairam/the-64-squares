import { guidePages, guidePath } from '../data/guidePages';

const HOME_LINKS = [
  { href: '#learn', label: 'Learn' },
  { href: '#chaturanga', label: 'Origins' },
  { href: '#immortal', label: 'Immortal Game' },
  { href: '#pieces', label: 'Anatomy' },
  { href: '#faq', label: 'FAQ' },
  { href: '#sources', label: 'Sources' },
  { href: '#challenge', label: 'Challenge' },
];

export default function SiteFooter({ variant = 'home', apiStatus = 'static' }) {
  const isHome = variant === 'home';

  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__brand">
          <span className="footer__name">The 64 Squares</span>
          <span className="footer__tagline">
            A field guide to the art, history and geometry of chess.
          </span>
        </div>

        <nav className="footer__nav" aria-label="Footer">
          {isHome ? (
            <>
              {HOME_LINKS.map((link) => (
                <a key={link.href} href={link.href}>
                  {link.label}
                </a>
              ))}
              <a href={guidePath('learn-chess')}>Beginner path</a>
            </>
          ) : (
            <>
              <a href="/">Home</a>
              {guidePages.map((page) => (
                <a key={page.slug} href={guidePath(page.slug)}>
                  {page.navLabel}
                </a>
              ))}
            </>
          )}
        </nav>

        <div className="footer__meta">
          <span>© 2026 · Archive Nº 64</span>
          {isHome ? (
            <span className={`footer__api ${apiStatus}`}>
              <span className="footer__dot" aria-hidden="true" />
              {apiStatus === 'live' ? 'API: connected' : 'Content: bundled'}
            </span>
          ) : (
            <span className="footer__reviewed">Reviewed October 2026</span>
          )}
        </div>
      </div>
    </footer>
  );
}
