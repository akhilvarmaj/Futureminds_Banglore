import React from 'react';
import { Check, X, Shield, Users, Cpu, Trophy, Clock, HeartHandshake } from 'lucide-react';

export const WhyFutureMinds: React.FC<{ onBookDemo: () => void }> = ({ onBookDemo }) => {
  const comparisonItems = [
    {
      feature: 'Batch Size & Personal Guidance',
      futureMinds: 'Strictly 4–5 students per batch. Every child gets instant 1-on-1 mentor guidance.',
      traditional: '25–40 students crowded per classroom where quiet kids get left behind.',
      highlight: true
    },
    {
      feature: 'Hands-on Hardware Kits',
      futureMinds: '1:1 Hardware ratio. Every child gets their own individual sensor & robotics kit.',
      traditional: 'Shared kits where only the most vocal kid builds while others just watch.',
      highlight: false
    },
    {
      feature: 'Learning Methodology',
      futureMinds: '80% Practical Building & Coding. Learn by wiring, coding, testing, and debugging.',
      traditional: 'Passive slide presentations, memorizing syntax, and watching video tutorials.',
      highlight: true
    },
    {
      feature: 'Physical Innovation Lab',
      futureMinds: 'Purpose-built STEM Lab in Ananth Nagar with robot arenas and child-safe benches.',
      traditional: 'Standard computer lab or generic tuition classroom with no testing arenas.',
      highlight: false
    },
    {
      feature: 'Tangible Student Output',
      futureMinds: 'Working physical capstone projects (rovers, smart IoT, AI models) to showcase.',
      traditional: 'Theoretical exam worksheets and multiple-choice question quizzes.',
      highlight: false
    }
  ];

  const valuePillars = [
    {
      icon: Users,
      title: 'Small Batches (4–5 Kids)',
      desc: 'Ensures our mentors know your child’s learning pace, strengths, and specific curiosity triggers.'
    },
    {
      icon: Cpu,
      title: 'Real Hardware & Tools',
      desc: 'Kids work with authentic microcontrollers, ultrasonic sensors, servos, and typed Python syntax.'
    },
    {
      icon: Trophy,
      title: 'Confidence & Debugging',
      desc: 'We teach kids that errors and bugs are normal steps to celebrate, solve, and overcome.'
    },
    {
      icon: HeartHandshake,
      title: 'Parent Transparency',
      desc: 'Regular milestone updates, capstone demonstrations, and video highlights of your child’s builds.'
    }
  ];

  return (
    <div className="w-full space-y-12">
      {/* 4 Value Pillars */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {valuePillars.map((p, idx) => {
          const Icon = p.icon;
          return (
            <div
              key={idx}
              className="bg-white border border-[#e6edf7] rounded-2xl p-6 shadow-[0_8px_30px_rgba(26,62,112,0.055)] hover:border-[#1769ff]/40 transition"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#1769ff] flex items-center justify-center mb-4">
                <Icon className="w-6 h-6" />
              </div>
              <h2 className="text-base font-bold text-[#10233f] mb-1.5">{p.title}</h2>
              <p className="text-xs text-[#61708a] leading-relaxed">{p.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Comparison Matrix Table */}
      <div className="bg-white border border-[#e6edf7] rounded-[28px] p-6 sm:p-9 shadow-[0_15px_40px_rgba(24,57,105,0.08)] overflow-hidden">
        <div className="text-center max-w-xl mx-auto mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-[#1769ff]">
            The Future Minds Difference
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#10233f] mt-1">
            Why Hands-on Beats Traditional Coaching
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="py-3 px-4 text-xs font-bold text-[#61708a] uppercase tracking-wider w-1/3">
                  Key Criteria
                </th>
                <th className="py-3 px-4 text-xs font-black text-[#1769ff] uppercase tracking-wider bg-blue-50/50 rounded-t-xl w-1/3">
                  🌟 Future Minds Academy
                </th>
                <th className="py-3 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider w-1/3">
                  Typical Classes / Video Courses
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
              {comparisonItems.map((item, i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition">
                  <td className="py-4 px-4 font-bold text-[#10233f]">
                    {item.feature}
                  </td>
                  <td className="py-4 px-4 font-semibold text-[#10233f] bg-blue-50/30">
                    <div className="flex items-start gap-2 text-[#1458d7]">
                      <Check className="w-4 h-4 text-[#1769ff] shrink-0 mt-0.5" />
                      <span>{item.futureMinds}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-[#61708a]">
                    <div className="flex items-start gap-2">
                      <X className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                      <span>{item.traditional}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#61708a]">
            Want to see how your child responds to hands-on building? Book a 45-minute trial demo session.
          </p>
          <button
            onClick={onBookDemo}
            className="bg-[#1769ff] hover:bg-[#1258d6] text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow transition shrink-0"
          >
            Book Free Demo Class
          </button>
        </div>
      </div>
    </div>
  );
};
