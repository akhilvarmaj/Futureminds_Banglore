import React, { useState } from 'react';
import { MessageCircle, X, Sparkles, MapPin, Send, Phone } from 'lucide-react';
import { FUTURE_MINDS_PHONE, getWhatsAppDirectUrl } from '../utils/whatsapp';

interface FloatingWhatsAppProps {
  onOpenEnrollModal: () => void;
}

export const FloatingWhatsApp: React.FC<FloatingWhatsAppProps> = ({ onOpenEnrollModal }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSendDirect = () => {
    window.open(getWhatsAppDirectUrl('Hi Future Minds, I would like to inquire about admissions for Robotics, AI & Coding at your Ananth Nagar campus.'), '_blank', 'noopener,noreferrer');
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end">
      {/* Popover Card */}
      {isOpen && (
        <div className="mb-3 w-80 sm:w-88 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-3 duration-200">
          {/* Popover Header */}
          <div className="bg-emerald-600 text-white p-4 relative">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-3 right-3 p-1 rounded-full text-emerald-100 hover:text-white hover:bg-emerald-700 transition"
              aria-label="Close WhatsApp chat popup"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-bold shrink-0">
                <MessageCircle className="w-6 h-6 fill-white" />
              </div>
              <div>
                <h4 className="font-bold text-sm">Future Minds Counselor</h4>
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-100">
                  <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse"></span>
                  Online • Ananth Nagar Lab
                </div>
              </div>
            </div>
          </div>

          {/* Popover Body */}
          <div className="p-4 bg-slate-50 space-y-3">
            <div className="bg-white p-3 rounded-xl border border-slate-200 text-xs text-slate-700 shadow-2xs">
              <p className="font-medium">
                Hello! 👋 Interested in Coding, AI, or Robotics courses for your child (ages 6 to 16)?
              </p>
              <p className="text-slate-500 text-[11px] mt-1.5">
                Reach us directly at <strong>+91 {FUTURE_MINDS_PHONE}</strong> or book a free trial at our Ananth Nagar center.
              </p>
            </div>

            <button
              onClick={handleSendDirect}
              className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition shadow-md shadow-emerald-600/20"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Send Inquiry via WhatsApp</span>
            </button>

            <button
              onClick={() => {
                setIsOpen(false);
                onOpenEnrollModal();
              }}
              className="w-full py-2 px-3 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Fill Quick Enrollment Form</span>
            </button>

            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-slate-400" /> Ananth Nagar Lab
              </span>
              <a href={`tel:+91${FUTURE_MINDS_PHONE}`} className="text-indigo-600 hover:underline flex items-center gap-1 font-semibold">
                <Phone className="w-3 h-3" /> Call: {FUTURE_MINDS_PHONE}
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        id="btn-floating-whatsapp"
        aria-label="WhatsApp Us at 9618283987"
        className="group relative flex items-center gap-2.5 px-4 py-3 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95"
      >
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
        </span>
        <MessageCircle className="w-6 h-6 fill-white" />
        <span className="text-xs font-bold tracking-tight hidden sm:inline-block">
          WhatsApp 9618283987
        </span>
      </button>
    </div>
  );
};
