import React, { useState } from 'react';
import {
  Monitor,
  Smartphone,
  Share2,
  Star,
  MapPin,
  ExternalLink,
  ChevronDown,
  CheckCircle,
  AlertCircle,
  Phone,
  Navigation,
} from 'lucide-react';

export const SerpSimulator: React.FC = () => {
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile' | 'social'>('desktop');
  const [isOptimized, setIsOptimized] = useState<boolean>(true);

  return (
    <div className="space-y-6">
      {/* Top Controls Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                Visual SERP Emulator
              </span>
              <span className="text-xs text-slate-400">Google Search & Social Share Preview</span>
            </div>
            <h2 className="text-xl font-bold text-white mt-1">
              Search Snippet & Rich Results Simulator
            </h2>
            <p className="text-xs text-slate-300 mt-0.5">
              Simulate exactly how parents see Future Minds when searching on Google or receiving a link on WhatsApp.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* View Mode Switcher */}
            <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setViewMode('desktop')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition ${
                  viewMode === 'desktop'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>Desktop Google</span>
              </button>
              <button
                onClick={() => setViewMode('mobile')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition ${
                  viewMode === 'mobile'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Mobile Search</span>
              </button>
              <button
                onClick={() => setViewMode('social')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition ${
                  viewMode === 'social'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Social / WhatsApp</span>
              </button>
            </div>

            {/* Optimization Toggle */}
            <div className="flex items-center bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 mr-2">Version:</span>
              <button
                onClick={() => setIsOptimized(!isOptimized)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition flex items-center space-x-1 ${
                  isOptimized
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                }`}
              >
                <span>{isOptimized ? '✓ Optimized (With SEO Pack)' : '✕ Before (Current Live)'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Simulator Display Card */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-2xl flex flex-col items-center">
        {/* Search Engine Header Bar */}
        <div className="w-full max-w-3xl mb-6 pb-4 border-b border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-rose-500/80"></span>
            <span className="w-3 h-3 rounded-full bg-amber-500/80"></span>
            <span className="w-3 h-3 rounded-full bg-emerald-500/80"></span>
            <span className="ml-2 font-mono text-slate-300">
              Google Search Query: &quot;robotics classes for kids electronic city&quot;
            </span>
          </div>
          <span className="text-[11px] text-slate-500">About 84,200 results (0.34 seconds)</span>
        </div>

        {/* 1. Desktop Google View */}
        {viewMode === 'desktop' && (
          <div className="w-full max-w-3xl bg-white text-slate-900 rounded-xl p-6 shadow-xl border border-slate-200">
            {/* Breadcrumb / URL */}
            <div className="flex items-center space-x-2 text-xs mb-1">
              <div className="w-6 h-6 rounded-full bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700 font-bold text-[10px]">
                FM
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-medium text-[#202124]">Future Minds</span>
                <span className="text-[11px] text-[#5f6368] font-mono">
                  https://futuremindsv2.vercel.app
                </span>
              </div>
            </div>

            {/* Title */}
            <h3 className="text-xl text-[#1a0dab] hover:underline font-normal cursor-pointer leading-snug mt-1">
              {isOptimized
                ? 'Future Minds | Robotics, AI & Coding Classes for Kids in Electronic City, Bangalore'
                : 'Future Minds — Robotics, AI & Coding for School Students'}
            </h3>

            {/* Rich Snippet Star Ratings (Only in Optimized) */}
            {isOptimized && (
              <div className="flex items-center space-x-2 text-xs text-[#70757a] mt-1">
                <div className="flex items-center text-amber-500">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <Star className="w-3.5 h-3.5 fill-current" />
                </div>
                <span className="font-semibold text-slate-700">4.9</span>
                <span>(48 parent reviews)</span>
                <span>·</span>
                <span className="text-emerald-700 font-medium">Ananth Nagar Lab</span>
                <span>·</span>
                <span>Strictly 4–5 students / batch</span>
              </div>
            )}

            {/* Meta Description */}
            <p className="text-sm text-[#4d5156] mt-2 leading-relaxed">
              {isOptimized
                ? 'Hands-on Robotics, AI & Python coding lab for school students (Grades 1–10) in Ananth Nagar, Electronic City, Bengaluru. Strictly small batches of 4–5 students. Book a free demo class today!'
                : 'Practical technology learning for school students (Grades 1–10). Robotics, AI & Coding in small batches (4–5 students) in Ananth Nagar, Bengaluru.'}
            </p>

            {/* Sitelinks & FAQ Accordions (Enabled by Schema in Optimized mode) */}
            {isOptimized && (
              <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-2 bg-slate-50 rounded border border-slate-100 hover:bg-slate-100 cursor-pointer">
                    <span className="text-[#1a0dab] font-medium block">
                      Grades 1–4: Blockly Robotics
                    </span>
                    <span className="text-[#5f6368] text-[11px]">
                      Motorized chassis, circuits & visual logic
                    </span>
                  </div>
                  <div className="p-2 bg-slate-50 rounded border border-slate-100 hover:bg-slate-100 cursor-pointer">
                    <span className="text-[#1a0dab] font-medium block">
                      Grades 5–7: Python & Connected IoT
                    </span>
                    <span className="text-[#5f6368] text-[11px]">
                      Microcontroller Bluetooth rovers & typed code
                    </span>
                  </div>
                  <div className="p-2 bg-slate-50 rounded border border-slate-100 hover:bg-slate-100 cursor-pointer">
                    <span className="text-[#1a0dab] font-medium block">
                      Grades 8–10: Computer Vision & AI
                    </span>
                    <span className="text-[#5f6368] text-[11px]">
                      4-DOF robotic arm servos & OpenCV capstones
                    </span>
                  </div>
                  <div className="p-2 bg-slate-50 rounded border border-slate-100 hover:bg-slate-100 cursor-pointer">
                    <span className="text-[#1a0dab] font-medium block">Book a Free 60-Min Demo</span>
                    <span className="text-[#5f6368] text-[11px]">
                      Try physical hardware before enrolling
                    </span>
                  </div>
                </div>

                {/* FAQ Snippet */}
                <div className="mt-3 pt-2 text-xs">
                  <span className="text-slate-500 font-semibold block mb-1">
                    People also ask (FAQ Rich Snippet):
                  </span>
                  <div className="border border-slate-200 rounded divide-y divide-slate-200">
                    <div className="p-2 flex justify-between items-center text-slate-700 font-medium">
                      <span>What is the batch size at Future Minds Bengaluru?</span>
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                    <div className="p-2 text-slate-600 text-[11px] bg-slate-50">
                      Strictly 4 to 5 students per batch to guarantee physical hardware safety and 1-on-1 mentor guidance.
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 2. Mobile Google Search View */}
        {viewMode === 'mobile' && (
          <div className="w-full max-w-sm bg-white text-slate-900 rounded-2xl p-4 shadow-xl border border-slate-200">
            {/* Local 3-Pack Header if Optimized */}
            {isOptimized && (
              <div className="mb-4 p-3 bg-blue-50/70 border border-blue-100 rounded-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1.5 text-blue-800 font-bold text-xs">
                    <MapPin className="w-4 h-4 text-blue-600" />
                    <span>Google Maps Local 3-Pack</span>
                  </div>
                  <span className="text-[10px] bg-blue-200/80 text-blue-800 px-1.5 py-0.5 rounded font-bold">
                    #1 Ranking
                  </span>
                </div>
                <div className="text-xs font-bold text-slate-900 mt-1">
                  Future Minds — Robotics & Coding Academy
                </div>
                <div className="flex items-center text-xs text-amber-500 mt-0.5">
                  <span className="font-bold text-slate-800 mr-1">4.9</span>
                  <div className="flex">
                    <Star className="w-3 h-3 fill-current" />
                    <Star className="w-3 h-3 fill-current" />
                    <Star className="w-3 h-3 fill-current" />
                    <Star className="w-3 h-3 fill-current" />
                    <Star className="w-3 h-3 fill-current" />
                  </div>
                  <span className="text-slate-500 ml-1">(48)</span>
                </div>
                <div className="text-[11px] text-slate-600 mt-1">
                  1121, 5th Cross, Phase II, Ananth Nagar, Electronic City
                </div>
                <div className="mt-2 pt-2 border-t border-blue-100 flex items-center justify-between text-xs font-semibold">
                  <button className="flex items-center space-x-1 text-blue-700">
                    <Phone className="w-3 h-3" />
                    <span>Call Now</span>
                  </button>
                  <button className="flex items-center space-x-1 text-blue-700">
                    <Navigation className="w-3 h-3" />
                    <span>Directions</span>
                  </button>
                  <button className="flex items-center space-x-1 text-blue-700">
                    <ExternalLink className="w-3 h-3" />
                    <span>Website</span>
                  </button>
                </div>
              </div>
            )}

            {/* Organic Mobile Result */}
            <div className="flex items-center space-x-2 text-xs mb-1">
              <div className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-[9px]">
                FM
              </div>
              <span className="text-xs font-medium text-slate-700">futuremindsv2.vercel.app</span>
            </div>

            <h4 className="text-base font-semibold text-[#1a0dab] leading-snug">
              {isOptimized
                ? 'Future Minds | Robotics, AI & Coding Classes for Kids (Grades 1-10)'
                : 'Future Minds — Robotics, AI & Coding for School Students'}
            </h4>

            {isOptimized && (
              <div className="flex items-center space-x-1 text-xs text-amber-500 my-1">
                <Star className="w-3 h-3 fill-current" />
                <span className="font-bold text-slate-700">4.9</span>
                <span className="text-slate-500">(48) · Electronic City</span>
              </div>
            )}

            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              {isOptimized
                ? 'Hands-on Robotics & Python lab in Ananth Nagar, Bengaluru. Strictly 4–5 students per batch. Free demo session.'
                : 'Practical technology learning for school students (Grades 1–10). Small batches in Ananth Nagar.'}
            </p>
          </div>
        )}

        {/* 3. Social / WhatsApp Card View */}
        {viewMode === 'social' && (
          <div className="w-full max-w-md bg-[#0b141a] text-slate-200 rounded-2xl p-4 shadow-xl border border-slate-800">
            <div className="text-xs text-emerald-400 font-semibold mb-2 flex items-center space-x-1.5">
              <span>WhatsApp / Social Chat Link Preview</span>
            </div>

            <div className="bg-[#1f2c34] rounded-xl overflow-hidden border border-[#2a3942]">
              {/* Image Preview Banner */}
              {isOptimized ? (
                <div className="h-40 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 flex flex-col items-center justify-center p-4 text-center border-b border-[#2a3942] relative overflow-hidden">
                  <div className="absolute inset-0 bg-blue-600/10 backdrop-blur-xs"></div>
                  <div className="relative z-10">
                    <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 text-[10px] font-bold uppercase tracking-wider">
                      Future Minds STEM Lab
                    </span>
                    <h5 className="text-base font-extrabold text-white mt-1">
                      Robotics, AI & Real Python for School Students
                    </h5>
                    <p className="text-[11px] text-slate-300 mt-1">
                      Ananth Nagar, Electronic City, Bengaluru · Strictly 4–5 Kids / Batch
                    </p>
                  </div>
                </div>
              ) : (
                <div className="h-28 bg-slate-800 flex flex-col items-center justify-center p-4 text-center border-b border-slate-700 text-slate-500 text-xs">
                  <AlertCircle className="w-6 h-6 mb-1 text-amber-500/80" />
                  <span>No og:image configured (Displays as a blank gray box on WhatsApp)</span>
                </div>
              )}

              {/* Card Text Content */}
              <div className="p-3">
                <span className="text-[10px] text-slate-400 font-mono block">
                  futuremindsv2.vercel.app
                </span>
                <h6 className="text-sm font-bold text-white mt-0.5">
                  {isOptimized
                    ? 'Future Minds | Hands-On Robotics, AI & Coding Lab for Kids'
                    : 'Future Minds — Robotics, AI & Coding for School Students'}
                </h6>
                <p className="text-xs text-slate-300 mt-1 leading-snug">
                  {isOptimized
                    ? 'Practical STEM education in Electronic City, Bengaluru. Small batches (4–5 students), physical microcontrollers, Blockly to real Python & Edge AI. Free demo session available!'
                    : 'Practical technology learning for school students (Grades 1–10). Robotics, AI & Coding in small batches (4–5 students) in Ananth Nagar, Bengaluru.'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
