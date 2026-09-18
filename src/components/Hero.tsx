import React from 'react';
import { 
  Sparkles, Bot, Brain, Code2, ArrowRight, Play, 
  MapPin, MessageCircle, ShieldCheck, CheckCircle, Flame, Star 
} from 'lucide-react';
import { FUTURE_MINDS_PHONE, getWhatsAppDirectUrl } from '../utils/whatsapp';

interface HeroProps {
  onEnrollClick: () => void;
  onExploreLessons: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onEnrollClick, onExploreLessons }) => {
  return (
    <section className="relative pt-12 pb-20 sm:pt-16 sm:pb-28 bg-gradient-to-b from-indigo-50/70 via-white to-slate-50 overflow-hidden">
      {/* Decorative subtle background elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-12 left-10 w-72 h-72 bg-indigo-300/20 rounded-full blur-3xl" />
        <div className="absolute top-24 right-10 w-80 h-80 bg-emerald-300/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-1/3 w-64 h-64 bg-amber-300/15 rounded-full blur-2xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headline & Action CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Badges row */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-100/90 text-indigo-900 text-xs font-bold border border-indigo-200 shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                Future Minds Academy
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/90 text-emerald-900 text-xs font-bold border border-emerald-200 shadow-xs">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                Ananth Nagar Center
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100/90 text-amber-900 text-xs font-bold border border-amber-200 shadow-xs">
                <Flame className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                Ages 6 to 16
              </span>
            </div>

            {/* Main Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.12]">
              Ignite Your Child&apos;s Superpower with{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-indigo-700 to-emerald-600">
                Coding, AI & Robotics
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Empower your kid from age 6 to 16 to build autonomous robots, code real Python games, and train real AI models. Experience our interactive lesson modules, live physical lab in Ananth Nagar, and real-time student growth tracking.
            </p>

            {/* Key Value Bullets */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs font-semibold text-slate-700 max-w-xl mx-auto lg:mx-0">
              <div className="flex items-center gap-2 bg-white/80 backdrop-blur-xs p-2.5 rounded-xl border border-slate-200/80 shadow-2xs">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>100% Hands-On Kits</span>
              </div>
              <div className="flex items-center gap-2 bg-white/80 backdrop-blur-xs p-2.5 rounded-xl border border-slate-200/80 shadow-2xs">
                <CheckCircle className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>Live Growth Portal</span>
              </div>
              <div className="flex items-center gap-2 bg-white/80 backdrop-blur-xs p-2.5 rounded-xl border border-slate-200/80 shadow-2xs">
                <CheckCircle className="w-4 h-4 text-purple-600 shrink-0" />
                <span>Ananth Nagar Lab</span>
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-4">
              <button
                onClick={onEnrollClick}
                id="btn-hero-enroll"
                className="w-full sm:w-auto px-7 py-3.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-bold rounded-2xl text-sm sm:text-base transition shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 group"
              >
                <span>Book Free Trial & Enroll</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onExploreLessons}
                className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-800 font-bold rounded-2xl text-sm sm:text-base transition border border-slate-300 shadow-sm flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 text-indigo-600 fill-indigo-600" />
                <span>Try Interactive Lesson</span>
              </button>

              <a
                href={getWhatsAppDirectUrl('Hi Future Minds, I would like to inquire about admissions for Robotics, AI & Coding for my child at your Ananth Nagar campus.')}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-5 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-2xl text-sm transition shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2"
                title="Direct WhatsApp: 9618283987"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>WhatsApp (9618283987)</span>
              </a>
            </div>

            {/* Social Proof */}
            <div className="pt-2 flex items-center justify-center lg:justify-start gap-4 text-xs text-slate-500">
              <div className="flex -space-x-2">
                {['👦', '👧', '🧑', '🤖'].map((emoji, i) => (
                  <span
                    key={i}
                    className="w-7 h-7 rounded-full bg-indigo-100 border-2 border-white flex items-center justify-center text-sm shadow-2xs"
                  >
                    {emoji}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-1 font-medium">
                <span className="flex text-amber-500">
                  {'★★★★★'}
                </span>
                <span className="font-bold text-slate-700">4.9/5</span>
                <span>rating from 120+ Ananth Nagar parents</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Tech Visual Deck */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200/80 backdrop-blur-md">
              {/* Card Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white flex items-center justify-center shadow-md">
                    <Bot className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">Future Minds STEM Suite</h3>
                    <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      Interactive Learning Live
                    </div>
                  </div>
                </div>
                <span className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-[11px] font-bold">
                  Ages 6–16
                </span>
              </div>

              {/* Course Pillar Preview Cards */}
              <div className="space-y-3">
                {/* Track 1 */}
                <div className="p-3.5 rounded-2xl bg-indigo-50/60 border border-indigo-100 flex items-center justify-between hover:bg-indigo-50 transition">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                      <Code2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Scratch to Python Coding</h4>
                      <p className="text-[11px] text-slate-500">Block algorithms, arcade games & app logic</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-indigo-700 bg-white px-2 py-0.5 rounded-full shadow-2xs">
                    6-12 Yrs
                  </span>
                </div>

                {/* Track 2 */}
                <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-100 flex items-center justify-between hover:bg-emerald-50 transition">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                      <Bot className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Physical Robotics & Sensors</h4>
                      <p className="text-[11px] text-slate-500">Autonomous rovers, Arduino & circuits</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-white px-2 py-0.5 rounded-full shadow-2xs">
                    Lab Kits
                  </span>
                </div>

                {/* Track 3 */}
                <div className="p-3.5 rounded-2xl bg-purple-50/60 border border-purple-100 flex items-center justify-between hover:bg-purple-50 transition">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-xs">
                      <Brain className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">AI & Machine Learning for Kids</h4>
                      <p className="text-[11px] text-slate-500">Computer vision, speech recognition & models</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-purple-700 bg-white px-2 py-0.5 rounded-full shadow-2xs">
                    Next-Gen
                  </span>
                </div>
              </div>

              {/* Interactive Mini Teaser Footer */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-indigo-600" />
                  <span className="text-slate-600 font-medium">Ananth Nagar Campus</span>
                </div>
                <button
                  onClick={onEnrollClick}
                  className="font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-0.5"
                >
                  Enroll Today <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
