import React, { useState } from 'react';
import { 
  Code2, Brain, Bot, Trophy, ArrowRight, CheckCircle2, 
  Sparkles, Clock, Layers, MessageCircle, Filter 
} from 'lucide-react';
import { COURSES } from '../data/coursesData';
import { Course, CourseCategory, AgeGroup } from '../types';
import { getEnrollmentWhatsAppUrl, getWhatsAppDirectUrl, FUTURE_MINDS_PHONE } from '../utils/whatsapp';

interface CourseCatalogProps {
  onSelectCourseToEnroll: (courseTitle: string) => void;
}

export const CourseCatalog: React.FC<CourseCatalogProps> = ({ onSelectCourseToEnroll }) => {
  const [selectedAge, setSelectedAge] = useState<AgeGroup>('all');
  const [selectedCategory, setSelectedCategory] = useState<CourseCategory | 'all'>('all');

  const filteredCourses = COURSES.filter((c) => {
    const matchAge = selectedAge === 'all' || c.ageGroup === selectedAge;
    const matchCat = selectedCategory === 'all' || c.category === selectedCategory;
    return matchAge && matchCat;
  });

  const getCategoryIcon = (category: CourseCategory) => {
    switch (category) {
      case 'coding':
        return <Code2 className="w-4 h-4 text-blue-500" />;
      case 'ai':
        return <Brain className="w-4 h-4 text-purple-500" />;
      case 'robotics':
        return <Bot className="w-4 h-4 text-emerald-500" />;
      case 'combo':
        return <Trophy className="w-4 h-4 text-amber-500" />;
    }
  };

  const getCategoryBadgeColor = (category: CourseCategory) => {
    switch (category) {
      case 'coding':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'ai':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'robotics':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'combo':
        return 'bg-amber-50 text-amber-800 border-amber-200';
    }
  };

  return (
    <section id="courses" className="py-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider border border-indigo-200">
            Ages 6 to 16 Curriculum
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3 tracking-tight">
            Future-Proof Courses in Coding, AI & Robotics
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-3">
            Structured step-by-step pathways designed by seasoned engineers. From playful block coding for 6-year-olds to computer vision and autonomous robotics for high schoolers.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10 pb-6 border-b border-slate-200">
          {/* Age Tier Filter */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 flex items-center gap-1 mr-1">
              <Filter className="w-3.5 h-3.5" /> Age Group:
            </span>
            {[
              { id: 'all', label: 'All Ages (6-16)' },
              { id: '6-8', label: 'Ages 6–8 (Junior)' },
              { id: '9-12', label: 'Ages 9–12 (Explorer)' },
              { id: '13-16', label: 'Ages 13–16 (Advanced)' }
            ].map((age) => (
              <button
                key={age.id}
                onClick={() => setSelectedAge(age.id as AgeGroup)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                  selectedAge === age.id
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {age.label}
              </button>
            ))}
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: 'all', label: 'All Disciplines' },
              { id: 'coding', label: 'Coding' },
              { id: 'ai', label: 'Artificial Intelligence' },
              { id: 'robotics', label: 'Robotics & Hardware' },
              { id: 'combo', label: 'STEM Masterclass' }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition ${
                  selectedCategory === cat.id
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-indigo-300 transition-all duration-300 flex flex-col justify-between overflow-hidden group"
            >
              {/* Card Top */}
              <div className="p-6">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border flex items-center gap-1 ${getCategoryBadgeColor(course.category)}`}>
                    {getCategoryIcon(course.category)}
                    {course.category.toUpperCase()}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
                    Ages {course.ageGroup}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                  {course.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                  {course.subtitle}
                </p>

                {/* Specs */}
                <div className="grid grid-cols-2 gap-2 mt-4 py-2.5 border-y border-slate-100 text-xs text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-slate-400" />
                    <span>{course.projectsCount} Hands-on Builds</span>
                  </div>
                </div>

                {/* Featured Project */}
                <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-150">
                  <div className="text-[11px] font-bold text-indigo-700 uppercase tracking-wide flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-500" /> Capstone Project:
                  </div>
                  <div className="text-xs font-semibold text-slate-800 mt-0.5">
                    {course.featuredProject}
                  </div>
                </div>

                {/* Key Skills */}
                <div className="mt-4">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    Key Competencies:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {course.keySkills.map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md text-[11px] font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Tools */}
                <div className="mt-3 flex items-center gap-1.5 text-[11px] text-slate-500">
                  <span className="font-semibold text-slate-400">Tools:</span>
                  <span>{course.toolsUsed.join(' • ')}</span>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-4 bg-slate-50/90 border-t border-slate-100 flex items-center gap-2">
                <button
                  onClick={() => onSelectCourseToEnroll(course.title)}
                  className="flex-1 py-2 px-3 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <span>Enroll for This Track</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <a
                  href={getEnrollmentWhatsAppUrl({
                    parentName: 'Parent',
                    studentName: 'Student',
                    studentAge: course.ageGroup.split('-')[0],
                    courseInterest: course.title,
                    preferredMode: 'ananth_nagar_lab'
                  })}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 rounded-xl transition"
                  title="Ask details about this course on WhatsApp"
                >
                  <MessageCircle className="w-4 h-4 fill-emerald-600 text-white" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Callout banner */}
        <div className="mt-12 bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center md:text-left">
            <span className="px-3 py-1 bg-amber-400/20 text-amber-300 text-xs font-bold rounded-full border border-amber-400/30">
              Not sure which course fits your child?
            </span>
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
              Get a Free 1-on-1 STEM Skill Assessment at Ananth Nagar
            </h3>
            <p className="text-indigo-200 text-xs sm:text-sm max-w-xl">
              Bring your child to our Ananth Nagar robotics lab or join online. Our senior instructors will assess their logic baseline and suggest the ideal learning pathway.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <button
              onClick={() => onSelectCourseToEnroll('Free STEM Assessment Session')}
              className="px-5 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-xs sm:text-sm transition shadow-lg"
            >
              Book Free Assessment
            </button>
            <a
              href={getWhatsAppDirectUrl('Hi Future Minds, I would like to inquire about course enrollment and batch availability for my child at your Ananth Nagar campus.')}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs sm:text-sm transition flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" /> WhatsApp Counselor
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
