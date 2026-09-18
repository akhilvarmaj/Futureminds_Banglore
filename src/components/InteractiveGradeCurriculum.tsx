import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, Bot, Code, Cpu, Award, ArrowRight, CheckCircle2, 
  ChevronLeft, ChevronRight, Compass, Layers, Zap, Check, Eye
} from 'lucide-react';

interface GradeTier {
  id: string;
  stepNumber: string;
  gradeLabel: string;
  ageRange: string;
  phaseName: string;
  title: string;
  tagline: string;
  focus: string;
  hardwareKit: string[];
  softwareTools: string[];
  keyMilestones: string[];
  sampleProject: {
    title: string;
    emoji: string;
    description: string;
  };
  accentColor: string;
  badgeBg: string;
}

const GRADE_TIERS: GradeTier[] = [
  {
    id: 'g1-2',
    stepNumber: '01',
    gradeLabel: 'Grade 1–2',
    ageRange: 'Ages 6–7',
    phaseName: 'Phase 1: Tactile Foundations',
    title: 'Little Innovators: Explore & Create',
    tagline: 'Fostering tactile curiosity with magnetic circuits, motorized gears, and block logic.',
    focus: 'Pattern recognition, basic cause-and-effect mechanics, and intuitive spatial play.',
    hardwareKit: ['Modular Magnetic Snaps', 'Color Sensors', 'Mini DC Motors', 'Buzzer & Light Modules'],
    softwareTools: ['Scratch Jr', 'Story Blocks', 'FutureMinds KidPad'],
    keyMilestones: [
      'Understand how electric currents flow to power motors and LEDs',
      'Build automated merry-go-rounds and crank gear mechanisms',
      'Code visual sequence animations with sound effects and sprite movement',
      'Learn basic troubleshooting of broken circuits with mentor guidance'
    ],
    sampleProject: {
      title: 'Motorized Lighthouse with Auto Night Sensor',
      emoji: '🏮',
      description: 'Children assemble a lighthouse with a spinning optical beacon that turns on automatically when the light sensor detects darkness.'
    },
    accentColor: '#1769ff',
    badgeBg: 'bg-blue-50 text-blue-700 border-blue-200'
  },
  {
    id: 'g3-4',
    stepNumber: '02',
    gradeLabel: 'Grade 3–4',
    ageRange: 'Ages 8–9',
    phaseName: 'Phase 2: Microcontrollers & Sensing',
    title: 'Junior Makers: Build & Experiment',
    tagline: 'Moving from simple circuits into programmable microcontrollers and sensory rovers.',
    focus: 'Loops, if-then logic, ultrasonic distance sensors, and modular 2-wheel chassis construction.',
    hardwareKit: ['BBC Micro:bit v2', 'Ultrasonic Sonar', 'Servo Motors (180°)', 'Infrared Line Sensors'],
    softwareTools: ['MakeCode Blocks', 'Blockly Robotics', 'Tinkercad Circuits'],
    keyMilestones: [
      'Learn variable counters, loops, and conditional if-else statements',
      'Interface ultrasonic echo sensors to measure distance in real time',
      'Assemble a 2-wheel motorized robotic chassis with battery management',
      'Complete hands-on bug-hunt sessions to identify wiring & logic errors'
    ],
    sampleProject: {
      title: 'Smart Room Security Rover with Motion Alarm',
      emoji: '🛡️',
      description: 'A miniature rover that patrols a perimeter and triggers an audible siren when someone approaches.'
    },
    accentColor: '#0ea5e9',
    badgeBg: 'bg-sky-50 text-sky-700 border-sky-200'
  },
  {
    id: 'g5-6',
    stepNumber: '03',
    gradeLabel: 'Grade 5–6',
    ageRange: 'Ages 10–11',
    phaseName: 'Phase 3: Python Syntax & Breadboarding',
    title: 'Code & Engineer: Bridging Blocks to Text',
    tagline: 'Introducing typed Python fundamentals, solderless breadboard prototyping, and autonomous rovers.',
    focus: 'Real syntax, variables, lists, breadboards, Arduino microcontrollers, and motor drivers.',
    hardwareKit: ['Arduino Nano / Uno', 'Solderless Breadboards', 'L298N Motor Driver', 'Multi-Sensor Shield'],
    softwareTools: ['Python 3 Basics', 'Arduino IDE / C++', 'Pygame Turtle'],
    keyMilestones: [
      'Transition from visual blocks to text-based Python and Arduino C++',
      'Master electronic breadboarding: resistors, LEDs, buttons, and analog inputs',
      'Program motor PWM speed modulation for smooth turns and stops',
      'Build multi-mode autonomous vehicles with racetrack testing'
    ],
    sampleProject: {
      title: 'Black-Tape Autonomous Line-Follower Racebot',
      emoji: '🏎️',
      description: 'Calibrates dual infrared optical sensors to follow high-contrast racetrack curves at speed without falling off.'
    },
    accentColor: '#10b981',
    badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200'
  },
  {
    id: 'g7-8',
    stepNumber: '04',
    gradeLabel: 'Grade 7–8',
    ageRange: 'Ages 12–13',
    phaseName: 'Phase 4: Smart IoT & Connected Systems',
    title: 'Innovate & Automate: Smart IoT & Systems',
    tagline: 'Engineering connected smart home IoT devices, sensor telemetry networks, and cloud automation.',
    focus: 'Microcontroller Wi-Fi/Bluetooth, cloud telemetry, logic state machines, and system architecture.',
    hardwareKit: ['ESP32 Wi-Fi / BLE Board', 'OLED Display (128x64)', 'Soil Moisture & DHT11 Weather Sensors', 'Relay Modules'],
    softwareTools: ['Python Data Scripts', 'MQTT / WebSockets', 'ESP-IDF / Arduino'],
    keyMilestones: [
      'Connect microcontrollers to Wi-Fi networks to transmit telemetry',
      'Read environmental sensor data and render live graphs on miniature OLEDs',
      'Control high-power AC/DC loads safely using electronic relays',
      'Build a phone-controlled robotic rover over Bluetooth'
    ],
    sampleProject: {
      title: 'IoT Cloud Weather Station & Auto Greenhouse',
      emoji: '🌦️',
      description: 'Logs temperature, humidity, and soil hydration to a live web dashboard and automatically triggers the watering pump.'
    },
    accentColor: '#8b5cf6',
    badgeBg: 'bg-purple-50 text-purple-700 border-purple-200'
  },
  {
    id: 'g9-10',
    stepNumber: '05',
    gradeLabel: 'Grade 9–10',
    ageRange: 'Ages 14–16',
    phaseName: 'Phase 5: Computer Vision & Edge AI',
    title: 'Future Tech Leaders: AI, Vision & Robotics',
    tagline: 'Advanced neural classifiers, camera computer vision with OpenCV, and competitive robotics capstones.',
    focus: 'Object detection, camera video streams, machine learning models, and portfolio-ready engineering.',
    hardwareKit: ['Raspberry Pi 4 / ESP32-CAM', 'High-Res Wide Camera', 'Robotic Arm Servos (4-DOF)', 'Aluminum Chassis Kit'],
    softwareTools: ['Python 3 (NumPy & OpenCV)', 'TensorFlow Lite for Microcontrollers', 'GitHub Basics'],
    keyMilestones: [
      'Train lightweight machine learning models to classify hand gestures and objects',
      'Process live camera video frames using color thresholding and edge detection',
      'Program a 4-degree-of-freedom robotic arm to pick and sort colored blocks',
      'Build a comprehensive capstone portfolio project for STEM competitions'
    ],
    sampleProject: {
      title: 'Autonomous Vision-Guided Sorting Robotic Arm',
      emoji: '🦾',
      description: 'A webcam identifies red vs blue cubes on a conveyor belt and commands a servo-powered mechanical claw to sort them into distinct bins.'
    },
    accentColor: '#f59e0b',
    badgeBg: 'bg-amber-50 text-amber-700 border-amber-200'
  }
];

