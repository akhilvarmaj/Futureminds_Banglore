import React, { useEffect, useState } from 'react';
import {
  Search, RefreshCw, Activity, AlertTriangle, XCircle, CheckCircle2,
  Gauge, FileText, Image as ImageIcon, MapPin, Globe, Zap, Clock, TrendingUp,
} from 'lucide-react';

interface AuditIssue {
  id: string;
  category: 'technical' | 'onpage' | 'schema' | 'local';
  severity: 'critical' | 'warning' | 'good';
  title: string;
  description: string;
  recommendation: string;
}

interface AuditResponse {
  url: string;
  fetchStatus: number;
  responseTime: number;
  overallScore: number;
  categoryScores: { technical: number; onpage: number; schema: number; local: number };
  counts: { critical: number; warning: number; good: number };
  metadata: {
    title: string;
    titleLength: number;
    description: string;
    descriptionLength: number;
    canonical: string;
    viewport: boolean;
    h1: string[];
    h2: string[];
    imagesTotal: number;
    imagesWithoutAlt: number;
    schemasCount: number;
    robotsStatus: number;
    sitemapStatus: number;
  };
  issues: AuditIssue[];
}

type IssueFilter = 'all' | 'critical' | 'warning' | 'good';

const scoreColor = (score: number) =>
  score >= 75 ? '#10b981' : score >= 60 ? '#f59e0b' : '#f43f5e';

const scoreGrade = (score: number) =>
  score >= 90 ? 'Excellent' : score >= 75 ? 'Strong' : score >= 60 ? 'Needs Work' : 'Critical';

function ScoreRing({ score }: { score: number }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - score / 100);
  const color = scoreColor(score);
  return (
    <div className="relative w-32 h-32 shrink-0">
      <svg viewBox="0 0 128 128" className="w-full h-full -rotate-90">
        <circle cx="64" cy="64" r={radius} fill="none" stroke="#e6edf7" strokeWidth="10" />
        <circle
          cx="64" cy="64" r={radius} fill="none" stroke={color} strokeWidth="10"
          strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1s ease' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-black tracking-tight" style={{ color }}>{score}</span>
        <span className="text-[10px] font-bold text-[#61708a] uppercase tracking-wider">/ 100</span>
      </div>
    </div>
  );
}

function CategoryBar({ label, score, delay }: { label: string; score: number; delay: number }) {
  return (
    <div>
      <div className="flex items-center justify-between text-xs font-bold mb-1.5">
        <span className="text-[#40516c]">{label}</span>
        <span style={{ color: scoreColor(score) }}>{score}</span>
      </div>
      <div className="h-2.5 bg-[#e6edf7] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${score}%`, backgroundColor: scoreColor(score), transitionDelay: `${delay}ms` }}
        />
      </div>
    </div>
  );
}

function MetricCard({
  icon, label, value, tone = 'neutral', hint,
}: { icon: React.ReactNode; label: string; value: string; tone?: 'good' | 'bad' | 'neutral'; hint?: string }) {
  const toneClass =
    tone === 'good' ? 'text-emerald-600' : tone === 'bad' ? 'text-rose-600' : 'text-[#10233f]';
  return (
    <div className="bg-white border border-[#e6edf7] rounded-2xl p-4 flex flex-col gap-1.5">
      <div className="flex items-center gap-1.5 text-[#1769ff]">
        {icon}
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#61708a]">{label}</span>
      </div>
      <span className={`text-lg font-black tracking-tight leading-tight ${toneClass}`}>{value}</span>
      {hint && <span className="text-[11px] text-[#61708a] leading-snug">{hint}</span>}
    </div>
  );
}

const severityStyles: Record<AuditIssue['severity'], { badge: string; icon: React.ReactNode }> = {
  critical: { badge: 'bg-rose-50 text-rose-600 border-rose-200', icon: <XCircle className="w-4 h-4 text-rose-500" /> },
  warning: { badge: 'bg-amber-50 text-amber-600 border-amber-200', icon: <AlertTriangle className="w-4 h-4 text-amber-500" /> },
  good: { badge: 'bg-emerald-50 text-emerald-600 border-emerald-200', icon: <CheckCircle2 className="w-4 h-4 text-emerald-500" /> },
};

