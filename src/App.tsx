/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { AuditOverview } from './components/AuditOverview';
import { CodeExporter } from './components/CodeExporter';
import { KeywordMatrix } from './components/KeywordMatrix';
import { SerpSimulator } from './components/SerpSimulator';
import { AiSeoAdvisor } from './components/AiSeoAdvisor';
import { LocalGbpPlaybook } from './components/LocalGbpPlaybook';
import { DeploymentGuide } from './components/DeploymentGuide';
import { GitHubSync } from './components/GitHubSync';
import { AuditResult } from './types';
import { ExternalLink, Sparkles } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('audit');
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const runAudit = async (targetUrl = 'https://futuremindsv2.vercel.app/') => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: targetUrl }),
      });
      if (!response.ok) {
        throw new Error(`Audit request returned status ${response.status}`);
      }
      const data: AuditResult = await response.json();
      setAuditResult(data);
    } catch (err: any) {
      console.error('Audit failed:', err);
      setError(err.message || 'Failed to scan target website');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    runAudit();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Top Header */}
      <Header
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onRefreshAudit={() => runAudit(auditResult?.url || 'https://futuremindsv2.vercel.app/')}
        isAuditing={isLoading}
        score={auditResult?.overallScore ?? 41}
      />

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-between">
            <span>Audit Alert: {error}</span>
            <button
              onClick={() => runAudit()}
              className="px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded font-semibold transition"
            >
              Retry
            </button>
          </div>
        )}

        {currentTab === 'audit' && (
          <AuditOverview
            audit={auditResult}
            isLoading={isLoading}
            onAuditUrl={(url) => runAudit(url)}
            onNavigateToCode={() => setCurrentTab('code')}
          />
        )}

        {currentTab === 'git' && <GitHubSync />}

        {currentTab === 'code' && <CodeExporter />}

        {currentTab === 'keywords' && <KeywordMatrix />}

        {currentTab === 'serp' && <SerpSimulator />}

        {currentTab === 'ai' && <AiSeoAdvisor />}

        {currentTab === 'local' && <LocalGbpPlaybook />}

        {currentTab === 'deploy' && (
          <DeploymentGuide onNavigateToCode={() => setCurrentTab('code')} />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-6 mt-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-slate-400">Future Minds SEO Optimization Suite</span>
            <span>·</span>
            <span>Bengaluru STEM Academy</span>
          </div>

          <div className="flex items-center space-x-4">
            <a
              href="https://futuremindsv2.vercel.app/"
              target="_blank"
              rel="noreferrer"
              className="hover:text-cyan-400 transition flex items-center space-x-1"
            >
              <span>futuremindsv2.vercel.app</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <span>·</span>
            <span className="text-slate-400">Targeting Page 1 Google & Maps 3-Pack</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
