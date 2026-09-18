import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { 
  Bot, MessageCircle, MapPin, Sparkles, ChevronDown, 
  Menu, X, ArrowRight, CheckCircle2, Phone, Calendar, Send,
  Clock, ShieldCheck, Users, Cpu, Trophy, Star, Award, Layers,
  ExternalLink, Check, Play, BookOpen, Share2, Lock, Unlock
} from 'lucide-react';
import { FUTURE_MINDS_PHONE, getWhatsAppDirectUrl, getEnrollmentWhatsAppUrl } from './utils/whatsapp';
import { InteractiveHeroRobot } from './components/InteractiveHeroRobot';
import { InteractiveGradeCurriculum } from './components/InteractiveGradeCurriculum';
import { InteractiveProjectLab } from './components/InteractiveProjectLab';
import { WhyFutureMinds } from './components/WhyFutureMinds';
import { ScheduleAndBatches } from './components/ScheduleAndBatches';
import { ParentReviews } from './components/ParentReviews';
import { CampusLocationMap } from './components/CampusLocationMap';
import { ShareModal } from './components/ShareModal';

type PageTab = 'home' | 'about' | 'programs' | 'grades' | 'projects' | 'gallery' | 'demo' | 'contact' | 'faq';

export default function App() {
  const [activeTab, setActiveTab] = useState<PageTab>('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);

  // Owner / Admin Mode - Hides the Share button from general visitors unless unlocked
  const [isOwner, setIsOwner] = useState(false);
  const [ownerToast, setOwnerToast] = useState<string | null>(null);
  const logoClicksRef = useRef(0);
  const lastLogoClickRef = useRef(0);

  // Initialize and check Owner Mode (?admin=true, ?owner=true, or remembered in localStorage)
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const adminVal = params.get('admin') || params.get('owner') || params.get('share');
      
      if (adminVal === 'true' || adminVal === '1') {
        localStorage.setItem('fm_owner_mode', 'true');
        setIsOwner(true);
        setOwnerToast('Owner Mode Unlocked: Share button is now active.');
        const t = setTimeout(() => setOwnerToast(null), 4000);
        return () => clearTimeout(t);
      } else if (adminVal === 'false' || adminVal === '0') {
        localStorage.removeItem('fm_owner_mode');
        setIsOwner(false);
      } else {
        const saved = localStorage.getItem('fm_owner_mode');
        if (saved === 'true') {
          setIsOwner(true);
        }
      }
    } catch {
      // Fallback in restricted iframe environments
    }
  }, []);

  const handleLogoClick = () => {
    const now = Date.now();
    if (now - lastLogoClickRef.current < 1500) {
      logoClicksRef.current += 1;
    } else {
      logoClicksRef.current = 1;
    }
    lastLogoClickRef.current = now;

    // Triple click logo to toggle Owner Mode
    if (logoClicksRef.current >= 3) {
      logoClicksRef.current = 0;
      const nextState = !isOwner;
      setIsOwner(nextState);
      if (nextState) {
        try { localStorage.setItem('fm_owner_mode', 'true'); } catch {}
        setOwnerToast('Owner Mode Enabled: Share button is now visible.');
      } else {
        try { localStorage.removeItem('fm_owner_mode'); } catch {}
        setOwnerToast('Visitor Mode: Share button is hidden.');
      }
      setTimeout(() => setOwnerToast(null), 3500);
    } else {
      navigateTo('home');
    }
  };
  
  // Free Demo Form state
  const [parentName, setParentName] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [childName, setChildName] = useState('');
  const [childGrade, setChildGrade] = useState('Grade 3–4 (Ages 8–9)');
  const [interest, setInterest] = useState('Robotics & Hardware');
  const [preferredSlot, setPreferredSlot] = useState('Weekend: Saturday 10:00 AM');
  const [formSubmitted, setFormSubmitted] = useState(false);

  // FAQ accordion state
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Sync with browser hash if provided or clicked
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '') as PageTab;
      const validTabs: PageTab[] = ['home', 'about', 'programs', 'grades', 'projects', 'gallery', 'demo', 'contact', 'faq'];
      if (validTabs.includes(hash)) {
        setActiveTab(hash);
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const navigateTo = (tab: PageTab, prefillGradeOrSlot?: string) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    window.location.hash = tab;
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (prefillGradeOrSlot && tab === 'demo') {
      if (prefillGradeOrSlot.startsWith('Grade')) {
        setChildGrade(prefillGradeOrSlot);
      } else if (prefillGradeOrSlot.includes('Slot') || prefillGradeOrSlot.includes('Weekend') || prefillGradeOrSlot.includes('Weekday')) {
        setPreferredSlot(prefillGradeOrSlot);
      } else if (prefillGradeOrSlot.toLowerCase().includes('robot')) {
        setInterest('Robotics & Hardware');
      } else if (prefillGradeOrSlot.toLowerCase().includes('ai') || prefillGradeOrSlot.toLowerCase().includes('machine')) {
        setInterest('Artificial Intelligence');
      } else if (prefillGradeOrSlot.toLowerCase().includes('cod') || prefillGradeOrSlot.toLowerCase().includes('python')) {
        setInterest('Coding & Python');
      } else {
        setInterest(prefillGradeOrSlot);
      }
    }
  };

  const handleSendDemoWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    const p = parentName.trim() || 'Parent';
    const c = childName.trim() || 'Student';
    const phone = parentPhone.trim() || '';
    
    // Fire confetti celebration
    try {
      confetti({
        particleCount: 90,
        spread: 75,
        origin: { y: 0.6 }
      });
    } catch {
      // fallback safe
    }

    setFormSubmitted(true);

    const waUrl = getEnrollmentWhatsAppUrl({
      parentName: p,
      parentPhone: phone,
      studentName: c,
      studentGradeOrAge: childGrade,
      courseInterest: interest,
      preferredSlot: preferredSlot,
      preferredMode: 'ananth_nagar_lab'
    });
    
    // Synchronous opening to prevent modern browser popup blockers from suppressing the redirect
    try {
      const win = window.open(waUrl, '_blank');
      if (!win || win.closed || typeof win.closed === 'undefined') {
        window.location.assign(waUrl);
      }
    } catch {
      window.location.assign(waUrl);
    }
  };

  const handleDirectWhatsApp = (customText?: string) => {
    const text = customText || 'Hi Future Minds, I would like to inquire about Robotics, AI & Coding admissions for my child at your Ananth Nagar campus. Please share program details and demo availability.';
    const url = `https://wa.me/91${FUTURE_MINDS_PHONE}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const faqs = [
    {
      q: 'Which grades and age groups do you teach?',
      a: 'We offer structured programs for school students from Grade 1 to Grade 10 (ages 6 to 16). Children are grouped strictly into age-appropriate developmental tiers (Little Innovators: Grades 1–2, Junior Makers: Grades 3–4, Code & Engineer: Grades 5–6, Innovate & Automate: Grades 7–8, and Advanced Tech Leaders: Grades 9–10).'
    },
    {
      q: 'Why is the batch size limited to only 4–5 students?',
      a: 'Robotics and electronics require real, physical hands-on building. In typical classes with 20–30 students, only 1 or 2 kids touch the hardware while the rest watch. At Future Minds, every single child gets their own individual toolkit, sensors, and dedicated mentor attention.'
    },
    {
      q: 'Where is your physical campus located in Bengaluru?',
      a: 'Our physical STEM & Robotics Innovation Lab is located at 1121, 5th Cross, Ananth Nagar, Phase 1, Phase II, Electronic City, Hebbagodi, Karnataka 560100. It features dedicated test arenas, child-safe hardware workbenches, dual-display programming stations, and reserved parent parking.'
    },
    {
      q: 'What is included in the Free Demo Session?',
      a: 'The Free Demo is a 45-minute interactive 1-on-1 experience where your child physically assembles a working circuit, writes their first lines of code to control an obstacle rover or motor, and tests their creation in the lab. It helps parents see how their child responds before committing.'
    },
    {
      q: 'What if my child misses a weekend or weekday session?',
      a: 'Because our batches are small (4–5 students), our mentors schedule personalized makeup sessions so your child never falls behind on their capstone project progression.'
    },
    {
      q: 'Does my child need any prior programming or electronics experience?',
      a: 'No prior experience is necessary! We start with tangible physical mechanics, visual block logic, and gradually build up to typed Python and real Arduino C++ hardware engineering.'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#f7faff] text-[#10233f] font-sans antialiased selection:bg-[#1769ff] selection:text-white">
      {/* Top Notification / Admissions Ribbon */}
      <div className="bg-gradient-to-r from-[#10233f] via-[#123970] to-[#10233f] text-white py-2 px-4 text-xs font-semibold border-b border-slate-800">
        <div className="max-w-[1180px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <div className="flex items-center gap-2 justify-center">
            <span className="bg-[#1769ff] text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
              Ananth Nagar Campus
            </span>
            <span className="text-slate-200">
              📍 1121, 5th Cross, Ananth Nagar, Phase II, Electronic City, Hebbagodi • Strictly 4–5 students per batch
            </span>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <a 
              href={`tel:+91${FUTURE_MINDS_PHONE}`} 
              className="text-slate-300 hover:text-white flex items-center gap-1 font-medium transition"
            >
              <Phone className="w-3 h-3 text-emerald-400" />
              <span>+91 {FUTURE_MINDS_PHONE}</span>
            </a>
            <span className="text-slate-600">|</span>
            <button 
              onClick={() => navigateTo('demo')} 
              className="text-[#19c3d1] hover:underline font-bold flex items-center gap-1"
            >
              <span>Book Demo Class</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Sticky Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#e6edf7] shadow-sm">
        <div className="max-w-[1180px] mx-auto px-5 py-3.5 flex items-center justify-between gap-6">
          {/* Brand Logo with Generated Emblem (Triple-tap logo to toggle Owner Mode) */}
          <button 
            onClick={handleLogoClick} 
            className="flex items-center gap-3 text-left font-black text-xl tracking-tight text-[#10233f] hover:opacity-95 transition group"
            title="Future Minds Academy (Admin: Tap 3x to toggle Owner Mode)"
          >
            <img
              src="/future_minds_logo.jpg"
              alt="Future Minds Robotics & AI Academy Logo"
              referrerPolicy="no-referrer"
              className="w-11 h-11 rounded-xl object-cover shadow-[0_4px_12px_rgba(23,105,255,0.2)] border border-[#d6e5fb] group-hover:scale-105 transition-transform"
            />
            <span className="flex flex-col leading-none">
              <span className="font-extrabold tracking-tight text-lg sm:text-xl text-[#10233f]">FUTURE MINDS</span>
              <span className="text-[10px] font-bold text-[#1769ff] tracking-wider mt-0.5">ROBOTICS • AI • CODING</span>
            </span>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-bold text-[#40516c]">
            {[
              { id: 'home', label: 'Home' },
              { id: 'about', label: 'About' },
              { id: 'programs', label: 'Programs' },
              { id: 'grades', label: 'Grades 1–10' },
              { id: 'projects', label: 'Projects Lab' },
              { id: 'gallery', label: 'Campus & Lab' },
              { id: 'contact', label: 'Contact' },
              { id: 'faq', label: 'FAQ' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => navigateTo(tab.id as PageTab)}
                className={`transition py-1 relative hover:text-[#1769ff] ${
                  activeTab === tab.id ? 'text-[#1769ff]' : ''
                }`}
              >
                <span>{tab.label}</span>
                {activeTab === tab.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1769ff] rounded-full" />
                )}
              </button>
            ))}
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-2.5">
            {/* Share Interactive Website Button - Visible ONLY to the owner */}
            {isOwner && (
              <button
                onClick={() => setShareModalOpen(true)}
                className="inline-flex items-center gap-1.5 bg-[#f0f5ff] hover:bg-[#e4efff] text-[#1769ff] border border-[#d6e5fb] px-3 py-2 rounded-xl font-bold text-xs transition active:scale-95 shadow-sm"
                title="Share Interactive Website (Owner Mode)"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Share</span>
                <span className="text-[10px] bg-blue-100 text-[#1769ff] px-1 rounded font-mono hidden md:inline">Admin</span>
              </button>
            )}

            <button
              onClick={() => handleDirectWhatsApp()}
              className="hidden sm:inline-flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200/80 px-3.5 py-2 rounded-xl font-bold text-xs transition"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span>WhatsApp</span>
            </button>

            <button
              onClick={() => navigateTo('demo')}
              className="bg-[#1769ff] hover:bg-[#1258d6] text-white px-4 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm shadow-[0_4px_14px_rgba(23,105,255,0.3)] transition flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4" />
              <span>Book Free Demo</span>
            </button>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Navigation Menu"
              className="lg:hidden p-2 rounded-xl border border-[#e6edf7] bg-white text-[#10233f] hover:bg-slate-50 transition"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-[#e6edf7] px-5 py-3 shadow-xl flex flex-col animate-in fade-in slide-in-from-top-2 duration-150">
            {[
              { id: 'home', label: 'Home' },
              { id: 'about', label: 'About & Approach' },
              { id: 'programs', label: 'Programs (Robotics, AI, Coding)' },
              { id: 'grades', label: 'Programs by Grade (1–10)' },
              { id: 'projects', label: 'Interactive Projects Lab' },
              { id: 'gallery', label: 'Campus & Lab Gallery' },
              { id: 'contact', label: 'Contact & Location (Ananth Nagar)' },
              { id: 'faq', label: 'FAQ' },
              { id: 'demo', label: '✨ Book Free Demo Class' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => navigateTo(item.id as PageTab)}
                className={`text-left py-3 border-b border-[#f0f3f8] text-sm font-bold flex items-center justify-between ${
                  activeTab === item.id ? 'text-[#1769ff]' : 'text-[#40516c]'
                }`}
              >
                <span>{item.label}</span>
                <ArrowRight className="w-4 h-4 opacity-40" />
              </button>
            ))}

            {/* Share Interactive Website (Visible only in Owner Mode) */}
            {isOwner && (
              <div className="pt-3">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setShareModalOpen(true);
                  }}
                  className="w-full bg-[#f0f5ff] hover:bg-[#e4efff] text-[#1769ff] border border-[#d6e5fb] py-2.5 rounded-xl font-bold text-xs text-center flex items-center justify-center gap-1.5 transition mb-2.5"
                >
                  <Share2 className="w-4 h-4" /> Share Interactive Website (Admin)
                </button>
              </div>
            )}

            <div className="pb-2 flex gap-3">
              <a
                href={getWhatsAppDirectUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-[#25D366] text-white py-2.5 rounded-xl font-bold text-xs text-center flex items-center justify-center gap-1.5"
              >
                <MessageCircle className="w-4 h-4" /> WhatsApp Chat
              </a>
              <a
                href={`tel:+91${FUTURE_MINDS_PHONE}`}
                className="flex-1 bg-slate-900 text-white py-2.5 rounded-xl font-bold text-xs text-center flex items-center justify-center gap-1.5"
              >
                <Phone className="w-4 h-4" /> Call Lab
              </a>
            </div>
          </div>
        )}
      </header>

      {/* Main Multi-Page Container */}
      <main className="flex-1">
        {/* ======================================================== */}
        {/* PAGE 1: HOME TAB                                         */}
        {/* ======================================================== */}
        {activeTab === 'home' && (
          <div className="space-y-16 sm:space-y-20">
            {/* Hero Section with Interactive Live Rover Simulator */}
            <section className="max-w-[1180px] mx-auto px-5 pt-8 sm:pt-12">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                {/* Hero Left Column */}
                <div className="lg:col-span-6 space-y-6">
                  <div className="inline-flex items-center gap-2 bg-[#eaf2ff] text-[#1458d7] rounded-full px-3.5 py-1.5 font-black text-xs border border-blue-100">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
                    </span>
                    <span>ROBOTICS • AI • CODING FOR GRADES 1–10</span>
                  </div>
                  
                  <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[0.98] text-[#10233f]">
                    Think.<br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1769ff] to-[#19c3d1]">
                      Build.
                    </span><br />
                    Create.
                  </h1>

                  <p className="text-lg leading-relaxed text-[#61708a] max-w-[540px]">
                    Practical technology education for school students in Ananth Nagar. Kids don’t just stare at screens — they assemble circuits, program sensors, train AI models, and engineer real-world capstone projects.
                  </p>

                  {/* Key Highlights Checklist */}
                  <div className="grid grid-cols-2 gap-2 text-xs font-bold text-[#10233f]">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-[#1769ff]" />
                      <span>Strictly 4–5 Kids / Batch</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <span>1:1 Hardware Kit Ratio</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-purple-500" />
                      <span>80% Practical Building</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-amber-500" />
                      <span>Ananth Nagar Lab Campus</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3.5 flex-wrap pt-2">
                    <button
                      onClick={() => navigateTo('demo')}
                      className="bg-[#1769ff] hover:bg-[#1258d6] text-white px-6 py-4 rounded-[14px] font-extrabold text-sm shadow-[0_8px_25px_rgba(23,105,255,0.3)] transition flex items-center gap-2 hover:scale-[1.02]"
                    >
                      <span>Book a Free Demo</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => navigateTo('programs')}
                      className="bg-white hover:bg-slate-50 text-[#10233f] border border-[#e6edf7] px-5 py-4 rounded-[14px] font-extrabold text-sm shadow-sm transition"
                    >
                      Explore Programs →
                    </button>
                  </div>
                </div>

                {/* Hero Right Column: LIVE Interactive Simulator */}
                <div className="lg:col-span-6">
                  <InteractiveHeroRobot onBookDemo={() => navigateTo('demo')} />
                </div>
              </div>

              {/* Stats Ribbon */}
              <div className="mt-12 bg-white border border-[#e6edf7] rounded-2xl p-4 sm:p-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-center shadow-sm">
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-[#1769ff]">4–5</div>
                  <div className="text-xs font-bold text-[#61708a] mt-0.5">Students Per Batch</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-emerald-600">80%</div>
                  <div className="text-xs font-bold text-[#61708a] mt-0.5">Hands-on Hardware Lab</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-purple-600">Grades 1–10</div>
                  <div className="text-xs font-bold text-[#61708a] mt-0.5">Curriculum Progression</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-amber-500">1:4</div>
                  <div className="text-xs font-bold text-[#61708a] mt-0.5">Dedicated Mentor Ratio</div>
                </div>
              </div>
            </section>

            {/* Three Pillars Section */}
            <section className="max-w-[1180px] mx-auto px-5">
              <div className="text-center max-w-[720px] mx-auto mb-10">
                <span className="text-xs font-bold uppercase tracking-wider text-[#1769ff]">
                  Three Pillars of Innovation
                </span>
                <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-[#10233f] mt-1 mb-3">
                  Learning that feels like building
                </h2>
                <p className="text-[#61708a] text-base leading-relaxed">
                  Future Minds helps children understand technology by making it, wiring it, and testing it — never by rote memorization.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Pillar 1: Robotics */}
                <div className="bg-white border border-[#e6edf7] rounded-[24px] p-7 shadow-[0_8px_30px_rgba(26,62,112,0.055)] hover:shadow-md hover:border-[#1769ff]/40 transition group">
                  <div className="w-14 h-14 rounded-2xl bg-blue-50 text-3xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                    🤖
                  </div>
                  <h3 className="text-2xl font-bold text-[#10233f] mb-2">Robotics & Hardware</h3>
                  <p className="text-sm text-[#61708a] leading-relaxed mb-4">
                    Kids build real physical machines: DC gear motors, ultrasonic distance sensors, line trackers, and obstacle-avoiding chassis.
                  </p>
                  <div className="text-xs font-semibold text-[#1769ff] bg-blue-50/70 p-2.5 rounded-xl mb-4">
                    Tools: Arduino, Micro:bit, Breadboards, Servos, Chassis
                  </div>
                  <button
                    onClick={() => navigateTo('programs', 'Robotics')}
                    className="text-xs font-bold text-[#1769ff] hover:underline flex items-center gap-1"
                  >
                    View Robotics Syllabus <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Pillar 2: AI */}
                <div className="bg-white border border-[#e6edf7] rounded-[24px] p-7 shadow-[0_8px_30px_rgba(26,62,112,0.055)] hover:shadow-md hover:border-[#19c3d1]/40 transition group">
                  <div className="w-14 h-14 rounded-2xl bg-cyan-50 text-3xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                    🧠
                  </div>
                  <h3 className="text-2xl font-bold text-[#10233f] mb-2">Artificial Intelligence</h3>
                  <p className="text-sm text-[#61708a] leading-relaxed mb-4">
                    Demystify how machine learning works through computer vision, gesture tracking, voice recognition, and decision algorithms.
                  </p>
                  <div className="text-xs font-semibold text-[#19c3d1] bg-cyan-50/70 p-2.5 rounded-xl mb-4">
                    Tools: Teachable Machine, OpenCV, Python AI, Edge ML
                  </div>
                  <button
                    onClick={() => navigateTo('programs', 'Artificial Intelligence')}
                    className="text-xs font-bold text-[#1769ff] hover:underline flex items-center gap-1"
                  >
                    View AI Syllabus <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Pillar 3: Coding */}
                <div className="bg-white border border-[#e6edf7] rounded-[24px] p-7 shadow-[0_8px_30px_rgba(26,62,112,0.055)] hover:shadow-md hover:border-purple-400/40 transition group">
                  <div className="w-14 h-14 rounded-2xl bg-purple-50 text-3xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                    💻
                  </div>
                  <h3 className="text-2xl font-bold text-[#10233f] mb-2">Computational Coding</h3>
                  <p className="text-sm text-[#61708a] leading-relaxed mb-4">
                    Transition from creative visual drag-and-drop logic blocks to typed Python syntax, game architecture, and algorithmic thinking.
                  </p>
                  <div className="text-xs font-semibold text-purple-700 bg-purple-50/70 p-2.5 rounded-xl mb-4">
                    Tools: Scratch Jr, Python 3, Pygame, Visual Studio Code
                  </div>
                  <button
                    onClick={() => navigateTo('programs', 'Coding')}
                    className="text-xs font-bold text-[#1769ff] hover:underline flex items-center gap-1"
                  >
                    View Coding Syllabus <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </section>

            {/* Why Future Minds & Comparison */}
            <section className="max-w-[1180px] mx-auto px-5">
              <WhyFutureMinds onBookDemo={() => navigateTo('demo')} />
            </section>

            {/* Interactive Grade Roadmap Preview */}
            <section className="max-w-[1180px] mx-auto px-5">
              <div className="text-center max-w-[720px] mx-auto mb-10">
                <span className="text-xs font-bold uppercase tracking-wider text-[#1769ff]">
                  Grade 1 to 10 Curriculum
                </span>
                <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-[#10233f] mt-1 mb-3">
                  Tailored by Age, Grade & Ability
                </h2>
                <p className="text-[#61708a] text-base leading-relaxed">
                  Click on any grade to explore the custom hardware kit, learning milestones, and sample capstone projects.
                </p>
              </div>

              <InteractiveGradeCurriculum onSelectGradeDemo={(grade) => navigateTo('demo', grade)} />
            </section>

            {/* Parent Reviews & Social Proof */}
            <section className="max-w-[1180px] mx-auto px-5">
              <ParentReviews />
            </section>

            {/* Ananth Nagar Campus Launch CTA Banner */}
            <section className="max-w-[1180px] mx-auto px-5 pb-8">
              <div className="bg-gradient-to-r from-[#0f55d8] via-[#1268f0] to-[#13aebd] text-white rounded-[30px] p-8 sm:p-12 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 shadow-[0_20px_50px_rgba(23,105,255,0.28)] relative overflow-hidden">
                <div className="relative z-10 max-w-xl">
                  <div className="inline-flex items-center gap-1.5 bg-white/20 text-white px-3 py-1 rounded-full text-xs font-bold mb-3 backdrop-blur-sm">
                    <MapPin className="w-3.5 h-3.5" /> Physical Campus in Ananth Nagar, Bengaluru
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-3 text-white">
                    Give your child a real maker advantage.
                  </h2>
                  <p className="text-[#e2f3ff] text-base leading-relaxed">
                    Book a free 45-minute 1-on-1 trial session at our Ananth Nagar STEM Lab. Experience our 4–5 student batch approach in person.
                  </p>
                </div>

                <div className="relative z-10 flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                  <button
                    onClick={() => navigateTo('demo')}
                    className="bg-white text-[#1257d6] hover:bg-slate-100 px-6 py-4 rounded-[14px] font-extrabold text-sm shrink-0 shadow-lg transition text-center"
                  >
                    Book Free Demo Class
                  </button>
                  <button
                    onClick={() => handleDirectWhatsApp()}
                    className="bg-emerald-500 hover:bg-emerald-400 text-white px-6 py-4 rounded-[14px] font-extrabold text-sm shrink-0 shadow-lg transition flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>WhatsApp Inquiry</span>
                  </button>
                </div>
              </div>
            </section>

            {/* Campus Location & Interactive Google Map */}
            <section className="max-w-[1180px] mx-auto px-5 pb-8">
              <CampusLocationMap />
            </section>
          </div>
        )}

        {/* ======================================================== */}
        {/* PAGE 2: ABOUT TAB                                        */}
        {/* ======================================================== */}
        {activeTab === 'about' && (
          <div className="space-y-16">
            <div className="py-16 px-5 bg-gradient-to-b from-[#edf5ff] to-transparent text-center border-b border-[#e6edf7]">
              <div className="inline-flex items-center gap-2 bg-[#eaf2ff] text-[#1458d7] rounded-full px-3.5 py-1 font-bold text-xs mb-3">
                <span>🏫 Ananth Nagar STEM Academy</span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-[#10233f] mb-4">
                About Future Minds
              </h1>
              <p className="text-[#61708a] text-base max-w-[700px] mx-auto leading-relaxed">
                We are building a practical, hands-on technology learning environment where school students discover robotics, AI, and coding through curiosity, tangible experimentation, and creative joy.
              </p>
            </div>

            {/* Approach Cards */}
            <section className="max-w-[1180px] mx-auto px-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white border border-[#e6edf7] rounded-[22px] p-7 shadow-[0_8px_30px_rgba(26,62,112,0.055)]">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#1769ff] flex items-center justify-center font-black text-lg mb-4">
                    01
                  </div>
                  <h3 className="text-xl font-bold text-[#10233f] mb-2">Active Maker Approach</h3>
                  <p className="text-sm text-[#61708a] leading-relaxed">
                    Learn the concept → wire the circuit → write the code → test it → embrace bugs → improve it. This keeps learning deeply memorable and confidence-building.
                  </p>
                </div>

                <div className="bg-white border border-[#e6edf7] rounded-[22px] p-7 shadow-[0_8px_30px_rgba(26,62,112,0.055)]">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black text-lg mb-4">
                    02
                  </div>
                  <h3 className="text-xl font-bold text-[#10233f] mb-2">Micro-Batches (4–5 Kids)</h3>
                  <p className="text-sm text-[#61708a] leading-relaxed">
                    With only 4–5 students per mentor, nobody gets lost in the crowd. Every child has their own physical hardware station and gets immediate help when debugging.
                  </p>
                </div>

                <div className="bg-white border border-[#e6edf7] rounded-[22px] p-7 shadow-[0_8px_30px_rgba(26,62,112,0.055)]">
                  <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-black text-lg mb-4">
                    03
                  </div>
                  <h3 className="text-xl font-bold text-[#10233f] mb-2">Structured Grades 1–10</h3>
                  <p className="text-sm text-[#61708a] leading-relaxed">
                    Curriculum is calibrated for every developmental milestone — from early motor circuits for Grade 1 up to neural vision models and IoT telemetry for Grade 10.
                  </p>
                </div>
              </div>
            </section>

            {/* Why Future Minds Matrix */}
            <section className="max-w-[1180px] mx-auto px-5">
              <WhyFutureMinds onBookDemo={() => navigateTo('demo')} />
            </section>

            {/* Schedules and Batches */}
            <section className="max-w-[1180px] mx-auto px-5">
              <ScheduleAndBatches onBookSlot={(slot) => navigateTo('demo', slot)} />
            </section>
          </div>
        )}

        {/* ======================================================== */}
        {/* PAGE 3: PROGRAMS TAB                                     */}
        {/* ======================================================== */}
        {activeTab === 'programs' && (
          <div className="space-y-16">
            <div className="py-16 px-5 bg-gradient-to-b from-[#edf5ff] to-transparent text-center border-b border-[#e6edf7]">
              <div className="inline-flex items-center gap-2 bg-[#eaf2ff] text-[#1458d7] rounded-full px-3.5 py-1 font-bold text-xs mb-3">
                <span>📚 Complete STEM Tracks</span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-[#10233f] mb-3">
                Our Programs & Curriculum
              </h1>
              <p className="text-[#61708a] text-base max-w-[680px] mx-auto leading-relaxed">
                Three comprehensive technical learning tracks designed to cultivate genuine logic, hardware mastery, and computational confidence.
              </p>
            </div>

            {/* Detailed Programs Grid */}
            <section className="max-w-[1180px] mx-auto px-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Track 1 */}
                <div className="bg-white border border-[#e6edf7] rounded-[28px] p-7 shadow-[0_15px_40px_rgba(24,57,105,0.08)] flex flex-col justify-between hover:border-[#1769ff]/50 transition">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-4xl">🤖</span>
                      <span className="text-xs font-bold bg-blue-50 text-[#1769ff] px-3 py-1 rounded-full">
                        Ages 6–16
                      </span>
                    </div>
                    <h3 className="text-2xl font-black text-[#10233f] mb-2">Robotics & IoT Track</h3>
                    <p className="text-xs text-[#61708a] leading-relaxed mb-4">
                      From building fundamental DC motor circuits to programming autonomous rovers, smart sensor arrays, and IoT wireless systems.
                    </p>

                    <div className="space-y-2 text-xs font-medium text-[#40516c] mb-6">
                      <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Breadboards, resistors, LEDs & buzzers</div>
                      <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Ultrasonic sonar & Infrared line tracking</div>
                      <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Dual-motor H-Bridge driver speed control</div>
                      <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> ESP32 Wi-Fi & Bluetooth telemetry</div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100">
                    <button
                      onClick={() => navigateTo('demo', 'Robotics')}
                      className="w-full bg-[#1769ff] hover:bg-[#1258d6] text-white py-3 rounded-xl font-bold text-xs shadow-sm transition flex items-center justify-center gap-2"
                    >
                      <span>Enroll in Robotics Track</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Track 2 */}
                <div className="bg-white border border-[#e6edf7] rounded-[28px] p-7 shadow-[0_15px_40px_rgba(24,57,105,0.08)] flex flex-col justify-between hover:border-[#19c3d1]/50 transition">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-4xl">🧠</span>
                      <span className="text-xs font-bold bg-cyan-50 text-[#19c3d1] px-3 py-1 rounded-full">
                        Ages 8–16
                      </span>
                    </div>
                    <h3 className="text-2xl font-black text-[#10233f] mb-2">AI & Machine Learning</h3>
                    <p className="text-xs text-[#61708a] leading-relaxed mb-4">
                      Understand how artificial intelligence makes decisions. Train custom image classifiers, gesture detectors, and voice recognition algorithms.
                    </p>

                    <div className="space-y-2 text-xs font-medium text-[#40516c] mb-6">
                      <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Image recognition & feature extraction</div>
                      <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Computer vision with webcam video feeds</div>
                      <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Training sets, testing accuracy & bias</div>
                      <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Edge AI models on microcontrollers</div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100">
                    <button
                      onClick={() => navigateTo('demo', 'Artificial Intelligence')}
                      className="w-full bg-[#19c3d1] hover:bg-[#15afbd] text-white py-3 rounded-xl font-bold text-xs shadow-sm transition flex items-center justify-center gap-2"
                    >
                      <span>Enroll in AI Track</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Track 3 */}
                <div className="bg-white border border-[#e6edf7] rounded-[28px] p-7 shadow-[0_15px_40px_rgba(24,57,105,0.08)] flex flex-col justify-between hover:border-purple-400/50 transition">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-4xl">💻</span>
                      <span className="text-xs font-bold bg-purple-50 text-purple-700 px-3 py-1 rounded-full">
                        Ages 6–16
                      </span>
                    </div>
                    <h3 className="text-2xl font-black text-[#10233f] mb-2">Coding & Python Track</h3>
                    <p className="text-xs text-[#61708a] leading-relaxed mb-4">
                      Master foundational computational logic, sequence structures, algorithms, real typed Python 3 syntax, and 2D Pygame game design.
                    </p>

                    <div className="space-y-2 text-xs font-medium text-[#40516c] mb-6">
                      <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Algorithmic logic & sequencing</div>
                      <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Variables, loops, conditions & functions</div>
                      <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> 2D Game loops and physics coordinates</div>
                      <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Real Python scripts & debugging habits</div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100">
                    <button
                      onClick={() => navigateTo('demo', 'Coding')}
                      className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-xl font-bold text-xs shadow-sm transition flex items-center justify-center gap-2"
                    >
                      <span>Enroll in Coding Track</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Curriculum by Grade Component */}
            <section className="max-w-[1180px] mx-auto px-5">
              <InteractiveGradeCurriculum onSelectGradeDemo={(g) => navigateTo('demo', g)} />
            </section>
          </div>
        )}

        {/* ======================================================== */}
        {/* PAGE 4: GRADES TAB                                       */}
        {/* ======================================================== */}
        {activeTab === 'grades' && (
          <div className="space-y-16">
            <div className="py-16 px-5 bg-gradient-to-b from-[#edf5ff] to-transparent text-center border-b border-[#e6edf7]">
              <div className="inline-flex items-center gap-2 bg-[#eaf2ff] text-[#1458d7] rounded-full px-3.5 py-1 font-bold text-xs mb-3">
                <span>🎯 Grade-by-Grade Progression</span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-[#10233f] mb-3">
                Programs by Grade (1 to 10)
              </h1>
              <p className="text-[#61708a] text-base max-w-[680px] mx-auto leading-relaxed">
                A structured roadmap taking kids from tactile playful curiosity in Grade 1 to building independent AI models and autonomous rovers in Grade 10.
              </p>
            </div>

            <section className="max-w-[1180px] mx-auto px-5">
              <InteractiveGradeCurriculum onSelectGradeDemo={(g) => navigateTo('demo', g)} />
            </section>

            <section className="max-w-[1180px] mx-auto px-5">
              <ScheduleAndBatches onBookSlot={(s) => navigateTo('demo', s)} />
            </section>
          </div>
        )}

        {/* ======================================================== */}
        {/* PAGE 5: PROJECTS TAB                                     */}
        {/* ======================================================== */}
        {activeTab === 'projects' && (
          <div className="space-y-16">
            <div className="py-16 px-5 bg-gradient-to-b from-[#edf5ff] to-transparent text-center border-b border-[#e6edf7]">
              <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-800 rounded-full px-3.5 py-1 font-bold text-xs mb-3">
                <span>🛠️ Hands-on Capstones</span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-[#10233f] mb-3">
                Interactive Student Projects Lab
              </h1>
              <p className="text-[#61708a] text-base max-w-[680px] mx-auto leading-relaxed">
                The objective is not merely completing a class — it is building real, working creations that children can proudly present to their peers, teachers, and family.
              </p>
            </div>

            {/* Interactive Project Simulator */}
            <section className="max-w-[1180px] mx-auto px-5">
              <InteractiveProjectLab onBookDemo={(p) => navigateTo('demo', p)} />
            </section>

            {/* Additional Project Cards Showcase */}
            <section className="max-w-[1180px] mx-auto px-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white border border-[#e6edf7] rounded-2xl p-6 shadow-sm">
                  <div className="text-4xl mb-3">🚗</div>
                  <h4 className="text-lg font-bold text-[#10233f] mb-1">Autonomous Obstacle Rover</h4>
                  <p className="text-xs text-[#61708a] leading-relaxed mb-3">
                    Equipped with ultrasonic sensors that measure echo reflections to detect walls and navigate mazes automatically.
                  </p>
                  <span className="text-[10px] font-bold bg-blue-50 text-[#1769ff] px-2 py-0.5 rounded-full">
                    Grades 3–6 • Arduino C++
                  </span>
                </div>

                <div className="bg-white border border-[#e6edf7] rounded-2xl p-6 shadow-sm">
                  <div className="text-4xl mb-3">🌱</div>
                  <h4 className="text-lg font-bold text-[#10233f] mb-1">Smart IoT Greenhouse</h4>
                  <p className="text-xs text-[#61708a] leading-relaxed mb-3">
                    Soil moisture probes monitor dryness and command a miniature water pump relay to keep plants watered automatically.
                  </p>
                  <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full">
                    Grades 5–8 • Micro:bit & Sensors
                  </span>
                </div>

                <div className="bg-white border border-[#e6edf7] rounded-2xl p-6 shadow-sm">
                  <div className="text-4xl mb-3">🦾</div>
                  <h4 className="text-lg font-bold text-[#10233f] mb-1">Vision-Guided Robotic Arm</h4>
                  <p className="text-xs text-[#61708a] leading-relaxed mb-3">
                    A webcam detects colored objects on a testing track and commands multi-servo claws to sort items into boxes.
                  </p>
                  <span className="text-[10px] font-bold bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full">
                    Grades 8–10 • Python & OpenCV
                  </span>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ======================================================== */}
        {/* PAGE 6: GALLERY TAB                                      */}
        {/* ======================================================== */}
        {activeTab === 'gallery' && (
          <div className="space-y-16">
            <div className="py-16 px-5 bg-gradient-to-b from-[#edf5ff] to-transparent text-center border-b border-[#e6edf7]">
              <div className="inline-flex items-center gap-2 bg-[#eaf2ff] text-[#1458d7] rounded-full px-3.5 py-1 font-bold text-xs mb-3">
                <span>📍 Ananth Nagar Lab Campus</span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-[#10233f] mb-3">
                Campus & Innovation Lab
              </h1>
              <p className="text-[#61708a] text-base max-w-[680px] mx-auto leading-relaxed">
                Take a peek at our dedicated STEM learning workstations, robotics test tracks, and child-safe hardware environments.
              </p>
            </div>

            <section className="max-w-[1180px] mx-auto px-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Station 1 */}
                <div className="bg-white border border-[#e6edf7] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition">
                  <div className="h-48 bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-7xl">
                    🔬
                  </div>
                  <div className="p-6">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#1769ff] bg-blue-50 px-2 py-0.5 rounded-full">
                      Hardware Workstation
                    </span>
                    <h3 className="text-xl font-bold text-[#10233f] mt-2 mb-1">Electronics & Sensor Benches</h3>
                    <p className="text-xs text-[#61708a] leading-relaxed">
                      Equipped with solderless breadboards, individual power regulators, digital multimeters, and component organizers.
                    </p>
                  </div>
                </div>

                {/* Station 2 */}
                <div className="bg-white border border-[#e6edf7] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition">
                  <div className="h-48 bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center text-7xl">
                    🏁
                  </div>
                  <div className="p-6">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                      Robot Testing Arena
                    </span>
                    <h3 className="text-xl font-bold text-[#10233f] mt-2 mb-1">Racetrack & Obstacle Arena</h3>
                    <p className="text-xs text-[#61708a] leading-relaxed">
                      Custom flat testing surface with black-line curves, maze wooden boundaries, and ramp bridges for vehicle trials.
                    </p>
                  </div>
                </div>

                {/* Station 3 */}
                <div className="bg-white border border-[#e6edf7] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition">
                  <div className="h-48 bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center text-7xl">
                    🖥️
                  </div>
                  <div className="p-6">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full">
                      Coding & AI Pods
                    </span>
                    <h3 className="text-xl font-bold text-[#10233f] mt-2 mb-1">Dual-Display Code Stations</h3>
                    <p className="text-xs text-[#61708a] leading-relaxed">
                      Ergonomic seating with dual monitors so children can see interactive code documentation side-by-side with their projects.
                    </p>
                  </div>
                </div>
              </div>

              {/* Lab Visit Notice */}
              <div className="mt-8 p-6 bg-white border border-[#e6edf7] rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
                <div>
                  <h4 className="text-lg font-bold text-[#10233f]">Want to visit our physical lab in Ananth Nagar?</h4>
                  <p className="text-xs text-[#61708a] mt-0.5">Parents are warmly welcomed for a guided tour and interactive walkthrough.</p>
                </div>
                <button
                  onClick={() => navigateTo('demo')}
                  className="bg-[#1769ff] text-white px-5 py-2.5 rounded-xl font-bold text-xs hover:bg-[#1258d6] transition shrink-0"
                >
                  Schedule a Lab Tour
                </button>
              </div>
            </section>
          </div>
        )}

        {/* ======================================================== */}
        {/* PAGE 7: DEMO TAB (FREE DEMO BOOKING)                     */}
        {/* ======================================================== */}
        {activeTab === 'demo' && (
          <div className="space-y-12">
            <div className="py-16 px-5 bg-gradient-to-b from-[#edf5ff] to-transparent text-center border-b border-[#e6edf7]">
              <div className="inline-flex items-center gap-2 bg-[#eaf2ff] text-[#1458d7] rounded-full px-3.5 py-1 font-bold text-xs mb-3">
                <span>🎁 100% Free · No Commitment</span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-[#10233f] mb-3">
                Book a Free 1-on-1 Demo Session
              </h1>
              <p className="text-[#61708a] text-base max-w-[680px] mx-auto leading-relaxed">
                Give your child a chance to build a working robot, code a game, or train an AI model before joining. Hosted at our Ananth Nagar Lab.
              </p>
            </div>

            <section className="max-w-[720px] mx-auto px-5 pb-12">
              <div className="bg-white border border-[#e6edf7] rounded-[28px] p-6 sm:p-9 shadow-[0_18px_50px_rgba(24,57,105,0.1)]">
                {formSubmitted ? (
                  <div className="text-center py-6 space-y-5">
                    <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-3xl mx-auto shadow-inner">
                      🎉
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-[#10233f]">
                        Thank You, {parentName || 'Parent'}!
                      </h3>
                      <p className="text-sm text-[#61708a] max-w-md mx-auto leading-relaxed mt-1">
                        Your complete inquiry for <strong>{childName || 'Student'}</strong> ({childGrade}) has been generated for our Ananth Nagar counseling mentor.
                      </p>
                    </div>

                    {/* Summary of sent details */}
                    <div className="bg-[#f7faff] border border-[#d6e5fb] rounded-2xl p-5 max-w-md mx-auto text-left text-xs text-[#40516c] space-y-2">
                      <div className="font-bold text-[#10233f] text-sm border-b border-[#e2eaf5] pb-2 flex items-center justify-between">
                        <span>📋 Inquiry Summary</span>
                        <span className="text-[11px] font-normal text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">Ready on WhatsApp</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <div>
                          <span className="text-[#8494ab] block text-[10px] uppercase font-bold">Parent Name</span>
                          <span className="font-bold text-[#10233f]">{parentName || 'Parent'}</span>
                        </div>
                        <div>
                          <span className="text-[#8494ab] block text-[10px] uppercase font-bold">Phone Number</span>
                          <span className="font-bold text-[#10233f]">{parentPhone || 'Not provided'}</span>
                        </div>
                        <div>
                          <span className="text-[#8494ab] block text-[10px] uppercase font-bold">Student Name</span>
                          <span className="font-bold text-[#10233f]">{childName || 'Student'}</span>
                        </div>
                        <div>
                          <span className="text-[#8494ab] block text-[10px] uppercase font-bold">Grade Level</span>
                          <span className="font-bold text-[#10233f]">{childGrade}</span>
                        </div>
                        <div className="col-span-2">
                          <span className="text-[#8494ab] block text-[10px] uppercase font-bold">Program Track</span>
                          <span className="font-bold text-[#1769ff]">{interest}</span>
                        </div>
                        <div className="col-span-2">
                          <span className="text-[#8494ab] block text-[10px] uppercase font-bold">Preferred Slot</span>
                          <span className="font-semibold text-[#10233f]">{preferredSlot}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-1">
                      <a
                        href={getEnrollmentWhatsAppUrl({
                          parentName: parentName || 'Parent',
                          parentPhone: parentPhone,
                          studentName: childName || 'Student',
                          studentGradeOrAge: childGrade,
                          courseInterest: interest,
                          preferredSlot: preferredSlot,
                          preferredMode: 'ananth_nagar_lab'
                        })}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white px-7 py-3.5 rounded-xl font-extrabold text-sm shadow-lg shadow-emerald-500/25 transition hover:scale-[1.02]"
                      >
                        <MessageCircle className="w-5 h-5 fill-white text-emerald-600" />
                        <span>Open WhatsApp with All Details (+91 {FUTURE_MINDS_PHONE})</span>
                      </a>
                    </div>

                    <div>
                      <button
                        onClick={() => setFormSubmitted(false)}
                        className="text-xs text-[#61708a] underline hover:text-[#10233f] transition font-semibold"
                      >
                        ← Edit details or submit another inquiry
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSendDemoWhatsApp} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-[#10233f] mb-1.5">
                          Parent Name <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Ramesh Varma"
                          value={parentName}
                          onChange={(e) => setParentName(e.target.value)}
                          className="w-full px-4 py-3 border border-[#e6edf7] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1769ff] bg-[#f7faff]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#10233f] mb-1.5">
                          Phone / WhatsApp Number <span className="text-[#8494ab] font-normal">(optional)</span>
                        </label>
                        <input
                          type="tel"
                          placeholder="e.g. 9876543210"
                          value={parentPhone}
                          onChange={(e) => setParentPhone(e.target.value)}
                          className="w-full px-4 py-3 border border-[#e6edf7] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1769ff] bg-[#f7faff]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-[#10233f] mb-1.5">
                          Student Name <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Aarav"
                          value={childName}
                          onChange={(e) => setChildName(e.target.value)}
                          className="w-full px-4 py-3 border border-[#e6edf7] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1769ff] bg-[#f7faff]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#10233f] mb-1.5">
                          Child&apos;s Grade Level <span className="text-rose-500">*</span>
                        </label>
                        <select
                          value={childGrade}
                          onChange={(e) => setChildGrade(e.target.value)}
                          className="w-full px-4 py-3 border border-[#e6edf7] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1769ff] bg-[#f7faff] font-medium"
                        >
                          <option>Grade 1–2 (Ages 6–7)</option>
                          <option>Grade 3–4 (Ages 8–9)</option>
                          <option>Grade 5–6 (Ages 10–11)</option>
                          <option>Grade 7–8 (Ages 12–13)</option>
                          <option>Grade 9–10 (Ages 14–16)</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-[#10233f] mb-1.5">
                          Primary Area of Interest
                        </label>
                        <select
                          value={interest}
                          onChange={(e) => setInterest(e.target.value)}
                          className="w-full px-4 py-3 border border-[#e6edf7] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1769ff] bg-[#f7faff] font-medium"
                        >
                          <option>Robotics & Hardware</option>
                          <option>Artificial Intelligence</option>
                          <option>Coding & Python</option>
                          <option>All-in-One STEM (Robotics + AI + Code)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#10233f] mb-1.5">
                          Preferred Batch Timing
                        </label>
                        <select
                          value={preferredSlot}
                          onChange={(e) => setPreferredSlot(e.target.value)}
                          className="w-full px-4 py-3 border border-[#e6edf7] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1769ff] bg-[#f7faff] font-medium"
                        >
                          <option>Weekend: Saturday 10:00 AM</option>
                          <option>Weekend: Saturday 02:00 PM</option>
                          <option>Weekend: Sunday 10:00 AM</option>
                          <option>Weekend: Sunday 02:00 PM</option>
                          <option>Weekday: Tue/Thu 04:45 PM</option>
                          <option>Online 1-on-1 Interactive</option>
                        </select>
                      </div>
                    </div>

                    {/* Live WhatsApp Message Preview */}
                    <div className="bg-[#f0f6ff] border border-[#cde0fd] rounded-2xl p-4 text-xs text-[#40516c]">
                      <div className="font-bold text-[#10233f] mb-2 flex items-center gap-1.5">
                        <MessageCircle className="w-4 h-4 text-emerald-600" />
                        <span>Message Preview Sent to WhatsApp Counselor (+91 {FUTURE_MINDS_PHONE}):</span>
                      </div>
                      <div className="font-mono text-[11px] text-[#243750] bg-white p-3 rounded-xl border border-[#d3e3fa] space-y-1 leading-relaxed">
                        <div className="font-bold text-[#1769ff]">🚀 *FUTURE MINDS — NEW ENROLLMENT & DEMO ENQUIRY*</div>
                        <div>👤 *Parent:* {parentName.trim() || '...'} {parentPhone.trim() ? `• 📞 ${parentPhone.trim()}` : ''}</div>
                        <div>👦 *Student:* {childName.trim() || '...'} • 🎓 *Grade:* {childGrade}</div>
                        <div>🔬 *Track:* {interest} • ⏰ *Slot:* {preferredSlot}</div>
                        <div>📍 *Campus:* Ananth Nagar STEM Lab (1121, 5th Cross, Phase II)</div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-[#1769ff] hover:bg-[#1258d6] text-white py-4 rounded-xl font-extrabold text-sm flex items-center justify-center gap-2 shadow-[0_8px_25px_rgba(23,105,255,0.25)] transition hover:scale-[1.01]"
                    >
                      <Send className="w-4 h-4" />
                      <span>Confirm & Send Complete Inquiry on WhatsApp</span>
                    </button>

                    <div className="text-center pt-1">
                      <p className="text-xs text-[#61708a] leading-relaxed">
                        🔒 No payment required. Submitting directly opens WhatsApp to our counselor at <span className="font-bold text-emerald-600">+91 {FUTURE_MINDS_PHONE}</span> with all your pre-filled details.
                      </p>
                    </div>
                  </form>
                )}
              </div>
            </section>
          </div>
        )}

        {/* ======================================================== */}
        {/* PAGE 8: CONTACT TAB                                      */}
        {/* ======================================================== */}
        {activeTab === 'contact' && (
          <div className="space-y-16">
            <div className="py-16 px-5 bg-gradient-to-b from-[#edf5ff] to-transparent text-center border-b border-[#e6edf7]">
              <div className="inline-flex items-center gap-2 bg-[#eaf2ff] text-[#1458d7] rounded-full px-3.5 py-1 font-bold text-xs mb-3">
                <span>📍 Get in Touch & Visit Lab</span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-[#10233f] mb-3">
                Contact & Campus Location
              </h1>
              <p className="text-[#61708a] text-base max-w-[680px] mx-auto leading-relaxed">
                Located at 1121, 5th Cross, Ananth Nagar, Phase II, Electronic City, Hebbagodi, Bengaluru. We welcome parents to visit, tour our workstations, and consult with academic mentors.
              </p>
            </div>

            {/* Google Map & Interactive Campus Location */}
            <section className="max-w-[1180px] mx-auto px-5">
              <CampusLocationMap />
            </section>

            <section className="max-w-[1180px] mx-auto px-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Location */}
                <div className="bg-white border border-[#e6edf7] rounded-[22px] p-7 shadow-[0_8px_30px_rgba(26,62,112,0.055)] flex flex-col justify-between">
                  <div>
                    <div className="text-4xl mb-3">📍</div>
                    <h3 className="text-xl font-bold text-[#10233f] mb-2">Campus Location</h3>
                    <p className="text-xs text-[#61708a] leading-relaxed mb-4">
                      1121, 5th Cross, Ananth Nagar, Phase 1, Phase II, Electronic City, Hebbagodi, Karnataka 560100
                    </p>
                  </div>
                  <div className="text-xs text-slate-500 bg-slate-50 p-3 rounded-xl">
                    Landmark: Electronic City Phase 1 & 2 corridor / Hebbagodi
                  </div>
                </div>

                {/* WhatsApp & Call */}
                <div className="bg-white border border-[#e6edf7] rounded-[22px] p-7 shadow-[0_8px_30px_rgba(26,62,112,0.055)] flex flex-col justify-between">
                  <div>
                    <div className="text-4xl mb-3">📱</div>
                    <h3 className="text-xl font-bold text-[#10233f] mb-2">Direct WhatsApp & Phone</h3>
                    <p className="text-sm font-black text-[#10233f] mb-1">
                      +91 96182 83987
                    </p>
                    <p className="text-xs text-[#61708a] mb-4">
                      Open Monday to Sunday (9:00 AM – 7:30 PM) for parent inquiries.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDirectWhatsApp()}
                      className="flex-1 bg-[#25D366] hover:bg-[#20ba59] text-white py-2.5 rounded-xl font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <MessageCircle className="w-4 h-4" /> WhatsApp
                    </button>
                    <a
                      href={`tel:+91${FUTURE_MINDS_PHONE}`}
                      className="flex-1 bg-slate-900 hover:bg-slate-800 text-white py-2.5 rounded-xl font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <Phone className="w-4 h-4" /> Call Lab
                    </a>
                  </div>
                </div>

                {/* Batch Standards */}
                <div className="bg-white border border-[#e6edf7] rounded-[22px] p-7 shadow-[0_8px_30px_rgba(26,62,112,0.055)] flex flex-col justify-between">
                  <div>
                    <div className="text-4xl mb-3">🎓</div>
                    <h3 className="text-xl font-bold text-[#10233f] mb-2">Batch Standards</h3>
                    <p className="text-xs text-[#61708a] leading-relaxed mb-4">
                      Small batches strictly capped at 4–5 students per slot. Weekend clubs & weekday after-school options available.
                    </p>
                  </div>
                  <button
                    onClick={() => navigateTo('demo')}
                    className="w-full bg-[#1769ff] hover:bg-[#1258d6] text-white py-2.5 rounded-xl font-bold text-xs transition shadow-sm"
                  >
                    Reserve Batch Seat
                  </button>
                </div>
              </div>
            </section>

            {/* Schedule Section */}
            <section className="max-w-[1180px] mx-auto px-5">
              <ScheduleAndBatches onBookSlot={(s) => navigateTo('demo', s)} />
            </section>
          </div>
        )}

        {/* ======================================================== */}
        {/* PAGE 9: FAQ TAB                                          */}
        {/* ======================================================== */}
        {activeTab === 'faq' && (
          <div className="space-y-12">
            <div className="py-16 px-5 bg-gradient-to-b from-[#edf5ff] to-transparent text-center border-b border-[#e6edf7]">
              <div className="inline-flex items-center gap-2 bg-[#eaf2ff] text-[#1458d7] rounded-full px-3.5 py-1 font-bold text-xs mb-3">
                <span>❓ Common Questions</span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-[#10233f] mb-3">
                Frequently Asked Questions
              </h1>
              <p className="text-[#61708a] text-base max-w-[680px] mx-auto leading-relaxed">
                Everything you need to know about our student batches, hardware equipment, curriculum, and trial sessions.
              </p>
            </div>

            <section className="max-w-[820px] mx-auto px-5 pb-16">
              <div className="bg-white border border-[#e6edf7] rounded-[24px] p-6 sm:p-8 shadow-sm divide-y divide-[#e6edf7]">
                {faqs.map((f, idx) => (
                  <div key={idx} className="py-5 first:pt-0 last:pb-0">
                    <button
                      onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                      className="w-full text-left flex items-center justify-between gap-4 font-bold text-[#10233f] hover:text-[#1769ff] transition"
                    >
                      <span className="text-base sm:text-lg">{f.q}</span>
                      <span className="text-xl font-bold text-[#1769ff] shrink-0">
                        {openFaq === idx ? '−' : '＋'}
                      </span>
                    </button>
                    {openFaq === idx && (
                      <div className="pt-3 text-xs sm:text-sm text-[#61708a] leading-relaxed animate-in fade-in duration-200">
                        {f.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Still have questions */}
              <div className="mt-8 text-center bg-[#f7faff] border border-[#e6edf7] rounded-2xl p-6">
                <h4 className="font-bold text-sm text-[#10233f] mb-1">Still have questions for our mentors?</h4>
                <p className="text-xs text-[#61708a] mb-4">Feel free to chat with our academic team on WhatsApp anytime.</p>
                <button
                  onClick={() => handleDirectWhatsApp('Hi Future Minds, I have a quick question regarding the programs.')}
                  className="bg-[#25D366] hover:bg-[#20ba59] text-white px-5 py-2.5 rounded-xl font-bold text-xs transition inline-flex items-center gap-2 shadow-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Ask on WhatsApp (+91 {FUTURE_MINDS_PHONE})</span>
                </button>
              </div>
            </section>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-[#0d1d34] text-[#d7e3f5] py-14 px-5 border-t border-slate-800">
        <div className="max-w-[1180px] mx-auto space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
            {/* Brand column */}
            <div className="lg:col-span-4 space-y-3">
              <div className="flex items-center gap-3 font-black text-xl tracking-tight text-white">
                <img
                  src="/future_minds_logo.jpg"
                  alt="Future Minds Logo"
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 rounded-xl object-cover shadow-md border border-slate-700"
                />
                <div>
                  <div className="text-lg font-black text-white leading-none">FUTURE MINDS</div>
                  <div className="text-[10px] font-bold text-[#19c3d1] tracking-wider uppercase mt-1">Robotics • AI • Coding</div>
                </div>
              </div>
              <p className="text-xs text-[#91a4bd] leading-relaxed max-w-sm">
                Next-generation Robotics, AI & Coding academy for school students (Grades 1–10). Nurturing creators, thinkers, and engineers with strictly small batches of 4–5 kids.
              </p>
              <div className="text-xs text-emerald-400 font-semibold flex items-start gap-1.5 pt-1">
                <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
                <a
                  href="https://maps.google.com/?q=1121,+5th+Cross,+Ananth+Nagar,+Electronic+City,+Hebbagodi,+Karnataka+560100"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline text-emerald-300"
                >
                  1121, 5th Cross, Ananth Nagar, Phase 1, Phase II, Electronic City, Hebbagodi, Karnataka 560100
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="lg:col-span-4 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Navigation</h4>
              <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-slate-300">
                <button onClick={() => navigateTo('home')} className="text-left hover:text-white transition">Home</button>
                <button onClick={() => navigateTo('about')} className="text-left hover:text-white transition">About Approach</button>
                <button onClick={() => navigateTo('programs')} className="text-left hover:text-white transition">All Programs</button>
                <button onClick={() => navigateTo('grades')} className="text-left hover:text-white transition">Grades 1–10</button>
                <button onClick={() => navigateTo('projects')} className="text-left hover:text-white transition">Projects Lab</button>
                <button onClick={() => navigateTo('gallery')} className="text-left hover:text-white transition">Campus Gallery</button>
                <button onClick={() => navigateTo('contact')} className="text-left hover:text-white transition">Contact Us</button>
                <button onClick={() => navigateTo('faq')} className="text-left hover:text-white transition">FAQs</button>
              </div>
            </div>

            {/* Contact & Demo CTA */}
            <div className="lg:col-span-4 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Ananth Nagar Admissions</h4>
              <p className="text-xs text-[#91a4bd]">
                WhatsApp:{' '}
                <a
                  href={getWhatsAppDirectUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:underline font-bold"
                >
                  +91 {FUTURE_MINDS_PHONE}
                </a>
              </p>
              <p className="text-xs text-[#91a4bd]">
                Email: admissions@futureminds.academy
              </p>

              <div className="pt-2">
                <button
                  onClick={() => navigateTo('demo')}
                  className="bg-[#1769ff] hover:bg-[#1258d6] text-white px-4 py-2.5 rounded-xl font-bold text-xs transition shadow-sm flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Book a Free Demo Session
                </button>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <div>
              © {new Date().getFullYear()} Future Minds. All rights reserved. 1121, 5th Cross, Ananth Nagar, Phase 1, Phase II, Electronic City, Hebbagodi, Karnataka 560100.
            </div>
            <div className="flex items-center gap-3">
              <span>Ages 6–16 STEM</span>
              <span>•</span>
              <span>Small 4–5 Batches</span>
              <span>•</span>
              <button
                onClick={() => {
                  const nextState = !isOwner;
                  setIsOwner(nextState);
                  if (nextState) {
                    try { localStorage.setItem('fm_owner_mode', 'true'); } catch {}
                    setOwnerToast('Owner Mode Enabled: Share button is now visible.');
                  } else {
                    try { localStorage.removeItem('fm_owner_mode'); } catch {}
                    setOwnerToast('Visitor Mode: Share button is hidden.');
                  }
                  setTimeout(() => setOwnerToast(null), 3000);
                }}
                className="text-slate-600 hover:text-slate-400 transition flex items-center gap-1.5 cursor-pointer select-none"
                title={isOwner ? "Owner Mode Active (Click to switch to Visitor view)" : "Admin access (Click or add ?admin=true)"}
              >
                {isOwner ? (
                  <>
                    <Unlock className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-semibold">Owner Mode</span>
                  </>
                ) : (
                  <Lock className="w-3 h-3 text-slate-700 hover:text-slate-500" />
                )}
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Owner Mode Notification Toast */}
      {ownerToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#10233f] text-white px-5 py-3 rounded-2xl text-xs font-bold shadow-2xl border border-slate-700 flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>{ownerToast}</span>
        </div>
      )}

      {/* Interactive Website Share Modal */}
      <ShareModal 
        isOpen={shareModalOpen} 
        onClose={() => setShareModalOpen(false)} 
      />
    </div>
  );
}
