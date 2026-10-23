export default function StructuredData({ content }) {
  const { brand, faq, learn } = content;

  const graph = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: brand.name,
      description: brand.tagline,
      inLanguage: 'en',
      url: '/',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: 'The 64 Squares: The Art, History & Geometry of Chess',
      description:
        'A visual chess reference with a scroll-driven Scholar’s Mate lesson, beginner rules, the corrected Immortal Game, piece anatomy, modern history and sources.',
      inLanguage: 'en',
      datePublished: '2026-10-23',
      dateModified: '2026-10-23',
      author: {
        '@type': 'Organization',
        name: brand.archive,
      },
      publisher: {
        '@type': 'Organization',
        name: brand.archive,
      },
      image: '/og-image.png',
      mainEntityOfPage: '/',
      about: ['Chess', 'History of chess', 'Chess rules', 'Immortal Game'],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faq.items.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer,
        },
      })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      name: 'How to play the Scholar’s Mate',
      description: learn.lede,
      inLanguage: 'en',
      step: content.lesson.slice(1).map((frame, index) => ({
        '@type': 'HowToStep',
        position: index + 1,
        name: frame.subtitle,
        text: frame.lede,
      })),
    },
  ];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
