import React, { useState } from 'react';
import { X, MessageCircle, Sparkles, CheckCircle2, User, Phone, BookOpen, MapPin, Calendar } from 'lucide-react';
import { getEnrollmentWhatsAppUrl, getWhatsAppDirectUrl, FUTURE_MINDS_PHONE } from '../utils/whatsapp';
import { COURSES } from '../data/coursesData';

interface EnrollmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCourseTitle?: string;
}

export const EnrollmentModal: React.FC<EnrollmentModalProps> = ({
  isOpen,
  onClose,
  defaultCourseTitle = 'Future Minds STEM Triple Masterclass'
}) => {
  const [parentName, setParentName] = useState('');
  const [studentName, setStudentName] = useState('');
  const [studentAge, setStudentAge] = useState<number | string>(10);
  const [phone, setPhone] = useState('');
  const [courseInterest, setCourseInterest] = useState(defaultCourseTitle);
  const [preferredMode, setPreferredMode] = useState<'ananth_nagar_lab' | 'online_interactive'>('ananth_nagar_lab');
  const [preferredSlot, setPreferredSlot] = useState('Weekend Batch (Sat & Sun)');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmitWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Generate WhatsApp link with user details
    const waUrl = getEnrollmentWhatsAppUrl({
      parentName: parentName || 'Parent',
      parentPhone: phone,
      studentName: studentName || 'Student',
      studentGradeOrAge: `${studentAge} years`,
      courseInterest,
      preferredSlot,
      preferredMode,
      notes
    });

    setSubmitted(true);
    
    try {
      const opened = window.open(waUrl, '_blank', 'noopener,noreferrer');
      if (!opened || opened.closed || typeof opened.closed === 'undefined') {
        window.location.assign(waUrl);
      }
    } catch {
      window.location.assign(waUrl);
    }
  };

  const handleQuickWhatsApp = () => {
    const directUrl = getWhatsAppDirectUrl('Hi Future Minds, I would like to inquire about Robotics, AI & Coding admissions for my child at your Ananth Nagar campus. Please share program details.');
    window.open(directUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-emerald-600 px-6 py-5 text-white relative">
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-200 text-xs font-semibold border border-emerald-400/30 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Free Trial Session
            </span>
            <span className="text-xs text-indigo-100 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-emerald-300" /> Ananth Nagar Lab
            </span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Enroll at Future Minds</h2>
          <p className="text-indigo-100 text-sm mt-1">
            Fill in quick details to connect directly with our mentors on WhatsApp.
          </p>
        </div>

        {/* Content */}
        {submitted ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Redirecting to WhatsApp...</h3>
            <p className="text-slate-600 text-sm max-w-md mx-auto">
              Your inquiry details for <strong>{studentName || 'your child'}</strong> have been formatted. Opening WhatsApp to connect with our counselor at <strong>+91 {FUTURE_MINDS_PHONE}</strong>.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
              <button
                type="button"
                onClick={() => {
                  const url = getEnrollmentWhatsAppUrl({
                    parentName,
                    studentName,
                    studentAge,
                    courseInterest,
                    preferredMode,
                    notes
                  });
                  window.open(url, '_blank');
                }}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition"
              >
                <MessageCircle className="w-4 h-4" /> Re-open WhatsApp
              </button>
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  onClose();
                }}
                className="px-5 py-2.5 border border-slate-300 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition"
              >
                Close Window
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmitWhatsApp} className="p-6 space-y-4 text-left">
            {/* Direct Quick WhatsApp Banner */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-emerald-900 uppercase tracking-wide">
                    Instant 1-Click WhatsApp
                  </div>
                  <div className="text-xs text-emerald-700">
                    Direct chat with: <strong>+91 {FUTURE_MINDS_PHONE}</strong>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={handleQuickWhatsApp}
                className="px-3 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition shrink-0 flex items-center gap-1 shadow-sm"
              >
                Direct Chat
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Parent Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Parent / Guardian Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Varma"
                    value={parentName}
                    onChange={(e) => setParentName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  />
                </div>
              </div>

              {/* Student Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Student's Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Aarav"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Student Age */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Student's Age (6 to 16 Years) *
                </label>
                <select
                  value={studentAge}
                  onChange={(e) => setStudentAge(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white"
                >
                  {Array.from({ length: 11 }, (_, i) => i + 6).map((age) => (
                    <option key={age} value={age}>
                      {age} Years Old ({age <= 8 ? 'Junior Tier' : age <= 12 ? 'Intermediate Tier' : 'Advanced Senior'})
                    </option>
                  ))}
                </select>
              </div>

              {/* Contact Phone */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Your Phone / WhatsApp Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="tel"
                    placeholder="e.g. 9876543210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Course Program */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Course Program of Interest
              </label>
              <div className="relative">
                <BookOpen className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <select
                  value={courseInterest}
                  onChange={(e) => setCourseInterest(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white"
                >
                  {COURSES.map((course) => (
                    <option key={course.id} value={course.title}>
                      {course.title} ({course.category.toUpperCase()} • Ages {course.ageGroup})
                    </option>
                  ))}
                  <option value="General STEM Discovery (Let Mentors Recommend)">
                    General STEM Discovery (Let Mentors Recommend)
                  </option>
                </select>
              </div>
            </div>

            {/* Learning Mode */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Preferred Learning Mode & Campus
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPreferredMode('ananth_nagar_lab')}
                  className={`p-2.5 rounded-xl border text-left text-xs font-medium transition flex items-start gap-2 ${
                    preferredMode === 'ananth_nagar_lab'
                      ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900 ring-2 ring-indigo-500/20'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <MapPin className={`w-4 h-4 shrink-0 mt-0.5 ${preferredMode === 'ananth_nagar_lab' ? 'text-indigo-600' : 'text-slate-400'}`} />
                  <div>
                    <div className="font-semibold">Ananth Nagar Lab</div>
                    <div className="text-[11px] text-slate-500">In-person physical STEM kit robotics lab</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPreferredMode('online_interactive')}
                  className={`p-2.5 rounded-xl border text-left text-xs font-medium transition flex items-start gap-2 ${
                    preferredMode === 'online_interactive'
                      ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900 ring-2 ring-indigo-500/20'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <Sparkles className={`w-4 h-4 shrink-0 mt-0.5 ${preferredMode === 'online_interactive' ? 'text-indigo-600' : 'text-slate-400'}`} />
                  <div>
                    <div className="font-semibold">Live Online Class</div>
                    <div className="text-[11px] text-slate-500">Interactive screen-share & simulator</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Optional message preview info */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-600">
              <div className="font-semibold text-slate-800 mb-1 flex items-center gap-1.5">
                <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                WhatsApp Message Preview to 9618283987:
              </div>
              <p className="font-mono text-[11px] text-slate-700 bg-white p-2.5 rounded border border-slate-200 leading-relaxed">
                🚀 *FUTURE MINDS — NEW ENROLLMENT ENQUIRY*
                <br />👤 *Parent:* {parentName || '...'} | 👦 *Student:* {studentName || '...'} ({studentAge} yrs)
                <br />🔬 *Track:* {courseInterest} | 📍 *Campus:* Ananth Nagar STEM Lab
              </p>
            </div>

            {/* Submit Button */}
            <div className="pt-2 flex flex-col gap-2">
              <button
                type="submit"
                id="btn-submit-enroll-whatsapp"
                className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold rounded-xl transition shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 text-sm"
              >
                <MessageCircle className="w-5 h-5 fill-white text-emerald-600" />
                <span>Enroll on WhatsApp (9618283987)</span>
              </button>
              <p className="text-[11px] text-center text-slate-500">
                No fee required for trial booking. Connects directly to Future Minds Ananth Nagar team.
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
