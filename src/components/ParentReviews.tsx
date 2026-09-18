import React from 'react';
import { Star, Quote, Heart, CheckCircle2 } from 'lucide-react';

export const ParentReviews: React.FC = () => {
  const reviews = [
    {
      parent: 'Priya R.',
      child: 'Aarav (Grade 4)',
      neighborhood: 'Ananth Nagar, Bengaluru',
      rating: 5,
      quote: 'The 4–5 student batch size makes an enormous difference. Aarav used to get intimidated in large coding classes, but here he actually wired his own obstacle rover and couldn’t stop demonstrating it to his grandparents!',
      tag: 'Obstacle Rover Project'
    },
    {
      parent: 'Karthik S.',
      child: 'Ananya (Grade 7)',
      neighborhood: 'Electronic City / Ananth Nagar',
      rating: 5,
      quote: 'We wanted something beyond passive YouTube tutorials. At Future Minds, Ananya built a smart greenhouse monitor with soil moisture sensors. She understands real circuit electronics and typed Python now.',
      tag: 'IoT & Python Track'
    },
    {
      parent: 'Deepa V.',
      child: 'Rohan (Grade 2)',
      neighborhood: 'Ananth Nagar Phase 2',
      rating: 5,
      quote: 'The mentors are exceptionally patient with younger kids. Rohan loves assembling the motorized gear circuits every Saturday. Screen time turned into productive creator time!',
      tag: 'Junior Innovators'
    }
  ];

  return (
    <div className="w-full">
      <div className="text-center max-w-2xl mx-auto mb-8">
        <span className="text-xs font-bold uppercase tracking-wider text-[#1769ff]">
          Parent Experiences
        </span>
        <h3 className="text-2xl sm:text-3xl font-black text-[#10233f] mt-1">
          Loved by Parents in Ananth Nagar & Bengaluru
        </h3>
        <p className="text-sm text-[#61708a] mt-1">
          Here is what families notice when learning shifts from rote memorization to hands-on creation.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reviews.map((rev, idx) => (
          <div
            key={idx}
            className="bg-white border border-[#e6edf7] rounded-2xl p-6 shadow-[0_8px_30px_rgba(26,62,112,0.055)] flex flex-col justify-between hover:shadow-md transition"
          >
            <div>
              <div className="flex items-center gap-1 text-amber-400 mb-3">
                {[...Array(rev.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-[#40516c] leading-relaxed italic mb-4">
                &ldquo;{rev.quote}&rdquo;
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <div>
                <div className="text-xs font-black text-[#10233f]">{rev.parent}</div>
                <div className="text-[11px] text-[#61708a]">{rev.child} · {rev.neighborhood}</div>
              </div>
              <span className="text-[10px] font-bold bg-blue-50 text-[#1769ff] px-2 py-0.5 rounded-full">
                {rev.tag}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
