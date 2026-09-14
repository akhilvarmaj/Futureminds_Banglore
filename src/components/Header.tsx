import React from 'react';
import { Sparkles, RefreshCw, ExternalLink, ShieldCheck, Download, Search } from 'lucide-react';

interface HeaderProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onRefreshAudit: () => void;
  isAuditing: boolean;
  score: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  onRefreshAudit,
  isAuditing,
  score,
}) => {
  const tabs = [
    { id: 'audit', label: 'SEO Health & Audit' },
    { id: 'git', label: 'GitHub Auto-Sync' },
    { id: 'code', label: 'Turnkey Code & Assets' },
    { id: 'keywords', label: 'Keyword Matrix & Rankings' },
    { id: 'serp', label: 'SERP & Social Preview' },
    { id: 'ai', label: 'AI SEO Studio' },
    { id: 'local', label: 'Google Maps 3-Pack' },
    { id: 'deploy', label: 'Vercel Deploy Guide' },
  ];

  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white font-bold text-lg">
              FM
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg text-white tracking-tight">Future Minds</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-medium border border-indigo-500/30">
                  SEO Suite
                </span>
              </div>
              <div className="flex items-center space-x-2 text-xs text-slate-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Auditing:</span>
                <a
                  href="https://futuremindsv2.vercel.app/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-cyan-400 hover:text-cyan-300 flex items-center space-x-1 font-mono hover:underline"
                >
                  <span>futuremindsv2.vercel.app</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          {/* Quick Metrics & Actions */}
          <div className="flex items-center space-x-3">
            <div className="hidden sm:flex items-center px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs">
              <span className="text-slate-400 mr-2">Live SEO Score:</span>
              <span
                className={`font-bold px-2 py-0.5 rounded ${
                  score >= 80
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : score >= 50
                    ? 'bg-amber-500/20 text-amber-400'
                    : 'bg-rose-500/20 text-rose-400'
                }`}
              >
                {score}/100
              </span>
              <span className="text-slate-500 mx-2">→</span>
              <span className="text-emerald-400 font-medium flex items-center space-x-1">
                <Sparkles className="w-3 h-3" />
                <span>98/100 after fixes</span>
              </span>
            </div>

            <button
              onClick={onRefreshAudit}
              disabled={isAuditing}
              className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium flex items-center space-x-1.5 transition disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isAuditing ? 'animate-spin text-indigo-400' : ''}`} />
              <span className="hidden sm:inline">{isAuditing ? 'Scanning...' : 'Re-scan Site'}</span>
            </button>

            <button
              onClick={() => setCurrentTab('code')}
              className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center space-x-1.5 transition shadow-sm shadow-indigo-500/30"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Get SEO Code</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 overflow-x-auto py-2 scrollbar-none border-t border-slate-800/60">
          {tabs.map((tab) => {
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition flex items-center space-x-1.5 ${
                  isActive
                    ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