export const InteractiveGradeCurriculum: React.FC<{ onSelectGradeDemo: (grade: string) => void }> = ({
  onSelectGradeDemo
}) => {
  const [selectedGradeId, setSelectedGradeId] = useState<string>('g3-4');
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(25);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const currentTier = GRADE_TIERS.find((t) => t.id === selectedGradeId) || GRADE_TIERS[1];

  const updateScrollState = () => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    const maxScroll = scrollWidth - clientWidth;
    setCanScrollLeft(scrollLeft > 20);
    setCanScrollRight(scrollLeft < maxScroll - 20);
    if (maxScroll > 0) {
      setScrollProgress(Math.round((scrollLeft / maxScroll) * 100));
    }
  };

  useEffect(() => {
    updateScrollState();
  }, []);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollOffset = direction === 'left' ? -380 : 380;
      scrollContainerRef.current.scrollBy({ left: scrollOffset, behavior: 'smooth' });
    }
  };

  const scrollToTier = (tierId: string) => {
    setSelectedGradeId(tierId);
    const element = document.getElementById(`tier-card-${tierId}`);
    if (element && scrollContainerRef.current) {
      const containerLeft = scrollContainerRef.current.getBoundingClientRect().left;
      const elementLeft = element.getBoundingClientRect().left;
      const targetScroll = scrollContainerRef.current.scrollLeft + (elementLeft - containerLeft) - 30;
      scrollContainerRef.current.scrollTo({ left: targetScroll, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full space-y-8">
      {/* Roadmap Navigation Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 bg-[#eaf2ff] text-[#1458d7] rounded-full px-3.5 py-1 font-bold text-xs mb-2">
            <Compass className="w-3.5 h-3.5" />
            <span>Interactive Learning Progression (Grades 1–10)</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-[#10233f] tracking-tight">
            Curriculum Timeline & Learning Roadmap
          </h3>
          <p className="text-xs sm:text-sm text-[#61708a] mt-1 max-w-2xl leading-relaxed">
            Scroll horizontally along the timeline to follow how students progressively evolve from tangible circuit blocks to real Python, IoT telemetry, and computer vision AI.
          </p>
        </div>

        {/* Scroll Buttons & Drag Hint */}
        <div className="flex items-center gap-3 self-start md:self-auto shrink-0">
          <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-[#61708a] bg-white px-3 py-1.5 rounded-xl border border-[#e6edf7] shadow-xs">
            <span>Scroll horizontally</span>
            <span className="text-[#1769ff] font-bold">⇄</span>
          </div>

          <div className="flex items-center gap-1.5 bg-white p-1 rounded-2xl border border-[#e6edf7] shadow-xs">
            <button
              onClick={() => handleScroll('left')}
              disabled={!canScrollLeft}
              aria-label="Scroll timeline left"
              className={`p-2 rounded-xl transition ${
                canScrollLeft
                  ? 'hover:bg-[#f0f5ff] text-[#10233f]'
                  : 'text-slate-300 cursor-not-allowed'
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleScroll('right')}
              disabled={!canScrollRight}
              aria-label="Scroll timeline right"
              className={`p-2 rounded-xl transition ${
                canScrollRight
                  ? 'hover:bg-[#f0f5ff] text-[#10233f]'
                  : 'text-slate-300 cursor-not-allowed'
              }`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Jump Stage Badges */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {GRADE_TIERS.map((tier) => {
          const isSelected = tier.id === selectedGradeId;
          return (
            <button
              key={tier.id}
              onClick={() => scrollToTier(tier.id)}
              className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 border ${
                isSelected
                  ? 'bg-[#1769ff] text-white border-[#1769ff] shadow-sm scale-102'
                  : 'bg-white text-[#40516c] border-[#e6edf7] hover:bg-[#f8faff]'
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                isSelected ? 'bg-white/20 text-white' : 'bg-[#eef4fc] text-[#1769ff]'
              }`}>
                {tier.stepNumber}
              </span>
              <span>{tier.gradeLabel}</span>
              <span className={`text-[10px] font-semibold opacity-80`}>({tier.ageRange})</span>
            </button>
          );
        })}
      </div>

      {/* HORIZONTAL ROADMAP CONTAINER */}
      <div className="relative">
        {/* Subtle Horizontal Progression Track Line */}
        <div className="hidden lg:block absolute top-[52px] left-8 right-8 h-1 bg-gradient-to-r from-[#1769ff] via-[#0ea5e9] to-[#f59e0b] rounded-full opacity-30 z-0 pointer-events-none" />

        {/* Scrollable Cards Track */}
        <div
          ref={scrollContainerRef}
          onScroll={updateScrollState}
          className="flex gap-5 overflow-x-auto pb-5 pt-2 px-1 snap-x snap-mandatory scroll-smooth"
          style={{ scrollbarWidth: 'thin' }}
        >
          {GRADE_TIERS.map((tier) => {
            const isSelected = tier.id === selectedGradeId;

            return (
              <div
                key={tier.id}
                id={`tier-card-${tier.id}`}
                onClick={() => setSelectedGradeId(tier.id)}
                className={`snap-start shrink-0 w-[320px] sm:w-[360px] rounded-[24px] border p-6 transition-all duration-300 cursor-pointer flex flex-col justify-between relative bg-white ${
                  isSelected
                    ? 'border-[#1769ff] shadow-[0_15px_35px_rgba(23,105,255,0.18)] ring-2 ring-[#1769ff]/30 -translate-y-1'
                    : 'border-[#e6edf7] hover:border-[#1769ff]/40 hover:shadow-md'
                }`}
              >
                {/* Active Indicator Bar */}
                {isSelected && (
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#1769ff] via-[#19c3d1] to-[#1769ff] rounded-t-[24px]" />
                )}

                <div>
                  {/* Step Header */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div className="flex items-center gap-2">
                      <span className={`w-9 h-9 rounded-2xl flex items-center justify-center font-black text-sm shadow-xs ${
                        isSelected
                          ? 'bg-[#1769ff] text-white'
                          : 'bg-[#eef4fc] text-[#1769ff]'
                      }`}>
                        {tier.stepNumber}
                      </span>
                      <div>
                        <div className="text-xs font-bold text-[#61708a] uppercase tracking-wider">
                          {tier.phaseName.split(':')[0]}
                        </div>
                        <div className="text-base font-black text-[#10233f]">
                          {tier.gradeLabel}
                        </div>
                      </div>
                    </div>

                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${tier.badgeBg}`}>
                      {tier.ageRange}
                    </span>
                  </div>

                  {/* Title & Tagline */}
                  <h4 className="text-base font-bold text-[#10233f] mb-1.5 line-clamp-1">
                    {tier.title}
                  </h4>
                  <p className="text-xs text-[#61708a] leading-relaxed mb-4 line-clamp-2">
                    {tier.tagline}
                  </p>

                  {/* Hardware & Software Badges */}
                  <div className="space-y-3 mb-4">
                    <div className="bg-[#f7faff] border border-[#e6edf7] rounded-xl p-3">
                      <div className="text-[11px] font-bold text-[#10233f] mb-1.5 flex items-center gap-1">
                        <Cpu className="w-3.5 h-3.5 text-[#1769ff]" /> Hands-on Hardware
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {tier.hardwareKit.slice(0, 3).map((hw, idx) => (
                          <span
                            key={idx}
                            className="bg-white border border-[#e4ecf7] text-[#40516c] text-[10px] font-semibold px-2 py-0.5 rounded-md"
                          >
                            {hw}
                          </span>
                        ))}
                        {tier.hardwareKit.length > 3 && (
                          <span className="text-[10px] font-bold text-[#1769ff] px-1 py-0.5">
                            +{tier.hardwareKit.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="bg-[#f7faff] border border-[#e6edf7] rounded-xl p-3">
                      <div className="text-[11px] font-bold text-[#10233f] mb-1.5 flex items-center gap-1">
                        <Code className="w-3.5 h-3.5 text-emerald-600" /> Coding & Tools
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {tier.softwareTools.map((sw, idx) => (
                          <span
                            key={idx}
                            className="bg-white border border-[#e4ecf7] text-[#40516c] text-[10px] font-semibold px-2 py-0.5 rounded-md"
                          >
                            {sw}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Capstone Project Preview Badge */}
                  <div className="bg-gradient-to-r from-[#f0f6ff] to-[#f0fbff] border border-blue-100 rounded-xl p-3 flex items-start gap-2.5">
                    <span className="text-2xl shrink-0">{tier.sampleProject.emoji}</span>
                    <div>
                      <div className="text-[10px] font-extrabold uppercase tracking-wide text-[#1458d7]">
                        Capstone Project
                      </div>
                      <div className="text-xs font-bold text-[#10233f] line-clamp-1">
                        {tier.sampleProject.title}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Footer Button */}
                <div className="pt-4 mt-4 border-t border-[#f0f4fa] flex items-center justify-between">
                  <span className="text-xs font-bold text-[#1769ff] flex items-center gap-1">
                    {isSelected ? 'Currently Viewing' : 'Click to View Details'}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectGradeDemo(tier.gradeLabel);
                    }}
                    className="bg-[#1769ff] hover:bg-[#1258d6] text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-xs transition flex items-center gap-1"
                  >
                    <span>Book Demo</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Scroll Progress Bar */}
        <div className="w-full bg-[#e6edf7] h-1.5 rounded-full overflow-hidden mt-1">
          <div
            className="bg-gradient-to-r from-[#1769ff] to-[#19c3d1] h-full transition-all duration-200 rounded-full"
            style={{ width: `${Math.max(15, scrollProgress)}%` }}
          />
        </div>
      </div>

      {/* SYNCHRONIZED DEEP-DIVE CURRICULUM PANEL */}
      <div className="bg-white border border-[#e6edf7] rounded-[28px] p-6 sm:p-9 shadow-[0_15px_40px_rgba(24,57,105,0.08)]">
        {/* Stage Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-[#e6edf7]">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#eaf2ff] text-[#1458d7] rounded-full px-3 py-1 font-bold text-xs mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>
                Roadmap Stage {currentTier.stepNumber}: {currentTier.gradeLabel} ({currentTier.ageRange})
              </span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-[#10233f] tracking-tight">
              {currentTier.title}
            </h3>
            <p className="text-[#61708a] text-sm mt-1 max-w-2xl leading-relaxed">
              {currentTier.tagline}
            </p>
          </div>

          <button
            onClick={() => onSelectGradeDemo(currentTier.gradeLabel)}
            className="self-start lg:self-center bg-[#1769ff] hover:bg-[#1258d6] text-white px-5 py-3 rounded-xl font-bold text-sm shadow-[0_6px_20px_rgba(23,105,255,0.25)] flex items-center gap-2 transition hover:scale-102"
          >
            <span>Book Free Demo for {currentTier.gradeLabel}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Deep Dive Grid: Key Milestones & Project Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6">
          {/* Left Column: Learning Milestones & Core Focus */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#1769ff] mb-3 flex items-center gap-1.5">
                <Award className="w-4 h-4" /> Core Learning Milestones in {currentTier.gradeLabel}
              </h4>
              <div className="space-y-3">
                {currentTier.keyMilestones.map((milestone, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-sm text-[#10233f] bg-[#f8fbff] p-3 rounded-xl border border-[#e8f1fc]">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="font-medium">{milestone}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Hardware & Software Tools */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="bg-[#f7faff] border border-[#e6edf7] rounded-xl p-4">
                <div className="text-xs font-bold text-[#10233f] mb-2 flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-[#1769ff]" /> Hands-on Hardware Kit (1:1 Ratio)
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {currentTier.hardwareKit.map((hw, i) => (
                    <span key={i} className="bg-white border border-[#e6edf7] text-[#40516c] text-xs font-semibold px-2.5 py-1 rounded-md">
                      {hw}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-[#f7faff] border border-[#e6edf7] rounded-xl p-4">
                <div className="text-xs font-bold text-[#10233f] mb-2 flex items-center gap-1.5">
                  <Code className="w-3.5 h-3.5 text-[#19c3d1]" /> Software & Languages
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {currentTier.softwareTools.map((sw, i) => (
                    <span key={i} className="bg-white border border-[#e6edf7] text-[#40516c] text-xs font-semibold px-2.5 py-1 rounded-md">
                      {sw}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Featured Capstone Project Card */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="h-full bg-gradient-to-br from-[#dfeeff] via-[#edf7ff] to-[#ecfffa] border border-[#d8e8f8] rounded-2xl p-6 sm:p-7 flex flex-col justify-between shadow-sm">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-[#1458d7] bg-white/90 px-3 py-1 rounded-full border border-blue-100">
                    Capstone Build Showcase
                  </span>
                  <span className="text-4xl">{currentTier.sampleProject.emoji}</span>
                </div>
                <h5 className="text-xl font-black text-[#10233f] mb-2">
                  {currentTier.sampleProject.title}
                </h5>
                <p className="text-xs sm:text-sm text-[#475774] leading-relaxed mb-6">
                  {currentTier.sampleProject.description}
                </p>

                <div className="space-y-2 bg-white/80 p-4 rounded-xl border border-blue-100 text-xs font-semibold text-[#10233f]">
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>80% Hands-on physical construction</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Every student builds and tests independently</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Verified in Future Minds Ananth Nagar Lab arena</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-blue-200/60 mt-6 flex items-center justify-between text-xs font-bold text-[#1458d7]">
                <span>Batch: Strictly 4–5 Students</span>
                <button
                  onClick={() => onSelectGradeDemo(currentTier.gradeLabel)}
                  className="text-[#1769ff] hover:underline flex items-center gap-1"
                >
                  <span>Select {currentTier.gradeLabel}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
