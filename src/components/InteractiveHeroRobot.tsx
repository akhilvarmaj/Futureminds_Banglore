import React, { useState } from 'react';
import { Bot, Play, RotateCcw, Volume2, ShieldAlert, Cpu, Code, ArrowRight } from 'lucide-react';

export const InteractiveHeroRobot: React.FC<{ onBookDemo: () => void }> = ({ onBookDemo }) => {
  const [mode, setMode] = useState<'robot' | 'code'>('robot');
  
  // Robot simulator state
  const [distance, setDistance] = useState<number>(28);
  const [robotStatus, setRobotStatus] = useState<string>('Cruising Forward · Path Clear');
  const [robotDirection, setRobotDirection] = useState<'forward' | 'left' | 'right' | 'stopped'>('forward');
  const [soundBeep, setSoundBeep] = useState<boolean>(false);

  const handleDistanceChange = (newVal: number) => {
    setDistance(newVal);
    if (newVal < 15) {
      setRobotStatus('🚨 Obstacle Too Close (<15cm)! Emergency Stop & Reversing.');
      setRobotDirection('stopped');
      setSoundBeep(true);
      setTimeout(() => setSoundBeep(false), 800);
    } else if (newVal < 25) {
      setRobotStatus('⚠️ Object Detected at ' + newVal + 'cm! Turning Left 90°');
      setRobotDirection('left');
    } else {
      setRobotStatus('✅ Cruising Forward · Path Clear (' + newVal + 'cm)');
      setRobotDirection('forward');
    }
  };

  const triggerBeep = () => {
    setSoundBeep(true);
    setTimeout(() => setSoundBeep(false), 500);
  };

  return (
    <div className="w-full bg-white rounded-[28px] border border-[#e6edf7] shadow-[0_20px_50px_rgba(23,105,255,0.12)] overflow-hidden transition-all">
      {/* Top Header with Tab Switcher & Live Indicator */}
      <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-black tracking-wider uppercase text-slate-200">
            Live Lab Simulator
          </span>
        </div>

        <div className="flex items-center bg-slate-800 p-0.5 rounded-lg text-xs font-bold">
          <button
            onClick={() => setMode('robot')}
            className={`px-3 py-1 rounded-md transition ${
              mode === 'robot' ? 'bg-[#1769ff] text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Rover Test
          </button>
          <button
            onClick={() => setMode('code')}
            className={`px-3 py-1 rounded-md transition ${
              mode === 'code' ? 'bg-[#1769ff] text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Block vs Python
          </button>
        </div>
      </div>

      {mode === 'robot' ? (
        /* ================= Mode 1: Interactive Rover Console ================= */
        <div className="p-5 sm:p-6 bg-gradient-to-br from-[#f8fbff] via-white to-[#f0f7ff]">
          {/* Visual Arena Screen */}
          <div className="bg-slate-950 rounded-2xl p-4 sm:p-5 border border-slate-800 relative overflow-hidden mb-5">
            {/* Grid Pattern Background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:16px_16px] opacity-25"></div>

            <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Animated Robot Avatar */}
              <div className="flex items-center gap-4">
                <div 
                  className={`w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center text-4xl shadow-lg transform transition-transform duration-300 ${
                    robotDirection === 'left' ? '-rotate-12 scale-105' :
                    robotDirection === 'right' ? 'rotate-12 scale-105' :
                    robotDirection === 'stopped' ? 'animate-bounce' : 'rotate-0'
                  }`}
                >
                  🤖
                </div>
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#19c3d1]">
                    Smart Rover · Model FM-01
                  </div>
                  <div className="text-base font-bold text-white mt-0.5">
                    {robotDirection === 'forward' && 'Moving Ahead ↑'}
                    {robotDirection === 'left' && 'Turning Left ↰'}
                    {robotDirection === 'right' && 'Turning Right ↱'}
                    {robotDirection === 'stopped' && 'Braked (Collision Shield)'}
                  </div>
                  <div className="text-xs text-slate-400 font-mono mt-0.5">
                    Speed: {robotDirection === 'stopped' ? '0 rpm' : '180 rpm'} | Motor: 2x DC 5V
                  </div>
                </div>
              </div>

              {/* Sensor HUD Badge */}
              <div className="w-full sm:w-auto bg-slate-900/90 border border-slate-800 rounded-xl p-3 text-right flex sm:flex-col justify-between items-center sm:items-end">
                <div className="text-xs text-slate-400 flex items-center gap-1.5 font-semibold">
                  <span className={`w-2 h-2 rounded-full ${distance < 20 ? 'bg-rose-500 animate-pulse' : 'bg-emerald-400'}`}></span>
                  Ultrasonic Radar:
                </div>
                <div className={`text-2xl font-black font-mono ${distance < 20 ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {distance} cm
                </div>
              </div>
            </div>

            {/* Dynamic Status Bar */}
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-300 font-medium">
              <span className="truncate">{robotStatus}</span>
              {soundBeep && (
                <span className="flex items-center gap-1 text-amber-400 animate-pulse font-bold">
                  <Volume2 className="w-3.5 h-3.5" /> BEEP!
                </span>
              )}
            </div>
          </div>

          {/* Interactive Controls: Ultrasonic Distance Slider */}
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center text-xs font-bold text-[#10233f] mb-1.5">
                <span>Slide to test obstacle distance:</span>
                <span className="text-[#1769ff] font-mono">{distance} cm</span>
              </div>
              <input
                type="range"
                min="5"
                max="50"
                value={distance}
                onChange={(e) => handleDistanceChange(Number(e.target.value))}
                className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#1769ff]"
              />
              <div className="flex justify-between text-[10px] text-[#61708a] font-semibold mt-1">
                <span className="text-rose-600">5cm (Collision Danger)</span>
                <span className="text-amber-600">20cm (Turn Threshold)</span>
                <span className="text-emerald-600">50cm (Clear Track)</span>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="grid grid-cols-4 gap-2 pt-1">
              <button
                onClick={() => { setRobotDirection('left'); setRobotStatus('Manually Steered Left'); }}
                className="p-2 rounded-xl border border-[#e6edf7] bg-white hover:bg-slate-50 text-[#10233f] font-bold text-xs shadow-sm transition active:scale-95"
              >
                ↰ Steer Left
              </button>
              <button
                onClick={() => { setRobotDirection('forward'); setRobotStatus('Moving Straight Ahead'); }}
                className="p-2 rounded-xl border border-[#e6edf7] bg-white hover:bg-slate-50 text-[#10233f] font-bold text-xs shadow-sm transition active:scale-95"
              >
                ↑ Forward
              </button>
              <button
                onClick={() => { setRobotDirection('right'); setRobotStatus('Manually Steered Right'); }}
                className="p-2 rounded-xl border border-[#e6edf7] bg-white hover:bg-slate-50 text-[#10233f] font-bold text-xs shadow-sm transition active:scale-95"
              >
                Steer Right ↱
              </button>
              <button
                onClick={triggerBeep}
                className="p-2 rounded-xl border border-[#e6edf7] bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-xs shadow-sm transition active:scale-95 flex items-center justify-center gap-1"
              >
                <Volume2 className="w-3.5 h-3.5" /> Beep
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* ================= Mode 2: Block vs Python Comparison ================= */
        <div className="p-5 sm:p-6 bg-slate-950 text-white font-mono text-xs">
          <div className="flex items-center justify-between mb-3 text-slate-400">
            <span className="flex items-center gap-1.5 text-xs text-indigo-400 font-sans font-bold">
              <Code className="w-4 h-4" /> Visual Block → Typed Python Logic
            </span>
            <span className="text-[10px] bg-indigo-950 border border-indigo-800 text-indigo-300 px-2 py-0.5 rounded-full font-sans">
              Grades 1–10 Curriculum
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            {/* Scratch / Blockly representation */}
            <div className="bg-slate-900 rounded-xl p-3 border border-slate-800">
              <div className="text-[11px] font-sans font-bold text-amber-400 mb-2">
                1. Visual Blocks (Grades 1–4)
              </div>
              <div className="space-y-1.5 font-sans text-[11px]">
                <div className="bg-amber-600 text-white px-2.5 py-1 rounded-md font-bold">
                  when [Green Flag] clicked
                </div>
                <div className="bg-blue-600 text-white px-2.5 py-1 rounded-md font-bold ml-2">
                  repeat forever:
                </div>
                <div className="bg-orange-600 text-white px-2.5 py-1 rounded-md font-bold ml-4">
                  if &lt;distance sensor &lt; 20&gt; then:
                </div>
                <div className="bg-emerald-600 text-white px-2.5 py-1 rounded-md font-bold ml-6">
                  turn left (90) degrees
                </div>
                <div className="bg-purple-600 text-white px-2.5 py-1 rounded-md font-bold ml-4">
                  else: move (10) steps
                </div>
              </div>
            </div>

            {/* Typed Python representation */}
            <div className="bg-slate-900 rounded-xl p-3 border border-slate-800">
              <div className="text-[11px] font-sans font-bold text-[#19c3d1] mb-2">
                2. Real Typed Python (Grades 5–10)
              </div>
              <pre className="text-slate-300 overflow-x-auto text-[11px] leading-relaxed">
{`from futureminds import Rover

robot = Rover(port="COM4")

while True:
    dist = robot.get_distance()
    if dist < 20:
        robot.turn_left(degrees=90)
        robot.beep()
    else:
        robot.forward(speed=80)`}
              </pre>
            </div>
          </div>

          <p className="text-slate-400 font-sans text-xs leading-relaxed">
            💡 Students seamlessly transition from visual thinking to typed industry code as they advance through our grade roadmap!
          </p>
        </div>
      )}

      {/* Card Footer Banner */}
      <div className="px-5 py-3 bg-[#eaf2ff] border-t border-[#d8e6fa] flex items-center justify-between text-xs">
        <div className="text-[#1458d7] font-extrabold flex items-center gap-1.5">
          <Cpu className="w-4 h-4 text-[#1769ff]" />
          <span>Small Batches (4–5 kids) · Ananth Nagar Lab</span>
        </div>
        <button
          onClick={onBookDemo}
          className="font-extrabold text-[#1769ff] hover:text-[#1258d6] hover:underline flex items-center gap-1"
        >
          Book 1-on-1 Trial <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
