import { KeywordItem, ContentPillar } from '../types';

export const TARGET_DOMAIN = 'https://futuremindsv2.vercel.app';

export const OPTIMIZED_HEAD_HTML = `<!-- Future Minds — Optimized Production SEO Meta Tags -->
<!-- Place inside <head> of index.html in your repository -->

<!-- Primary Meta Tags -->
<title>Future Minds | Robotics, AI & Coding Classes for Kids in Electronic City, Bangalore</title>
<meta name="title" content="Future Minds | Robotics, AI & Coding Classes for Kids in Electronic City, Bangalore" />
<meta name="description" content="Hands-on Robotics, AI & Python coding lab for school students (Grades 1–10) in Ananth Nagar, Electronic City, Bengaluru. Strictly small batches of 4–5 students. Book a free demo class today!" />
<meta name="keywords" content="robotics classes for kids, coding classes electronic city, python for kids bangalore, stem lab ananth nagar, ai courses for school students, robotics workshop bangalore, blockly robotics grades 1-10" />
<meta name="author" content="Future Minds Academy" />
<meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
<link rel="canonical" href="https://futuremindsv2.vercel.app/" />

<!-- Open Graph / Facebook / WhatsApp -->
<meta property="og:type" content="website" />
<meta property="og:url" content="https://futuremindsv2.vercel.app/" />
<meta property="og:site_name" content="Future Minds STEM Academy" />
<meta property="og:title" content="Future Minds | Hands-On Robotics, AI & Coding Lab for Kids" />
<meta property="og:description" content="Practical STEM education in Electronic City, Bengaluru. Small batches (4–5 students), physical microcontrollers, Blockly to real Python & Edge AI. Free demo session available!" />
<meta property="og:image" content="https://futuremindsv2.vercel.app/og-banner.jpg" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:image:alt" content="Future Minds Robotics and AI STEM Lab for School Students in Bengaluru" />
<meta property="og:locale" content="en_IN" />

<!-- Twitter / X -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:url" content="https://futuremindsv2.vercel.app/" />
<meta name="twitter:title" content="Future Minds | Robotics & AI Lab for School Students" />
<meta name="twitter:description" content="Hands-on robotics & coding in small batches (4–5 kids) in Ananth Nagar, Electronic City, Bengaluru. Book your child's free trial." />
<meta name="twitter:image" content="https://futuremindsv2.vercel.app/og-banner.jpg" />

<!-- Local SEO / Geolocation Tags (Bangalore / Electronic City) -->
<meta name="geo.region" content="IN-KA" />
<meta name="geo.placename" content="Bengaluru, Karnataka, India" />
<meta name="geo.position" content="12.8398;77.6775" />
<meta name="ICBM" content="12.8398, 77.6775" />
<meta name="address" content="1121, 5th Cross, Phase II, Ananth Nagar, Electronic City, Bengaluru, Karnataka 560100" />

<!-- Mobile & PWA -->
<meta name="theme-color" content="#10233f" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />`;

export const ROBOTS_TXT = `# Future Minds Production robots.txt
# Place at /public/robots.txt in your repository root

User-agent: *
Allow: /
Disallow: /api/
Disallow: /private/

# Explicit search bot directives
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

# Sitemap index
Sitemap: https://futuremindsv2.vercel.app/sitemap.xml
`;

export const SITEMAP_XML = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">

  <!-- Homepage (Primary Priority) -->
  <url>
    <loc>https://futuremindsv2.vercel.app/</loc>
    <lastmod>2026-09-14</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>

  <!-- Curriculum & Programs Section -->
  <url>
    <loc>https://futuremindsv2.vercel.app/#curriculum</loc>
    <lastmod>2026-09-14</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>

  <!-- Grades 1-4 Visual Blocks & Robotics -->
  <url>
    <loc>https://futuremindsv2.vercel.app/#grades-1-4</loc>
    <lastmod>2026-09-14</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>

  <!-- Grades 5-7 Real Python & Smart IoT -->
  <url>
    <loc>https://futuremindsv2.vercel.app/#grades-5-7</loc>
    <lastmod>2026-09-14</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>

  <!-- Grades 8-10 Computer Vision & Edge AI -->
  <url>
    <loc>https://futuremindsv2.vercel.app/#grades-8-10</loc>
    <lastmod>2026-09-14</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>

  <!-- Free Demo Booking & Contact -->
  <url>
    <loc>https://futuremindsv2.vercel.app/#contact</loc>
    <lastmod>2026-09-14</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>

