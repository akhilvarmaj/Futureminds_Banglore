import React, { useState } from 'react';
import {
  GitBranch,
  GitPullRequest,
  CheckCircle,
  AlertCircle,
  Loader2,
  Terminal,
  Copy,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  FolderGit2,
  Lock,
  Flame,
  Check,
} from 'lucide-react';

export const GitHubSync: React.FC = () => {
  const [repoUrl, setRepoUrl] = useState('https://github.com/akhilvarmaj/FuturemindsV2');
  const [token, setToken] = useState('');
  const [branch, setBranch] = useState('main');
  const [pushDirectly, setPushDirectly] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [resultMessage, setResultMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [copiedCmd, setCopiedCmd] = useState(false);

  const handleSync = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!repoUrl.trim()) {
      setErrorMessage('Please provide your GitHub repository URL (e.g., https://github.com/username/futuremindsv2)');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setResultMessage(null);
    setLogs([`[${new Date().toLocaleTimeString()}] Initiating repository pull & SEO injection...`]);

    try {
      const response = await fetch('/api/github/patch-repo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          repoUrl: repoUrl.trim(),
          token: token.trim() || undefined,
          branch: branch.trim() || 'main',
          pushDirectly,
        }),
      });

      const data = await response.json();
      if (data.logs && Array.isArray(data.logs)) {
        setLogs(data.logs);
      }

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to pull and optimize repository.');
      }

      setIsSuccess(true);
      setResultMessage(data.message || 'Repository successfully optimized and pushed!');
    } catch (err: any) {
      console.error('GitHub Sync Error:', err);
      setIsSuccess(false);
      setErrorMessage(err.message || 'An error occurred during synchronization.');
    } finally {
      setIsLoading(false);
    }
  };

  const manualTerminalScript = `# In your local repository terminal:
# 1. Pull latest code
git pull origin ${branch || 'main'}

# 2. Add public/robots.txt
cat << 'EOF' > public/robots.txt
User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/
Crawl-delay: 1
Sitemap: https://futuremindsv2.vercel.app/sitemap.xml
EOF

# 3. Add public/sitemap.xml
cat << 'EOF' > public/sitemap.xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://futuremindsv2.vercel.app/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://futuremindsv2.vercel.app/#courses</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://futuremindsv2.vercel.app/#batches</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://futuremindsv2.vercel.app/#faq</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
</urlset>
EOF

# 4. Commit and Push to trigger instant Vercel build
git add .
git commit -m "feat(seo): rank #1 in Electronic City Bangalore - Schema, sitemap, robots & geo meta"
git push origin ${branch || 'main'}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(manualTerminalScript);
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-cyan-950 border border-indigo-500/30 rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-500/30">
              <FolderGit2 className="w-3.5 h-3.5" />
              <span>Automated GitHub Pipeline & Vercel Deployment</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Pull & Patch Future Minds Repository
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Connect your GitHub repository to pull the latest code, automatically inject the
              high-ranking Electronic City local SEO files (Schema.org, robots.txt, sitemap.xml,
              geo tags), and push directly so Vercel redeploys immediately.
            </p>
          </div>

          <div className="flex flex-col gap-2 w-full md:w-auto">
            <div className="px-4 py-3 bg-slate-900/90 border border-slate-700/60 rounded-xl text-xs space-y-1">
              <div className="flex items-center space-x-2 text-emerald-400 font-semibold">
                <ShieldCheck className="w-4 h-4" />
                <span>Target: Rank #1 Center</span>
              </div>
              <div className="text-slate-400">
                Ananth Nagar Phase 2 &bull; Electronic City &bull; Bangalore
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Two-Column Grid: Form & Requirements */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Automated Sync Tool */}
        <div className="lg:col-span-7 bg-slate-900/70 border border-slate-800/80 rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                <GitPullRequest className="w-5 h-5 text-indigo-400" />
                <span>One-Click Repository Optimizer</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Enter your repository URL below. Our server will clone, inject all files, and push back.
              </p>
            </div>
          </div>

          <form onSubmit={handleSync} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                GitHub Repository URL <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                placeholder="https://github.com/akhilvarma/futureminds"
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700/70 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-mono transition"
                required
              />
              <span className="text-[11px] text-slate-500 mt-1 block">
                Example: https://github.com/your-username/futuremindsv2
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center space-x-1.5">
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                  <span>GitHub Personal Access Token (PAT)</span>
                </label>
                <input
                  type="password"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700/70 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-mono transition"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Required if the repo is private or for auto-pushing commits.
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center space-x-1.5">
                  <GitBranch className="w-3.5 h-3.5 text-slate-400" />
                  <span>Target Branch</span>
                </label>
                <input
                  type="text"
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  placeholder="main"
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700/70 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-mono transition"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Defaults to main. Vercel auto-deploys on push.
                </span>
              </div>
            </div>

            <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={pushDirectly}
                  onChange={(e) => setPushDirectly(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600 bg-slate-900 border-slate-700 focus:ring-indigo-500 focus:ring-offset-slate-900"
                />
                <div className="text-xs">
                  <span className="font-semibold text-white">
                    Direct Push to GitHub after applying optimizations
                  </span>
                  <p className="text-slate-400 text-[11px]">
                    Creates a commit and pushes to origin, automatically triggering Vercel redeployment.
                  </p>
                </div>
              </label>
            </div>

            {errorMessage && (
              <div className="p-4 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-semibold">Sync Failed:</span>
                  <p>{errorMessage}</p>
                </div>
              </div>
            )}

            {resultMessage && (
              <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-semibold">Success!</span>
                  <p>{resultMessage}</p>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-6 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/30 transition duration-200 flex items-center justify-center space-x-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Pulling, Injecting SEO Files & Committing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Pull, Optimize & Apply Fixes</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </>
              )}
            </button>
          </form>

          {/* Real-Time Terminal Log */}
          {logs.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center space-x-1.5 font-mono">
                  <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Execution Logs</span>
                </span>
                <span className="text-[11px] text-slate-500">{logs.length} events logged</span>
              </div>
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-[11px] text-slate-300 max-h-48 overflow-y-auto space-y-1">
                {logs.map((line, idx) => (
                  <div
                    key={idx}
                    className={
                      line.includes('failed') || line.includes('error')
                        ? 'text-rose-400'
                        : line.includes('Successfully') || line.includes('Wrote')
                        ? 'text-emerald-400'
                        : 'text-slate-300'
                    }
                  >
                    {line}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Information & Requirements Checklist */}
        <div className="lg:col-span-5 space-y-6">
          {/* What We Need From You */}
          <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <Flame className="w-4 h-4 text-amber-400" />
              <span>What We Need From You</span>
            </h3>

            <div className="space-y-3 text-xs text-slate-300">
              <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  1
                </div>
                <div>
                  <span className="font-semibold text-white">Your GitHub Repository URL</span>
                  <p className="text-slate-400 text-[11px] mt-0.5">
                    Paste your repo link (e.g. <code className="text-cyan-400">https://github.com/username/futuremindsv2</code>)
                    in the form or reply in the chat.
                  </p>
                </div>
              </div>

              <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  2
                </div>
                <div>
                  <span className="font-semibold text-white">Repo Access (If Private)</span>
                  <p className="text-slate-400 text-[11px] mt-0.5">
                    If private, either provide a temporary Personal Access Token (PAT) with <code className="text-cyan-400">repo</code> scope,
                    or make it public temporarily.
                  </p>
                </div>
              </div>

              <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  3
                </div>
                <div>
                  <span className="font-semibold text-white">Official Address & Contact</span>
                  <p className="text-slate-400 text-[11px] mt-0.5">
                    We pre-loaded your address: 1121, 5th Cross, Phase II, Ananth Nagar, Electronic City, Bangalore 560100.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Terminal Script */}
          <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-6 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center space-x-1.5">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <span>Manual 1-Click Terminal Command</span>
              </span>
              <button
                onClick={copyToClipboard}
                className="flex items-center space-x-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition cursor-pointer"
              >
                {copiedCmd ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCmd ? 'Copied!' : 'Copy Script'}</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              If you prefer applying the changes locally in your own machine, copy this command and paste it into your project folder:
            </p>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-[11px] text-cyan-300 overflow-x-auto max-h-36">
              <pre>{manualTerminalScript}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
