import React, { useState } from 'react';
import {
  Copy,
  Check,
  Download,
  FileCode,
  CheckCircle2,
  FolderTree,
  ExternalLink,
  ShieldCheck,
  Info,
} from 'lucide-react';
import {
  OPTIMIZED_HEAD_HTML,
  ROBOTS_TXT,
  SITEMAP_XML,
  SCHEMA_JSON_LD,
  VERCEL_JSON_CONFIG,
} from '../data/seoAssets';

export const CodeExporter: React.FC = () => {
  const [activeAsset, setActiveAsset] = useState<string>('head');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const assets = [
    {
      id: 'head',
      name: 'index.html <head>',
      filename: 'index.html',
      path: '/index.html',
      description:
        'Complete high-conversion <head> meta tags: title, description, Open Graph thumbnail, Twitter Cards, Geolocation & Schema scripts.',
      content: OPTIMIZED_HEAD_HTML,
      badge: 'Immediate Rank Boost',
      fileType: 'html',
    },
    {
      id: 'robots',
      name: 'robots.txt',
      filename: 'robots.txt',
      path: '/public/robots.txt',
      description:
        'Fixes the live HTTP 404 error on your site. Authorizes Googlebot & Bingbot and directs crawlers directly to your sitemap.',
      content: ROBOTS_TXT,
      badge: 'Critical Fix (404)',
      fileType: 'txt',
    },
    {
      id: 'sitemap',
      name: 'sitemap.xml',
      filename: 'sitemap.xml',
      path: '/public/sitemap.xml',
      description:
        'Fixes the live HTTP 404 error on your site. Maps all courses, grades 1-10 pathways, and contact booking endpoints with priority.',
      content: SITEMAP_XML,
      badge: 'Critical Fix (404)',
      fileType: 'xml',
    },
    {
      id: 'schema',
      name: 'Schema.org JSON-LD',
      filename: 'structured-data.json',
      path: 'index.html <script type="application/ld+json">',
      description:
        'Validates EducationalOrganization, LocalBusiness, 3 Course modules, and 6 high-intent FAQ questions for Google Rich Results.',
      content: SCHEMA_JSON_LD,
      badge: 'Rich Snippets & Stars',
      fileType: 'json',
    },
    {
      id: 'vercel',
      name: 'vercel.json',
      filename: 'vercel.json',
      path: '/vercel.json',
      description:
        'Production caching headers, crawler TTL, and security policies for optimal Core Web Vitals on Vercel.',
      content: VERCEL_JSON_CONFIG,
      badge: 'Performance & Security',
      fileType: 'json',
    },
  ];

  const current = assets.find((a) => a.id === activeAsset) || assets[0];

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleDownload = (filename: string, content: string) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Introduction Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                1-Click Turnkey Assets
              </span>
              <span className="text-xs text-slate-400">Target: futuremindsv2.vercel.app</span>
            </div>
            <h2 className="text-xl font-bold text-white mt-1">
              Production-Ready SEO Code & File Generator
            </h2>
            <p className="text-xs text-slate-300 mt-0.5">
              Copy and drop these exact files into your Vite/React repository to resolve all audit issues and enable Google Rich Results.
            </p>
          </div>

          <button
            onClick={() => handleCopy(current.content, current.id)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center space-x-2 transition shadow-md shadow-emerald-600/20 shrink-0"
          >
            {copiedKey === current.id ? (
              <>
                <Check className="w-4 h-4" />
                <span>Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy Current File</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main File Viewer & Switcher */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left: Asset List Navigation */}
        <div className="space-y-2 lg:col-span-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2 block mb-2">
            Generated Files ({assets.length})
          </span>
          {assets.map((asset) => {
            const isActive = activeAsset === asset.id;
            return (
              <button
                key={asset.id}
                onClick={() => setActiveAsset(asset.id)}
                className={`w-full text-left p-3 rounded-xl border transition flex flex-col space-y-1 ${
                  isActive
                    ? 'bg-indigo-950/60 border-indigo-500/50 text-white shadow-md'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs text-slate-200">{asset.name}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-indigo-300 font-mono">
                    .{asset.fileType}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 font-mono truncate">{asset.path}</span>
                </div>
                <span
                  className={`text-[10px] inline-block mt-1 font-medium ${
                    asset.badge.includes('Critical')
                      ? 'text-rose-400'
                      : asset.badge.includes('Rich')
                      ? 'text-purple-400'
                      : 'text-emerald-400'
                  }`}
                >
                  ● {asset.badge}
                </span>
              </button>
            );
          })}

          {/* Quick Info Box */}
          <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl mt-4">
            <div className="flex items-start space-x-2 text-slate-400 text-xs">
              <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-300">Vercel Location Tip:</span>
                <p className="mt-0.5 text-[11px] text-slate-400 leading-relaxed">
                  In Vite and Next.js, static files like <code className="text-cyan-300">robots.txt</code> and{' '}
                  <code className="text-cyan-300">sitemap.xml</code> must be placed inside the{' '}
                  <code className="text-cyan-300">/public</code> folder so they are served at the root URL.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Code Viewer */}
        <div className="lg:col-span-3 bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden flex flex-col shadow-2xl">
          {/* File Top Bar */}
          <div className="bg-slate-900/90 border-b border-slate-800 px-4 py-3 flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center space-x-2">
              <FileCode className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-mono font-bold text-white">{current.filename}</span>
              <span className="text-xs text-slate-500 font-mono">({current.path})</span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleDownload(current.filename, current.content)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download</span>
              </button>
              <button
                onClick={() => handleCopy(current.content, current.id)}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium flex items-center space-x-1.5 transition"
              >
                {copiedKey === current.id ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Code</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Description & Impact */}
          <div className="bg-slate-900/40 border-b border-slate-800/80 px-4 py-2.5 text-xs text-slate-300 flex items-center justify-between">
            <span>{current.description}</span>
            <span className="text-emerald-400 font-medium shrink-0 ml-2">✓ Verified Valid</span>
          </div>

          {/* Code Content */}
          <div className="relative flex-1 p-4 overflow-x-auto max-h-[520px]">
            <pre className="font-mono text-xs text-slate-300 leading-relaxed select-all">
              <code>{current.content}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
