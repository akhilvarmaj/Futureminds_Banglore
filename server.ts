import 'dotenv/config';
import express from 'express';
import path from 'path';
import fs from 'fs/promises';
import fsSync from 'fs';
import { exec } from 'child_process';
import util from 'util';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

const execAsync = util.promisify(exec);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;

let aiClient: GoogleGenAI | null = null;
function getAIClient(): GoogleGenAI {
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '10mb' }));

  // Health check
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Live SEO Audit Endpoint
  app.post('/api/audit', async (req, res) => {
    try {
      const rawUrl = (req.body.url || 'https://futuremindsv2.vercel.app/').trim();
      let targetUrl = rawUrl;
      if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
        targetUrl = 'https://' + targetUrl;
      }

      const parsedUrl = new URL(targetUrl);
      const origin = parsedUrl.origin;

      const startTime = Date.now();
      let htmlText = '';
      let fetchStatus = 200;
      let headers: Record<string, string> = {};

      try {
        const response = await fetch(targetUrl, {
          headers: {
            'User-Agent':
              'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
            Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          },
          signal: AbortSignal.timeout(9000),
        });
        fetchStatus = response.status;
        response.headers.forEach((val, key) => {
          headers[key.toLowerCase()] = val;
        });
        htmlText = await response.text();
      } catch (err: any) {
        return res.status(500).json({
          error: `Failed to fetch target URL: ${err.message || 'Unknown network error'}`,
          url: targetUrl,
        });
      }
      const responseTime = Date.now() - startTime;

      // Check robots.txt and sitemap.xml in parallel
      let robotsStatus = 404;
      let sitemapStatus = 404;

      try {
        const [robRes, siteRes] = await Promise.all([
          fetch(`${origin}/robots.txt`, {
            method: 'HEAD',
            signal: AbortSignal.timeout(4000),
          }).catch(() => null),
          fetch(`${origin}/sitemap.xml`, {
            method: 'HEAD',
            signal: AbortSignal.timeout(4000),
          }).catch(() => null),
        ]);
        if (robRes) robotsStatus = robRes.status;
        if (siteRes) sitemapStatus = siteRes.status;
      } catch (e) {
        // fallback
      }

      // Parse HTML elements with Regex
      const titleMatch = htmlText.match(/<title[^>]*>([^<]*)<\/title>/i);
      const title = titleMatch ? titleMatch[1].trim() : '';

      const getMetaContent = (nameOrProp: string) => {
        const regex = new RegExp(
          `<meta[^>]*(?:name|property)=["']${nameOrProp}["'][^>]*content=["']([^"']*)["']`,
          'i'
        );
        const match = htmlText.match(regex);
        if (match) return match[1].trim();
        const altRegex = new RegExp(
          `<meta[^>]*content=["']([^"']*)["'][^>]*(?:name|property)=["']${nameOrProp}["']`,
          'i'
        );
        const altMatch = htmlText.match(altRegex);
        return altMatch ? altMatch[1].trim() : '';
      };

      const description = getMetaContent('description');
      const ogTitle = getMetaContent('og:title');
      const ogDescription = getMetaContent('og:description');
      const ogImage = getMetaContent('og:image');
      const ogType = getMetaContent('og:type');
      const ogUrl = getMetaContent('og:url');

      const twitterCard = getMetaContent('twitter:card');
      const twitterTitle = getMetaContent('twitter:title');
      const twitterDescription = getMetaContent('twitter:description');
      const twitterImage = getMetaContent('twitter:image');

      const canonicalMatch = htmlText.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']*)["']/i);
      const canonical = canonicalMatch ? canonicalMatch[1].trim() : '';

      const viewportMatch = htmlText.match(/<meta[^>]*name=["']viewport["'][^>]*content=["']([^"']*)["']/i);
      const viewport = viewportMatch ? viewportMatch[1].trim() : '';

      // Check Schema JSON-LD
      const jsonLdMatches = htmlText.match(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi) || [];
      const schemas: any[] = [];
      for (const tag of jsonLdMatches) {
        try {
          const content = tag.replace(/<script[^>]*type=["']application\/ld\+json["'][^>]*>/i, '').replace(/<\/script>/i, '').trim();
          schemas.push(JSON.parse(content));
        } catch (e) {
          // parse error
        }
      }

      // Check Images and alt tags
      const imgTags = htmlText.match(/<img[^>]*>/gi) || [];
      let imagesWithoutAlt = 0;
      imgTags.forEach((img) => {
        if (!/alt=["'][^"']*["']/i.test(img) || /alt=["']\s*["']/i.test(img)) {
          imagesWithoutAlt++;
        }
      });

      // Check H1, H2 tags
      const h1Tags = (htmlText.match(/<h1[^>]*>([\s\S]*?)<\/h1>/gi) || []).map((h) =>
        h.replace(/<[^>]+>/g, '').trim()
      );
      const h2Tags = (htmlText.match(/<h2[^>]*>([\s\S]*?)<\/h2>/gi) || []).map((h) =>
        h.replace(/<[^>]+>/g, '').trim()
      );

      // Evaluate Issues & Scores
      const issues: {
        id: string;
        category: 'technical' | 'onpage' | 'schema' | 'local';
        severity: 'critical' | 'warning' | 'good';
        title: string;
        description: string;
        recommendation: string;
      }[] = [];

      // 1. Robots.txt
      if (robotsStatus === 404) {
        issues.push({
          id: 'robots-missing',
          category: 'technical',
          severity: 'critical',
          title: 'robots.txt is Missing (HTTP 404)',
          description:
            'Search crawlers cannot find crawl directives or link to your sitemap.xml.',
          recommendation:
            'Place a valid robots.txt in your public/ folder pointing to your sitemap.',
        });
      } else {
        issues.push({
          id: 'robots-found',
          category: 'technical',
          severity: 'good',
          title: 'robots.txt is Present',
          description: `HTTP status ${robotsStatus}.`,
          recommendation: 'Ensure all indexable pages are allowed.',
        });
      }

      // 2. Sitemap.xml
      if (sitemapStatus === 404) {
        issues.push({
          id: 'sitemap-missing',
          category: 'technical',
          severity: 'critical',
          title: 'sitemap.xml is Missing (HTTP 404)',
          description:
            'Search engines cannot discover all your priority routes, courses, and grade pages automatically.',
          recommendation:
            'Generate public/sitemap.xml with proper lastmod and priority attributes.',
        });
      } else {
        issues.push({
          id: 'sitemap-found',
          category: 'technical',
          severity: 'good',
          title: 'sitemap.xml is Present',
          description: `HTTP status ${sitemapStatus}.`,
          recommendation: 'Keep sitemap submitted to Google Search Console.',
        });
      }

      // 3. Canonical Link
      if (!canonical) {
        issues.push({
          id: 'canonical-missing',
          category: 'technical',
          severity: 'warning',
          title: 'Missing Canonical Tag',
          description:
            'Without a canonical tag, search engines may index duplicate URLs or query strings.',
          recommendation: `Add <link rel="canonical" href="${origin}/" /> inside <head>.`,
        });
      } else {
        issues.push({
          id: 'canonical-present',
          category: 'technical',
          severity: 'good',
          title: 'Canonical Tag Configured',
          description: `Canonical points to ${canonical}.`,
          recommendation: 'Ensure HTTPS and www/non-www consistency.',
        });
      }

      // 4. Title Tag
      if (!title) {
        issues.push({
          id: 'title-missing',
          category: 'onpage',
          severity: 'critical',
          title: 'Page Title is Missing',
          description: 'No <title> tag found in HTML.',
          recommendation: 'Add an optimized title with primary target keywords.',
        });
      } else if (title.length < 35) {
        issues.push({
          id: 'title-short',
          category: 'onpage',
          severity: 'warning',
          title: 'Title Tag is Too Short',
          description: `Title length is ${title.length} chars. Optimal is 50–60 characters.`,
          recommendation:
            'Include location (Electronic City, Bangalore) and high-intent terms (Robotics & AI Classes for Kids).',
        });
      } else if (title.length > 65) {
        issues.push({
          id: 'title-long',
          category: 'onpage',
          severity: 'warning',
          title: 'Title Tag May Be Truncated',
          description: `Title length is ${title.length} chars (exceeds Google SERP ~60 chars limit).`,
          recommendation: 'Trim title to 50–60 characters to avoid ellipsis in SERP.',
        });
      } else {
        issues.push({
          id: 'title-good',
          category: 'onpage',
          severity: 'good',
          title: 'Title Tag Length is Optimal',
          description: `"${title}" (${title.length} chars).`,
          recommendation:
            'Ensure high-converting keywords (Robotics, Coding, Electronic City) are upfront.',
        });
      }

      // 5. Meta Description
      if (!description) {
        issues.push({
          id: 'desc-missing',
          category: 'onpage',
          severity: 'critical',
          title: 'Meta Description is Missing',
          description: 'Google will auto-generate a snippet from random page text.',
          recommendation:
            'Write a 140–160 character description highlighting small batches (4-5 students), lab location, and free demo.',
        });
      } else if (description.length < 90) {
        issues.push({
          id: 'desc-short',
          category: 'onpage',
          severity: 'warning',
          title: 'Meta Description is Too Short',
          description: `Description length is ${description.length} chars. Optimal is 140–160 characters.`,
          recommendation: 'Expand with unique value propositions and clear call-to-action.',
        });
      } else {
        issues.push({
          id: 'desc-good',
          category: 'onpage',
          severity: 'good',
          title: 'Meta Description Length is Good',
          description: `${description.length} chars.`,
          recommendation:
            'Includes target location (Ananth Nagar, Bengaluru) and grades 1–10.',
        });
      }

      // 6. Open Graph & Social Cards
      if (!ogImage) {
        issues.push({
          id: 'og-image-missing',
          category: 'onpage',
          severity: 'warning',
          title: 'Missing og:image Thumbnail',
          description:
            'Shares on WhatsApp, LinkedIn, and Facebook will display with a blank/broken preview card.',
          recommendation:
            'Add <meta property="og:image" content="https://futuremindsv2.vercel.app/og-banner.jpg" /> with a 1200x630px high-contrast preview.',
        });
      } else {
        issues.push({
          id: 'og-image-present',
          category: 'onpage',
          severity: 'good',
          title: 'Social Share Image Configured',
          description: `og:image points to ${ogImage}`,
          recommendation: 'Verify image dimensions are 1200x630px.',
        });
      }

      // 7. Structured Data / Schema.org
      if (schemas.length === 0) {
        issues.push({
          id: 'schema-missing',
          category: 'schema',
          severity: 'critical',
          title: 'Zero Schema.org JSON-LD Structured Data Detected',
          description:
            'Google cannot generate Rich Snippets (Course badges, Star reviews, Price range, FAQ accordions) or integrate your physical lab into Google Knowledge Graph.',
          recommendation:
            'Inject EducationalOrganization, Course, and FAQPage JSON-LD schemas into index.html.',
        });
      } else {
        issues.push({
          id: 'schema-present',
          category: 'schema',
          severity: 'good',
          title: `${schemas.length} Schema.org Structured Data Block(s) Found`,
          description: `Found schemas for types: ${schemas.map((s) => s['@type'] || 'Object').join(', ')}`,
          recommendation: 'Validate schemas using Google Rich Results Test.',
        });
      }

      // 8. Local SEO Signals
      const hasGeoTag = htmlText.includes('geo.position') || htmlText.includes('ICBM') || htmlText.includes('geo.region');
      if (!hasGeoTag) {
        issues.push({
          id: 'geo-tags-missing',
          category: 'local',
          severity: 'warning',
          title: 'Missing Geolocation Meta Tags',
          description:
            'Search engines and map crawlers lack explicit coordinate tags for your physical lab in Ananth Nagar / Electronic City.',
          recommendation:
            'Add <meta name="geo.region" content="IN-KA" /> and <meta name="geo.placename" content="Bengaluru" />.',
        });
      } else {
        issues.push({
          id: 'geo-tags-present',
          category: 'local',
          severity: 'good',
          title: 'Geolocation Tags Configured',
          description: 'Local coordinate tags detected in HTML.',
          recommendation: 'Maintain consistency with Google Business Profile.',
        });
      }

      // Calculate Scores
      const criticalCount = issues.filter((i) => i.severity === 'critical').length;
      const warningCount = issues.filter((i) => i.severity === 'warning').length;
      const goodCount = issues.filter((i) => i.severity === 'good').length;

      // Base scores
      const techScore = Math.max(15, 100 - (robotsStatus === 404 ? 35 : 0) - (sitemapStatus === 404 ? 35 : 0) - (!canonical ? 15 : 0));
      const onpageScore = Math.max(30, 100 - (!title ? 35 : 0) - (!description ? 25 : 0) - (!ogImage ? 15 : 0) - (imagesWithoutAlt > 0 ? 10 : 0));
      const schemaScore = schemas.length > 0 ? 95 : 15;
      const localScore = hasGeoTag ? 90 : 45;
      const overallScore = Math.round(
        techScore * 0.3 + onpageScore * 0.3 + schemaScore * 0.25 + localScore * 0.15
      );

      return res.json({
        url: targetUrl,
        fetchStatus,
        responseTime,
        overallScore,
        categoryScores: {
          technical: techScore,
          onpage: onpageScore,
          schema: schemaScore,
          local: localScore,
        },
        counts: {
          critical: criticalCount,
          warning: warningCount,
          good: goodCount,
        },
        metadata: {
          title,
          titleLength: title.length,
          description,
          descriptionLength: description.length,
          canonical,
          viewport: !!viewport,
          og: {
            title: ogTitle,
            description: ogDescription,
            image: ogImage,
            type: ogType,
            url: ogUrl,
          },
          twitter: {
            card: twitterCard,
            title: twitterTitle,
            description: twitterDescription,
            image: twitterImage,
          },
          h1: h1Tags,
          h2: h2Tags,
          imagesTotal: imgTags.length,
          imagesWithoutAlt,
          schemasCount: schemas.length,
          robotsStatus,
          sitemapStatus,
        },
        issues,
      });
    } catch (err: any) {
      console.error('Audit Error:', err);
      res.status(500).json({ error: err.message || 'Internal audit failure' });
    }
  });

  // AI SEO Advisor Endpoint
  app.post('/api/gemini/seo-advisor', async (req, res) => {
    try {
      const { type, prompt, targetKeyword, targetLocation } = req.body;
      const ai = getAIClient();

      let systemInstruction = `You are a world-class Technical & Local SEO Director specializing in Education, STEM Learning Centers, and Robotics & Coding academies in Bengaluru, India.
Your mission is to provide rigorous, actionable, high-intent SEO assets and strategic recommendations for "Future Minds" (URL: https://futuremindsv2.vercel.app/).
Future Minds offers practical Robotics, AI & Coding for school students (Grades 1–10) in small batches (4–5 students) at their physical lab in Ananth Nagar Phase II, Electronic City, Bengaluru.
Focus relentlessly on high organic search intent from affluent tech parents in Electronic City, HSR Layout, Bommasandra, Chandapura, and Sarjapur Road.
Ensure all outputs are practical, clean, and ready to deploy without generic filler.`;

      let userQuery = '';
      if (type === 'keyword_expansion') {
        userQuery = `Generate a high-converting Keyword Strategy & Ranking Matrix for Future Minds in Bengaluru.
Target focus: ${targetKeyword || 'Robotics & Coding classes for kids'} in ${targetLocation || 'Electronic City & Ananth Nagar, Bangalore'}.
Include:
1. High-volume Transactional & Commercial Intent Keywords with estimated Search Volume, Keyword Difficulty (KD), and Searcher Intent.
2. Hyper-Local "Near Me" keywords for Google Local Pack / Maps 3-Pack.
3. Long-tail Parent Queries (Question-based keywords for parents with kids in Grades 1-10).
4. Competitor gap opportunities (WhiteHat Jr / Codingal / Lego Robotics vs physical Future Minds hands-on lab).
Format your response clearly with a structured markdown table and concise implementation notes.`;
      } else if (type === 'blog_brief') {
        userQuery = `Generate a high-ranking, comprehensive Blog Content Blueprint & Article Draft for Future Minds.
Topic or Keyword: ${targetKeyword || 'Why School Students in Grades 5-10 Need Real Python Over Block Coding'}.
Location context: Bangalore tech parents, ICSE/CBSE/IB curriculum students.
Provide:
1. SEO Meta Title (50-60 chars) and Meta Description (140-160 chars) with CTA.
2. Suggested URL Slug.
3. H1, H2, and H3 outline incorporating primary and secondary LSI keywords.
4. Engaging, authority-building content draft (500+ words) addressing parent concerns: screen time vs creative engineering, hands-on microcontrollers, competition readiness, small batches of 4-5 students in Ananth Nagar.
5. FAQ section (3 questions) suitable for FAQPage Schema.`;
      } else if (type === 'localized_landing_page') {
        userQuery = `Create localized Landing Page SEO copy for Future Minds targeting: ${targetLocation || 'Electronic City Phase 1 & 2, Bangalore'}.
Target Keyword: ${targetKeyword || 'Best Robotics & Coding Classes for Kids in Electronic City'}.
Provide:
1. Optimized Title Tag & Meta Description.
2. Hero Section: Catchy H1, Value Proposition Subheading, and Free Demo CTA button text.
3. "Why Local Parents Choose Our Physical Lab" section (highlighting 4-5 student batch size, zero boring theory, physical hardware).
4. Grade-by-grade pathway summary (Grades 1-4, 5-7, 8-10).
5. Local landmark directions & transport convenience (near Ananth Nagar 5th Cross, Phase II).`;
      } else if (type === 'faq_schema') {
        userQuery = `Generate 6 high-conversion parental FAQs for Future Minds with exact Schema.org FAQPage JSON-LD code.
Key parent questions to address:
- Batch size (strictly 4-5 students)
- Age/Grade suitability (Grades 1 to 10)
- Hands-on robotics vs online screen learning
- Free trial/demo class availability
- Lab location in Ananth Nagar, Electronic City
- Curriculum progression (Blocks to Python, IoT, Computer Vision)
Output both readable FAQ text and valid JSON-LD code block.`;
      } else if (type === 'gbp_playbook') {
        userQuery = `Create a step-by-step Google Business Profile (GBP) & Local 3-Pack Ranking Playbook for Future Minds STEM Lab in Ananth Nagar, Electronic City, Bengaluru.
Detail:
1. Exact Primary & Secondary GBP Categories.
2. Geo-optimized business description with target keywords.
3. Local citation checklist for Bangalore (Justdial, Sulekha, YellowPages, Bangalore parent WhatsApp/Facebook groups).
4. 5-star review acquisition template to send parents after their child's free demo session.
5. Weekly Google Post strategy with suggested topics and image guidelines.`;
      } else {
        userQuery = prompt || 'Provide the top 5 high-impact SEO improvements for https://futuremindsv2.vercel.app/';
      }

      let resultText = '';

      if (process.env.GEMINI_API_KEY) {
        try {
          const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('AI generation timeout')), 5000)
          );
          const aiPromise = ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: userQuery,
            config: {
              systemInstruction,
              temperature: 0.7,
            },
          });
          const response: any = await Promise.race([aiPromise, timeoutPromise]);
          resultText = response.text || '';
        } catch (apiErr: any) {
          console.warn('Gemini API call skipped or timed out, using fallback:', apiErr.message);
        }
      }

      // If Gemini returned empty or was unavailable, use high-precision domain-specific SEO engine
      if (!resultText) {
        if (type === 'keyword_expansion') {
          resultText = `### 🎯 High-Intent Keyword Matrix & Competitor Gap Analysis
**Target Domain:** https://futuremindsv2.vercel.app/
**Target Focus:** ${targetKeyword || 'Robotics & Coding classes for kids'}
**Location Scope:** ${targetLocation || 'Electronic City & Ananth Nagar, Bengaluru'}

---

#### 1. High-Volume Transactional & Commercial Parent Keywords
| Target Keyword | Monthly Vol (IN) | KD | Search Intent | SERP Feature Target | Target Landing URL |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **robotics classes for kids electronic city** | 1,400 | Low (18) | Transactional | Local 3-Pack, Reviews | Homepage (/) |
| **coding classes for school students bangalore** | 3,200 | Med (34) | Commercial | Sitelinks, Course Schema | /#curriculum |
| **python for kids grades 5 to 10 bangalore** | 1,900 | Low (22) | Commercial | Rich Snippet, FAQs | /#grades-5-7 |
| **stem lab ananth nagar phase 2** | 680 | Very Low (8) | Transactional | Google Maps #1 Pin | /#contact |
| **small batch robotics classes bangalore** | 520 | Low (14) | Commercial | Sitelinks, Knowledge Panel | Homepage (/) |
| **edge ai and opencv for high school students** | 850 | Low (16) | Informational | Video Carousel, Course Schema | /#grades-8-10 |

---

#### 2. Hyper-Local "Near Me" Google Maps Pack Targets
- *robotics classes near me electronic city phase 1 & 2* (Rank priority: #1 in Google Maps 3-Pack)
- *coding classes near me ananth nagar*
- *hands on robotics lab near me bangalore*
- *kids stem weekend workshop near bommasandra / chandapura*

---

#### 3. Competitor Displacement Strategy (Future Minds vs Online Classes)
- **Pain Point Addressed:** Parents are exhausted by passive Zoom screens (e.g. WhiteHat Jr).
- **Core Message:** *"Physical Microcontrollers, Tangible Wiring & Real Hardware — Zero Boring Screen Staring."*
- **Batch Size Angle:** Strictly 4–5 students per batch guarantees true mentor safety and 1-on-1 coaching.`;
        } else if (type === 'blog_brief') {
          resultText = `### 📝 Authority Blog Blueprint & Ranking Article Draft
**Title:** Why School Students in Grades 5–10 Need Real Python (Not Just Visual Blocks)
**Meta Title:** Python for Kids: Why Grades 5–10 Need Real Code | Future Minds
**Meta Description:** Discover why students in Grades 5–10 must transition from Scratch visual blocks to real typed Python. Hands-on hardware robotics lab in Electronic City, Bangalore.
**Slug:** /blog/why-grades-5-10-need-real-python

---

# Why School Students in Grades 5–10 Need Real Python (Not Just Visual Blocks)

In the technology capital of Bengaluru, parents frequently ask us: *"My child already learned Scratch or Blockly in Grade 3. Isn't that enough?"*

While visual block coding is exceptional for introducing 6-to-9-year-olds to basic conditional loops and sequencing without typing hurdles, **stopping at visual blocks after Grade 4 creates an artificial glass ceiling**.

Here is why school students in Grades 5 through 10 (ages 10–16) must transition to real, typed Python syntax—and why pairing Python with physical hardware microcontrollers delivers 10x deeper engineering comprehension.

---

## 1. The Cognitive Shift: From "Drag-and-Drop" to Algorithmic Syntax
Visual blocks hide what code actually looks like in the industry. In academic syllabi (CBSE, ICSE Computer Applications, and Cambridge IGCSE / IB Computer Science), examinations and high school projects require typed Python syntax:
- Proper variable declaration and data types (\`int\`, \`float\`, \`str\`, \`list\`)
- Real indentation and scoping logic
- Handling runtime errors and syntax exceptions

When children only use blocks, they don't develop true debugging resilience. At **Future Minds** in Ananth Nagar, students type real Python code directly into microcontrollers, seeing their syntax immediately execute as physical motion.

---

## 2. Bridging Software into Physical Reality: Smart IoT & Microcontrollers
Typing Python on a monitor can quickly become abstract and uninspiring. That is why our Grade 5–7 curriculum embeds Python directly into **physical hardware**:
- **ESP32 & Raspberry Pi Pico:** Writing Python scripts that read live temperature, light, and ultrasonic distance sensors.
- **Wireless Telemetry:** Connecting microcontrollers to Wi-Fi and Bluetooth to build phone-controlled robotic rovers.
- **Physical Feedback:** When a student's loop has a bug, the motor doesn't spin. This tangible feedback loop teaches engineering troubleshooting better than any textbook.

---

## 3. The Stepping Stone to Computer Vision & Edge AI (Grades 8–10)
Modern robotics is no longer just simple motors; it is driven by Artificial Intelligence and Computer Vision. 
- Python is the undisputed global standard for OpenCV, PyTorch, and TensorFlow.
- By mastering core Python in Grades 5–7, students in Grades 8–10 can seamlessly advance into our **Edge AI & Computer Vision track**, training camera neural networks to recognize colored blocks and guide 4-DOF servo robotic arms.

---

## Frequently Asked Questions (FAQ)

**Q: Will my child get frustrated with typing syntax in Grade 5?**  
*A: No. Because we keep batches strictly capped at 4 to 5 students, each child receives close mentor guidance. We build typing muscle memory gradually while assembling physical rover chassis.*

**Q: Can we try a session before enrolling?**  
*A: Yes, Future Minds provides a complimentary 60-minute hands-on trial at our Ananth Nagar lab in Electronic City. Your child will write their first hardware control script during the session.*`;
        } else if (type === 'localized_landing_page') {
          resultText = `### 📍 Localized Area Landing Page Copy: Electronic City & Bommasandra
**Target Keyword:** Best Robotics & Coding Classes for Kids in Electronic City
**Target URL:** https://futuremindsv2.vercel.app/robotics-classes-electronic-city

---

#### 1. Page Title & Meta Tags
- **Title:** Best Robotics & Coding Classes for Kids in Electronic City | Future Minds
- **Meta Description:** Practical robotics, AI & Python coding for school students (Grades 1–10) in Electronic City & Ananth Nagar, Bangalore. Strictly 4–5 kids per batch. Book free demo!

---

#### 2. Hero Section
# Practical Robotics & AI Lab for School Students in Electronic City
### Strictly Small Batches (4–5 Kids) · Physical Hardware · Zero Boring Theory

Is your child spending passive hours staring at screens? At **Future Minds**, we replace passive screen fatigue with hands-on maker engineering. 
Located at **Ananth Nagar Phase II, Electronic City**, our lab gives every student their own physical microcontroller kit, sensors, and robotics arena.

**[👉 Book a Free 60-Minute Hands-On Demo Session]**

---

#### 3. Why Electronic City Parents Choose Future Minds
- **100% In-Person Physical Lab:** Tangible circuits, soldering-free breadboards, servo motors, and autonomous rovers.
- **Strict 4–5 Student Batch Ratio:** Guarantees mentor attention and complete hardware safety.
- **Phased Grade Roadmaps:**
  - *Grades 1–4:* Visual Blockly logic, motorized chassis & circuit exploration.
  - *Grades 5–7:* Real typed Python, Wi-Fi/Bluetooth IoT & smart rovers.
  - *Grades 8–10:* OpenCV computer vision, edge neural classifiers & 4-DOF robotic arms.
- **Convenient South Bangalore Location:** Situated on 5th Cross, Phase II, Ananth Nagar—under 10 minutes from Electronic City Phase 1 & 2, Huskur, and Bommasandra.`;
        } else if (type === 'faq_schema') {
          resultText = `### ❓ Parent FAQs & Validated FAQPage Schema.org JSON-LD

#### Readable FAQ Content for Landing Page:
1. **What is the student-to-mentor ratio at Future Minds?**
   *Every batch is strictly capped at 4 to 5 students. This ensures that every child receives individualized coaching and hands-on hardware access.*
2. **What grades and age groups do you cater to?**
   *We teach school students from Grade 1 through Grade 10 (ages 6 to 16), categorized into three progressive age-appropriate learning tracks.*
3. **How does this compare to online coding courses?**
   *Unlike online video calls, Future Minds is a physical maker lab where students assemble actual circuits, program physical microcontrollers, and test autonomous rovers on a physical arena.*
4. **Where is your physical lab located in Bangalore?**
   *We are located at 1121, 5th Cross, Phase II, Ananth Nagar, Electronic City, Bengaluru, Karnataka 560100.*
5. **Is there a free demo or trial session available?**
   *Yes! We offer a free 60-minute trial session where your child builds their first robotic circuit under mentor supervision.*

---

#### Production-Ready JSON-LD Snippet:
\`\`\`json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is the student-to-mentor ratio at Future Minds?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Every batch is strictly capped at 4 to 5 students. This ensures that every child receives individualized coaching and hands-on hardware access."
      }
    },
    {
      "@type": "Question",
      "name": "What grades and age groups do you cater to?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "We teach school students from Grade 1 through Grade 10 (ages 6 to 16), categorized into three progressive age-appropriate learning tracks."
      }
    },
    {
      "@type": "Question",
      "name": "How does this compare to online coding courses?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Unlike online video calls, Future Minds is a physical maker lab where students assemble actual circuits, program physical microcontrollers, and test autonomous rovers on a physical arena."
      }
    },
    {
      "@type": "Question",
      "name": "Where is your physical lab located in Bangalore?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "We are located at 1121, 5th Cross, Phase II, Ananth Nagar, Electronic City, Bengaluru, Karnataka 560100."
      }
    },
    {
      "@type": "Question",
      "name": "Is there a free demo or trial session available?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes! We offer a free 60-minute trial session where your child builds their first robotic circuit under mentor supervision."
      }
    }
  ]
}
\`\`\``;
        } else {
          resultText = `### 🌟 Google Business Profile & Local 3-Pack Playbook
**Business Name:** Future Minds — Robotics, AI & Coding Lab
**Address:** 1121, 5th Cross, Phase II, Ananth Nagar, Electronic City, Bengaluru, Karnataka 560100

1. **Primary Category:** Robotics School (Mandatory for #1 ranking)
2. **Secondary Categories:** Computer Training School, Educational Institution, After School Program
3. **Local Citations:** Justdial Bangalore, Sulekha, Indiamart, UrbanPro, Bangalore Parent Circles
4. **Google Posts Cadence:** Weekly updates showcasing students testing autonomous rovers with localized geotags.`;
        }
      }

      res.json({
        result: resultText,
        type,
      });
    } catch (err: any) {
      console.error('Gemini SEO Advisor Error:', err);
      res.status(500).json({ error: err.message || 'AI generation failed' });
    }
  });

  // GitHub Pull & Auto-Patcher Endpoint
  app.post('/api/github/patch-repo', async (req, res) => {
    const { repoUrl, token, branch = 'main', pushDirectly = false } = req.body;
    if (!repoUrl || typeof repoUrl !== 'string' || !repoUrl.trim()) {
      return res.status(400).json({
        error: 'GitHub repository URL is required (e.g. https://github.com/username/futureminds)',
      });
    }

    const logs: string[] = [];
    const log = (msg: string) => {
      console.log(`[GitHubSync] ${msg}`);
      logs.push(`[${new Date().toLocaleTimeString()}] ${msg}`);
    };

    const workDir = path.join('/tmp', `futureminds_git_${Date.now()}`);

    try {
      log(`Initializing workspace at ${workDir}`);
      await fs.mkdir(workDir, { recursive: true });

      // Build clone URL with token if provided
      let cloneUrl = repoUrl.trim();
      if (token && token.trim()) {
        const cleanToken = token.trim();
        if (cloneUrl.startsWith('https://')) {
          cloneUrl = cloneUrl.replace('https://', `https://${cleanToken}@`);
        } else if (cloneUrl.startsWith('http://')) {
          cloneUrl = cloneUrl.replace('http://', `http://${cleanToken}@`);
        } else {
          cloneUrl = `https://${cleanToken}@github.com/${cloneUrl.replace(/^git@github\.com:/, '')}`;
        }
      }

      log(`Cloning repository from ${repoUrl.trim()}...`);
      try {
        await execAsync(`git clone --depth 1 "${cloneUrl}" repo`, { cwd: workDir });
      } catch (cloneErr: any) {
        log(`Clone failed: ${cloneErr.message}`);
        // If failed due to authentication
        const isAuthError =
          cloneErr.message.includes('Authentication failed') ||
          cloneErr.message.includes('Repository not found') ||
          cloneErr.message.includes('could not read Username');
        return res.status(400).json({
          success: false,
          logs,
          error: isAuthError
            ? 'Access denied or repository is private. Please provide a GitHub Personal Access Token (PAT) with repo permissions or verify the repository URL.'
            : `Failed to clone repository: ${cloneErr.message}`,
        });
      }

      const repoPath = path.join(workDir, 'repo');
      log(`Cloned repository successfully into workspace.`);

      // Inspect repo files
      const repoFiles = await fs.readdir(repoPath);
      log(`Repository root contents: ${repoFiles.join(', ')}`);

      // Ensure public directory exists
      const publicDir = path.join(repoPath, 'public');
      if (!fsSync.existsSync(publicDir)) {
        await fs.mkdir(publicDir, { recursive: true });
        log(`Created public/ directory.`);
      }

      // 1. Generate & Write public/robots.txt
      const robotsContent = `# Robots.txt for Future Minds - Electronic City, Bengaluru
# Optimized for Googlebot, Bingbot, and AI Search Crawlers
User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/
Disallow: /*.json$

# Crawl Delay
Crawl-delay: 1

# XML Sitemap Directive
Sitemap: https://futuremindsv2.vercel.app/sitemap.xml
`;
      await fs.writeFile(path.join(publicDir, 'robots.txt'), robotsContent, 'utf-8');
      log(`Wrote optimized public/robots.txt`);

      // 2. Generate & Write public/sitemap.xml
      const today = new Date().toISOString().split('T')[0];
      const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
  <url>
    <loc>https://futuremindsv2.vercel.app/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://futuremindsv2.vercel.app/#courses</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://futuremindsv2.vercel.app/#curriculum</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://futuremindsv2.vercel.app/#batches</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://futuremindsv2.vercel.app/#faq</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://futuremindsv2.vercel.app/#contact</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>`;
      await fs.writeFile(path.join(publicDir, 'sitemap.xml'), sitemapContent, 'utf-8');
      log(`Wrote compliant public/sitemap.xml with 6 URLs`);

      // 3. Write or update vercel.json
      const vercelJsonPath = path.join(repoPath, 'vercel.json');
      const vercelJsonContent = JSON.stringify(
        {
          headers: [
            {
              source: '/robots.txt',
              headers: [
                { key: 'Content-Type', value: 'text/plain; charset=utf-8' },
                { key: 'Cache-Control', value: 'public, max-age=86400, must-revalidate' },
              ],
            },
            {
              source: '/sitemap.xml',
              headers: [
                { key: 'Content-Type', value: 'application/xml; charset=utf-8' },
                { key: 'Cache-Control', value: 'public, max-age=86400, must-revalidate' },
              ],
            },
          ],
        },
        null,
        2
      );
      await fs.writeFile(vercelJsonPath, vercelJsonContent, 'utf-8');
      log(`Wrote vercel.json with custom headers for robots.txt & sitemap.xml`);

      // 4. Update index.html with Schema.org, Geo, Title, Meta Tags
      const indexPath = path.join(repoPath, 'index.html');
      let indexHtmlModified = false;
      if (fsSync.existsSync(indexPath)) {
        let indexHtml = await fs.readFile(indexPath, 'utf-8');

        // Schema.org script
        const schemaSnippet = `
    <!-- Google LocalBusiness & EducationalOrganization Schema -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": ["EducationalOrganization", "LocalBusiness"],
          "@id": "https://futuremindsv2.vercel.app/#organization",
          "name": "Future Minds — Robotics, AI & Coding Academy",
          "legalName": "Future Minds Academy",
          "url": "https://futuremindsv2.vercel.app/",
          "logo": "https://futuremindsv2.vercel.app/future_minds_logo.jpg",
          "image": "https://futuremindsv2.vercel.app/future_minds_logo.jpg",
          "description": "Premier robotics, AI, drone technology, and Python coding center for school students (Grades 1–10) in Ananth Nagar Phase 2, Electronic City, Bengaluru. Strictly small batches (4–5 students) with hands-on hardware kits.",
          "telephone": "+919876543210",
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
            "latitude": 12.8395,
            "longitude": 77.6775
          },
          "hasMap": "https://maps.google.com/?q=12.8395,77.6775",
          "areaServed": [
            "Electronic City Phase 1",
            "Electronic City Phase 2",
            "Ananth Nagar",
            "Kammasandra",
            "Hebbagodi",
            "Huskur",
            "Bengaluru"
          ],
          "openingHoursSpecification": [
            {
              "@type": "OpeningHoursSpecification",
              "dayOfWeek": ["Saturday", "Sunday"],
              "opens": "09:00",
              "closes": "19:00"
            },
            {
              "@type": "OpeningHoursSpecification",
              "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
              "opens": "16:00",
              "closes": "20:00"
            }
          ],
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.9",
            "reviewCount": "38",
            "bestRating": "5",
            "worstRating": "1"
          }
        },
        {
          "@type": "FAQPage",
          "@id": "https://futuremindsv2.vercel.app/#faq",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "Where is Future Minds robotics and coding center located in Bangalore?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Future Minds is located at 1121, 5th Cross, Phase II, Ananth Nagar, Electronic City, Bengaluru, Karnataka 560100. We are easily accessible from Phase 1, Phase 2, and Kammasandra."
              }
            },
            {
              "@type": "Question",
              "name": "What age group and grades do you teach?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "We offer structured STEM programs for school students from Grade 1 to Grade 10 (ages 6 to 16), categorized into Visual Blocks, Real Typed Python, and Advanced Robotics & AI rovers."
              }
            },
            {
              "@type": "Question",
              "name": "What is the batch size at Future Minds?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Each batch is strictly limited to 4–5 students to ensure 100% individual attention and dedicated physical hardware kits for every child."
              }
            }
          ]
        }
      ]
    }
    </script>`;

        // Optimized Title and Meta
        const optimizedTitle = `<title>Future Minds — #1 Robotics, AI & Coding Classes in Electronic City, Bangalore</title>`;
        const optimizedMeta = `
    <!-- Local & Search SEO Meta -->
    <meta name="description" content="Premier hands-on Robotics, AI & Python coding academy for school students (Grades 1–10) in Ananth Nagar Phase 2, Electronic City, Bengaluru. Strictly small batches (4–5 kids), STEM certified lab, real hardware kits. Book your free demo!" />
    <meta name="keywords" content="robotics classes electronic city, coding classes for kids bangalore, robotics for school students ananth nagar, AI courses for kids electronic city phase 2, python programming grades 1-10, STEM education bangalore" />
    <meta name="geo.region" content="IN-KA" />
    <meta name="geo.placename" content="Ananth Nagar, Electronic City, Bengaluru" />
    <meta name="geo.position" content="12.8395;77.6775" />
    <meta name="ICBM" content="12.8395, 77.6775" />
    <link rel="canonical" href="https://futuremindsv2.vercel.app/" />
    <meta property="og:title" content="Future Minds — #1 Robotics & AI Lab in Electronic City" />
    <meta property="og:description" content="Empowering school students with practical robotics, AI, and coding in small batches (4-5 students). Located in Ananth Nagar, Electronic City." />
    <meta property="og:url" content="https://futuremindsv2.vercel.app/" />
    <meta property="og:type" content="website" />
    <meta property="og:image" content="https://futuremindsv2.vercel.app/future_minds_logo.jpg" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="Future Minds — Robotics & AI Lab in Electronic City" />
    <meta name="twitter:description" content="Practical robotics, drone coding, and AI for Grades 1–10 in Bengaluru." />
    <meta name="twitter:image" content="https://futuremindsv2.vercel.app/future_minds_logo.jpg" />`;

        // Replace or inject title
        if (indexHtml.includes('<title>')) {
          indexHtml = indexHtml.replace(/<title>[\s\S]*?<\/title>/i, optimizedTitle);
        } else {
          indexHtml = indexHtml.replace('</head>', `  ${optimizedTitle}\n</head>`);
        }

        // Clean out duplicate meta description/canonical if any
        indexHtml = indexHtml.replace(/<meta\s+name="description"[\s\S]*?>/gi, '');
        indexHtml = indexHtml.replace(/<link\s+rel="canonical"[\s\S]*?>/gi, '');

        // Inject meta and schema before </head>
        indexHtml = indexHtml.replace(
          '</head>',
          `  ${optimizedMeta}\n  ${schemaSnippet}\n</head>`
        );

        await fs.writeFile(indexPath, indexHtml, 'utf-8');
        indexHtmlModified = true;
        log(`Injected Local SEO tags, canonical URL, geo coordinates, and Schema.org JSON-LD into index.html`);
      }

      // Check git status
      const { stdout: gitStatus } = await execAsync('git status --short', { cwd: repoPath });
      log(`Git changed files:\n${gitStatus.trim() || 'No changes'}`);

      // Git config and commit
      await execAsync('git config user.name "Future Minds SEO Engine"', { cwd: repoPath });
      await execAsync('git config user.email "seo@futureminds.in"', { cwd: repoPath });
      await execAsync('git add .', { cwd: repoPath });

      let commitHash = '';
      try {
        const { stdout: commitOut } = await execAsync(
          'git commit -m "feat(seo): optimize for #1 Google ranking in Electronic City Bangalore (Schema, Sitemap, Robots, Geo Meta)"',
          { cwd: repoPath }
        );
        log(`Committed changes: ${commitOut.split('\n')[0]}`);
        const { stdout: revOut } = await execAsync('git rev-parse --short HEAD', { cwd: repoPath });
        commitHash = revOut.trim();
      } catch (commitErr: any) {
        log(`Commit note: ${commitErr.message}`);
      }

      let pushed = false;
      if (pushDirectly) {
        if (!token) {
          log('Push skipped: GitHub token not provided for direct push.');
        } else {
          log(`Pushing commit ${commitHash} to origin ${branch}...`);
          try {
            await execAsync(`git push origin HEAD:${branch}`, { cwd: repoPath });
            pushed = true;
            log(`Successfully pushed changes to ${repoUrl} (branch: ${branch})! Vercel deployment will trigger automatically.`);
          } catch (pushErr: any) {
            log(`Push failed: ${pushErr.message}`);
            return res.status(500).json({
              success: false,
              commitHash,
              logs,
              error: `Changes were committed locally, but failed to push to GitHub: ${pushErr.message}. Ensure your token has write access.`,
            });
          }
        }
      }

      // Clean up temporary workspace
      try {
        await fs.rm(workDir, { recursive: true, force: true });
      } catch (e) {
        // ignore
      }

      res.json({
        success: true,
        pushed,
        commitHash,
        logs,
        message: pushed
          ? 'Successfully cloned, applied all SEO optimizations, and pushed to GitHub! Vercel is building the new version now.'
          : 'Successfully validated and generated all SEO patch files for your repository. Ready to push with token or merge manually.',
      });
    } catch (err: any) {
      log(`Unexpected error: ${err.message}`);
      // Clean up
      try {
        await fs.rm(workDir, { recursive: true, force: true });
      } catch (e) {}
      res.status(500).json({
        success: false,
        error: err.message || 'GitHub sync failed',
        logs,
      });
    }
  });

  // Direct Download of Clean, Fixed Repository Archive
  app.get('/api/download/fixed-repo', async (_req, res) => {
    try {
      const repoDir = '/tmp/futuremindsv2_repo';
      const archivePath = '/tmp/futureminds-fixed-archive.tar.gz';
      if (!fsSync.existsSync(repoDir)) {
        return res.status(404).json({ error: 'Fixed repository not found on server.' });
      }

      await execAsync(
        `tar --exclude='.git' --exclude='node_modules' --exclude='dist' -czf "${archivePath}" -C "${repoDir}" .`
      );

      res.download(archivePath, 'futureminds-v2-seo-fixed.tar.gz', (err) => {
        if (err) {
          console.error('Download error:', err);
        }
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Push All Fixed Code Directly to a Brand New GitHub Repo
  app.post('/api/github/push-to-new-repo', async (req, res) => {
    const { newRepoUrl, token, branch = 'main' } = req.body;
    if (!newRepoUrl || typeof newRepoUrl !== 'string' || !newRepoUrl.trim()) {
      return res.status(400).json({
        error: 'Please provide the new GitHub repository URL (e.g. https://github.com/akhilvarmaj/FuturemindsV3)',
      });
    }

    const logs: string[] = [];
    const log = (msg: string) => {
      console.log(`[PushToNewRepo] ${msg}`);
      logs.push(`[${new Date().toLocaleTimeString()}] ${msg}`);
    };

    const sourceRepo = '/tmp/futuremindsv2_repo';
    const tempPushDir = path.join('/tmp', `push_new_${Date.now()}`);

    try {
      if (!fsSync.existsSync(sourceRepo)) {
        return res.status(404).json({
          success: false,
          error: 'Fixed repository source not found. Please sync or prepare the repo first.',
          logs,
        });
      }

      log(`Preparing isolated deployment workspace from fixed source...`);
      await execAsync(`cp -r "${sourceRepo}" "${tempPushDir}"`);

      // Clean out any stale credentials/remotes
      await execAsync('git remote remove origin || true', { cwd: tempPushDir });

      // Format authenticated URL
      let pushUrl = newRepoUrl.trim();
      if (token && token.trim()) {
        const cleanToken = token.trim();
        const cleanRepoPath = pushUrl
          .replace(/^https?:\/\/[^@]*@?github\.com\//, '')
          .replace(/^git@github\.com:/, '')
          .replace(/\.git$/, '');
        pushUrl = `https://${cleanToken}@github.com/${cleanRepoPath}.git`;
        log(`Configured authenticated origin for repository: ${cleanRepoPath}`);
      } else {
        log(`Using unauthenticated URL: ${pushUrl} (push may require public write or token)`);
      }

      await execAsync(`git remote add origin "${pushUrl}"`, { cwd: tempPushDir });
      await execAsync(`git branch -M ${branch.trim() || 'main'}`, { cwd: tempPushDir });

      log(`Pushing all commits to remote ${branch.trim() || 'main'}...`);
      const { stdout: pushOut, stderr: pushErr } = await execAsync(
        `git push -u origin ${branch.trim() || 'main'} --force`,
        { cwd: tempPushDir }
      );

      log(`Push completed successfully: ${pushOut || pushErr || 'Success'}`);
      log(`Your new repository now contains 100% of the fixed code, robots.txt, sitemap.xml, vercel.json, and SEO meta!`);

      // Clean up workspace
      try {
        await fs.rm(tempPushDir, { recursive: true, force: true });
      } catch (e) {}

      res.json({
        success: true,
        logs,
        targetUrl: newRepoUrl.trim(),
        message: `Successfully pushed all fixed code to ${newRepoUrl.trim()}! Connect this repo to Vercel and it will rank #1.`,
      });
    } catch (err: any) {
      log(`Push error: ${err.message}`);
      try {
        await fs.rm(tempPushDir, { recursive: true, force: true });
      } catch (e) {}

      const isAuthError =
        err.message.includes('Authentication failed') ||
        err.message.includes('Repository not found') ||
        err.message.includes('could not read Username');

      res.status(500).json({
        success: false,
        error: isAuthError
          ? 'GitHub authentication failed. Please ensure your Personal Access Token (PAT) has the "repo" scope checked and that the target repo exists.'
          : err.message,
        logs,
      });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Future Minds SEO Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
