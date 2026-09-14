import React from 'react';
import { Calendar, Clock, MapPin, Users, CheckCircle, Phone, ArrowRight } from 'lucide-react';
import { FUTURE_MINDS_PHONE, getWhatsAppDirectUrl } from '../utils/whatsapp';

export const ScheduleAndBatches: React.FC<{ onBookSlot: (slotInfo: string) => void }> = ({ onBookSlot }) => {
  const weekendBatches = [
    {
      slot: 'Morning Batch (Sat & Sun)',
      time: '10:00 AM – 12:00 PM',
      bestFor: 'Grades 1 to 4 (Ages 6–9)',
      availability: '2 Seats Left',
      badge: 'High Demand'
    },
    {
      slot: 'Afternoon Batch (Sat & Sun)',
      time: '02:00 PM – 04:00 PM',
      bestFor: 'Grades 5 to 7 (Ages 10–13)',
      availability: '3 Seats Left',
      badge: 'Filling Fast'
    },
    {
      slot: 'Evening Batch (Sat & Sun)',
      time: '04:30 PM – 06:30 PM',
      bestFor: 'Grades 8 to 10 (Ages 13–16)',
      availability: '2 Seats Left',
      badge: 'Advanced AI & IoT'
    }
  ];

  const weekdayBatches = [
    {
      slot: 'Tue & Thu After-School',
      time: '04:45 PM – 06:15 PM',
      bestFor: 'Grades 3 to 7 (Ages 8–13)',
      availability: '3 Seats Available',
      badge: 'After-School'
    },
    {
      slot: 'Wed & Fri After-School',
      time: '05:00 PM – 06:30 PM',
      bestFor: 'Grades 5 to 10 (Ages 10–16)',
      availability: 'Open for Registration',
      badge: 'New Batch'
    }
  ];

  return (
    <div className="w-full space-y-8">
      {/* Batch Overview Card */}
      <div className="bg-white border border-[#e6edf7] rounded-[28px] p-6 sm:p-9 shadow-[0_15px_40px_rgba(24,57,105,0.08)]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#e6edf7]">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#1769ff]">
              Batches & Timings
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-[#10233f] mt-1">
              Choose a Schedule that Fits Your Child&apos;s Routine
            </h3>
            <p className="text-sm text-[#61708a] mt-1">
              All batches are capped at strictly 4–5 students to guarantee individual hardware stations.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-bold bg-emerald-50 text-emerald-700 px-3.5 py-1.5 rounded-full border border-emerald-200/60 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" /> Max 4–5 Students / Batch
            </span>
          </div>
        </div>

        {/* Schedules Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-6">
          {/* Weekend Batches */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-[#1769ff]" />
              <h4 className="text-lg font-bold text-[#10233f]">Weekend Intensive Batches (Sat & Sun)</h4>
            </div>

            <div className="space-y-3">
              {weekendBatches.map((b, idx) => (
                <div
                  key={idx}
                  className="bg-[#f8fbff] border border-[#e6edf7] rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-[#1769ff]/50 transition"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-[#10233f]">{b.slot}</span>
                      <span className="text-[10px] font-bold bg-blue-100 text-[#1458d7] px-2 py-0.5 rounded-full">
                        {b.badge}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#1769ff] mt-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{b.time}</span>
                    </div>
                    <div className="text-xs text-[#61708a] mt-0.5">
                      Ideal for: {b.bestFor}
                    </div>
                  </div>

                  <button
                    onClick={() => onBookSlot(`Weekend: ${b.slot} (${b.time})`)}
                    className="self-start sm:self-center bg-white border border-[#1769ff] text-[#1769ff] hover:bg-[#1769ff] hover:text-white px-3.5 py-2 rounded-xl text-xs font-bold transition shrink-0 shadow-sm"
                  >
                    Reserve Slot
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Weekday Batches */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-[#19c3d1]" />
              <h4 className="text-lg font-bold text-[#10233f]">Weekday After-School Batches</h4>
            </div>

            <div className="space-y-3">
              {weekdayBatches.map((b, idx) => (
                <div
                  key={idx}
                  className="bg-[#f8fbff] border border-[#e6edf7] rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-[#19c3d1]/50 transition"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-[#10233f]">{b.slot}</span>
                      <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                        {b.badge}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#19c3d1] mt-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{b.time}</span>
                    </div>
                    <div className="text-xs text-[#61708a] mt-0.5">
                      Ideal for: {b.bestFor}
                    </div>
                  </div>

                  <button
                    onClick={() => onBookSlot(`Weekday: ${b.slot} (${b.time})`)}
                    className="self-start sm:self-center bg-white border border-[#1769ff] text-[#1769ff] hover:bg-[#1769ff] hover:text-white px-3.5 py-2 rounded-xl text-xs font-bold transition shrink-0 shadow-sm"
                  >
                    Reserve Slot
                  </button>
                </div>
              ))}
            </div>

            {/* Safety & Lab Facility Note */}
            <div className="mt-4 p-4 rounded-2xl bg-amber-50/70 border border-amber-200/60 text-xs text-amber-900 leading-relaxed">
              <span className="font-bold">Child-Safe Lab Policy:</span> All hardware operates under low-voltage safe DC (3.3V–5V). Lab workstations feature rubber anti-static mats and individual surge-protected power docks.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
