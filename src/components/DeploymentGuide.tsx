import React, { useState } from 'react';
import {
  CheckCircle2,
  Circle,
  ExternalLink,
  Terminal,
  FolderTree,
  ShieldCheck,
  Zap,
  ArrowRight,
} from 'lucide-react';

export const DeploymentGuide: React.FC<{ onNavigateToCode: () => void }> = ({
  onNavigateToCode,
}) => {
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});

  const toggleStep = (stepNum: number) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [stepNum]: !prev[stepNum],
    }));
  };

  const steps = [
    {
      num: 1,
      title: 'Update index.html with Optimized <head> Tags',
      summary:
        'Replaces current generic title and missing meta tags with high-intent keywords, canonical URL, Open Graph preview image, and Schema.org JSON-LD scripts.',
      action: 'Copy from "Turnkey Code & Assets" → index.html tab and paste into your project index.html.',
      badge: 'Solves On-Page & Schema Issues',
    },
    {
      num: 2,
      title: 'Create /public/robots.txt to Fix HTTP 404',
      summary:
        'Fixes the live 404 error crawlers currently receive when visiting futuremindsv2.vercel.app/robots.txt.',
      action: 'Create a file named robots.txt inside your repository’s /public directory.',
      badge: 'Solves Critical 404',
    },
    {
      num: 3,
      title: 'Create /public/sitemap.xml to Fix HTTP 404',
      summary:
        'Provides Googlebot and Bingbot with an accurate XML index of your home, curriculum sections, grade tracks, and contact demo booking.',
      action: 'Create a file named sitemap.xml inside your repository’s /public directory.',
      badge: 'Solves Critical 404',
    },
    {
      num: 4,
      title: 'Add /public/og-banner.jpg (1200x630px)',
      summary:
        'Fixes social sharing on WhatsApp, LinkedIn, and Twitter so links show a high-resolution branded Future Minds banner instead of a blank card.',
      action: 'Save your lab photo or branded graphic as og-banner.jpg in the /public folder.',
      badge: 'Social CTR Boost',
    },
    {
      num: 5,
      title: 'Deploy to Vercel & Submit to Google Search Console',
      summary:
        'Push changes via Git to trigger instant Vercel redeployment. Then submit your sitemap to Google Search Console for immediate re-indexing.',
      action: 'Run `git add . && git commit -m "feat(seo): add production meta tags, sitemap, robots, schema" && git push`',
      badge: 'Indexing Fast-Track',
    },
  ];

  const completedCount = Object.values(completedSteps).filter(Boolean).length;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                10-Minute Implementation
              </span>
              <span className="text-xs text-slate-400">Vercel & Vite Project Guide</span>
            </div>
            <h2 className="text-xl font-bold text-white mt-1">
              Step-by-Step Vercel Deployment Checklist
            </h2>
            <p className="text-xs text-slate-300 mt-0.5">
              Follow these simple steps to apply your SEO optimizations to futuremindsv2.vercel.app and increase organic rankings.
            </p>
          </div>

          <div className="flex items-center space-x-2 bg-slate-950 px-3 py-2 rounded-xl border border-slate-800 shrink-0">
            <span className="text-xs text-slate-400">Checklist Progress:</span>
            <span className="text-xs font-bold text-emerald-400">
              {completedCount} of {steps.length} completed
            </span>
          </div>
        </div>
      </div>

      {/* Directory Layout Diagram */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex items-center space-x-2 text-indigo-400 font-semibold text-xs mb-3">
          <FolderTree className="w-4 h-4" />
          <span>Expected Project File Structure in Your Repository:</span>
        </div>
        <pre className="font-mono text-xs text-slate-300 bg-slate-900/80 p-4 rounded-xl border border-slate-800 leading-relaxed overflow-x-auto">
{`futuremindsv2/
├── index.html               ← Update <head> tags with title, canonical, OG & Schema scripts
├── package.json
├── vercel.json              ← Optional: caching & security headers
└── public/
    ├── future_minds_logo.jpg
    ├── og-banner.jpg        ← Place 1200x630px social preview image here
    ├── robots.txt           ← Place generated robots.txt here (fixes 404)
    └── sitemap.xml          ← Place generated sitemap.xml here (fixes 404)`}
        </pre>
      </div>

      {/* Step by step cards */}
      <div className="space-y-3">
        {steps.map((step) => {
          const isDone = !!completedSteps[step.num];
          return (
            <div
              key={step.num}
              onClick={() => toggleStep(step.num)}
              className={`p-4 rounded-2xl border transition cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                isDone
                  ? 'bg-emerald-950/20 border-emerald-500/40 text-slate-200'
                  : 'bg-slate-900/90 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start space-x-3">
                <button className="mt-0.5 shrink-0 text-slate-400 hover:text-white">
                  {isDone ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-500" />
                  )}
                </button>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-indigo-400">Step {step.num}:</span>
                    <h4
                      className={`text-sm font-bold ${
                        isDone ? 'line-through text-slate-400' : 'text-white'
                      }`}
                    >
                      {step.title}
                    </h4>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-medium">
                      {step.badge}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">{step.summary}</p>
                  <div className="mt-2 text-xs font-mono bg-slate-950/70 p-2 rounded-lg text-indigo-300/90 border border-slate-800">
                    <span className="text-slate-400 font-sans font-semibold mr-1">Action:</span>
                    {step.action}
                  </div>
                </div>
              </div>

              {step.num === 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onNavigateToCode();
                  }}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shrink-0 flex items-center space-x-1 self-end md:self-center transition"
                >
                  <span>Get Code</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* External Validation Links */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
        <h4 className="text-sm font-bold text-white flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Post-Deployment Verification Links</span>
        </h4>
        <p className="text-xs text-slate-400">
          After pushing to Vercel, verify your new SEO configuration using Google&apos;s official testing tools:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <a
            href="https://search.google.com/test/rich-results?url=https%3A%2F%2Ffuturemindsv2.vercel.app%2F"
            target="_blank"
            rel="noreferrer"
            className="p-3 bg-slate-950 rounded-xl border border-slate-800 hover:border-indigo-500/50 transition flex flex-col justify-between"
          >
            <div>
              <span className="text-xs font-bold text-white flex items-center justify-between">
                <span>Google Rich Results Test</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
              </span>
              <p className="text-[11px] text-slate-400 mt-1">
                Verifies Course, LocalBusiness, and FAQ schema badges.
              </p>
            </div>
            <span className="text-[10px] text-emerald-400 mt-2 block font-mono">Verify Schemas →</span>
          </a>

          <a
            href="https://pagespeed.web.dev/analysis?url=https%3A%2F%2Ffuturemindsv2.vercel.app%2F"
            target="_blank"
            rel="noreferrer"
            className="p-3 bg-slate-950 rounded-xl border border-slate-800 hover:border-indigo-500/50 transition flex flex-col justify-between"
          >
            <div>
              <span className="text-xs font-bold text-white flex items-center justify-between">
                <span>PageSpeed Insights</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
              </span>
              <p className="text-[11px] text-slate-400 mt-1">
                Measures Core Web Vitals (LCP, CLS, INP) for Google ranking speed.
              </p>
            </div>
            <span className="text-[10px] text-cyan-400 mt-2 block font-mono">Test Speed →</span>
          </a>

          <a
            href="https://search.google.com/search-console"
            target="_blank"
            rel="noreferrer"
            className="p-3 bg-slate-950 rounded-xl border border-slate-800 hover:border-indigo-500/50 transition flex flex-col justify-between"
          >
            <div>
              <span className="text-xs font-bold text-white flex items-center justify-between">
                <span>Google Search Console</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
              </span>
              <p className="text-[11px] text-slate-400 mt-1">
                Submit https://futuremindsv2.vercel.app/sitemap.xml for fast indexing.
              </p>
            </div>
            <span className="text-[10px] text-indigo-400 mt-2 block font-mono">Submit Sitemap →</span>
          </a>
        </div>
      </div>
    </div>
  );
};
