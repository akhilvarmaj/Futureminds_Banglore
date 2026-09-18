import React from 'react';
import { 
  MapPin, Phone, MessageCircle, Clock, ShieldCheck, 
  Cpu, Users, Sparkles, Navigation, Calendar, Award 
} from 'lucide-react';
import { FUTURE_MINDS_PHONE, getEnrollmentWhatsAppUrl } from '../utils/whatsapp';

interface CampusAnanthNagarProps {
  onEnrollClick: () => void;
}

export const CampusAnanthNagar: React.FC<CampusAnanthNagarProps> = ({ onEnrollClick }) => {
  return (
    <section id="ananth-nagar-campus" className="py-20 bg-slate-900 text-white relative overflow-hidden">
      {/* Background glow accents */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-emerald-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold uppercase tracking-wider mb-3">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            Physical Innovation Campus
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Future Minds STEM Lab at Ananth Nagar
          </h2>
          <p className="text-slate-300 text-sm sm:text-base mt-3">
            A state-of-the-art tech incubator designed specifically for young creators. Fully equipped with robotics assembly benches, sensor prototyping stations, and guided 1:8 mentor pods.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left: Campus Highlights & Lab Features */}
          <div className="lg:col-span-7 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Feature 1 */}
              <div className="bg-slate-800/80 border border-slate-700/80 p-5 rounded-2xl">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-3">
                  <Cpu className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-white">Robotics & Circuit Arena</h4>
                <p className="text-xs text-slate-300 mt-1">
                  Individual hardware toolkits for every student. Hands-on breadboarding, motors, Arduino, ESP32, and Lego robotics chassis.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-slate-800/80 border border-slate-700/80 p-5 rounded-2xl">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-3">
                  <Users className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-white">1:8 Mentor to Kid Ratio</h4>
                <p className="text-xs text-slate-300 mt-1">
                  Intimate cohorts where mentors coach each child through code errors and mechanical debugging step-by-step.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-slate-800/80 border border-slate-700/80 p-5 rounded-2xl">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-white">Kid-Safe & Ergonomic</h4>
                <p className="text-xs text-slate-300 mt-1">
                  Low-voltage 5V/9V electronics, child-safe tool sets, high-speed fiber internet, and CCTV monitoring for total parent peace of mind.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="bg-slate-800/80 border border-slate-700/80 p-5 rounded-2xl">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-3">
                  <Award className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-white">Project Exhibitions</h4>
                <p className="text-xs text-slate-300 mt-1">
                  Monthly demo days where kids pitch their inventions to parents, win badges, and build their STEM portfolios.
                </p>
              </div>
            </div>

            {/* Batch Schedule Table */}
            <div className="bg-slate-800/90 border border-slate-700 p-5 rounded-2xl">
              <h4 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
                <Calendar className="w-4 h-4 text-indigo-400" />
                Ananth Nagar Center Batch Schedules
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-750">
                  <span className="font-bold text-indigo-300 block mb-1">Weekday After-School Batches</span>
                  <div className="text-slate-300 space-y-1">
                    <div>• Tuesday & Thursday: 4:30 PM – 6:00 PM</div>
                    <div>• Wednesday & Friday: 6:15 PM – 7:45 PM</div>
                  </div>
                </div>

                <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-750">
                  <span className="font-bold text-emerald-300 block mb-1">Weekend Intensive Clubs</span>
                  <div className="text-slate-300 space-y-1">
                    <div>• Saturday Morning: 10:00 AM – 1:00 PM</div>
                    <div>• Sunday Afternoon: 2:30 PM – 5:30 PM</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Contact & Location Card */}
          <div className="lg:col-span-5 bg-gradient-to-b from-slate-800 to-slate-850 p-6 sm:p-8 rounded-3xl border border-slate-700 shadow-2xl relative">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Admissions Open for New Term
              </span>
            </div>

            <h3 className="text-2xl font-bold text-white tracking-tight">
              Visit Future Minds Lab
            </h3>
            <p className="text-slate-300 text-xs mt-1">
              Located conveniently in Ananth Nagar with safe drop-off and pickup areas for parents.
            </p>

            <div className="space-y-4 my-6 text-xs">
              <div className="flex items-start gap-3 p-3 bg-slate-900/60 rounded-xl border border-slate-700/60">
                <MapPin className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-white">Future Minds Tech Academy</div>
                  <div className="text-slate-300 mt-0.5">
                    Main Road, Ananth Nagar (Near Central Park & Community Center)
                  </div>
                  <div className="text-slate-400 text-[11px] mt-0.5">Bengaluru / Hyderabad Region</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-slate-900/60 rounded-xl border border-slate-700/60">
                <Phone className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <div className="text-[11px] text-slate-400">Call / Inquiries:</div>
                  <a href={`tel:+91${FUTURE_MINDS_PHONE}`} className="text-sm font-bold text-white hover:text-emerald-400 transition">
                    +91 {FUTURE_MINDS_PHONE}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-emerald-950/40 border border-emerald-600/40 rounded-xl">
                <MessageCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                <div className="flex-1">
                  <div className="text-[11px] text-emerald-300">Direct WhatsApp Line:</div>
                  <div className="text-sm font-bold text-white">+91 {FUTURE_MINDS_PHONE}</div>
                </div>
                <a
                  href={getEnrollmentWhatsAppUrl({
                    parentName: 'Parent',
                    courseInterest: 'Campus Visit & Lab Inquiry',
                    preferredMode: 'ananth_nagar_lab'
                  })}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition"
                >
                  Chat Now
                </a>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-2.5">
              <button
                onClick={onEnrollClick}
                className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-bold rounded-xl text-xs sm:text-sm transition shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Book Free In-Person Demo at Ananth Nagar</span>
              </button>

              <a
                href={getEnrollmentWhatsAppUrl({
                  parentName: '',
                  studentName: '',
                  studentAge: 10,
                  courseInterest: 'Campus Tour & Free Trial',
                  preferredMode: 'ananth_nagar_lab'
                })}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium rounded-xl text-xs transition border border-slate-600 flex items-center justify-center gap-2"
              >
                <Navigation className="w-3.5 h-3.5 text-indigo-400" />
                <span>Get Directions & WhatsApp Location</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
