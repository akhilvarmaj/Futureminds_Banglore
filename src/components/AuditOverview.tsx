import React, { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  Code2,
  Sparkles,
  Zap,
  Globe,
  FileCode,
  MapPin,
  Search,
} from 'lucide-react';
import { AuditResult, IssueSeverity, IssueCategory } from '../types';

interface AuditOverviewProps {
  audit: AuditResult | null;
  isLoading: boolean;
  onAuditUrl: (url: string) => void;
  onNavigateToCode: () => void;
}

export const AuditOverview: React.FC<AuditOverviewProps> = ({
  audit,
  isLoading,
  onAuditUrl,
  onNavigateToCode,
}) => {
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [urlInput, setUrlInput] = useState<string>(
    audit?.url || 'https://futuremindsv2.vercel.app/'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (urlInput.trim()) {
      onAuditUrl(urlInput.trim());
    }
  };

  if (!audit && isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-8">
        <div className="w-14 h-14 rounded-2xl border-4 border-indigo-500/30 border-t-indigo-500 animate-spin mb-4"></div>
        <h3 className="text-lg font-bold text-white mb-2">Analyzing futuremindsv2.vercel.app...</h3>
        <p className="text-slate-400 text-sm max-w-md">
          Inspecting HTML head tags, robots.txt status, sitemap.xml, Schema.org JSON-LD structured
          data, Open Graph previews, and local SEO signals.
        </p>
      </div>
    );
  }

  if (!audit) {
    return null;
  }

  const filteredIssues = audit.issues.filter((issue) => {
    const matchSeverity = selectedSeverity === 'all' || issue.severity === selectedSeverity;
    const matchCategory = selectedCategory === 'all' || issue.category === selectedCategory;
    return matchSeverity && matchCategory;
  });

  const getSeverityBadge = (severity: IssueSeverity) => {
    switch (severity) {
      case 'critical':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-rose-500/15 text-rose-400 border border-rose-500/20">
            <XCircle className="w-3 h-3 mr-1" />
            Critical Action
          </span>
        );
      case 'warning':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/20">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Recommendation
          </span>
        );
      case 'good':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Passed
          </span>
        );
    }
  };

  const getCategoryIcon = (category: IssueCategory) => {
    switch (category) {
      case 'technical':
        return <Zap className="w-3.5 h-3.5 text-blue-400" />;
      case 'onpage':
        return <FileCode className="w-3.5 h-3.5 text-cyan-400" />;
      case 'schema':
        return <Code2 className="w-3.5 h-3.5 text-purple-400" />;
      case 'local':
        return <MapPin className="w-3.5 h-3.5 text-emerald-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Scanner Bar */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 rounded-2xl border border-indigo-500/20 p-5 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Live Audit Report
              </span>
              <span className="text-xs text-slate-400 flex items-center space-x-1">
                <Clock className="w-3 h-3 text-slate-500" />
                <span>Response time: {audit.responseTime}ms</span>
              </span>
            </div>
            <h2 className="text-xl font-bold text-white mt-1">
              Future Minds Website SEO Health Diagnostic
            </h2>
            <p className="text-slate-300 text-xs mt-0.5">
              Live crawler diagnosis of on-page metadata, missing crawlers directives, schema, and local signals.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex items-center gap-2 max-w-md w-full">
            <div className="relative flex-1">
              <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://futuremindsv2.vercel.app/"
                className="w-full bg-slate-950/80 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition flex items-center space-x-1 disabled:opacity-50"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Scan</span>
            </button>
          </form>
        </div>
      </div>

      {/* Score Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Main Score Card */}
        <div className="lg:col-span-1 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 flex flex-col items-center justify-center text-center shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4 w-24 h-24 bg-indigo-500/10 rounded-full blur-xl pointer-events-none"></div>
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">
            Overall Health
          </span>
          <div className="relative flex items-center justify-center">
            <div
              className={`text-4xl font-extrabold ${
                audit.overallScore >= 80
                  ? 'text-emerald-400'
                  : audit.overallScore >= 50
                  ? 'text-amber-400'
                  : 'text-rose-400'
              }`}
            >
              {audit.overallScore}
            </div>
            <span className="text-slate-500 text-base font-semibold ml-1">/100</span>
          </div>

          <div className="mt-2 text-xs font-medium text-slate-400 flex items-center space-x-1">
            <span>Critical fixes needed</span>
          </div>

          <button
            onClick={onNavigateToCode}
            className="mt-4 w-full py-1.5 px-3 bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/30 text-indigo-300 rounded-lg text-xs font-semibold transition flex items-center justify-center space-x-1"
          >
            <Sparkles className="w-3 h-3" />
            <span>Apply 98/100 Fix</span>
          </button>
        </div>

        {/* Technical SEO Score */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Technical SEO</span>
            <span className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400">
              <Zap className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-bold text-white mt-2">
            {audit.categoryScores.technical}%
          </div>
          <div className="mt-2 text-[11px] text-slate-400 space-y-0.5">
            <div className="flex justify-between">
              <span>robots.txt:</span>
              <span className={audit.metadata.robotsStatus === 200 ? 'text-emerald-400' : 'text-rose-400 font-semibold'}>
                {audit.metadata.robotsStatus === 200 ? '200 OK' : '404 Missing'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>sitemap.xml:</span>
              <span className={audit.metadata.sitemapStatus === 200 ? 'text-emerald-400' : 'text-rose-400 font-semibold'}>
                {audit.metadata.sitemapStatus === 200 ? '200 OK' : '404 Missing'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Canonical URL:</span>
              <span className={audit.metadata.canonical ? 'text-emerald-400' : 'text-amber-400'}>
                {audit.metadata.canonical ? 'Present' : 'Missing'}
              </span>
            </div>
          </div>
        </div>

        {/* On-Page Content Score */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">On-Page Meta</span>
            <span className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400">
              <FileCode className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-bold text-white mt-2">
            {audit.categoryScores.onpage}%
          </div>
          <div className="mt-2 text-[11px] text-slate-400 space-y-0.5">
            <div className="flex justify-between">
              <span>Title Length:</span>
              <span className="text-slate-200">{audit.metadata.titleLength} chars</span>
            </div>
            <div className="flex justify-between">
              <span>Description:</span>
              <span className="text-slate-200">{audit.metadata.descriptionLength} chars</span>
            </div>
            <div className="flex justify-between">
              <span>og:image:</span>
              <span className={audit.metadata.og.image ? 'text-emerald-400' : 'text-amber-400'}>
                {audit.metadata.og.image ? 'Configured' : 'Missing'}
              </span>
            </div>
          </div>
        </div>

        {/* Schema.org Structured Data */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Structured Data</span>
            <span className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400">
              <Code2 className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-bold text-white mt-2">
            {audit.categoryScores.schema}%
          </div>
          <div className="mt-2 text-[11px] text-slate-400 space-y-0.5">
            <div className="flex justify-between">
              <span>Schemas Found:</span>
              <span className={audit.metadata.schemasCount > 0 ? 'text-emerald-400' : 'text-rose-400 font-semibold'}>
                {audit.metadata.schemasCount} JSON-LD
              </span>
            </div>
            <div className="flex justify-between">
              <span>Rich Results:</span>
              <span className="text-amber-400">Disabled</span>
            </div>
            <div className="flex justify-between">
              <span>FAQ Schema:</span>
              <span className="text-rose-400">Missing</span>
            </div>
          </div>
        </div>

        {/* Local Search Signals */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Local SEO</span>
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <MapPin className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-bold text-white mt-2">
            {audit.categoryScores.local}%
          </div>
          <div className="mt-2 text-[11px] text-slate-400 space-y-0.5">
            <div className="flex justify-between">
              <span>Geo Coordinates:</span>
              <span className="text-amber-400">Missing tags</span>
            </div>
            <div className="flex justify-between">
              <span>Target Region:</span>
              <span className="text-slate-200">IN-KA (Bangalore)</span>
            </div>
            <div className="flex justify-between">
              <span>Local Pack Ready:</span>
              <span className="text-amber-400">Action needed</span>
            </div>
          </div>
        </div>
      </div>

      {/* Issues Diagnostic List */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white">Diagnostic Action Plan</h3>
            <p className="text-xs text-slate-400">
              Prioritized issues preventing futuremindsv2.vercel.app from ranking on Page 1 of Google.
            </p>
          </div>

          {/* Filter Chips */}
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setSelectedSeverity('all')}
              className={`px-2.5 py-1 text-xs rounded-lg font-medium transition ${
                selectedSeverity === 'all'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              All ({audit.issues.length})
            </button>
            <button
              onClick={() => setSelectedSeverity('critical')}
              className={`px-2.5 py-1 text-xs rounded-lg font-medium transition ${
                selectedSeverity === 'critical'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Critical ({audit.counts.critical})
            </button>
            <button
              onClick={() => setSelectedSeverity('warning')}
              className={`px-2.5 py-1 text-xs rounded-lg font-medium transition ${
                selectedSeverity === 'warning'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Warnings ({audit.counts.warning})
            </button>
            <button
              onClick={() => setSelectedSeverity('good')}
              className={`px-2.5 py-1 text-xs rounded-lg font-medium transition ${
                selectedSeverity === 'good'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Passed ({audit.counts.good})
            </button>
          </div>
        </div>

        {/* Issue Cards */}
        <div className="divide-y divide-slate-800/80 mt-2">
          {filteredIssues.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-xs">
              No issues matching the selected filters.
            </div>
          ) : (
            filteredIssues.map((issue) => (
              <div key={issue.id} className="py-4 flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    {getSeverityBadge(issue.severity)}
                    <span className="inline-flex items-center text-xs text-slate-400 capitalize bg-slate-800/60 px-2 py-0.5 rounded">
                      {getCategoryIcon(issue.category)}
                      <span className="ml-1">{issue.category}</span>
                    </span>
                    <h4 className="text-sm font-semibold text-white">{issue.title}</h4>
                  </div>
                  <p className="text-xs text-slate-300">{issue.description}</p>
                  <div className="text-xs text-indigo-300/90 bg-indigo-950/40 border border-indigo-800/30 rounded-lg p-2.5 mt-2">
                    <span className="font-semibold text-indigo-300">Action: </span>
                    {issue.recommendation}
                  </div>
                </div>

                {issue.severity !== 'good' && (
                  <div className="flex md:flex-col items-end justify-between gap-2 shrink-0">
                    <button
                      onClick={onNavigateToCode}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-lg text-xs font-medium flex items-center space-x-1 transition hover:text-white"
                    >
                      <span>View Turnkey Code</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
