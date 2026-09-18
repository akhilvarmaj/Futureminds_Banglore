export const SITE_ORIGIN = 'https://www.futuremindsco.in';
export const BUSINESS = {
  name: 'Future Minds',
  phone: '+919618283987',
  address: '1121, 5th Cross, Phase II, Ananth Nagar, Electronic City, Bengaluru, Karnataka 560100',
  hours: 'Monday-Friday 4:00 PM-8:00 PM; Saturday-Sunday 9:00 AM-7:00 PM',
  latitude: 12.835341359891938,
  longitude: 77.69243633284383,
};

export const routes = {
  home: { path: '/', title: 'Future Minds | Robotics, AI & Coding Classes in Electronic City', description: 'Robotics, AI and coding classes for kids in Grades 1-10 at Future Minds, Ananth Nagar, Electronic City, Bengaluru. Book a free demo.' },
  about: { path: '/about/', title: 'About Future Minds | Hands-on STEM Learning in Electronic City', description: 'Learn about the Future Minds approach: small groups, practical hardware projects and a grade-based learning progression for children in Bengaluru.' },
  programs: { path: '/programs/', title: 'Robotics, AI & Coding Programs for Kids | Future Minds', description: 'Compare robotics, artificial intelligence and coding tracks for Grades 1-10. Explore tools, projects and learning paths at our Ananth Nagar campus.' },
  grades: { path: '/grades/', title: 'Grades 1-10 STEM Curriculum | Future Minds Bengaluru', description: 'Explore the progression from visual coding and circuits to Python, IoT and AI. Find age-appropriate projects and learning milestones for your child.' },
  projects: { path: '/projects/', title: 'Interactive Robotics & Coding Project Lab | Future Minds', description: 'Try rover navigation, logic gates, an AI classifier and a smart soil simulation. Discover how children learn through testing and debugging.' },
  gallery: { path: '/gallery/', title: 'Campus & Innovation Lab in Ananth Nagar | Future Minds', description: 'Explore the Future Minds learning spaces for electronics, robotics and coding in Ananth Nagar, Electronic City. Arrange a campus visit.' },
  demo: { path: '/demo/', title: 'Book a Free Robotics & Coding Demo | Future Minds', description: 'Request a free hands-on demo for your child at Future Minds in Ananth Nagar. Share their grade, interests and preferred class slot on WhatsApp.' },
  contact: { path: '/contact/', title: 'Contact Future Minds | Ananth Nagar, Electronic City', description: 'Find the Future Minds address, verified opening hours, directions and admissions phone number. Visit our robotics, AI and coding campus in Bengaluru.' },
  faq: { path: '/faq/', title: 'Classes, Kits & Admissions FAQ | Future Minds', description: 'Answers for parents about student grades, small batches, robotics kits, missed classes and booking a trial at Future Minds in Electronic City.' },
  robotics: { path: '/robotics-classes-electronic-city/', title: 'Robotics Classes for Kids in Electronic City | Future Minds', description: 'Hands-on robotics for Grades 1-10 near Ananth Nagar. Explore circuits, sensors, Arduino and rover projects with a learning path matched to your child.' },
  ai: { path: '/ai-classes-for-kids-bangalore/', title: 'AI Classes for Kids in Bangalore | Future Minds', description: 'Explore age-appropriate AI learning in Bengaluru: examples, image classification, model testing and Python. Find the right starting point for your child.' },
  coding: { path: '/coding-classes-electronic-city/', title: 'Coding Classes for Kids in Electronic City | Future Minds', description: 'From Scratch and block coding to Python, learn how children build programs, test ideas and debug projects at Future Minds in Ananth Nagar.' },
} as const;

export type PageTab = keyof typeof routes;
export const hashAliases: Record<string, PageTab> = {
  home: 'home', about: 'about', programs: 'programs', courses: 'programs', classes: 'programs',
  grades: 'grades', curriculum: 'grades', syllabus: 'grades', projects: 'projects', lab: 'projects',
  gallery: 'gallery', photos: 'gallery', demo: 'demo', trial: 'demo', enroll: 'demo', book: 'demo',
  contact: 'contact', location: 'contact', address: 'contact', batches: 'programs', faq: 'faq', faqs: 'faq',
  robotics: 'robotics', ai: 'ai', coding: 'coding',
};

export function pageFromPath(pathname: string): PageTab | undefined {
  const normalized = pathname === '/' ? '/' : `${pathname.replace(/\/+$/, '')}/`;
  return (Object.keys(routes) as PageTab[]).find(page => routes[page].path === normalized);
}

export function structuredData(page: PageTab) {
  const canonical = SITE_ORIGIN + routes[page].path;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['LocalBusiness', 'EducationalOrganization'], '@id': `${SITE_ORIGIN}/#organization`,
        name: BUSINESS.name, url: `${SITE_ORIGIN}/`, telephone: BUSINESS.phone,
        logo: `${SITE_ORIGIN}/future_minds_logo.jpg`, image: `${SITE_ORIGIN}/og/future-minds-1200x630.jpg`,
        description: 'Robotics, AI and coding classes for children in Grades 1-10 in Ananth Nagar, Electronic City, Bengaluru.',
        address: { '@type': 'PostalAddress', streetAddress: '1121, 5th Cross, Phase II, Ananth Nagar', addressLocality: 'Electronic City, Bengaluru', addressRegion: 'Karnataka', postalCode: '560100', addressCountry: 'IN' },
        geo: { '@type': 'GeoCoordinates', latitude: BUSINESS.latitude, longitude: BUSINESS.longitude },
        hasMap: `https://www.google.com/maps/search/?api=1&query=${BUSINESS.latitude},${BUSINESS.longitude}`,
        openingHoursSpecification: [
          { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '16:00', closes: '20:00' },
          { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Saturday', 'Sunday'], opens: '09:00', closes: '19:00' },
        ],
        areaServed: ['Ananth Nagar', 'Electronic City', 'Bengaluru'],
      },
      { '@type': 'WebSite', '@id': `${SITE_ORIGIN}/#website`, name: BUSINESS.name, url: `${SITE_ORIGIN}/`, publisher: { '@id': `${SITE_ORIGIN}/#organization` } },
      { '@type': 'WebPage', '@id': `${canonical}#webpage`, url: canonical, name: routes[page].title, description: routes[page].description, isPartOf: { '@id': `${SITE_ORIGIN}/#website` }, about: { '@id': `${SITE_ORIGIN}/#organization` } },
    ],
  };
}

export function updatePageMetadata(page: PageTab) {
  const route = routes[page];
  document.title = route.title;
  const setMeta = (key: string, value: string, property = false) => {
    const attribute = property ? 'property' : 'name';
    let element = document.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
    if (!element) { element = document.createElement('meta'); element.setAttribute(attribute, key); document.head.append(element); }
    element.content = value;
  };
  setMeta('description', route.description);
  for (const prefix of ['og', 'twitter']) {
    setMeta(`${prefix}:title`, route.title, prefix === 'og');
    setMeta(`${prefix}:description`, route.description, prefix === 'og');
  }
  setMeta('og:url', SITE_ORIGIN + route.path, true);
  const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (canonical) canonical.href = SITE_ORIGIN + route.path;
  const schema = document.getElementById('site-schema');
  if (schema) schema.textContent = JSON.stringify(structuredData(page));
}