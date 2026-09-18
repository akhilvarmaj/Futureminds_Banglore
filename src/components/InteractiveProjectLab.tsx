import React, { useState } from 'react';
import { 
  Bot, Droplets, TrafficCone, Scan, Play, CheckCircle2, 
  Sparkles, ArrowRight, ShieldCheck, Cpu 
} from 'lucide-react';

export const InteractiveProjectLab: React.FC<{ onBookDemo: (projectTitle: string) => void }> = ({ onBookDemo }) => {
  const [activeProject, setActiveProject] = useState<'plant' | 'traffic' | 'vision'>('plant');

  // Project 1: Smart Plant Monitor State
  const [moisture, setMoisture] = useState<number>(24);
  const isPumpActive = moisture < 30;

  // Project 2: Smart Traffic System State
  const [pedestrianWaiting, setPedestrianWaiting] = useState<boolean>(false);
  const [trafficLight, setTrafficLight] = useState<'green' | 'yellow' | 'red'>('green');

  const triggerPedestrianCross = () => {
    setPedestrianWaiting(true);
    setTrafficLight('yellow');
    setTimeout(() => {
      setTrafficLight('red');
      setTimeout(() => {
        setPedestrianWaiting(false);
        setTrafficLight('green');
      }, 2500);
    }, 1000);
  };

  // Project 3: AI Gesture Classifier
  const [selectedGesture, setSelectedGesture] = useState<'rock' | 'paper' | 'scissors' | 'thumbs_up'>('thumbs_up');

  return (
    <div className="w-full space-y-8">
      {/* Project Selector Tabs */}
      <div className="flex flex-wrap gap-2.5 p-1.5 bg-slate-100 rounded-2xl border border-slate-200 max-w-2xl mx-auto">
        <button
          onClick={() => setActiveProject('plant')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
            activeProject === 'plant'
              ? 'bg-white text-[#10233f] shadow-sm border border-slate-200'
              : 'text-[#61708a] hover:text-[#10233f]'
          }`}
        >
          <span>🌱</span> Smart Plant IoT
        </button>

        <button
          onClick={() => setActiveProject('traffic')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
            activeProject === 'traffic'
              ? 'bg-white text-[#10233f] shadow-sm border border-slate-200'
              : 'text-[#61708a] hover:text-[#10233f]'
          }`}
        >
          <span>🚦</span> Intelligent Traffic
        </button>

        <button
          onClick={() => setActiveProject('vision')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
            activeProject === 'vision'
              ? 'bg-white text-[#10233f] shadow-sm border border-slate-200'
              : 'text-[#61708a] hover:text-[#10233f]'
          }`}
        >
          <span>🧠</span> AI Vision Classifier
        </button>
      </div>

      {/* Active Interactive Simulation Display */}
      <div className="bg-white border border-[#e6edf7] rounded-[28px] p-6 sm:p-9 shadow-[0_15px_40px_rgba(24,57,105,0.08)]">
        {activeProject === 'plant' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold">
                <span>🌱 IoT & Environmental Sensing</span> • Grades 3–6
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-[#10233f]">
                Smart Soil Hydration & Auto-Watering Pump
              </h3>
              <p className="text-sm text-[#61708a] leading-relaxed">
                Kids connect analog soil hygrometer pins to an Arduino/Micro:bit microcontroller. When soil dries below 30%, a mini 5V submersible water pump activates automatically to save the plant!
              </p>

              {/* Interactive Soil Slider */}
              <div className="bg-[#f7faff] border border-[#e6edf7] rounded-2xl p-5 space-y-3">
                <div className="flex justify-between items-center text-xs font-bold text-[#10233f]">
                  <span>Adjust Simulated Soil Moisture:</span>
                  <span className={`font-mono text-base ${moisture < 30 ? 'text-amber-600' : 'text-emerald-600'}`}>
                    {moisture}% ({moisture < 30 ? 'Dry Soil · Thirsty' : 'Moist & Healthy'})
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="85"
                  value={moisture}
                  onChange={(e) => setMoisture(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                <div className="flex justify-between text-[11px] font-semibold text-[#61708a]">
                  <span>0% (Bone Dry)</span>
                  <span className="text-amber-600 font-bold">30% Threshold</span>
                  <span>100% (Fully Saturated)</span>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => onBookDemo('Smart Plant Monitor Project')}
                  className="bg-[#1769ff] hover:bg-[#1258d6] text-white px-5 py-3 rounded-xl font-bold text-xs transition flex items-center gap-2"
                >
                  <span>Build This in Demo Class</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Simulation Canvas / Graphic */}
            <div className="lg:col-span-5 bg-gradient-to-br from-emerald-50 to-teal-100/50 rounded-2xl border border-emerald-200/60 p-6 flex flex-col items-center justify-center text-center relative overflow-hidden min-h-[300px]">
              <div className="text-7xl mb-3 transform transition-transform duration-300 hover:scale-110">
                {moisture < 30 ? '🥀' : '🌿'}
              </div>
              <div className="font-extrabold text-lg text-[#10233f]">
                {moisture < 30 ? 'Plant Needs Water!' : 'Plant is Happy!'}
              </div>
              <div className="text-xs text-[#61708a] mt-1 mb-4 font-mono">
                Sensor: Analog A0 = {Math.round(moisture * 10.23)} / 1023
              </div>

              {/* Pump status card */}
              <div className={`px-4 py-2.5 rounded-xl border font-bold text-xs flex items-center gap-2 ${
                isPumpActive 
                  ? 'bg-emerald-500 text-white border-emerald-600 animate-pulse shadow-md' 
                  : 'bg-white text-slate-600 border-slate-200'
              }`}>
                <Droplets className="w-4 h-4" />
                <span>{isPumpActive ? 'Water Pump: ACTIVE 💦' : 'Water Pump: STANDBY 💤'}</span>
              </div>
            </div>
          </div>
        )}

        {activeProject === 'traffic' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 bg-amber-50 text-amber-800 px-3 py-1 rounded-full text-xs font-bold">
                <span>🚦 Urban Automation & Logic</span> • Grades 4–8
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-[#10233f]">
                Intelligent Smart Traffic Control System
              </h3>
              <p className="text-sm text-[#61708a] leading-relaxed">
                Students construct a functioning 4-stage municipal traffic junction using red, yellow, and green LEDs with push-button pedestrian walk requests and timer interrupt algorithms.
              </p>

              <div className="bg-[#f7faff] border border-[#e6edf7] rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#10233f]">
                    Pedestrian Crosswalk Status:
                  </span>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-md ${
                    pedestrianWaiting ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {pedestrianWaiting ? 'Crosswalk Requested 🚶' : 'Cars Flowing Normally 🚗'}
                  </span>
                </div>

                <button
                  onClick={triggerPedestrianCross}
                  disabled={pedestrianWaiting}
                  className="w-full bg-[#1769ff] hover:bg-[#1258d6] disabled:opacity-60 text-white py-3 rounded-xl font-bold text-xs transition flex items-center justify-center gap-2 shadow-sm"
                >
                  <TrafficCone className="w-4 h-4" />
                  <span>Press Pedestrian Pushbutton (Simulate Crosswalk)</span>
                </button>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => onBookDemo('Smart Traffic System Project')}
                  className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-3 rounded-xl font-bold text-xs transition flex items-center gap-2"
                >
                  <span>Experience This in Demo Class</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Traffic Signal Animation View */}
            <div className="lg:col-span-5 bg-slate-950 rounded-2xl border border-slate-800 p-6 flex flex-col items-center justify-center text-center min-h-[300px]">
              {/* Traffic Light Housing */}
              <div className="w-24 bg-slate-900 border-2 border-slate-700 rounded-3xl p-3 flex flex-col gap-3 shadow-xl mb-4">
                <div className={`w-16 h-16 rounded-full mx-auto transition-all duration-300 ${
                  trafficLight === 'red' 
                    ? 'bg-rose-500 shadow-[0_0_25px_rgba(244,63,94,0.9)]' 
                    : 'bg-rose-950/60 opacity-30'
                }`} />
                <div className={`w-16 h-16 rounded-full mx-auto transition-all duration-300 ${
                  trafficLight === 'yellow' 
                    ? 'bg-amber-400 shadow-[0_0_25px_rgba(251,191,36,0.9)]' 
                    : 'bg-amber-950/60 opacity-30'
                }`} />
                <div className={`w-16 h-16 rounded-full mx-auto transition-all duration-300 ${
                  trafficLight === 'green' 
                    ? 'bg-emerald-400 shadow-[0_0_25px_rgba(52,211,153,0.9)]' 
                    : 'bg-emerald-950/60 opacity-30'
                }`} />
              </div>

              <div className="text-xs font-mono text-slate-300">
                Current Light: <span className="font-bold uppercase text-white">{trafficLight}</span>
              </div>
            </div>
          </div>
        )}

        {activeProject === 'vision' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-xs font-bold">
                <span>🧠 AI & Computer Vision</span> • Grades 6–10
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-[#10233f]">
                AI Hand Gesture & Pattern Recognition
              </h3>
              <p className="text-sm text-[#61708a] leading-relaxed">
                Older students train deep neural models using webcam video streams to recognise hand signs, play computer-vs-human rock-paper-scissors, and trigger robotics actuators.
              </p>

              {/* Gesture test buttons */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-[#10233f]">
                  Select Hand Sign to Test Neural Confidence:
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'thumbs_up', label: 'Thumbs Up', icon: '👍' },
                    { id: 'rock', label: 'Rock / Fist', icon: '✊' },
                    { id: 'paper', label: 'Paper / Palm', icon: '✋' },
                    { id: 'scissors', label: 'Victory / Two', icon: '✌️' },
                  ].map((g) => (
                    <button
                      key={g.id}
                      onClick={() => setSelectedGesture(g.id as any)}
                      className={`p-3 rounded-xl border text-xs font-bold transition flex flex-col items-center gap-1 ${
                        selectedGesture === g.id
                          ? 'bg-[#1769ff] text-white border-[#1769ff] shadow-sm'
                          : 'bg-white text-[#10233f] border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <span className="text-2xl">{g.icon}</span>
                      <span>{g.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => onBookDemo('AI Vision & Gesture Project')}
                  className="bg-[#1769ff] hover:bg-[#1258d6] text-white px-5 py-3 rounded-xl font-bold text-xs transition flex items-center gap-2"
                >
                  <span>Build AI Models in Demo Class</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Neural Network HUD */}
            <div className="lg:col-span-5 bg-slate-950 rounded-2xl border border-slate-800 p-6 flex flex-col justify-between min-h-[300px] text-white">
              <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-3">
                <span className="flex items-center gap-1.5 text-purple-400 font-bold">
                  <Scan className="w-4 h-4" /> Webcam Classifier Stream
                </span>
                <span className="font-mono text-emerald-400">30 FPS · 0.04ms</span>
              </div>

              <div className="my-6 text-center">
                <div className="text-7xl mb-2">
                  {selectedGesture === 'thumbs_up' && '👍'}
                  {selectedGesture === 'rock' && '✊'}
                  {selectedGesture === 'paper' && '✋'}
                  {selectedGesture === 'scissors' && '✌️'}
                </div>
                <div className="text-lg font-bold text-white uppercase tracking-wider">
                  {selectedGesture.replace('_', ' ')}
                </div>
                <div className="text-xs font-mono text-emerald-400 mt-1">
                  Confidence: 98.4% MATCH
                </div>
              </div>

              <div className="space-y-1.5 text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-800">
                <div className="flex justify-between">
                  <span>Class: {selectedGesture}</span>
                  <span className="text-emerald-400">0.984</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full w-[98%]"></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
