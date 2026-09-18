import React, { useState } from 'react';
import { 
  TrendingUp, Activity, Award, Flame, CheckCircle, Clock, 
  Calendar, UserCheck, Sparkles, ChevronRight, BarChart3, 
  Cpu, Brain, Code2, Users, ShieldAlert, Zap
} from 'lucide-react';
import { SAMPLE_STUDENTS } from '../data/mockStudentData';
import { StudentProgress } from '../types';
import confetti from 'canvas-confetti';

interface StudentDashboardProps {
  onEnrollClick: () => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ onEnrollClick }) => {
  const [studentsList, setStudentsList] = useState<StudentProgress[]>(SAMPLE_STUDENTS);
  const [selectedStudentId, setSelectedStudentId] = useState<string>(SAMPLE_STUDENTS[0].id);
  const [justUpdated, setJustUpdated] = useState(false);

  const student = studentsList.find((s) => s.id === selectedStudentId) || studentsList[0];

  // Interactive action: simulate real-time lesson completion / engagement boost
  const handleSimulateActivity = () => {
    setStudentsList((prev) =>
      prev.map((s) => {
        if (s.id === student.id) {
          const newEngagement = Math.min(100, s.overallEngagement + 2);
          const newLessonCount = Math.min(s.totalLessons, s.completedLessons + 1);
          return {
            ...s,
            overallEngagement: newEngagement,
            completedLessons: newLessonCount,
            streakDays: s.streakDays + 1,
            skillGrowth: {
              ...s.skillGrowth,
              algorithmicThinking: Math.min(100, s.skillGrowth.algorithmicThinking + 1),
              roboticsHardware: Math.min(100, s.skillGrowth.roboticsHardware + 2)
            }
          };
        }
        return s;
      })
    );

    setJustUpdated(true);
    setTimeout(() => setJustUpdated(false), 2500);

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });
    } catch (e) {
      // fallback
    }
  };

  return (
    <section id="student-growth-dashboard" className="py-16 bg-slate-100/70 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-xs font-semibold mb-2">
              <Activity className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
              Live Parent Portal & Telemetry
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Real-Time Student Growth & Engagement Dashboard
            </h2>
            <p className="text-slate-600 text-sm mt-1 max-w-2xl">
              Parents at Future Minds track their child&apos;s real-time skill acquisition, cognitive growth, lab attendance, and weekly focus metrics after every robotics and AI session.
            </p>
          </div>

          {/* Student Profile Switcher Tabs */}
          <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm shrink-0">
            <span className="text-xs text-slate-500 font-medium px-2">Sample Student:</span>
            {studentsList.map((s) => (
              <button
                key={s.id}
                onClick={() => setSelectedStudentId(s.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                  selectedStudentId === s.id
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {s.name.split(' ')[0]} ({s.age}y)
              </button>
            ))}
          </div>
        </div>

        {/* Live notification pill if updated */}
        {justUpdated && (
          <div className="mb-6 p-3 bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-2xl text-xs font-semibold flex items-center justify-between animate-in fade-in slide-in-from-top-2">
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              Real-time update received! Aarav completed Lab Milestone #19. Engagement score increased!
            </span>
            <span className="text-[11px] text-emerald-700 bg-white/80 px-2 py-0.5 rounded-md">Live Telemetry Synced</span>
          </div>
        )}

        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Card 1: Engagement Level */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">
              <span>Overall Engagement</span>
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900 font-mono">
                {student.overallEngagement}%
              </span>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                <TrendingUp className="w-3 h-3" /> High Focus
              </span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-3">
              <div
                className="bg-gradient-to-r from-indigo-500 to-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${student.overallEngagement}%` }}
              ></div>
            </div>
            <p className="text-[11px] text-slate-500 mt-2">Active participation in lab discussions & hardware tasks.</p>
          </div>

          {/* Card 2: Learning Streak */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">
              <span>Active Streak</span>
              <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900 font-mono">
                {student.streakDays} Days
              </span>
              <span className="text-xs font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                Consistent Learner
              </span>
            </div>
            <div className="text-xs text-slate-500 mt-3 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Avg {student.weeklyHours} hours hands-on coding / week</span>
            </div>
          </div>

          {/* Card 3: Lessons Completed */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">
              <span>Curriculum Progress</span>
              <CheckCircle className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900 font-mono">
                {student.completedLessons} / {student.totalLessons}
              </span>
              <span className="text-xs font-medium text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full">
                {Math.round((student.completedLessons / student.totalLessons) * 100)}% Complete
              </span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-3">
              <div
                className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${(student.completedLessons / student.totalLessons) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Card 4: Current Active Track */}
          <div className="bg-gradient-to-br from-indigo-700 to-indigo-900 text-white p-5 rounded-2xl shadow-sm flex flex-col justify-between">
            <div>
              <div className="text-indigo-200 text-xs font-semibold uppercase tracking-wider mb-1">
                Enrolled Track
              </div>
              <div className="font-bold text-sm text-white line-clamp-2">
                {student.enrolledCourse}
              </div>
              <div className="text-xs text-indigo-200 mt-1 font-mono">
                {student.level}
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-indigo-600/60 flex items-center justify-between text-xs">
              <span className="text-indigo-200">Campus: Ananth Nagar</span>
              <button
                onClick={handleSimulateActivity}
                className="px-2 py-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-[11px] transition flex items-center gap-1 shadow"
                title="Test real-time update"
              >
                <Zap className="w-3 h-3 fill-slate-950" /> Test Activity
              </button>
            </div>
          </div>
        </div>

        {/* Middle Row: Skill Mastery Breakdown & Weekly Engagement History */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
          {/* Skill Mastery Breakdown */}
          <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Brain className="w-4 h-4 text-indigo-600" />
                  Cognitive & Technical Skill Mastery
                </h3>
                <p className="text-xs text-slate-500">Evaluated continuously during hands-on lab sessions</p>
              </div>
              <span className="text-xs bg-slate-100 text-slate-700 font-semibold px-2.5 py-1 rounded-lg">
                Rubric v2.4
              </span>
            </div>

            <div className="space-y-4">
              {/* Skill 1: Algorithmic Thinking */}
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span className="flex items-center gap-1.5">
                    <Code2 className="w-3.5 h-3.5 text-indigo-600" /> Algorithmic & Sequencing Logic
                  </span>
                  <span className="font-mono text-indigo-600">{student.skillGrowth.algorithmicThinking}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-indigo-600 h-full rounded-full transition-all duration-500" 
                    style={{ width: `${student.skillGrowth.algorithmicThinking}%` }}
                  />
                </div>
              </div>

              {/* Skill 2: Robotics & Hardware */}
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span className="flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-emerald-600" /> Robotics Hardware & Circuits
                  </span>
                  <span className="font-mono text-emerald-600">{student.skillGrowth.roboticsHardware}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
                    style={{ width: `${student.skillGrowth.roboticsHardware}%` }}
                  />
                </div>
              </div>

              {/* Skill 3: AI Fundamentals */}
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span className="flex items-center gap-1.5">
                    <Brain className="w-3.5 h-3.5 text-purple-600" /> AI Fundamentals & Machine Learning
                  </span>
                  <span className="font-mono text-purple-600">{student.skillGrowth.aiFundamentals}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-purple-600 h-full rounded-full transition-all duration-500" 
                    style={{ width: `${student.skillGrowth.aiFundamentals}%` }}
                  />
                </div>
              </div>

              {/* Skill 4: Creativity & Problem Solving */}
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Creative Debugging & Problem Solving
                  </span>
                  <span className="font-mono text-amber-600">{student.skillGrowth.creativityProblemSolving}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-amber-500 h-full rounded-full transition-all duration-500" 
                    style={{ width: `${student.skillGrowth.creativityProblemSolving}%` }}
                  />
                </div>
              </div>

              {/* Skill 5: Team Collaboration */}
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-sky-600" /> Teamwork & Peer Communication
                  </span>
                  <span className="font-mono text-sky-600">{student.skillGrowth.teamCollaboration}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-sky-500 h-full rounded-full transition-all duration-500" 
                    style={{ width: `${student.skillGrowth.teamCollaboration}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Weekly Engagement Trend Chart */}
          <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-emerald-600" />
                  6-Week Engagement Trajectory
                </h3>
                <span className="text-xs text-slate-500">Live Lab Metrics</span>
              </div>
              <p className="text-xs text-slate-500 mb-5">
                Composite metric based on task completion speed, curiosity questions asked, and hands-on circuit assembly.
              </p>

              {/* Visual Bars */}
              <div className="pt-4 pb-2">
                <div className="flex items-end justify-between gap-3 h-40 border-b border-slate-200 px-2">
                  {student.weeklyEngagementHistory.map((item, idx) => {
                    const heightPercent = (item.score / 100) * 100;
                    return (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-1 h-full justify-end group">
                        <div className="text-[10px] font-mono text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
                          {item.score}%
                        </div>
                        <div
                          className="w-full max-w-[40px] rounded-t-lg bg-gradient-to-t from-indigo-600 to-indigo-400 group-hover:from-emerald-500 group-hover:to-emerald-400 transition-all duration-300 shadow-sm relative"
                          style={{ height: `${heightPercent}%` }}
                        >
                          <span className="sr-only">{item.week}: {item.score}%</span>
                        </div>
                        <span className="text-[11px] font-bold text-slate-600 mt-1">{item.week}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="flex justify-between text-[11px] text-slate-400 pt-2 px-1">
                  <span>Week 1 (Orientation)</span>
                  <span>Week 6 (Active Project Build)</span>
                </div>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 mt-4 flex items-center justify-between text-xs">
              <span className="text-slate-600">
                <strong>Growth Trend:</strong> Consistent upward trajectory (+16% over 6 weeks)
              </span>
              <span className="text-emerald-600 font-bold flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> Top 5% Focus Tier
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Row: Achievements & Ananth Nagar Mentor Observation */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Achievements */}
          <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" />
              Verified Badges & Accomplishments
            </h3>
            <div className="space-y-3">
              {student.recentAchievements.map((ach) => (
                <div key={ach.id} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-150">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 shadow-xs">
                    <Award className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs sm:text-sm text-slate-900">{ach.title}</span>
                      <span className="text-[11px] text-slate-400">{ach.date}</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5">{ach.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 p-3 bg-indigo-50/70 border border-indigo-100 rounded-xl text-xs text-indigo-900 flex items-center justify-between">
              <div>
                <strong>Next Capstone:</strong> {student.upcomingMilestone}
              </div>
              <span className="font-bold text-indigo-600 shrink-0 ml-2">In 2 Weeks</span>
            </div>
          </div>

          {/* Mentor Feedback Box */}
          <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">
                  FM
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Lead Mentor Observation</h4>
                  <p className="text-[11px] text-slate-500">Future Minds Ananth Nagar Lab</p>
                </div>
              </div>

              <blockquote className="text-xs sm:text-sm text-slate-700 italic bg-slate-50 p-4 rounded-xl border-l-4 border-indigo-600 leading-relaxed">
                &ldquo;{student.mentorFeedback}&rdquo;
              </blockquote>

              <div className="mt-4 text-xs text-slate-500 space-y-1">
                <div className="flex items-center justify-between">
                  <span>Student Age:</span>
                  <span className="font-bold text-slate-700">{student.age} Years</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Enrolled Since:</span>
                  <span className="font-bold text-slate-700">{student.joinedDate}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Lab Location:</span>
                  <span className="font-bold text-indigo-600">Ananth Nagar Campus</span>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100">
              <button
                onClick={onEnrollClick}
                className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm"
              >
                <span>Enroll Your Child to Get Started</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
