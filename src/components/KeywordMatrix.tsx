import React, { useState } from 'react';
import {
  Search,
  Filter,
  TrendingUp,
  Target,
  Zap,
  MapPin,
  Sparkles,
  ExternalLink,
  ChevronDown,
  Layers,
  Award,
} from 'lucide-react';
import { INITIAL_KEYWORDS } from '../data/seoAssets';
import { KeywordItem } from '../types';

export const KeywordMatrix: React.FC = () => {
  const [keywords, setKeywords] = useState<KeywordItem[]>(INITIAL_KEYWORDS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedIntent, setSelectedIntent] = useState<string>('All');

  const categories = [
    'All',
    'Local Bangalore',
    'Robotics Classes',
    'Coding & Python',
    'Grades 1-10',
    'Near Me Queries',
  ];

  const intents = ['All', 'Transactional', 'Commercial', 'Informational'];

  const filteredKeywords = keywords.filter((kw) => {
    const matchSearch =
      kw.keyword.toLowerCase().includes(searchQuery.toLowerCase()) ||
      kw.suggestedAnchor.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCat = selectedCategory === 'All' || kw.category === selectedCategory;
    const matchIntent = selectedIntent === 'All' || kw.searchIntent === selectedIntent;
    return matchSearch && matchCat && matchIntent;
  });

  const totalMonthlyVolume = filteredKeywords.reduce((acc, curr) => acc + curr.monthlyVolume, 0);

  return (
    <div className="space-y-6">
      {/* Header & Metric Summary */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                Ranking Blueprint
              </span>
              <span className="text-xs text-slate-400">High-Intent Organic Strategy</span>
            </div>
            <h2 className="text-xl font-bold text-white mt-1">
              Bengaluru & Electronic City Keyword Ranking Matrix
            </h2>
            <p className="text-xs text-slate-300 mt-0.5">
              Targeting affluent tech parents in South Bangalore seeking practical, small-batch robotics and coding for school students.
            </p>
          </div>

          <div className="flex items-center space-x-4 bg-slate-950/60 border border-slate-800 rounded-xl p-3 shrink-0">
            <div>
              <span className="text-[11px] text-slate-400 block">Total Est. Search Vol:</span>
              <span className="text-lg font-bold text-emerald-400">
                {totalMonthlyVolume.toLocaleString()} / mo
              </span>
            </div>
            <div className="h-8 w-px bg-slate-800"></div>
            <div>
              <span className="text-[11px] text-slate-400 block">Target Terms:</span>
              <span className="text-lg font-bold text-white">{filteredKeywords.length} keywords</span>
            </div>
          </div>
        </div>
      </div>

      {/* Strategic Playbook Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 text-indigo-400 font-semibold text-xs mb-1">
              <MapPin className="w-4 h-4" />
              <span>Pillar 1: Hyper-Local Dominance</span>
            </div>
            <h4 className="text-sm font-bold text-white mb-1">Ananth Nagar & Electronic City</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Parents in Electronic City Phase 1 & 2 search for physical labs within a 5km radius. Rank #1 in Google Maps 3-Pack and capture high-converting parents immediately.
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-800 text-[11px] text-emerald-400 font-medium">
            Target: 4,000+ local monthly searches
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 text-cyan-400 font-semibold text-xs mb-1">
              <Layers className="w-4 h-4" />
              <span>Pillar 2: Grade-Based Pathways</span>
            </div>
            <h4 className="text-sm font-bold text-white mb-1">Grades 1–4, 5–7, 8–10 Queries</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Target parents searching by grade or age level (&quot;Python for Grade 5&quot;, &quot;Scratch for 8-year-olds&quot;, &quot;AI and OpenCV for 9th graders&quot;).
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-800 text-[11px] text-cyan-400 font-medium">
            Target: High conversion from ICSE / CBSE parents
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 text-purple-400 font-semibold text-xs mb-1">
              <Award className="w-4 h-4" />
              <span>Pillar 3: The &quot;Offline Lab&quot; Differentiator</span>
            </div>
            <h4 className="text-sm font-bold text-white mb-1">Physical Hardware vs Online Zoom</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Parents are fatigued by passive online coding classes. Emphasize small batches (4–5 students), tangible circuit assembly, and autonomous rover testing.
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-800 text-[11px] text-purple-400 font-medium">
            Differentiator: 100% hands-on physical arena
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search keyword or anchor text (e.g., electronic city, python, robotics)..."
              className="w-full bg-slate-950/80 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <div className="flex items-center space-x-1">
              <span className="text-xs text-slate-400">Category:</span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-xl px-2.5 py-2 focus:outline-none focus:border-indigo-500"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-1">
              <span className="text-xs text-slate-400">Intent:</span>
              <select
                value={selectedIntent}
                onChange={(e) => setSelectedIntent(e.target.value)}
                className="bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-xl px-2.5 py-2 focus:outline-none focus:border-indigo-500"
              >
                {intents.map((i) => (
                  <option key={i} value={i}>
                    {i}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Keywords Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-3 px-4 font-semibold">Target Keyword</th>
                <th className="py-3 px-4 font-semibold">Category</th>
                <th className="py-3 px-4 font-semibold">Search Intent</th>
                <th className="py-3 px-4 font-semibold">Est. Monthly Vol</th>
                <th className="py-3 px-4 font-semibold">Difficulty</th>
                <th className="py-3 px-4 font-semibold">Priority</th>
                <th className="py-3 px-4 font-semibold">Target SERP Features</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-200">
              {filteredKeywords.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No keywords match your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredKeywords.map((kw) => (
                  <tr key={kw.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3.5 px-4 font-medium">
                      <div className="text-white font-semibold">{kw.keyword}</div>
                      <div className="text-[11px] text-indigo-300/80 font-mono mt-0.5">
                        Anchor: &quot;{kw.suggestedAnchor}&quot;
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-800 text-slate-300 border border-slate-700">
                        {kw.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          kw.searchIntent === 'Transactional'
                            ? 'bg-emerald-500/15 text-emerald-400'
                            : kw.searchIntent === 'Commercial'
                            ? 'bg-blue-500/15 text-blue-400'
                            : 'bg-purple-500/15 text-purple-400'
                        }`}
                      >
                        {kw.searchIntent}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-semibold text-slate-200">
                      {kw.monthlyVolume.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`font-medium ${
                          kw.difficulty === 'Low'
                            ? 'text-emerald-400'
                            : kw.difficulty === 'Medium'
                            ? 'text-amber-400'
                            : 'text-rose-400'
                        }`}
                      >
                        {kw.difficulty}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          kw.priority === 'Quick Win'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : kw.priority === 'High Value'
                            ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                            : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {kw.priority}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1">
                        {kw.serpFeatures.map((feat) => (
                          <span
                            key={feat}
                            className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800/80 text-slate-300 font-mono"
                          >
                            {feat}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
