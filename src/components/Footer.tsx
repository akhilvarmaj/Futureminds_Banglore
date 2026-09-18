import React, { useState } from 'react';
import { 
  Bot, MapPin, Phone, MessageCircle, Mail, ChevronDown, 
  ChevronUp, Sparkles, Heart, Shield, Award 
} from 'lucide-react';
import { FUTURE_MINDS_PHONE, getWhatsAppDirectUrl } from '../utils/whatsapp';

export const Footer: React.FC<{ onEnrollClick: () => void }> = ({ onEnrollClick }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: 'What age groups are accepted at Future Minds?',
      a: 'We teach kids from age 6 up to 16! We divide students into age-appropriate developmental tiers: Little Innovators (Ages 6-8: visual blocks & simple mechanics), Young Explorers (Ages 9-12: typed Python, sensors & Arduino), and Senior Tech Leaders (Ages 13-16: Advanced AI, computer vision & autonomous robotics).'
    },
    {
      q: 'Where is your physical campus located?',
      a: 'Our physical STEM & Robotics Lab is located on Main Road, Ananth Nagar (near Central Community Park). We have child-safe hardware workstations, dedicated test arenas, and high-speed workstations.'
    },
    {
      q: 'Does my child need prior coding experience?',
      a: 'No prior experience is required! We start from fundamental logic puzzles and visual blocks, gradually building up confidence to typed code and physical electronics.'
    },
    {
      q: 'How does the student growth tracking dashboard work?',
      a: 'Every student has a live digital profile where mentors record real-time engagement scores, weekly coding hours, completed capstones, and cognitive rubrics after every session so parents always have clear transparency.'
    },
    {
      q: 'How do I enroll or book a trial class?',
      a: 'Simply click any "Enroll" button or message us directly on WhatsApp at 9618283987. We will schedule a free, hands-on 1-on-1 assessment and trial session for your child.'
    }
  ];

  return (
    <footer className="bg-slate-950 text-slate-400 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Parent FAQ Section */}
        <div className="mb-16 pb-12 border-b border-slate-800/80">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
              Frequently Asked Questions
            </span>
            <h3 className="text-2xl font-bold text-white mt-1">
              Have Questions About Future Minds?
            </h3>
          </div>

          <div className="max-w-3xl mx-auto space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden transition"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-4 text-left flex items-center justify-between gap-4 text-white text-sm font-semibold hover:text-indigo-300 transition"
                >
                  <span>{faq.q}</span>
                  {openFaq === idx ? (
                    <ChevronUp className="w-4 h-4 text-indigo-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
                  )}
                </button>
                {openFaq === idx && (
                  <div className="px-4 pb-4 text-xs text-slate-400 leading-relaxed border-t border-slate-800/60 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Footer Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 mb-12">
          {/* Col 1: Brand */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-emerald-500 text-white flex items-center justify-center shadow">
                <Bot className="w-5 h-5" />
              </div>
              <span className="text-xl font-black text-white tracking-tight font-display">
                Future Minds
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Empowering kids aged 6 to 16 with real-world Coding, Artificial Intelligence, and Robotics education. Nurturing creative thinkers and tomorrow&apos;s innovators.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400">
              <MapPin className="w-4 h-4" />
              <span>Campus in Ananth Nagar</span>
            </div>
          </div>

          {/* Col 2: Programs */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Programs</h4>
            <ul className="space-y-2 text-xs">
              <li><span className="hover:text-white cursor-pointer">Visual Coding (Ages 6–8)</span></li>
              <li><span className="hover:text-white cursor-pointer">Python & Game Dev (Ages 9–12)</span></li>
              <li><span className="hover:text-white cursor-pointer">AI & Machine Learning (Ages 9–16)</span></li>
              <li><span className="hover:text-white cursor-pointer">Arduino & Robotics IoT (Ages 9–16)</span></li>
              <li><span className="hover:text-white cursor-pointer">All-in-One STEM Masterclass</span></li>
            </ul>
          </div>

          {/* Col 3: Campus & Contact */}
          <div className="lg:col-span-5 space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Ananth Nagar Campus & Admissions</h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <span>Future Minds STEM Lab, Main Road, Ananth Nagar (Near Central Park)</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href={`tel:+91${FUTURE_MINDS_PHONE}`} className="hover:text-white transition">
                  +91 {FUTURE_MINDS_PHONE}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <a
                  href={getWhatsAppDirectUrl('Hi Future Minds, I would like to inquire about admissions for Robotics, AI & Coding at your Ananth Nagar campus.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:underline font-semibold"
                >
                  WhatsApp: +91 {FUTURE_MINDS_PHONE}
                </a>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={onEnrollClick}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition shadow-sm"
              >
                Enroll Your Child Now
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-850 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} Future Minds. All rights reserved. Ananth Nagar Campus.
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Phase One Release</span>
            <span>•</span>
            <span>Ages 6–16 STEM Platform</span>
            <span>•</span>
            <a
              href={getWhatsAppDirectUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 hover:underline"
            >
              WhatsApp 9618283987
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
