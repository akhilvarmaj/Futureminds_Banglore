import React, { useState } from 'react';
import { X, Copy, Check, Share2, MessageCircle, Mail, Globe, Sparkles } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Derive the live shareable URL
  const LIVE_URL = typeof window !== 'undefined' 
    ? (window.location.origin.includes('localhost') || window.location.origin.includes('3000')
        ? 'https://ais-pre-elopse3afkrblusuew4don-716487279283.asia-southeast1.run.app'
        : window.location.origin)
    : 'https://ais-pre-elopse3afkrblusuew4don-716487279283.asia-southeast1.run.app';

  const SHARE_TEXT = 'Check out the interactive Future Minds website — Robotics, AI & Coding academy for school students (Grades 1–10) in Ananth Nagar, Electronic City, Bengaluru:';

  const handleCopy = () => {
    navigator.clipboard.writeText(LIVE_URL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const whatsAppShareUrl = `https://wa.me/?text=${encodeURIComponent(`${SHARE_TEXT} ${LIVE_URL}`)}`;
  const emailShareUrl = `mailto:?subject=${encodeURIComponent('Future Minds — Robotics, AI & Coding Academy (Interactive Website)')}&body=${encodeURIComponent(`${SHARE_TEXT}\n\n${LIVE_URL}`)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-100 relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#edf5ff] text-[#1769ff] flex items-center justify-center">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-[#10233f] tracking-tight">Share Interactive Website</h3>
              <p className="text-[11px] font-semibold text-slate-500">Live link ready for your team & parents</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Description & Badge */}
        <div className="py-4 space-y-3">
          <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-2xl p-3 flex items-start gap-2.5 text-xs text-emerald-900">
            <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              <strong>Fully interactive live web app:</strong> Anyone with this link can explore the curriculum, view the 3D robot, check the campus map, and book demo classes on any device.
            </span>
          </div>

          {/* Copyable URL box */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-[#1769ff]" />
              <span>Direct Website Link</span>
            </label>
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-2xl p-1.5 pl-3">
              <input
                type="text"
                readOnly
                value={LIVE_URL}
                className="bg-transparent text-xs font-mono text-slate-700 w-full outline-none select-all truncate"
              />
              <button
                onClick={handleCopy}
                className={`px-3.5 py-2 rounded-xl font-bold text-xs transition flex items-center gap-1.5 shrink-0 ${
                  copied 
                    ? 'bg-emerald-600 text-white shadow-sm' 
                    : 'bg-[#1769ff] hover:bg-[#1258d6] text-white shadow-sm'
                }`}
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy Link'}</span>
              </button>
            </div>
          </div>

          {/* Quick Forward buttons */}
          <div className="pt-2 space-y-2">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Quick Forward</div>
            <div className="grid grid-cols-2 gap-2.5">
              <a
                href={whatsAppShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#25D366] hover:bg-[#20ba59] text-white py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition shadow-sm"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp</span>
              </a>

              <a
                href={emailShareUrl}
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition"
              >
                <Mail className="w-4 h-4 text-slate-600" />
                <span>Email Team</span>
              </a>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="pt-3 border-t border-slate-100 text-center text-[11px] text-slate-400">
          Works seamlessly on Google Chrome, Safari, iOS & Android.
        </div>
      </div>
    </div>
  );
};
