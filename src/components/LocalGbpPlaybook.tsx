import React, { useState } from 'react';
import {
  MapPin,
  Star,
  CheckCircle2,
  Copy,
  Check,
  Smartphone,
  Image,
  Share2,
  Navigation,
  PhoneCall,
  Compass,
} from 'lucide-react';

export const LocalGbpPlaybook: React.FC = () => {
  const [copiedReview, setCopiedReview] = useState(false);

  const reviewScript = `Hi [Parent Name]! Thank you for bringing [Child Name] to Future Minds STEM Lab today for their free robotics demo.

[Child Name] did a fantastic job assembling the motorized chassis and testing the obstacle sensor! 🚀

If you loved our hands-on lab and small batch format (strictly 4-5 students), could you take 30 seconds to leave us a quick review on Google? It means the world to our mentor team:
👉 [YOUR_GOOGLE_REVIEW_LINK]

Thank you for supporting hands-on STEM education in Ananth Nagar & Electronic City!`;

  const handleCopyReview = () => {
    navigator.clipboard.writeText(reviewScript);
    setCopiedReview(true);
    setTimeout(() => setCopiedReview(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg">
        <div className="flex items-center space-x-2">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            Local SEO Dominance
          </span>
          <span className="text-xs text-slate-400">Google Maps & Local 3-Pack</span>
        </div>
        <h2 className="text-xl font-bold text-white mt-1">
          Google Maps Local 3-Pack Ranking Playbook
        </h2>
        <p className="text-xs text-slate-300 mt-0.5">
          Over 68% of parents searching for &quot;robotics classes near me&quot; click directly on the Google Maps top 3 results. Follow this blueprint to rank #1 in Electronic City.
        </p>
      </div>

      {/* 4 Pillars of Local Ranking */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Step 1: GBP Categories & NAP */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center space-x-2 text-indigo-400 font-bold text-sm">
            <Compass className="w-4 h-4" />
            <span>1. Google Business Profile Categorization</span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
              <span className="text-slate-400 font-medium block">Primary Category (Most Critical):</span>
              <span className="text-emerald-400 font-mono font-bold text-sm">Robotics School</span>
              <p className="text-[11px] text-slate-400">
                Setting this as Primary immediately matches searchers typing &quot;robotics classes&quot; or &quot;robotics lab&quot;.
              </p>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
              <span className="text-slate-400 font-medium block">Secondary Categories:</span>
              <div className="flex flex-wrap gap-1.5 mt-1">
                <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-200 font-mono text-[11px]">
                  Computer Training School
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-200 font-mono text-[11px]">
                  Educational Institution
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-200 font-mono text-[11px]">
                  After School Program
                </span>
              </div>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
              <span className="text-slate-400 font-medium block">Exact Address & Citation Consistency (NAP):</span>
              <span className="text-white font-mono text-[11px] block">
                1121, 5th Cross, Phase II, Ananth Nagar, Electronic City, Bengaluru, Karnataka 560100
              </span>
              <p className="text-[11px] text-slate-500">
                Ensure this exact spelling is used on your website footer, Google Profile, Justdial, and Sulekha.
              </p>
            </div>
          </div>
        </div>

        {/* Step 2: 5-Star Review Automation */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 text-amber-400 font-bold text-sm">
              <Star className="w-4 h-4 fill-current" />
              <span>2. Review Generation Engine</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Google algorithms strongly favor businesses with high review velocity and keyword-rich parent testimonials mentioning &quot;small batches&quot; and &quot;robotics&quot;.
            </p>

            <div className="mt-3 p-3 bg-slate-950 rounded-xl border border-slate-800">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-slate-300">WhatsApp Post-Demo Script:</span>
                <button
                  onClick={handleCopyReview}
                  className="text-[11px] text-indigo-400 hover:text-indigo-300 flex items-center space-x-1 font-semibold"
                >
                  {copiedReview ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedReview ? 'Copied!' : 'Copy Script'}</span>
                </button>
              </div>
              <pre className="text-[11px] text-slate-300 whitespace-pre-wrap font-sans leading-relaxed bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                {reviewScript}
              </pre>
            </div>
          </div>

          <div className="text-[11px] text-emerald-400 bg-emerald-950/30 border border-emerald-800/40 p-2.5 rounded-xl">
            💡 Pro-Tip: When parents mention &quot;Electronic City&quot; or &quot;small batches of 4-5 students&quot; in their review, Google ranks your profile higher for those exact search keywords!
          </div>
        </div>
      </div>

      {/* Step 3: Photo Uploads & Local Citations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Geo-tagged Photos */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center space-x-2 text-cyan-400 font-bold text-sm">
            <Image className="w-4 h-4" />
            <span>3. High-Ranking Photo Strategy</span>
          </div>
          <p className="text-xs text-slate-400">
            Profiles with 30+ authentic lab photos get 42% more directions requests on Google Maps:
          </p>

          <ul className="space-y-2 text-xs text-slate-300">
            <li className="flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                <strong>Physical Hardware in Action:</strong> Photos of students assembling 4-DOF servo robotic arms and autonomous rovers.
              </span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                <strong>Small Batch Verification:</strong> Wide-angle photos showing strictly 4–5 kids per mentor workstation.
              </span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                <strong>Exterior & Landmark Signage:</strong> Clear photo of the Ananth Nagar 5th Cross lab building entrance so parents recognize it when driving.
              </span>
            </li>
          </ul>
        </div>

        {/* Local Citations */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center space-x-2 text-purple-400 font-bold text-sm">
            <Share2 className="w-4 h-4" />
            <span>4. Local Bangalore Citation Directory</span>
          </div>
          <p className="text-xs text-slate-400">
            Submit your exact NAP details to establish local domain authority in Bengaluru:
          </p>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800">
              <span className="font-semibold text-white block">Justdial Bangalore</span>
              <span className="text-[11px] text-slate-400">Category: Robotics Classes</span>
            </div>
            <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800">
              <span className="font-semibold text-white block">Sulekha Bengaluru</span>
              <span className="text-[11px] text-slate-400">Category: STEM Academies</span>
            </div>
            <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800">
              <span className="font-semibold text-white block">UrbanPro</span>
              <span className="text-[11px] text-slate-400">Category: Kids Coding & Robotics</span>
            </div>
            <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800">
              <span className="font-semibold text-white block">Bangalore Parents Groups</span>
              <span className="text-[11px] text-slate-400">Electronic City Resident Forums</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
