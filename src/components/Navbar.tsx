import React, { useState } from 'react';
import { 
  Bot, MapPin, Phone, MessageCircle, Menu, X, 
  Sparkles, Award, Brain, BarChart3, ChevronRight 
} from 'lucide-react';
import { FUTURE_MINDS_PHONE, getWhatsAppDirectUrl } from '../utils/whatsapp';

interface NavbarProps {
  onEnrollClick: () => void;
  onNavigateSection: (sectionId: string) => void;
  activeSection?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  onEnrollClick,
  onNavigateSection,
  activeSection
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'courses', label: 'Courses (Ages 6-16)' },
    { id: 'interactive-lessons', label: 'Try Interactive Lesson' },
    { id: 'student-growth-dashboard', label: 'Growth Dashboard' },
    { id: 'ananth-nagar-campus', label: 'Ananth Nagar Campus' }
  ];

  const handleLinkClick = (id: string) => {
    onNavigateSection(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs">
      {/* Top micro bar with Ananth Nagar & WhatsApp */}
      <div className="bg-slate-900 text-slate-300 text-[11px] py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-slate-200">
              <MapPin className="w-3 h-3 text-emerald-400" />
              <strong>Location:</strong> Ananth Nagar STEM Innovation Lab
            </span>
            <span className="hidden sm:inline-block text-slate-500">|</span>
            <span className="hidden sm:inline-flex items-center gap-1 text-slate-300">
              <Sparkles className="w-3 h-3 text-amber-400" />
              Coding • AI • Robotics for Kids Ages 6–16
            </span>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={`tel:+91${FUTURE_MINDS_PHONE}`}
              className="hover:text-white transition flex items-center gap-1 font-mono"
            >
              <Phone className="w-3 h-3 text-indigo-400" />
              <span>+91 {FUTURE_MINDS_PHONE}</span>
            </a>
            <span className="text-slate-600">|</span>
            <a
              href={getWhatsAppDirectUrl('Hi Future Minds, I would like to inquire about Robotics, AI & Coding admissions for my child at your Ananth Nagar campus.')}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 hover:text-emerald-300 transition flex items-center gap-1 font-semibold"
            >
              <MessageCircle className="w-3 h-3" />
              <span>WhatsApp Us</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Logo */}
          <div 
            onClick={() => handleLinkClick('root')} 
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-emerald-500 text-white flex items-center justify-center shadow-md shadow-indigo-600/20 group-hover:scale-105 transition-transform">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-display">
                  Future Minds
                </span>
                <span className="text-[10px] uppercase font-extrabold px-1.5 py-0.5 rounded-sm bg-indigo-100 text-indigo-800">
                  STEM
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium tracking-wide">
                Coding • AI • Robotics (Ages 6-16)
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
                  activeSection === link.id
                    ? 'text-indigo-600 bg-indigo-50'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Right Action CTAs */}
          <div className="hidden sm:flex items-center gap-2.5">
            {/* Direct WhatsApp button with phone 9618283987 */}
            <a
              href={getWhatsAppDirectUrl('Hi Future Minds, I would like to inquire about Robotics, AI & Coding admissions for my child at your Ananth Nagar campus.')}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl transition border border-emerald-200 flex items-center gap-1.5"
              title="Connect on WhatsApp: 9618283987"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-emerald-600 text-emerald-600" />
              <span>WhatsApp: 9618283987</span>
            </a>

            {/* Enroll CTA */}
            <button
              onClick={onEnrollClick}
              id="btn-nav-enroll"
              className="px-4 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-xl transition shadow-md shadow-indigo-600/20 flex items-center gap-1.5"
            >
              <span>Enroll Free Demo</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={onEnrollClick}
              className="sm:hidden px-3 py-1.5 text-xs font-bold bg-indigo-600 text-white rounded-lg"
            >
              Enroll
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 p-4 space-y-3 animate-in fade-in slide-in-from-top-2">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id)}
                className="text-left px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100 transition"
              >
                {link.label}
              </button>
            ))}
          </nav>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <a
              href={getWhatsAppDirectUrl('Hi Future Minds, I would like to inquire about Robotics, AI & Coding admissions for my child at your Ananth Nagar campus.')}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 text-center text-xs font-semibold bg-emerald-600 text-white rounded-xl flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>WhatsApp Inquiry (9618283987)</span>
            </a>

            <button
              onClick={() => {
                onEnrollClick();
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 text-center text-xs font-bold bg-indigo-600 text-white rounded-xl"
            >
              Enroll for Free Trial Session
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
