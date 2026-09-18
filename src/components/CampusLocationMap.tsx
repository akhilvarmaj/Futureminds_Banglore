import React, { useState } from 'react';
import { MapPin, Navigation, ExternalLink, Copy, Check, Clock, Phone, Calendar, ShieldCheck, Car } from 'lucide-react';
import { FUTURE_MINDS_PHONE, getWhatsAppDirectUrl } from '../utils/whatsapp';
import { BUSINESS } from '../data/siteSeo';

export const CampusLocationMap: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const FULL_ADDRESS = BUSINESS.address;
  const MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${BUSINESS.latitude},${BUSINESS.longitude}`;
  const EMBED_MAP_SRC = `https://maps.google.com/maps?q=${BUSINESS.latitude},${BUSINESS.longitude}&t=&z=16&ie=UTF8&iwloc=&output=embed`;

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(FULL_ADDRESS);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const visitWhatsAppUrl = `https://wa.me/91${FUTURE_MINDS_PHONE}?text=${encodeURIComponent(
    'Hi Future Minds, I would like to visit your Ananth Nagar campus (1121, 5th Cross, Phase II) to see the lab and meet the mentors.'
  )}`;

  return (
    <div className="w-full bg-white border border-[#e6edf7] rounded-[28px] p-6 sm:p-9 shadow-[0_15px_40px_rgba(24,57,105,0.07)] overflow-hidden">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-8 border-b border-[#e6edf7]">
        <div>
          <div className="inline-flex items-center gap-2 bg-[#eaf2ff] text-[#1458d7] rounded-full px-3.5 py-1 font-bold text-xs mb-2">
            <MapPin className="w-3.5 h-3.5" />
            <span>Campus Location & Google Map</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#10233f] tracking-tight">
            Future Minds STEM & Robotics Campus
          </h2>
          <p className="text-xs sm:text-sm text-[#61708a] mt-1 max-w-2xl leading-relaxed">
            Visit our physical innovation academy in Ananth Nagar / Electronic City. We welcome parents and students for guided tours and lab demonstrations.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleCopyAddress}
            className="bg-[#f0f4fc] hover:bg-[#e4ecf9] text-[#1769ff] px-4 py-2.5 rounded-xl font-bold text-xs transition flex items-center gap-2 border border-[#d6e3f5]"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Address Copied!' : 'Copy Address'}</span>
          </button>

          <a
            href={MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#1769ff] hover:bg-[#1258d6] text-white px-5 py-2.5 rounded-xl font-bold text-xs transition flex items-center gap-2 shadow-[0_4px_14px_rgba(23,105,255,0.25)]"
          >
            <Navigation className="w-4 h-4" />
            <span>Get Driving Directions</span>
            <ExternalLink className="w-3.5 h-3.5 ml-0.5 opacity-80" />
          </a>
        </div>
      </div>

      {/* Main Grid: Google Map Embed + Campus Address Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8 items-stretch">
        {/* Left: Interactive Google Map Embed */}
        <div className="lg:col-span-7 flex flex-col">
          <div className="relative w-full h-[360px] sm:h-[420px] rounded-2xl overflow-hidden border border-[#dbe6f5] shadow-inner bg-slate-100">
            <iframe
              title="Future Minds Campus Location Google Map"
              src={EMBED_MAP_SRC}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full"
            />
            {/* Quick Map Tag Badge */}
            <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-3.5 py-1.5 rounded-xl shadow-md border border-slate-200 text-xs font-bold text-[#10233f] flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Ananth Nagar, Electronic City Hub</span>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between text-xs text-[#61708a] px-1">
            <span>📍 Coordinates: Electronic City Phase II / Hebbagodi corridor</span>
            <a
              href={MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#1769ff] font-bold hover:underline flex items-center gap-1"
            >
              <span>Open in Google Maps app</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Right: Address & Visiting Guide */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-5 bg-[#f8fbff] border border-[#e4ecf7] p-6 sm:p-7 rounded-2xl">
          <div>
            <div className="text-xs font-extrabold uppercase tracking-wider text-[#1769ff] mb-2">
              Official Physical Address
            </div>
            <div className="text-base sm:text-lg font-black text-[#10233f] leading-snug mb-3">
              {FULL_ADDRESS}
            </div>
            
            <p className="text-xs text-[#61708a] leading-relaxed mb-4">
              Conveniently located in the heart of Ananth Nagar, directly accessible from Electronic City Phase 1 & 2, Hebbagodi junction, and Hosur Main Road.
            </p>

            {/* Quick Points */}
            <div className="space-y-2.5 border-t border-[#e2eaf5] pt-4 text-xs">
              <div className="flex items-start gap-2.5 text-[#334767]">
                <Clock className="w-4 h-4 text-[#1769ff] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#10233f]">Lab Hours:</span> {BUSINESS.hours}
                </div>
              </div>

              <div className="flex items-start gap-2.5 text-[#334767]">
                <Car className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#10233f]">Accessibility:</span> Ample visitor parking and dedicated student pickup zone.
                </div>
              </div>

              <div className="flex items-start gap-2.5 text-[#334767]">
                <ShieldCheck className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#10233f]">Safety Standards:</span> Child-safe ESD-protected workbenches, low-voltage power packs, and supervised lab mentors.
                </div>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-4 border-t border-[#e2eaf5] space-y-2.5">
            <a
              href={visitWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-[#1769ff] hover:bg-[#1258d6] text-white py-3 rounded-xl font-bold text-xs transition flex items-center justify-center gap-2 shadow-[0_4px_14px_rgba(23,105,255,0.22)]"
            >
              <Calendar className="w-4 h-4" />
              <span>Schedule a Campus Visit & Demo</span>
            </a>

            <div className="flex gap-2">
              <a
                href={`tel:+91${FUTURE_MINDS_PHONE}`}
                className="flex-1 bg-white hover:bg-slate-50 text-[#10233f] py-2.5 rounded-xl font-bold text-xs border border-[#d6e3f5] transition flex items-center justify-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5 text-[#1769ff]" />
                <span>Call Center (+91 {FUTURE_MINDS_PHONE})</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
