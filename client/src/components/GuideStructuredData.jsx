import { guidePath } from '../data/guidePages';

const siteUrl = typeof __SITE_URL__ === 'string' ? __SITE_URL__ : '';
const absolute = (pathname) => `${siteUrl}${pathname}`;

export default function GuideStructuredData({ page }) {
  const pagePath = guidePath(page.slug);
  const isHub = page.slug === 'learn-chess';

  const breadcrumbItems = [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: absolute('/'),
    },
    ...(!isHub
      ? [
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Beginner path',
            item: absolute(guidePath('learn-chess')),
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: page.navLabel,
            item: absolute(pagePath),
          },
        ]
      : [
          {
            '@type': 'ListItem',
            position: 2,
            name: page.navLabel,
            item: absolute(pagePath),
          },
        ]),
  ];

  const graph = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      '@id': `${absolute(pagePath)}#article`,
      url: absolute(pagePath),
      headline: page.h1,
      description: page.description,
      inLanguage: 'en',
      datePublished: page.published,
      dateModified: page.updated,
      author: {
        '@type': 'Organization',
        name: 'Archive Nº 64',
      },
      publisher: {
        '@type': 'Organization',
        name: 'Archive Nº 64',
      },
      image: absolute('/og-image.png'),
      mainEntityOfPage: absolute(pagePath),
      articleSection: page.navLabel,
      keywords: page.keywords,
      isPartOf: {
        '@type': 'WebSite',
        name: 'The 64 Squares',
        url: absolute('/'),
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbItems,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: page.faqs.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer,
        },
      })),
    },
  ];

  if (page.howTo) {
    graph.push({
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      name: page.howTo.name,
      description: page.howTo.description,
      inLanguage: 'en',
      step: page.howTo.steps.map((step, index) => ({
        '@type': 'HowToStep',
        position: index + 1,
        name: step.name,
        text: step.text,
      })),
    });
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
