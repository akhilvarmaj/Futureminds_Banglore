import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, RotateCcw, Award, Sparkles, Bot, Brain, ArrowUp, 
  ArrowLeft, ArrowRight, Zap, CheckCircle2, AlertTriangle, 
  ChevronRight, Terminal, HelpCircle, Flame
} from 'lucide-react';
import confetti from 'canvas-confetti';

type CommandType = 'FORWARD' | 'TURN_LEFT' | 'TURN_RIGHT' | 'COLLECT' | 'SCAN_AI';

interface LevelConfig {
  id: number;
  title: string;
  subtitle: string;
  gridSize: number;
  startPos: { x: number; y: number; dir: 'N' | 'E' | 'S' | 'W' };
  goalPos: { x: number; y: number };
  crystals: { x: number; y: number; collected: boolean }[];
  obstacles: { x: number; y: number }[];
  targetCrystals: number;
  hint: string;
}

const LEVELS: LevelConfig[] = [
  {
    id: 1,
    title: 'Level 1: First Rover Mission',
    subtitle: 'Navigate your rover to collect the battery crystal and dock at the research base.',
    gridSize: 5,
    startPos: { x: 0, y: 4, dir: 'N' },
    goalPos: { x: 4, y: 0 },
    crystals: [
      { x: 0, y: 2, collected: false },
      { x: 2, y: 2, collected: false }
    ],
    obstacles: [
      { x: 1, y: 3 },
      { x: 3, y: 1 }
    ],
    targetCrystals: 2,
    hint: 'Move forward twice to grab the first battery, then turn right!'
  },
  {
    id: 2,
    title: 'Level 2: AI Obstacle Radar',
    subtitle: 'Avoid Martian boulders using sensory navigation and reach the communications dish.',
    gridSize: 5,
    startPos: { x: 0, y: 4, dir: 'E' },
    goalPos: { x: 4, y: 4 },
    crystals: [
      { x: 2, y: 3, collected: false },
      { x: 4, y: 1, collected: false }
    ],
    obstacles: [
      { x: 1, y: 4 },
      { x: 2, y: 4 },
      { x: 3, y: 4 },
      { x: 2, y: 2 }
    ],
    targetCrystals: 2,
    hint: 'Turn North early to detour around the rock barricade!'
  },
  {
    id: 3,
    title: 'Level 3: Deep Crater Exploration',
    subtitle: 'Advanced robotic sequence: gather all energy cores to power the Future Minds station.',
    gridSize: 6,
    startPos: { x: 0, y: 5, dir: 'N' },
    goalPos: { x: 5, y: 0 },
    crystals: [
      { x: 0, y: 3, collected: false },
      { x: 3, y: 3, collected: false },
      { x: 5, y: 2, collected: false }
    ],
    obstacles: [
      { x: 1, y: 4 },
      { x: 2, y: 4 },
      { x: 1, y: 2 },
      { x: 3, y: 2 },
      { x: 4, y: 2 }
    ],
    targetCrystals: 3,
    hint: 'Plan your route step-by-step. Break it down into sub-goals!'
  }
];