export function SeoDashboard() {
  const [url, setUrl] = useState('https://futuremindsv2.vercel.app/');
  const [data, setData] = useState<AuditResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastRun, setLastRun] = useState<Date | null>(null);
  const [filter, setFilter] = useState<IssueFilter>('all');

  const runAudit = async (targetUrl: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: targetUrl }),
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || `Audit failed (HTTP ${res.status})`);
      }
      setData(json);
      setLastRun(new Date());
    } catch (e: any) {
      setError(e.message || 'Audit failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runAudit('https://futuremindsv2.vercel.app/');
  }, []);

  const issues = data?.issues ?? [];
  const filteredIssues = filter === 'all' ? issues : issues.filter((i) => i.severity === filter);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-[#f0f5ff] border border-[#d6e5fb] flex items-center justify-center">
            <Gauge className="w-5 h-5 text-[#1769ff]" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#10233f]">
              SEO Performance Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-[#61708a] font-medium">
              Live audit of technical, on-page, schema & local SEO signals
            </p>
          </div>
        </div>

        {/* URL input + run button */}
        <form
          onSubmit={(e) => { e.preventDefault(); runAudit(url); }}
          className="flex flex-col sm:flex-row gap-2.5"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#61708a]" />
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter site URL to audit…"
              className="w-full pl-10 pr-4 py-3 text-sm font-semibold text-[#10233f] bg-white border border-[#d6e5fb] rounded-xl outline-none focus:border-[#1769ff] focus:ring-2 focus:ring-[#1769ff]/15 transition"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 bg-[#1769ff] hover:bg-[#1458d7] disabled:opacity-60 text-white px-5 py-3 rounded-xl text-sm font-bold transition active:scale-95 shadow-sm whitespace-nowrap"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Auditing…' : 'Run Audit'}
          </button>
        </form>

        {lastRun && (
          <p className="text-[11px] text-[#61708a] font-medium flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            Last run: {lastRun.toLocaleTimeString()}
          </p>
        )}
      </div>

      {/* Loading state */}
      {loading && !data && (
        <div className="bg-white border border-[#e6edf7] rounded-3xl p-10 flex flex-col items-center gap-3">
          <RefreshCw className="w-7 h-7 text-[#1769ff] animate-spin" />
          <p className="text-sm font-bold text-[#10233f]">Crawling page & analyzing SEO signals…</p>
          <p className="text-xs text-[#61708a]">This takes a few seconds</p>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-5 flex items-start gap-3">
          <XCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-rose-700">Audit failed</p>
            <p className="text-xs text-rose-600 mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {data && (
        <>
          {/* Overall summary card */}
          <div className="bg-white border border-[#e6edf7] rounded-3xl p-6 sm:p-8 shadow-sm">
            <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-10">
              <div className="flex flex-col items-center gap-1.5">
                <ScoreRing score={data.overallScore} />
                <span
                  className="text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full border"
                  style={{ color: scoreColor(data.overallScore), borderColor: scoreColor(data.overallScore) }}
                >
                  {scoreGrade(data.overallScore)}
                </span>
              </div>

              <div className="flex-1 w-full space-y-4">
                <div className="grid grid-cols-3 gap-2.5">
                  <div className="bg-rose-50 border border-rose-100 rounded-xl px-3 py-2.5 text-center">
                    <p className="text-xl font-black text-rose-600">{data.counts.critical}</p>
                    <p className="text-[10px] font-bold uppercase tracking-wide text-rose-500">Critical</p>
                  </div>
                  <div className="bg-amber-50 border border-amber-100 rounded-xl px-3 py-2.5 text-center">
                    <p className="text-xl font-black text-amber-600">{data.counts.warning}</p>
                    <p className="text-[10px] font-bold uppercase tracking-wide text-amber-500">Warnings</p>
                  </div>
                  <div className="bg-emerald-50 border border-emerald-100 rounded-xl px-3 py-2.5 text-center">
                    <p className="text-xl font-black text-emerald-600">{data.counts.good}</p>
                    <p className="text-[10px] font-bold uppercase tracking-wide text-emerald-500">Passed</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                  <CategoryBar label="Technical SEO" score={data.categoryScores.technical} delay={0} />
                  <CategoryBar label="On-Page SEO" score={data.categoryScores.onpage} delay={150} />
                  <CategoryBar label="Schema Markup" score={data.categoryScores.schema} delay={300} />
                  <CategoryBar label="Local SEO" score={data.categoryScores.local} delay={450} />
                </div>
              </div>
            </div>
          </div>

          {/* Key metrics grid */}
          <div>
            <h2 className="text-sm font-black uppercase tracking-wider text-[#10233f] mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#1769ff]" />
              Key Metrics
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              <MetricCard
                icon={<Zap className="w-3.5 h-3.5" />}
                label="Response Time"
                value={`${data.responseTime} ms`}
                tone={data.responseTime < 800 ? 'good' : data.responseTime > 2000 ? 'bad' : 'neutral'}
                hint={data.responseTime < 800 ? 'Fast — good for rankings' : 'Slow responses hurt rankings'}
              />
              <MetricCard
                icon={<Globe className="w-3.5 h-3.5" />}
                label="Fetch Status"
                value={`HTTP ${data.fetchStatus}`}
                tone={data.fetchStatus === 200 ? 'good' : 'bad'}
              />
              <MetricCard
                icon={<FileText className="w-3.5 h-3.5" />}
                label="Title Tag"
                value={`${data.metadata.titleLength} chars`}
                tone={data.metadata.titleLength >= 35 && data.metadata.titleLength <= 65 ? 'good' : 'bad'}
                hint={data.metadata.titleLength >= 35 && data.metadata.titleLength <= 65 ? 'Optimal length' : 'Optimal: 50–60 chars'}
              />
              <MetricCard
                icon={<FileText className="w-3.5 h-3.5" />}
                label="Meta Description"
                value={`${data.metadata.descriptionLength} chars`}
                tone={data.metadata.descriptionLength >= 90 && data.metadata.descriptionLength <= 165 ? 'good' : 'bad'}
                hint="Optimal: 140–160 chars"
              />
              <MetricCard
                icon={<ImageIcon className="w-3.5 h-3.5" />}
                label="Images Missing Alt"
                value={`${data.metadata.imagesWithoutAlt} / ${data.metadata.imagesTotal}`}
                tone={data.metadata.imagesWithoutAlt === 0 ? 'good' : 'bad'}
                hint={data.metadata.imagesWithoutAlt === 0 ? 'All images accessible' : 'Add descriptive alt text'}
              />
              <MetricCard
                icon={<MapPin className="w-3.5 h-3.5" />}
                label="Schema Markup"
                value={`${data.metadata.schemasCount} JSON-LD`}
                tone={data.metadata.schemasCount > 0 ? 'good' : 'bad'}
                hint={data.metadata.schemasCount > 0 ? 'Rich-result eligible' : 'Add JSON-LD schemas'}
              />
              <MetricCard
                icon={<Activity className="w-3.5 h-3.5" />}
                label="robots.txt"
                value={data.metadata.robotsStatus === 404 ? 'Missing' : `HTTP ${data.metadata.robotsStatus}`}
                tone={data.metadata.robotsStatus === 404 ? 'bad' : 'good'}
              />
              <MetricCard
                icon={<Activity className="w-3.5 h-3.5" />}
                label="sitemap.xml"
                value={data.metadata.sitemapStatus === 404 ? 'Missing' : `HTTP ${data.metadata.sitemapStatus}`}
                tone={data.metadata.sitemapStatus === 404 ? 'bad' : 'good'}
              />
            </div>
          </div>

          {/* Issues list */}
          <div>
            <div className="flex items-center justify-between flex-wrap gap-3 mb-3">
              <h2 className="text-sm font-black uppercase tracking-wider text-[#10233f] flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-[#1769ff]" />
                Findings & Recommendations
              </h2>
              <div className="flex gap-1.5 bg-[#f0f3f8] rounded-xl p-1">
                {([
                  ['all', `All (${issues.length})`],
                  ['critical', `Critical (${data.counts.critical})`],
                  ['warning', `Warnings (${data.counts.warning})`],
                  ['good', `Passed (${data.counts.good})`],
                ] as [IssueFilter, string][]).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => setFilter(key)}
                    className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition ${
                      filter === key ? 'bg-white text-[#1769ff] shadow-sm' : 'text-[#61708a] hover:text-[#10233f]'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2.5">
              {filteredIssues.length === 0 && (
                <p className="text-sm text-[#61708a] font-medium bg-white border border-[#e6edf7] rounded-2xl p-6 text-center">
                  No findings in this category.
                </p>
              )}
              {filteredIssues.map((issue) => {
                const style = severityStyles[issue.severity];
                return (
                  <div
                    key={issue.id}
                    className="bg-white border border-[#e6edf7] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row gap-3"
                  >
                    <div className="flex items-start gap-3 flex-1">
                      <div className="shrink-0 mt-0.5">{style.icon}</div>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-sm font-black text-[#10233f] tracking-tight">{issue.title}</h3>
                          <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full border ${style.badge}`}>
                            {issue.severity}
                          </span>
                          <span className="text-[10px] font-bold uppercase tracking-wide text-[#61708a] bg-[#f0f3f8] px-2 py-0.5 rounded-full">
                            {issue.category}
                          </span>
                        </div>
                        <p className="text-xs text-[#61708a] mt-1 leading-relaxed">{issue.description}</p>
                        {issue.severity !== 'good' && (
                          <p className="text-xs text-[#10233f] font-semibold mt-1.5 leading-relaxed">
                            <span className="text-[#1769ff] font-bold">Fix: </span>
                            {issue.recommendation}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