</urlset>`;

export const SCHEMA_JSON_LD = `{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["EducationalOrganization", "LocalBusiness"],
      "@id": "https://futuremindsv2.vercel.app/#organization",
      "name": "Future Minds — Robotics, AI & Coding Lab",
      "url": "https://futuremindsv2.vercel.app/",
      "logo": "https://futuremindsv2.vercel.app/future_minds_logo.jpg",
      "image": "https://futuremindsv2.vercel.app/future_minds_logo.jpg",
      "description": "Practical technology learning for school students (Grades 1–10). Hands-on Robotics, Artificial Intelligence & Python Coding in small batches (4–5 students) in Ananth Nagar, Electronic City, Bengaluru.",
      "telephone": "+91-9876543210",
      "email": "contact@futureminds.in",
      "priceRange": "₹₹",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "1121, 5th Cross, Phase II, Ananth Nagar",
        "addressLocality": "Electronic City, Bengaluru",
        "addressRegion": "Karnataka",
        "postalCode": "560100",
        "addressCountry": "IN"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 12.8398,
        "longitude": 77.6775
      },
      "openingHoursSpecification": [
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
          "opens": "09:00",
          "closes": "19:00"
        }
      ],
      "areaServed": [
        "Electronic City Phase 1",
        "Electronic City Phase 2",
        "Ananth Nagar",
        "Huskur",
        "Chandapura",
        "Bommasandra",
        "HSR Layout",
        "Bengaluru"
      ],
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "reviewCount": "48",
        "bestRating": "5"
      }
    },
    {
      "@type": "Course",
      "@id": "https://futuremindsv2.vercel.app/#course-visual-blocks",
      "name": "Blockly Robotics & Creative Coding (Grades 1–4)",
      "description": "Introduction to algorithmic thinking, motorized chassis assembly, circuit basics, and Blockly logic in small batches of 4–5 kids.",
      "provider": {
        "@id": "https://futuremindsv2.vercel.app/#organization"
      },
      "educationalLevel": "Grades 1–4 (Ages 6–10)",
      "hasCourseInstance": {
        "@type": "CourseInstance",
        "courseMode": "In-Person Classroom Lab",
        "courseWorkload": "PT2H/week",
        "location": "Future Minds Lab, Ananth Nagar, Bengaluru"
      }
    },
    {
      "@type": "Course",
      "@id": "https://futuremindsv2.vercel.app/#course-python-iot",
      "name": "Python Programming & Smart Connected IoT (Grades 5–7)",
      "description": "Transition from visual blocks to typed Python, microcontroller Wi-Fi/Bluetooth telemetry, sensors, and phone-controlled robotic rovers.",
      "provider": {
        "@id": "https://futuremindsv2.vercel.app/#organization"
      },
      "educationalLevel": "Grades 5–7 (Ages 10–13)",
      "hasCourseInstance": {
        "@type": "CourseInstance",
        "courseMode": "In-Person Classroom Lab",
        "courseWorkload": "PT2H/week",
        "location": "Future Minds Lab, Ananth Nagar, Bengaluru"
      }
    },
    {
      "@type": "Course",
      "@id": "https://futuremindsv2.vercel.app/#course-vision-ai",
      "name": "Computer Vision & Edge AI Robotics (Grades 8–10)",
      "description": "Advanced OpenCV camera computer vision, 4-DOF servo robotic arms, edge neural classifiers, and competitive STEM portfolios.",
      "provider": {
        "@id": "https://futuremindsv2.vercel.app/#organization"
      },
      "educationalLevel": "Grades 8–10 (Ages 13–16)",
      "hasCourseInstance": {
        "@type": "CourseInstance",
        "courseMode": "In-Person Classroom Lab",
        "courseWorkload": "PT3H/week",
        "location": "Future Minds Lab, Ananth Nagar, Bengaluru"
      }
    },
    {
      "@type": "FAQPage",
      "@id": "https://futuremindsv2.vercel.app/#faq",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What age or grade is Future Minds suitable for?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Future Minds is designed for school students in Grades 1 through 10 (ages 6 to 16). The curriculum is phased into 3 specialized tracks: Visual Blocks & Robotics (Grades 1–4), Python & Connected IoT (Grades 5–7), and Computer Vision & Edge AI (Grades 8–10)."
          }
        },
        {
          "@type": "Question",
          "name": "What is the batch size at Future Minds Bengaluru?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "To guarantee personalized mentor guidance and safety with physical hardware, every batch is strictly capped at 4 to 5 students. Every student works with their own physical robotic kit and workstation."
          }
        },
        {
          "@type": "Question",
          "name": "Where is the physical lab located?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The Future Minds STEM Lab is conveniently located at 1121, 5th Cross, Phase II, Ananth Nagar, Electronic City, Bengaluru, Karnataka 560100."
          }
        },
        {
          "@type": "Question",
          "name": "Can we attend a free trial or demo session?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes! We offer a complimentary, hands-on 60-minute demo session where your child can build a real robotic circuit and explore the lab before enrolling."
          }
        },
        {
          "@type": "Question",
          "name": "How does Future Minds differ from online coding classes?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Unlike online video calls where kids stare at screens, Future Minds is a physical maker lab where students assemble actual motors, sensors, microcontrollers, and servo robotic arms with hands-on mentor coaching."
          }
        }
      ]
    }
  ]
}`;

export const VERCEL_JSON_CONFIG = `{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        }
      ]
    },
    {
      "source": "/(robots.txt|sitemap.xml)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=86400, stale-while-revalidate=43200"
        }
      ]
    },
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}`;

export const INITIAL_KEYWORDS: KeywordItem[] = [
  {
    id: 'kw-1',
    keyword: 'robotics classes for kids in electronic city',
    category: 'Local Bangalore',
    searchIntent: 'Transactional',
    monthlyVolume: 1300,
    difficulty: 'Low',
    priority: 'Quick Win',
    targetUrl: 'https://futuremindsv2.vercel.app/',
    serpFeatures: ['Local 3-Pack', 'Reviews', 'Sitelinks'],
    suggestedAnchor: 'Robotics classes in Electronic City',
  },
  {
    id: 'kw-2',
    keyword: 'coding classes for kids near me electronic city',
    category: 'Near Me Queries',
    searchIntent: 'Transactional',
    monthlyVolume: 2400,
    difficulty: 'Medium',
    priority: 'Quick Win',
    targetUrl: 'https://futuremindsv2.vercel.app/',
    serpFeatures: ['Google Maps Pack', 'Distance badge', 'Reviews'],
    suggestedAnchor: 'Coding classes near me in Electronic City',
  },
  {
    id: 'kw-3',
    keyword: 'stem lab for school students ananth nagar bangalore',
    category: 'Local Bangalore',
    searchIntent: 'Commercial',
    monthlyVolume: 720,
    difficulty: 'Low',
    priority: 'Quick Win',
    targetUrl: 'https://futuremindsv2.vercel.app/',
    serpFeatures: ['Local 3-Pack', 'Knowledge Panel'],
    suggestedAnchor: 'STEM lab in Ananth Nagar Bengaluru',
  },
  {
    id: 'kw-4',
    keyword: 'robotics classes for school students bangalore',
    category: 'Robotics Classes',
    searchIntent: 'Commercial',
    monthlyVolume: 3600,
    difficulty: 'Medium',
    priority: 'High Value',
    targetUrl: 'https://futuremindsv2.vercel.app/#curriculum',
    serpFeatures: ['Featured Snippet', 'Course schema', 'Video Carousel'],
    suggestedAnchor: 'Robotics courses for school students Bangalore',
  },
  {
    id: 'kw-5',
    keyword: 'python coding classes for kids grades 5 to 10',
    category: 'Coding & Python',
    searchIntent: 'Commercial',
    monthlyVolume: 1900,
    difficulty: 'Medium',
    priority: 'High Value',
    targetUrl: 'https://futuremindsv2.vercel.app/#grades-5-7',
    serpFeatures: ['Course Rich Snippet', 'FAQ Dropdown'],
    suggestedAnchor: 'Python coding for kids Grades 5–10',
  },
  {
    id: 'kw-6',
    keyword: 'small batch robotics lab for kids bangalore',
    category: 'Robotics Classes',
    searchIntent: 'Commercial',
    monthlyVolume: 580,
    difficulty: 'Low',
    priority: 'Quick Win',
    targetUrl: 'https://futuremindsv2.vercel.app/',
    serpFeatures: ['Reviews', 'Sitelinks'],
    suggestedAnchor: 'Small batch robotics lab Bangalore',
  },
  {
    id: 'kw-7',
    keyword: 'ai and computer vision course for school students',
    category: 'Grades 1-10',
    searchIntent: 'Informational',
    monthlyVolume: 1100,
    difficulty: 'Low',
    priority: 'High Value',
    targetUrl: 'https://futuremindsv2.vercel.app/#grades-8-10',
    serpFeatures: ['Course Carousel', 'People Also Ask'],
    suggestedAnchor: 'Edge AI & Computer Vision course for teens',
  },
  {
    id: 'kw-8',
    keyword: 'blockly and scratch coding classes ananth nagar',
    category: 'Coding & Python',
    searchIntent: 'Transactional',
    monthlyVolume: 840,
    difficulty: 'Low',
    priority: 'Quick Win',
    targetUrl: 'https://futuremindsv2.vercel.app/#grades-1-4',
    serpFeatures: ['Local Pack', 'Sitelinks'],
    suggestedAnchor: 'Scratch & Blockly classes for Grades 1–4',
  },
  {
    id: 'kw-9',
    keyword: 'robotics summer camp electronic city 2025',
    category: 'Local Bangalore',
    searchIntent: 'Transactional',
    monthlyVolume: 1500,
    difficulty: 'Low',
    priority: 'High Value',
    targetUrl: 'https://futuremindsv2.vercel.app/#contact',
    serpFeatures: ['Events Pack', 'Local 3-Pack'],
    suggestedAnchor: 'Robotics Summer Camp Electronic City',
  },
  {
    id: 'kw-10',
    keyword: 'offline vs online robotics classes for children',
    category: 'Robotics Classes',
    searchIntent: 'Informational',
    monthlyVolume: 920,
    difficulty: 'Low',
    priority: 'Long-term Authority',
    targetUrl: 'https://futuremindsv2.vercel.app/',
    serpFeatures: ['Featured Snippet', 'FAQ Snippets'],
    suggestedAnchor: 'Benefits of hands-on physical robotics lab',
  },
];

export const CONTENT_PILLARS: ContentPillar[] = [
  {
    title: 'Why Physical Robotics Labs Beat Online Screen-Based Coding for Kids',
    targetKeyword: 'physical robotics lab vs online coding classes for kids',
    secondaryKeywords: [
      'hands-on STEM learning Bangalore',
      'robotics kit for school students',
      'reduce screen time with engineering',
    ],
    searchIntent: 'Commercial Investigation (Parents comparing learning formats)',
    targetAudience: 'Tech parents in Electronic City worried about passive screen time',
    estimatedVolume: '1,400 monthly searches in South India',
    wordCount: '1,200 words',
    slug: 'hands-on-robotics-vs-online-coding',
    summary:
      'A deep dive into why assembling real circuits, troubleshooting loose jumpers, and handling microcontrollers builds tactile problem-solving skills that 2D Zoom classes cannot match.',
    keyTakeaways: [
      'Tactile muscle memory & hardware debugging',
      'Zero passive video fatigue; active collaborative building',
      'Small batch ratio (4–5 students) ensures true mentor attention',
    ],
  },
  {
    title: 'The Grade 1–10 Coding Roadmap: When Should Your Child Switch from Scratch to Python?',
    targetKeyword: 'when to switch from scratch to python for kids',
    secondaryKeywords: [
      'python for grade 5 students',
      'visual blocks vs typed coding',
      'best age to learn python bangalore',
    ],
    searchIntent: 'Informational & Educational',
    targetAudience: 'Parents of Grades 4–6 students planning their child’s STEM journey',
    estimatedVolume: '2,800 monthly searches across India',
    wordCount: '1,500 words',
    slug: 'scratch-to-python-grade-roadmap',
    summary:
      'Clear, actionable timeline on transitioning from visual logic blocks (Grades 1–4) to real typed Python syntax (Grades 5–7) and Edge AI with OpenCV (Grades 8–10).',
    keyTakeaways: [
      'Visual blocks build foundational algorithmic logic without syntax frustration',
      'Grade 5 is the psychological inflection point for typing speed and abstract variables',
      'Real-world IoT projects bridge code into physical movement',
    ],
  },
  {
    title: 'Top 7 STEM & Robotics Competitions for Bangalore School Students (and How to Prepare)',
    targetKeyword: 'robotics competitions for school students bangalore',
    secondaryKeywords: [
      'WRO India Bangalore qualifier',
      'First Lego League Bengaluru',
      'school STEM Olympiad preparation',
    ],
    searchIntent: 'Informational & Transactional',
    targetAudience: 'Ambitious parents looking to build portfolios for high school and university admissions',
    estimatedVolume: '1,900 monthly searches',
    wordCount: '1,600 words',
    slug: 'bangalore-school-robotics-competitions-guide',
    summary:
      'Comprehensive guide to World Robot Olympiad (WRO), FLL, and regional innovation hackathons, highlighting capstone projects built in Future Minds lab.',
    keyTakeaways: [
      'Key competition dates and eligibility for Grades 1–10',
      'How our autonomous rover and robotic arm capstones prepare students',
      'Portfolio certification advantages for ICSE/CBSE/IB students',
    ],
  },
];