export const InteractiveLessons: React.FC<{ onEnrollClick: () => void }> = ({ onEnrollClick }) => {
  const [activeTab, setActiveTab] = useState<'rover' | 'aiVision'>('rover');
  const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
  const currentLevel = LEVELS[currentLevelIdx];

  // Rover state
  const [roverPos, setRoverPos] = useState({ ...currentLevel.startPos });
  const [program, setProgram] = useState<CommandType[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [executingStep, setExecutingStep] = useState<number | null>(null);
  const [crystals, setCrystals] = useState(currentLevel.crystals);
  const [missionStatus, setMissionStatus] = useState<'idle' | 'running' | 'success' | 'crashed'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  // AI Vision state
  const [selectedAiItem, setSelectedAiItem] = useState<'rover' | 'microchip' | 'sensor' | 'drone'>('rover');
  const [confidenceNoise, setConfidenceNoise] = useState(0);

  // Reset rover when level changes
  useEffect(() => {
    resetLevel();
  }, [currentLevelIdx]);

  const resetLevel = () => {
    const lvl = LEVELS[currentLevelIdx];
    setRoverPos({ ...lvl.startPos });
    setCrystals(lvl.crystals.map((c) => ({ ...c, collected: false })));
    setIsRunning(false);
    setExecutingStep(null);
    setMissionStatus('idle');
    setStatusMessage('');
  };

  const addCommand = (cmd: CommandType) => {
    if (isRunning || program.length >= 16) return;
    setProgram((prev) => [...prev, cmd]);
  };

  const removeCommand = (index: number) => {
    if (isRunning) return;
    setProgram((prev) => prev.filter((_, i) => i !== index));
  };

  const clearProgram = () => {
    if (isRunning) return;
    setProgram([]);
    resetLevel();
  };

  // Run program sequence
  const runProgram = async () => {
    if (program.length === 0 || isRunning) return;

    setIsRunning(true);
    setMissionStatus('running');
    setStatusMessage('Robot executing command pipeline...');

    let curX = roverPos.x;
    let curY = roverPos.y;
    let curDir = roverPos.dir;
    let curCrystals = [...crystals];

    for (let i = 0; i < program.length; i++) {
      setExecutingStep(i);
      const cmd = program[i];

      await new Promise((resolve) => setTimeout(resolve, 550));

      if (cmd === 'TURN_LEFT') {
        const dirs: ('N' | 'W' | 'S' | 'E')[] = ['N', 'W', 'S', 'E'];
        const mapNext: Record<string, 'N' | 'W' | 'S' | 'E'> = { N: 'W', W: 'S', S: 'E', E: 'N' };
        curDir = mapNext[curDir];
        setRoverPos((prev) => ({ ...prev, dir: curDir }));
      } else if (cmd === 'TURN_RIGHT') {
        const mapNext: Record<string, 'N' | 'W' | 'S' | 'E'> = { N: 'E', E: 'S', S: 'W', W: 'N' };
        curDir = mapNext[curDir];
        setRoverPos((prev) => ({ ...prev, dir: curDir }));
      } else if (cmd === 'FORWARD') {
        let nextX = curX;
        let nextY = curY;

        if (curDir === 'N') nextY -= 1;
        if (curDir === 'S') nextY += 1;
        if (curDir === 'E') nextX += 1;
        if (curDir === 'W') nextX -= 1;

        // Check bounds
        if (nextX < 0 || nextX >= currentLevel.gridSize || nextY < 0 || nextY >= currentLevel.gridSize) {
          setIsRunning(false);
          setMissionStatus('crashed');
          setStatusMessage('Ouch! Rover hit the crater border. Check coordinates!');
          return;
        }

        // Check obstacle collision
        const isObstacle = currentLevel.obstacles.some((o) => o.x === nextX && o.y === nextY);
        if (isObstacle) {
          setIsRunning(false);
          setMissionStatus('crashed');
          setStatusMessage('Collision! Rover hit a boulder. Use sensor scans to bypass!');
          return;
        }

        curX = nextX;
        curY = nextY;
        setRoverPos({ x: curX, y: curY, dir: curDir });

        // Auto-check crystal collection on step
        const crystalIdx = curCrystals.findIndex((c) => !c.collected && c.x === curX && c.y === curY);
        if (crystalIdx !== -1) {
          curCrystals[crystalIdx].collected = true;
          setCrystals([...curCrystals]);
        }
      } else if (cmd === 'COLLECT' || cmd === 'SCAN_AI') {
        const crystalIdx = curCrystals.findIndex((c) => !c.collected && c.x === curX && c.y === curY);
        if (crystalIdx !== -1) {
          curCrystals[crystalIdx].collected = true;
          setCrystals([...curCrystals]);
        }
      }
    }

    setExecutingStep(null);
    setIsRunning(false);

    // Final evaluation
    const collectedCount = curCrystals.filter((c) => c.collected).length;
    const isAtGoal = curX === currentLevel.goalPos.x && curY === currentLevel.goalPos.y;

    if (isAtGoal && collectedCount >= currentLevel.targetCrystals) {
      setMissionStatus('success');
      setStatusMessage(`Mission Accomplished! Docked at base station with ${collectedCount} crystals!`);
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (err) {
        // graceful fallback if canvas blocked
      }
    } else if (isAtGoal && collectedCount < currentLevel.targetCrystals) {
      setMissionStatus('idle');
      setStatusMessage(`Docked at base, but missed ${currentLevel.targetCrystals - collectedCount} energy crystals! Try again.`);
    } else {
      setMissionStatus('idle');
      setStatusMessage(`Sequence complete, but rover hasn't reached the base dock (${currentLevel.goalPos.x}, ${currentLevel.goalPos.y}) yet.`);
    }
  };

  // AI Vision simulator data
  const aiClassifications: Record<string, { label: string; confidence: number; features: string[]; category: string }> = {
    rover: {
      label: 'Autonomous Planetary Rover',
      confidence: Math.min(99.2, 98.4 + confidenceNoise),
      features: ['Six-wheel rocker-bogie mechanism', 'Masthead LiDAR sensor', 'High-gain antenna array'],
      category: 'Robotics Hardware'
    },
    microchip: {
      label: 'ESP32 IoT Microcontroller',
      confidence: Math.min(99.8, 97.5 + confidenceNoise),
      features: ['Dual-core Xtensa processor', 'Wi-Fi / Bluetooth antenna trace', 'GPIO pin headers'],
      category: 'Embedded Electronics'
    },
    sensor: {
      label: 'Ultrasonic Distance Transducer',
      confidence: Math.min(99.5, 96.8 + confidenceNoise),
      features: ['Dual ultrasonic mesh barrels', 'Echo & Trigger PWM pins', 'Compact PCB mount'],
      category: 'Sensory Perception'
    },
    drone: {
      label: 'Autonomous Quadcopter Drone',
      confidence: Math.min(98.9, 95.1 + confidenceNoise),
      features: ['Brushless motor quad rotor', 'Optical flow downward camera', 'Flight controller IMU'],
      category: 'Aerospace AI'
    }
  };

  const currentAi = aiClassifications[selectedAiItem];

  return (
    <section id="interactive-lessons" className="py-16 bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 text-white relative overflow-hidden">
      {/* Subtle background circuit lines */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Live Hands-On Experience
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Try a Real Lesson: Code, Robots & AI
          </h2>
          <p className="text-slate-300 text-sm sm:text-base mt-3">
            At Future Minds, children don&apos;t just memorize theory—they build logic block-by-block, command real robots, and train machine learning models. Test our interactive learning engine below!
          </p>

          {/* Module Selector Tabs */}
          <div className="inline-flex p-1 bg-slate-800/80 rounded-xl border border-slate-700/80 mt-6 shadow-lg">
            <button
              onClick={() => setActiveTab('rover')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition ${
                activeTab === 'rover'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Bot className="w-4 h-4" />
              Rover Maze Coding (Ages 6-12)
            </button>
            <button
              onClick={() => setActiveTab('aiVision')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition ${
                activeTab === 'aiVision'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Brain className="w-4 h-4" />
              AI Vision Classifier (Ages 9-16)
            </button>
          </div>
        </div>

        {/* Rover Navigation Interactive Module */}
        {activeTab === 'rover' && (
          <div className="bg-slate-800/90 border border-slate-700 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md">
            {/* Level bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-700/80 mb-6">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Bot className="w-5 h-5 text-indigo-400" />
                    {currentLevel.title}
                  </h3>
                  <span className="px-2 py-0.5 text-xs bg-indigo-500/20 text-indigo-300 rounded font-medium border border-indigo-500/30">
                    Ages 6-12 Module
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1">{currentLevel.subtitle}</p>
              </div>

              {/* Level Selector */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-medium">Select Mission:</span>
                <div className="flex gap-1.5">
                  {LEVELS.map((lvl, idx) => (
                    <button
                      key={lvl.id}
                      onClick={() => setCurrentLevelIdx(idx)}
                      className={`w-8 h-8 rounded-lg text-xs font-bold transition flex items-center justify-center ${
                        currentLevelIdx === idx
                          ? 'bg-indigo-500 text-white shadow-lg'
                          : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                      }`}
                    >
                      {lvl.id}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Interactive Grid and Code Block Deck */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Rover Arena Canvas */}
              <div className="lg:col-span-7 bg-slate-950 p-5 rounded-2xl border border-slate-700 flex flex-col items-center justify-center">
                <div className="w-full flex items-center justify-between text-xs text-slate-400 mb-3 px-1">
                  <span className="flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    Crystals Collected: <strong className="text-amber-300">{crystals.filter((c) => c.collected).length} / {currentLevel.targetCrystals}</strong>
                  </span>
                  <span className="flex items-center gap-1 text-slate-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    Rover Sensor Active
                  </span>
                </div>

                {/* Grid */}
                <div 
                  className="grid gap-1.5 p-2 bg-slate-900 rounded-xl border border-slate-800 shadow-inner w-full max-w-[420px] aspect-square"
                  style={{
                    gridTemplateColumns: `repeat(${currentLevel.gridSize}, minmax(0, 1fr))`,
                    gridTemplateRows: `repeat(${currentLevel.gridSize}, minmax(0, 1fr))`
                  }}
                >
                  {Array.from({ length: currentLevel.gridSize * currentLevel.gridSize }).map((_, idx) => {
                    const x = idx % currentLevel.gridSize;
                    const y = Math.floor(idx / currentLevel.gridSize);

                    const isRoverHere = roverPos.x === x && roverPos.y === y;
                    const isGoal = currentLevel.goalPos.x === x && currentLevel.goalPos.y === y;
                    const isObstacle = currentLevel.obstacles.some((o) => o.x === x && o.y === y);
                    const crystalObj = crystals.find((c) => c.x === x && c.y === y);

                    // Direction indicator rotation
                    const dirRotation = {
                      N: 'rotate-0',
                      E: 'rotate-90',
                      S: 'rotate-180',
                      W: '-rotate-90'
                    }[roverPos.dir];

                    return (
                      <div
                        key={`${x}-${y}`}
                        className={`relative rounded-lg flex items-center justify-center transition-all duration-300 ${
                          isRoverHere
                            ? 'bg-indigo-600/40 border-2 border-indigo-400 shadow-lg shadow-indigo-500/20'
                            : isGoal
                            ? 'bg-emerald-950/60 border-2 border-dashed border-emerald-400/80'
                            : isObstacle
                            ? 'bg-red-950/40 border border-red-900/60'
                            : 'bg-slate-800/60 border border-slate-700/40 hover:bg-slate-800'
                        }`}
                      >
                        {/* Grid coordinates */}
                        <span className="absolute top-1 left-1 text-[9px] text-slate-500 font-mono">
                          {x},{y}
                        </span>

                        {/* Rover Item */}
                        {isRoverHere && (
                          <div className={`transition-transform duration-300 ${dirRotation} flex flex-col items-center`}>
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-indigo-400 text-white flex items-center justify-center shadow-lg ring-2 ring-white/50">
                              <Bot className="w-5 h-5" />
                            </div>
                            <div className="w-1.5 h-1.5 bg-amber-400 rounded-full mt-0.5"></div>
                          </div>
                        )}

                        {/* Goal Base Station */}
                        {!isRoverHere && isGoal && (
                          <div className="flex flex-col items-center text-center p-1">
                            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-400/40">
                              <CheckCircle2 className="w-4 h-4" />
                            </div>
                            <span className="text-[8px] font-bold text-emerald-300 uppercase tracking-tighter mt-0.5">BASE</span>
                          </div>
                        )}

                        {/* Crystal */}
                        {!isRoverHere && crystalObj && !crystalObj.collected && (
                          <div className="flex flex-col items-center animate-bounce">
                            <Zap className="w-5 h-5 text-amber-400 fill-amber-400 filter drop-shadow(0 0 4px #fbbf24)" />
                          </div>
                        )}

                        {/* Obstacle Boulder */}
                        {!isRoverHere && isObstacle && (
                          <div className="text-center">
                            <div className="w-6 h-6 rounded-md bg-stone-700/80 text-stone-300 flex items-center justify-center text-xs font-mono">
                              ⛰️
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Status Bar */}
                <div className="w-full mt-3 p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    {missionStatus === 'success' ? (
                      <span className="text-emerald-400 font-semibold flex items-center gap-1">
                        <Award className="w-4 h-4" /> {statusMessage}
                      </span>
                    ) : missionStatus === 'crashed' ? (
                      <span className="text-red-400 font-semibold flex items-center gap-1">
                        <AlertTriangle className="w-4 h-4" /> {statusMessage}
                      </span>
                    ) : (
                      <span className="text-slate-300 flex items-center gap-1">
                        <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
                        {statusMessage || currentLevel.hint}
                      </span>
                    )}
                  </div>
                  {missionStatus === 'success' && currentLevelIdx < LEVELS.length - 1 && (
                    <button
                      onClick={() => setCurrentLevelIdx((prev) => prev + 1)}
                      className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold rounded flex items-center gap-1"
                    >
                      Next Level <ChevronRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>

              {/* Block Coding Workspace & Command Toolbox */}
              <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
                {/* Available Blocks Toolbox */}
                <div>
                  <div className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center justify-between">
                    <span>1. Click Command Blocks to Program:</span>
                    <span className="text-[11px] text-indigo-300">Max 16 steps</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => addCommand('FORWARD')}
                      disabled={isRunning}
                      className="p-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-sm transition active:scale-95"
                    >
                      <ArrowUp className="w-4 h-4 text-indigo-200" />
                      Move Forward
                    </button>

                    <button
                      onClick={() => addCommand('TURN_LEFT')}
                      disabled={isRunning}
                      className="p-2.5 bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-sm transition active:scale-95"
                    >
                      <ArrowLeft className="w-4 h-4 text-sky-200" />
                      Turn Left 90°
                    </button>

                    <button
                      onClick={() => addCommand('TURN_RIGHT')}
                      disabled={isRunning}
                      className="p-2.5 bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-sm transition active:scale-95"
                    >
                      <ArrowRight className="w-4 h-4 text-sky-200" />
                      Turn Right 90°
                    </button>

                    <button
                      onClick={() => addCommand('SCAN_AI')}
                      disabled={isRunning}
                      className="p-2.5 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-sm transition active:scale-95"
                    >
                      <Zap className="w-4 h-4 text-amber-200" />
                      Grab Crystal
                    </button>
                  </div>
                </div>

                {/* Program Sequence Queue */}
                <div className="flex-1 bg-slate-950/80 p-3.5 rounded-2xl border border-slate-700 min-h-[160px] flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                      <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                        <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                        Rover Script Pipeline ({program.length} commands)
                      </span>
                      {program.length > 0 && (
                        <button
                          onClick={clearProgram}
                          disabled={isRunning}
                          className="text-[11px] text-red-400 hover:text-red-300 disabled:opacity-50"
                        >
                          Clear All
                        </button>
                      )}
                    </div>

                    {program.length === 0 ? (
                      <div className="h-28 flex flex-col items-center justify-center text-center p-3 text-slate-500 text-xs border border-dashed border-slate-800 rounded-xl">
                        <Bot className="w-6 h-6 mb-1 text-slate-600" />
                        No code yet! Click the colorful blocks above to program the rover.
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-1">
                        {program.map((cmd, idx) => (
                          <div
                            key={idx}
                            onClick={() => removeCommand(idx)}
                            className={`group relative px-2.5 py-1.5 rounded-lg text-xs font-mono font-medium flex items-center gap-1.5 cursor-pointer transition ${
                              executingStep === idx
                                ? 'bg-amber-500 text-slate-950 font-bold scale-105 shadow-md shadow-amber-500/30 ring-2 ring-white'
                                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                            }`}
                            title="Click to remove"
                          >
                            <span className="text-[10px] text-slate-400">{idx + 1}.</span>
                            <span>{cmd}</span>
                            <span className="text-[10px] text-red-400 opacity-0 group-hover:opacity-100 transition">×</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Execution Action Row */}
                  <div className="pt-3 border-t border-slate-800 flex items-center gap-2">
                    <button
                      onClick={runProgram}
                      disabled={isRunning || program.length === 0}
                      id="btn-run-rover-program"
                      className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 transition active:scale-95"
                    >
                      <Play className="w-4 h-4 fill-white" />
                      {isRunning ? 'Robot Executing...' : 'Run Robot Program'}
                    </button>
                    <button
                      onClick={resetLevel}
                      disabled={isRunning}
                      className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs transition"
                      title="Reset Rover Position"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Trial CTA nudge */}
                <div className="p-3 bg-indigo-950/60 border border-indigo-500/30 rounded-xl flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-indigo-200">Loved this logic simulation?</span>
                    <div className="text-[11px] text-slate-400">Kids at our Ananth Nagar lab build this with real physical motors!</div>
                  </div>
                  <button
                    onClick={onEnrollClick}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold shrink-0 shadow-sm transition"
                  >
                    Enroll Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* AI Vision Classifier Module */}
        {activeTab === 'aiVision' && (
          <div className="bg-slate-800/90 border border-slate-700 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md">
            <div className="max-w-3xl mb-6">
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Brain className="w-5 h-5 text-indigo-400" />
                  AI Vision & Machine Learning Playground
                </h3>
                <span className="px-2 py-0.5 text-xs bg-indigo-500/20 text-indigo-300 rounded font-medium border border-indigo-500/30">
                  Ages 9-16 Module
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Experience how convolutional neural networks break down shapes, edges, and features to classify robotics components in real-time.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              {/* Select object input */}
              <div className="lg:col-span-5 space-y-4">
                <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Select Hardware Sample for AI Camera:
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 'rover', name: 'Rover Chassis', icon: '🤖', desc: 'Six-wheel rover model' },
                    { id: 'microchip', name: 'ESP32 IoT Chip', icon: '⚡', desc: 'Dual-core MCU' },
                    { id: 'sensor', name: 'Ultrasonic Sensor', icon: '📡', desc: 'HC-SR04 sonar' },
                    { id: 'drone', name: 'Flight Drone', icon: '🚁', desc: 'Quadcopter frame' }
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setSelectedAiItem(item.id as any);
                        setConfidenceNoise((Math.random() - 0.5) * 2);
                      }}
                      className={`p-3 rounded-2xl border text-left transition flex items-center gap-3 ${
                        selectedAiItem === item.id
                          ? 'border-indigo-500 bg-indigo-600/30 text-white ring-2 ring-indigo-500/40'
                          : 'border-slate-700 bg-slate-900/60 text-slate-300 hover:border-slate-600'
                      }`}
                    >
                      <span className="text-2xl">{item.icon}</span>
                      <div>
                        <div className="text-xs font-bold">{item.name}</div>
                        <div className="text-[10px] text-slate-400">{item.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Interactive slider to tune model confidence */}
                <div className="p-4 bg-slate-900/80 rounded-2xl border border-slate-700">
                  <div className="flex justify-between text-xs text-slate-300 mb-2">
                    <span className="font-semibold">Simulate Camera Lighting & Noise:</span>
                    <span className="font-mono text-indigo-400">{confidenceNoise >= 0 ? '+ ' : ''}{confidenceNoise.toFixed(1)}%</span>
                  </div>
                  <input
                    type="range"
                    min="-4"
                    max="1"
                    step="0.2"
                    value={confidenceNoise}
                    onChange={(e) => setConfidenceNoise(parseFloat(e.target.value))}
                    className="w-full accent-indigo-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                    <span>Dim Lighting / Blur</span>
                    <span>Studio Bright</span>
                  </div>
                </div>
              </div>

              {/* Real-time AI Neural Output */}
              <div className="lg:col-span-7 bg-slate-950 p-6 rounded-2xl border border-slate-700 space-y-5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                      Neural Inference Engine Live
                    </span>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">FutureMinds-YOLOv8-Kids</span>
                </div>

                {/* Primary Prediction */}
                <div className="bg-slate-900/90 p-4 rounded-xl border border-indigo-500/40 flex items-center justify-between">
                  <div>
                    <div className="text-[11px] text-slate-400 uppercase tracking-wider">Identified Component:</div>
                    <div className="text-lg font-bold text-white flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      {currentAi.label}
                    </div>
                    <div className="text-xs text-indigo-300 mt-0.5 font-medium">Domain: {currentAi.category}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[11px] text-slate-400 uppercase tracking-wider">Confidence:</div>
                    <div className="text-2xl font-black text-emerald-400 font-mono">
                      {currentAi.confidence.toFixed(1)}%
                    </div>
                  </div>
                </div>

                {/* Detected Feature Vectors */}
                <div>
                  <div className="text-xs font-semibold text-slate-300 mb-2">
                    Visual Feature Vectors Extracted by Convolution:
                  </div>
                  <div className="space-y-1.5">
                    {currentAi.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-center gap-2 text-xs text-slate-300 bg-slate-900/60 px-3 py-1.5 rounded-lg border border-slate-800">
                        <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                        <span>{feat}</span>
                        <span className="ml-auto text-[10px] text-emerald-400 font-mono">Weight: 0.{(90 + fIdx * 3).toString()}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Interactive CTA to enroll */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                  <span className="text-slate-400">
                    Want your child to train real computer vision models on Python & OpenCV?
                  </span>
                  <button
                    onClick={onEnrollClick}
                    className="w-full sm:w-auto px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition shadow-md shrink-0 flex items-center justify-center gap-1.5"
                  >
                    <Flame className="w-3.5 h-3.5" /> Book Ananth Nagar Trial
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
