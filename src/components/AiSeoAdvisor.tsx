import React, { useState } from 'react';
import {
  Sparkles,
  Send,
  Copy,
  Check,
  BookOpen,
  MapPin,
  HelpCircle,
  TrendingUp,
  Award,
  Layers,
  FileText,
} from 'lucide-react';

export const AiSeoAdvisor: React.FC = () => {
  const [selectedType, setSelectedType] = useState<string>('keyword_expansion');
  const [targetKeyword, setTargetKeyword] = useState<string>(
    'Robotics & Coding classes for school students'
  );
  const [targetLocation, setTargetLocation] = useState<string>(
    'Electronic City & Ananth Nagar, Bangalore'
  );
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedOutput, setGeneratedOutput] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const tools = [
    {
      id: 'keyword_expansion',
      title: 'Keyword Strategy & Gap Finder',
      icon: TrendingUp,
      desc: 'Uncover untapped search queries used by parents in South Bangalore with KD & search intent.',
      defaultKeyword: 'Robotics classes for kids in Electronic City',
      defaultLoc: 'Electronic City, Ananth Nagar, Bengaluru',
    },
    {
      id: 'blog_brief',
      title: 'Ranking Blog Content Generator',
      icon: BookOpen,
      desc: 'Generate complete, high-ranking 600+ word article drafts with H1/H2 tags and parent appeal.',
      defaultKeyword: 'Why school students in Grades 5-10 should learn real Python',
      defaultLoc: 'Bangalore parents, ICSE/CBSE school students',
    },
    {
      id: 'localized_landing_page',
      title: 'Localized Landing Page Copy',
      icon: MapPin,
      desc: 'Build dedicated geo-targeted landing page copy for HSR Layout, Bommasandra, Chandapura, or Huskur.',
      defaultKeyword: 'Best Robotics & STEM Lab for Kids near Bommasandra',
      defaultLoc: 'Bommasandra & Electronic City Phase 2',
    },
    {
      id: 'faq_schema',
      title: 'Parent FAQ & Schema Generator',
      icon: HelpCircle,
      desc: 'Draft 6 high-intent parent FAQs that capture Google People Also Ask and output valid JSON-LD.',
      defaultKeyword: 'Future Minds batch size, fees, demo class, and robotics hardware',
      defaultLoc: 'Ananth Nagar, Bengaluru',
    },
    {
      id: 'gbp_playbook',
      title: 'Google Business Profile Playbook',
      icon: Award,
      desc: 'Exact categories, post templates, and 5-star review request scripts to rank in Google Maps 3-Pack.',
      defaultKeyword: 'Robotics School & STEM Training Academy',
      defaultLoc: 'Phase II, Ananth Nagar, Electronic City',
    },
  ];

  const handleToolSelect = (toolId: string) => {
    setSelectedType(toolId);
    const selected = tools.find((t) => t.id === toolId);
    if (selected) {
      setTargetKeyword(selected.defaultKeyword);
      setTargetLocation(selected.defaultLoc);
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setGeneratedOutput(null);

    try {
      const response = await fetch('/api/gemini/seo-advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: selectedType,
          targetKeyword,
          targetLocation,
          prompt: customPrompt,
        }),
      });

      const data = await response.json();
      if (data.error) {
        setGeneratedOutput(`Error generating response: ${data.error}`);
      } else {
        setGeneratedOutput(data.result || 'No response generated.');
      }
    } catch (err: any) {
      setGeneratedOutput(`Network error: ${err.message || 'Failed to call Gemini API'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (!generatedOutput) return;
    navigator.clipboard.writeText(generatedOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Intro Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg">
        <div className="flex items-center space-x-2">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">
            Powered by Gemini
          </span>
          <span className="text-xs text-slate-400">Model: gemini-3.8-flash</span>
        </div>
        <h2 className="text-xl font-bold text-white mt-1">
          AI SEO Strategist for Future Minds
        </h2>
        <p className="text-xs text-slate-300 mt-0.5">
          Generate localized organic ranking assets, competitor gap analyses, and parent-targeted blog articles specifically calibrated for Bengaluru school parents.
        </p>
      </div>

      {/* Generator Tool Selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {tools.map((tool) => {
          const isSelected = selectedType === tool.id;
          const Icon = tool.icon;
          return (
            <button
              key={tool.id}
              onClick={() => handleToolSelect(tool.id)}
              className={`p-3.5 rounded-xl border text-left transition flex flex-col justify-between ${
                isSelected
                  ? 'bg-purple-950/50 border-purple-500/50 text-white shadow-lg'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-900 hover:text-slate-200'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Icon
                    className={`w-4 h-4 ${isSelected ? 'text-purple-400' : 'text-slate-400'}`}
                  />
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping"></span>
                  )}
                </div>
                <h4 className="text-xs font-bold text-slate-200">{tool.title}</h4>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{tool.desc}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Inputs & Action Form */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Target Keyword or Topic:
            </label>
            <input
              type="text"
              value={targetKeyword}
              onChange={(e) => setTargetKeyword(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              placeholder="e.g., Robotics classes for kids in Electronic City"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Target Neighborhood or Audience:
            </label>
            <input
              type="text"
              value={targetLocation}
              onChange={(e) => setTargetLocation(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              placeholder="e.g., Electronic City Phase 1 & 2, Bangalore"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1">
            Optional Custom Instructions or Competitor Context:
          </label>
          <input
            type="text"
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
            placeholder="e.g., Emphasize our 4-5 students small batch size and physical rover hardware vs WhiteHat Jr screen fatigue"
          />
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold transition flex items-center space-x-2 shadow-lg shadow-purple-600/20 disabled:opacity-50"
          >
            <Sparkles className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>{isGenerating ? 'Generating Strategy...' : 'Generate with Gemini'}</span>
          </button>
        </div>
      </div>

      {/* Generated Results Area */}
      {generatedOutput && (
        <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
          <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileText className="w-4 h-4 text-purple-400" />
              <span className="text-xs font-bold text-white">AI Strategy Output</span>
              <span className="text-[11px] text-slate-400">· Ready for copy & paste</span>
            </div>

            <button
              onClick={handleCopy}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Content</span>
                </>
              )}
            </button>
          </div>

          <div className="p-5 overflow-x-auto max-h-[600px] text-xs text-slate-200 leading-relaxed font-sans whitespace-pre-wrap">
            {generatedOutput}
          </div>
        </div>
      )}
    </div>
  );
};
