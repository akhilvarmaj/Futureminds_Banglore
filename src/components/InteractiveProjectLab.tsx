import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, Droplets, TrafficCone, Scan, Play, RotateCcw, 
  Sparkles, ArrowRight, ShieldCheck, Cpu, Volume2, 
  VolumeX, CheckCircle2, Award, Zap, AlertCircle, Compass
} from 'lucide-react';
import { labAudio } from '../utils/labAudio';

type LabTab = 'rover_maze' | 'logic_gates' | 'ai_vision' | 'smart_iot';

interface MazeCell {
  row: number;
  col: number;
  type: 'empty' | 'wall' | 'battery' | 'goal' | 'start';
}

const MAZE_LAYOUTS: Record<string, { name: string; grid: number[][]; start: [number, number]; goal: [number, number] }> = {
  easy: {
    name: 'Novice Runway (Grades 1–4)',
    start: [0, 0],
    goal: [4, 4],
    grid: [
      [0, 0, 1, 0, 0],
      [1, 0, 0, 0, 1],
      [0, 0, 1, 0, 2],
      [0, 1, 0, 0, 0],
      [0, 0, 0, 1, 3], // 2 = battery, 3 = goal
    ],
  },
  maze: {
    name: 'Robo-Maze Circuit (Grades 5–7)',
    start: [0, 0],
    goal: [4, 4],
    grid: [
      [0, 0, 1, 0, 0],
      [1, 0, 1, 0, 1],
      [0, 0, 0, 2, 0],
      [0, 1, 1, 1, 0],
      [2, 0, 0, 0, 3],
    ],
  },
  hard: {
    name: 'Electronic City Grid (Grades 8–10)',
    start: [0, 0],
    goal: [4, 4],
    grid: [
      [0, 1, 0, 0, 0],
      [0, 1, 0, 1, 0],
      [0, 0, 2, 1, 0],
      [1, 1, 0, 1, 0],
      [0, 0, 0, 0, 3],
    ],
  },
};

export const InteractiveProjectLab: React.FC<{ onBookDemo: (projectTitle: string) => void }> = ({ onBookDemo }) => {
  const [activeTab, setActiveTab] = useState<LabTab>('rover_maze');
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(false);

  // ================= GAME 1: ROVER MAZE & CODE SEQUENCER STATE =================
  const [selectedMapKey, setSelectedMapKey] = useState<string>('easy');
  const [roverPos, setRoverPos] = useState<[number, number]>([0, 0]);
  const [roverHeading, setRoverHeading] = useState<'N' | 'E' | 'S' | 'W'>('E');
  const [codeSequence, setCodeSequence] = useState<string[]>([]);
  const [isExecutingCode, setIsExecutingCode] = useState<boolean>(false);
  const [activeStepIdx, setActiveStepIdx] = useState<number>(-1);
  const [mazeBatteriesCollected, setMazeBatteriesCollected] = useState<number>(0);
  const [mazeMessage, setMazeMessage] = useState<string>('Queue navigation commands, then tap Run Algorithm!');
  const [mazeSuccess, setMazeSuccess] = useState<boolean>(false);

  const toggleSound = () => {
    const next = !isAudioMuted;
    setIsAudioMuted(next);
    labAudio.setMuted(next);
    if (!next) labAudio.playBuzzerBeep(880, 0.1);
  };

  const resetRoverMaze = (mapKey = selectedMapKey) => {
    const map = MAZE_LAYOUTS[mapKey];
    setRoverPos([map.start[0], map.start[1]]);
    setRoverHeading('E');
    setCodeSequence([]);
    setIsExecutingCode(false);
    setActiveStepIdx(-1);
    setMazeBatteriesCollected(0);
    setMazeSuccess(false);
    setMazeMessage('Queue navigation commands, then tap Run Algorithm!');
    labAudio.playClick(450);
  };

  const addCommand = (cmd: string) => {
    if (isExecutingCode || codeSequence.length >= 12) return;
    setCodeSequence((prev) => [...prev, cmd]);
    labAudio.playClick(600);
  };

  const clearCommands = () => {
    if (isExecutingCode) return;
    setCodeSequence([]);
    setActiveStepIdx(-1);
    labAudio.playClick(400);
  };

  const runCodeSequence = async () => {
    if (isExecutingCode || codeSequence.length === 0) return;
    setIsExecutingCode(true);
    setMazeMessage('🚀 Executing autonomous microcontroller firmware...');
    
    let currentPos: [number, number] = [roverPos[0], roverPos[1]];
    let currentHeading = roverHeading;
    const map = MAZE_LAYOUTS[selectedMapKey];

    for (let i = 0; i < codeSequence.length; i++) {
      setActiveStepIdx(i);
      const cmd = codeSequence[i];

      if (cmd === 'FORWARD') {
        let dr = 0;
        let dc = 0;
        if (currentHeading === 'N') dr = -1;
        if (currentHeading === 'S') dr = 1;
        if (currentHeading === 'E') dc = 1;
        if (currentHeading === 'W') dc = -1;

        const nextR = currentPos[0] + dr;
        const nextC = currentPos[1] + dc;

        // Check bounds & wall collisions
        if (
          nextR < 0 || nextR >= 5 ||
          nextC < 0 || nextC >= 5 ||
          map.grid[nextR][nextC] === 1
        ) {
          labAudio.playCollisionAlarm();
          setMazeMessage('🚨 Wall Obstacle Collision! Microcontroller stopped.');
          setIsExecutingCode(false);
          return;
        }

        currentPos = [nextR, nextC];
        setRoverPos([nextR, nextC]);
        labAudio.playRadarPing(25);

        // Check for battery pickup
        if (map.grid[nextR][nextC] === 2) {
          setMazeBatteriesCollected((b) => b + 1);
          labAudio.playBuzzerBeep(1046, 0.15);
        }

        // Check for goal
        if (nextR === map.goal[0] && nextC === map.goal[1]) {
          setMazeSuccess(true);
          setMazeMessage('🎉 Mission Accomplished! Rover reached the target station.');
          labAudio.playSuccessChime();
          setIsExecutingCode(false);
          return;
        }
      } else if (cmd === 'LEFT') {
        const headings: Array<'N' | 'E' | 'S' | 'W'> = ['N', 'W', 'S', 'E'];
        const curIdx = headings.indexOf(currentHeading);
        currentHeading = headings[(curIdx + 1) % 4];
        setRoverHeading(currentHeading);
        labAudio.playClick(750);
      } else if (cmd === 'RIGHT') {
        const headings: Array<'N' | 'E' | 'S' | 'W'> = ['N', 'E', 'S', 'W'];
        const curIdx = headings.indexOf(currentHeading);
        currentHeading = headings[(curIdx + 1) % 4];
        setRoverHeading(currentHeading);
        labAudio.playClick(750);
      } else if (cmd === 'SCAN') {
        labAudio.playRadarPing(15);
      }

      await new Promise((res) => setTimeout(res, 450));
    }

    setIsExecutingCode(false);
    if (!mazeSuccess) {
      setMazeMessage('Code sequence finished. Need more steps to reach the target!');
    }
  };

  // ================= GAME 2: LOGIC GATE CIRCUIT LAB STATE =================
  const [inputA, setInputA] = useState<boolean>(false);
  const [inputB, setInputB] = useState<boolean>(false);
  const [selectedGate, setSelectedGate] = useState<'AND' | 'OR' | 'XOR' | 'NAND'>('AND');
  const [circuitMission, setCircuitMission] = useState<number>(1);
  const [missionSolved, setMissionSolved] = useState<boolean>(false);

  const computeGateOutput = (gate: string, a: boolean, b: boolean): boolean => {
    switch (gate) {
      case 'AND': return a && b;
      case 'OR': return a || b;
      case 'XOR': return (a || b) && !(a && b);
      case 'NAND': return !(a && b);
      default: return false;
    }
  };

  const gateOutput = computeGateOutput(selectedGate, inputA, inputB);

  useEffect(() => {
    if (gateOutput) {
      labAudio.playBuzzerBeep(880, 0.1);
    }
    // Check missions
    if (circuitMission === 1 && selectedGate === 'AND' && gateOutput) {
      setMissionSolved(true);
      labAudio.playSuccessChime();
    } else if (circuitMission === 2 && selectedGate === 'XOR' && inputA !== inputB && gateOutput) {
      setMissionSolved(true);
      labAudio.playSuccessChime();
    } else if (circuitMission === 3 && selectedGate === 'NAND' && !inputA && !inputB && gateOutput) {
      setMissionSolved(true);
      labAudio.playSuccessChime();
    }
  }, [selectedGate, inputA, inputB, gateOutput, circuitMission]);

  // ================= GAME 3: AI VISION & NEURAL CLASSIFIER STATE =================
  const [aiDatasetCount, setAiDatasetCount] = useState<number>(6);
  const [aiEpoch, setAiEpoch] = useState<number>(0);
  const [aiAccuracy, setAiAccuracy] = useState<number>(72);
  const [isAiTraining, setIsAiTraining] = useState<boolean>(false);
  const [testObject, setTestObject] = useState<'rover' | 'drone' | 'arm'>('rover');

  const handleTrainAi = () => {
    if (isAiTraining) return;
    setIsAiTraining(true);
    setAiEpoch(0);
    labAudio.playRadarPing(30);

    let currentEpoch = 0;
    const interval = setInterval(() => {
      currentEpoch += 5;
      setAiEpoch(currentEpoch);
      setAiAccuracy((prev) => Math.min(98.4, +(prev + 3.2).toFixed(1)));
      labAudio.playClick(500 + currentEpoch * 10);

      if (currentEpoch >= 30) {
        clearInterval(interval);
        setIsAiTraining(false);
        labAudio.playSuccessChime();
      }
    }, 120);
  };

  // Probabilities based on training & test object
  const getAiProbabilities = () => {
    const acc = aiAccuracy / 100;
    if (testObject === 'rover') {
      return {
        rover: (acc * 96).toFixed(1),
        drone: ((1 - acc) * 45 + 3).toFixed(1),
        arm: ((1 - acc) * 35 + 2).toFixed(1),
      };
    }
    if (testObject === 'drone') {
      return {
        rover: ((1 - acc) * 40 + 2).toFixed(1),
        drone: (acc * 95).toFixed(1),
        arm: ((1 - acc) * 38 + 3).toFixed(1),
      };
    }
    return {
      rover: ((1 - acc) * 30 + 3).toFixed(1),
      drone: ((1 - acc) * 35 + 4).toFixed(1),
      arm: (acc * 94).toFixed(1),
    };
  };

  const aiProbs = getAiProbabilities();

  // ================= GAME 4: SMART SOIL IOT STATE =================
  const [moisture, setMoisture] = useState<number>(24);
  const isPumpActive = moisture < 30;

  const handleMoistureChange = (val: number) => {
    setMoisture(val);
    if (val < 30) {
      labAudio.playBuzzerBeep(650, 0.15);
    } else {
      labAudio.playClick(500);
    }
  };

  return (
    <div className="w-full space-y-8">
      {/* Top Header with Lab Selector & Audio Toggle */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 max-w-4xl mx-auto">
        {/* Tab Pills */}
        <div className="flex flex-wrap gap-2 p-1.5 bg-slate-100 dark:bg-[#16253c] rounded-2xl border border-slate-200 dark:border-[#1e304d] w-full sm:w-auto">
          <button
            onClick={() => { setActiveTab('rover_maze'); labAudio.playClick(600); }}
            className={`flex-1 sm:flex-initial py-2 px-3.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              activeTab === 'rover_maze'
                ? 'bg-white dark:bg-[#111d2e] text-[#10233f] dark:text-white shadow-sm border border-slate-200 dark:border-[#1e304d]'
                : 'text-[#61708a] dark:text-slate-400 hover:text-[#10233f] dark:hover:text-white'
            }`}
          >
            <span>🤖</span> Rover Maze Lab
          </button>

          <button
            onClick={() => { setActiveTab('logic_gates'); labAudio.playClick(600); }}
            className={`flex-1 sm:flex-initial py-2 px-3.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              activeTab === 'logic_gates'
                ? 'bg-white dark:bg-[#111d2e] text-[#10233f] dark:text-white shadow-sm border border-slate-200 dark:border-[#1e304d]'
                : 'text-[#61708a] dark:text-slate-400 hover:text-[#10233f] dark:hover:text-white'
            }`}
          >
            <span>⚡</span> Logic Gate Circuits
          </button>

          <button
            onClick={() => { setActiveTab('ai_vision'); labAudio.playClick(600); }}
            className={`flex-1 sm:flex-initial py-2 px-3.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              activeTab === 'ai_vision'
                ? 'bg-white dark:bg-[#111d2e] text-[#10233f] dark:text-white shadow-sm border border-slate-200 dark:border-[#1e304d]'
                : 'text-[#61708a] dark:text-slate-400 hover:text-[#10233f] dark:hover:text-white'
            }`}
          >
            <span>🧠</span> AI Vision Classifier
          </button>

          <button
            onClick={() => { setActiveTab('smart_iot'); labAudio.playClick(600); }}
            className={`flex-1 sm:flex-initial py-2 px-3.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              activeTab === 'smart_iot'
                ? 'bg-white dark:bg-[#111d2e] text-[#10233f] dark:text-white shadow-sm border border-slate-200 dark:border-[#1e304d]'
                : 'text-[#61708a] dark:text-slate-400 hover:text-[#10233f] dark:hover:text-white'
            }`}
          >
            <span>🌱</span> Smart IoT Sensor
          </button>
        </div>

        {/* Global Sound Effects Toggle */}
        <button
          onClick={toggleSound}
          className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2 border transition shrink-0 ${
            isAudioMuted
              ? 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700'
              : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-600/40'
          }`}
          title={isAudioMuted ? "Unmute Lab Audio" : "Mute Lab Audio"}
        >
          {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 animate-pulse text-emerald-500" />}
          <span>{isAudioMuted ? 'Sound Muted' : 'Lab Audio Active'}</span>
        </button>
      </div>

      {/* =========================================================================
          LAB 1: ROVER MAZE & BLOCK ALGORITHM SEQUENCER
          ========================================================================= */}
      {activeTab === 'rover_maze' && (
        <div className="bg-white dark:bg-[#111d2e] border border-[#e6edf7] dark:border-[#1e304d] rounded-[28px] p-6 sm:p-9 shadow-[0_15px_40px_rgba(24,57,105,0.08)]">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-[#e6edf7] dark:border-[#1e304d]">
            <div>
              <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-950/50 text-[#1769ff] dark:text-blue-300 px-3 py-1 rounded-full text-xs font-bold mb-1">
                <span>🤖 Autonomous Robotics & Algorithmic Thinking</span> • Grades 1–10
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-[#10233f] dark:text-white">
                Rover Pathfinding & Code Sequencer Lab
              </h2>
              <p className="text-xs sm:text-sm text-[#61708a] dark:text-slate-300 mt-1 max-w-2xl leading-relaxed">
                Program real hardware steps: Queue move and turn logic blocks, test obstacle collision sensors, collect energy batteries, and reach the destination terminal!
              </p>
            </div>

            {/* Map selection */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#61708a] dark:text-slate-400">Track:</span>
              <select
                value={selectedMapKey}
                onChange={(e) => {
                  setSelectedMapKey(e.target.value);
                  resetRoverMaze(e.target.value);
                }}
                className="bg-[#f0f5ff] dark:bg-[#16253c] text-xs font-bold text-[#10233f] dark:text-white px-3 py-1.5 rounded-xl border border-[#d6e5fb] dark:border-[#1e304d] outline-none"
              >
                <option value="easy">Runway (Grades 1–4)</option>
                <option value="maze">Circuit Maze (Grades 5–7)</option>
                <option value="hard">City Grid (Grades 8–10)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6 items-start">
            {/* Left: Interactive 5x5 Matrix Canvas */}
            <div className="lg:col-span-6 flex flex-col items-center">
              <div className="w-full max-w-[340px] aspect-square bg-slate-950 rounded-2xl border-2 border-slate-800 p-3 shadow-xl relative grid grid-cols-5 gap-1.5">
                {MAZE_LAYOUTS[selectedMapKey].grid.map((row, rIdx) =>
                  row.map((cellVal, cIdx) => {
                    const isRoverHere = roverPos[0] === rIdx && roverPos[1] === cIdx;
                    const isWall = cellVal === 1;
                    const isBattery = cellVal === 2;
                    const isGoal = cellVal === 3;

                    return (
                      <div
                        key={`${rIdx}-${cIdx}`}
                        className={`rounded-xl flex items-center justify-center text-xl transition-all relative ${
                          isWall
                            ? 'bg-slate-800 border border-slate-700 shadow-inner'
                            : 'bg-slate-900/90 border border-slate-800/80 hover:border-slate-700'
                        }`}
                      >
                        {isWall && <span className="text-sm opacity-60">🧱</span>}
                        {isBattery && !isRoverHere && (
                          <span className="animate-bounce text-base filter drop-shadow-[0_0_6px_rgba(251,191,36,0.8)]">
                            ⚡
                          </span>
                        )}
                        {isGoal && !isRoverHere && (
                          <span className="animate-pulse text-base filter drop-shadow-[0_0_6px_rgba(52,211,153,0.8)]">
                            🚩
                          </span>
                        )}

                        {isRoverHere && (
                          <div
                            className={`transform transition-transform duration-200 text-2xl filter drop-shadow-[0_0_10px_rgba(37,99,235,0.9)] ${
                              roverHeading === 'N'
                                ? '-rotate-90'
                                : roverHeading === 'S'
                                ? 'rotate-90'
                                : roverHeading === 'W'
                                ? 'scale-x-[-1]'
                                : 'rotate-0'
                            }`}
                          >
                            🤖
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>

              {/* Status Message Display */}
              <div className="w-full max-w-[340px] mt-3 p-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 font-medium flex items-center justify-between">
                <span className="truncate">{mazeMessage}</span>
                <span className="font-mono text-amber-400 font-bold shrink-0 ml-2">
                  ⚡ {mazeBatteriesCollected}
                </span>
              </div>
            </div>

            {/* Right: Block Code Construction Palette & Action Queue */}
            <div className="lg:col-span-6 space-y-4">
              <div>
                <div className="text-xs font-bold text-[#10233f] dark:text-white uppercase tracking-wider mb-2">
                  1. Microcontroller Action Blocks (Click to Queue)
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    onClick={() => addCommand('FORWARD')}
                    disabled={isExecutingCode}
                    className="p-2.5 rounded-xl border border-blue-200 dark:border-blue-900/50 bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 text-blue-800 dark:text-blue-300 font-bold text-xs transition active:scale-95 disabled:opacity-50"
                  >
                    ↑ Step Ahead
                  </button>
                  <button
                    onClick={() => addCommand('LEFT')}
                    disabled={isExecutingCode}
                    className="p-2.5 rounded-xl border border-indigo-200 dark:border-indigo-900/50 bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 text-indigo-800 dark:text-indigo-300 font-bold text-xs transition active:scale-95 disabled:opacity-50"
                  >
                    ↰ Turn Left 90°
                  </button>
                  <button
                    onClick={() => addCommand('RIGHT')}
                    disabled={isExecutingCode}
                    className="p-2.5 rounded-xl border border-purple-200 dark:border-purple-900/50 bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-100 text-purple-800 dark:text-purple-300 font-bold text-xs transition active:scale-95 disabled:opacity-50"
                  >
                    Turn Right 90° ↱
                  </button>
                  <button
                    onClick={() => addCommand('SCAN')}
                    disabled={isExecutingCode}
                    className="p-2.5 rounded-xl border border-teal-200 dark:border-teal-900/50 bg-teal-50 dark:bg-teal-950/40 hover:bg-teal-100 text-teal-800 dark:text-teal-300 font-bold text-xs transition active:scale-95 disabled:opacity-50"
                  >
                    📡 Sonar Scan
                  </button>
                </div>
              </div>

              {/* Code Sequence Queue */}
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-[#10233f] dark:text-white mb-2">
                  <span>2. Instruction Sequence Buffer ({codeSequence.length}/12 blocks):</span>
                  {codeSequence.length > 0 && (
                    <button
                      onClick={clearCommands}
                      disabled={isExecutingCode}
                      className="text-rose-600 dark:text-rose-400 hover:underline text-[11px] font-bold"
                    >
                      Clear All
                    </button>
                  )}
                </div>

                <div className="min-h-[85px] p-3 rounded-2xl bg-[#f8fbff] dark:bg-[#16243a] border border-[#e4ecf7] dark:border-[#1e304d] flex flex-wrap gap-2 items-center">
                  {codeSequence.length === 0 ? (
                    <span className="text-xs text-[#8494ab] dark:text-slate-400 italic">
                      Click the blocks above to build your autonomous robot algorithm!
                    </span>
                  ) : (
                    codeSequence.map((cmd, idx) => (
                      <span
                        key={idx}
                        className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition flex items-center gap-1 ${
                          activeStepIdx === idx
                            ? 'bg-[#1769ff] text-white scale-110 shadow-md ring-2 ring-blue-400'
                            : 'bg-white dark:bg-[#111d2e] text-[#10233f] dark:text-slate-200 border border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        <span className="text-[10px] text-slate-400">#{idx + 1}</span>
                        <span>{cmd}</span>
                      </span>
                    ))
                  )}
                </div>
              </div>

              {/* Execution Controls */}
              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  onClick={runCodeSequence}
                  disabled={isExecutingCode || codeSequence.length === 0}
                  className="flex-1 bg-[#1769ff] hover:bg-[#1258d6] disabled:opacity-50 text-white px-5 py-3 rounded-xl font-black text-xs transition flex items-center justify-center gap-2 shadow-[0_4px_14px_rgba(23,105,255,0.25)] active:scale-95"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>{isExecutingCode ? 'Executing Steps...' : 'Run Algorithm ▶'}</span>
                </button>

                <button
                  onClick={() => resetRoverMaze()}
                  disabled={isExecutingCode}
                  className="px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 text-[#10233f] dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold text-xs transition flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Board</span>
                </button>

                <button
                  onClick={() => onBookDemo('Robotics Rover Maze Program')}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-3 rounded-xl font-bold text-xs transition flex items-center gap-1.5"
                >
                  <span>Build at Lab</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          LAB 2: LOGIC GATES & HARDWARE CIRCUIT LAB
          ========================================================================= */}
      {activeTab === 'logic_gates' && (
        <div className="bg-white dark:bg-[#111d2e] border border-[#e6edf7] dark:border-[#1e304d] rounded-[28px] p-6 sm:p-9 shadow-[0_15px_40px_rgba(24,57,105,0.08)]">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-[#e6edf7] dark:border-[#1e304d]">
            <div>
              <div className="inline-flex items-center gap-2 bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 px-3 py-1 rounded-full text-xs font-bold mb-1">
                <span>⚡ Digital Electronics & Microcontroller Logic</span> • Grades 4–10
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-[#10233f] dark:text-white">
                Interactive Logic Gate & Actuator Breadboard
              </h2>
              <p className="text-xs sm:text-sm text-[#61708a] dark:text-slate-300 mt-1 max-w-2xl leading-relaxed">
                Connect real boolean logic gates (AND, OR, XOR, NAND) to sensors and watch electron currents trigger the robot arm servo motor and safety alarms.
              </p>
            </div>

            {/* Mission status */}
            <div className="bg-[#f8fbff] dark:bg-[#16243a] border border-[#e4ecf7] dark:border-[#1e304d] px-4 py-2 rounded-xl text-xs font-bold text-[#10233f] dark:text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" />
              <span>
                {circuitMission === 1 && 'Mission 1: Fire Alarm with AND Gate'}
                {circuitMission === 2 && 'Mission 2: Toggle Gripper with XOR Gate'}
                {circuitMission === 3 && 'Mission 3: Invert Current with NAND Gate'}
              </span>
              {missionSolved && <span className="text-emerald-500 font-extrabold">✓ SOLVED</span>}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6 items-center">
            {/* Left: Interactive Circuit Schematic Board */}
            <div className="lg:col-span-7 bg-slate-950 rounded-2xl border-2 border-slate-800 p-6 relative overflow-hidden text-white">
              {/* Circuit Grid Background */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:20px_20px] opacity-20 pointer-events-none"></div>

              <div className="relative z-10 space-y-6">
                {/* Circuit Wiring Stage */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                  {/* Inputs Section */}
                  <div className="space-y-4 w-full sm:w-auto">
                    {/* Switch A */}
                    <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl flex items-center justify-between gap-4">
                      <div>
                        <div className="text-[10px] text-slate-400 uppercase font-mono">Input A (Infrared)</div>
                        <div className="text-sm font-bold">{inputA ? 'HIGH (1)' : 'LOW (0)'}</div>
                      </div>
                      <button
                        onClick={() => { setInputA(!inputA); labAudio.playClick(inputA ? 400 : 800); }}
                        className={`w-12 h-6 rounded-full transition p-0.5 flex items-center ${
                          inputA ? 'bg-emerald-500 justify-end' : 'bg-slate-700 justify-start'
                        }`}
                      >
                        <div className="w-5 h-5 rounded-full bg-white shadow"></div>
                      </button>
                    </div>

                    {/* Switch B */}
                    <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl flex items-center justify-between gap-4">
                      <div>
                        <div className="text-[10px] text-slate-400 uppercase font-mono">Input B (Touch Sensor)</div>
                        <div className="text-sm font-bold">{inputB ? 'HIGH (1)' : 'LOW (0)'}</div>
                      </div>
                      <button
                        onClick={() => { setInputB(!inputB); labAudio.playClick(inputB ? 400 : 800); }}
                        className={`w-12 h-6 rounded-full transition p-0.5 flex items-center ${
                          inputB ? 'bg-emerald-500 justify-end' : 'bg-slate-700 justify-start'
                        }`}
                      >
                        <div className="w-5 h-5 rounded-full bg-white shadow"></div>
                      </button>
                    </div>
                  </div>

                  {/* Center: Selected Logic Gate IC */}
                  <div className="flex flex-col items-center justify-center p-4 bg-indigo-950/60 border-2 border-indigo-500/50 rounded-2xl shadow-[0_0_20px_rgba(99,102,241,0.2)] w-36 text-center">
                    <div className="text-[10px] uppercase font-mono tracking-wider text-indigo-300">Logic Gate IC</div>
                    <div className="text-2xl font-black text-white my-1 font-mono">{selectedGate}</div>
                    <div className="text-[10px] text-slate-400 font-mono">74HC Series</div>
                  </div>

                  {/* Output Actuator */}
                  <div className="w-full sm:w-auto">
                    <div className={`p-4 rounded-2xl border-2 transition-all text-center ${
                      gateOutput
                        ? 'bg-emerald-950/80 border-emerald-500 shadow-[0_0_25px_rgba(16,185,129,0.5)] scale-105'
                        : 'bg-slate-900 border-slate-800 opacity-60'
                    }`}>
                      <div className="text-4xl mb-1">{gateOutput ? '🦾' : '💤'}</div>
                      <div className="text-xs font-bold uppercase tracking-wider text-slate-300">
                        Actuator Status
                      </div>
                      <div className={`text-base font-black font-mono ${gateOutput ? 'text-emerald-400' : 'text-slate-500'}`}>
                        {gateOutput ? 'ACTIVE (1)' : 'IDLE (0)'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Gate Selector Pills */}
                <div className="pt-2 border-t border-slate-800 flex flex-wrap gap-2 justify-center">
                  {(['AND', 'OR', 'XOR', 'NAND'] as const).map((gate) => (
                    <button
                      key={gate}
                      onClick={() => { setSelectedGate(gate); labAudio.playClick(600); }}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition ${
                        selectedGate === gate
                          ? 'bg-[#1769ff] text-white shadow'
                          : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      {gate} GATE
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Truth Table & Curriculum Explainer */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-[#f8fbff] dark:bg-[#16243a] border border-[#e4ecf7] dark:border-[#1e304d] rounded-2xl p-5">
                <div className="text-xs font-bold text-[#10233f] dark:text-white mb-2 flex items-center justify-between">
                  <span>Truth Table for {selectedGate} Gate</span>
                  <span className="text-[10px] text-[#1769ff] dark:text-blue-400 font-mono">Live Evaluator</span>
                </div>
                
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-700 text-[#61708a] dark:text-slate-400">
                      <th className="py-1">Input A</th>
                      <th className="py-1">Input B</th>
                      <th className="py-1 font-bold text-[#1769ff] dark:text-blue-400">Output</th>
                      <th className="py-1">Active Now?</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
                    {[
                      [false, false],
                      [false, true],
                      [true, false],
                      [true, true],
                    ].map(([a, b], i) => {
                      const out = computeGateOutput(selectedGate, a, b);
                      const isRowActive = inputA === a && inputB === b;
                      return (
                        <tr
                          key={i}
                          className={`transition ${
                            isRowActive ? 'bg-blue-100 dark:bg-blue-900/40 font-bold text-blue-900 dark:text-blue-200' : 'text-slate-600 dark:text-slate-300'
                          }`}
                        >
                          <td className="py-1.5">{a ? '1' : '0'}</td>
                          <td className="py-1.5">{b ? '1' : '0'}</td>
                          <td className="py-1.5 font-bold">{out ? '1' : '0'}</td>
                          <td className="py-1.5">
                            {isRowActive ? <span className="text-emerald-500 font-sans font-bold">◀ Current</span> : '—'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setCircuitMission((m) => (m % 3) + 1);
                    setMissionSolved(false);
                    labAudio.playClick(500);
                  }}
                  className="flex-1 py-2.5 px-3 rounded-xl border border-slate-300 dark:border-slate-700 text-[#10233f] dark:text-slate-200 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  Next Mission ➔
                </button>
                <button
                  onClick={() => onBookDemo('Electronics & Logic Circuit Lab')}
                  className="flex-1 bg-[#1769ff] hover:bg-[#1258d6] text-white py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1"
                >
                  <span>Experience at Campus</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          LAB 3: AI COMPUTER VISION & MACHINE LEARNING LAB
          ========================================================================= */}
      {activeTab === 'ai_vision' && (
        <div className="bg-white dark:bg-[#111d2e] border border-[#e6edf7] dark:border-[#1e304d] rounded-[28px] p-6 sm:p-9 shadow-[0_15px_40px_rgba(24,57,105,0.08)]">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-[#e6edf7] dark:border-[#1e304d]">
            <div>
              <div className="inline-flex items-center gap-2 bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 px-3 py-1 rounded-full text-xs font-bold mb-1">
                <span>🧠 Artificial Intelligence & Deep Neural Networks</span> • Grades 6–10
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-[#10233f] dark:text-white">
                Train & Test a Convolutional Vision Classifier
              </h2>
              <p className="text-xs sm:text-sm text-[#61708a] dark:text-slate-300 mt-1 max-w-2xl leading-relaxed">
                Students train neural vision models using camera feeds to distinguish autonomous rovers, aerial quadcopters, and industrial robotic arms with live confidence matrices.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/40 px-3.5 py-1.5 rounded-xl text-xs font-bold text-purple-800 dark:text-purple-300">
                Model Accuracy: <span className="font-mono font-black text-purple-600 dark:text-purple-400">{aiAccuracy}%</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6 items-center">
            {/* Left: Training & Dataset Simulator */}
            <div className="lg:col-span-6 space-y-4">
              <div className="bg-[#f8fbff] dark:bg-[#16243a] border border-[#e4ecf7] dark:border-[#1e304d] rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-[#10233f] dark:text-white">
                  <span>Step 1: Dataset Samples ({aiDatasetCount} Images)</span>
                  <button
                    onClick={() => {
                      setAiDatasetCount((c) => c + 3);
                      labAudio.playClick(600);
                    }}
                    className="text-xs text-[#1769ff] dark:text-blue-400 font-bold hover:underline"
                  >
                    + Snap More Samples
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2.5 rounded-xl bg-white dark:bg-[#111d2e] border border-slate-200 dark:border-slate-700">
                    <div className="text-2xl mb-1">🤖</div>
                    <div className="font-bold text-[#10233f] dark:text-slate-200">Rover Class</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white dark:bg-[#111d2e] border border-slate-200 dark:border-slate-700">
                    <div className="text-2xl mb-1">🛸</div>
                    <div className="font-bold text-[#10233f] dark:text-slate-200">Drone Class</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white dark:bg-[#111d2e] border border-slate-200 dark:border-slate-700">
                    <div className="text-2xl mb-1">🦾</div>
                    <div className="font-bold text-[#10233f] dark:text-slate-200">Arm Class</div>
                  </div>
                </div>

                {/* Train Model Button */}
                <button
                  onClick={handleTrainAi}
                  disabled={isAiTraining}
                  className="w-full bg-purple-600 hover:bg-purple-500 disabled:opacity-60 text-white py-3 rounded-xl font-black text-xs transition flex items-center justify-center gap-2 shadow-md active:scale-95"
                >
                  <Cpu className="w-4 h-4" />
                  <span>
                    {isAiTraining ? `Training Epochs (${aiEpoch}/30)...` : 'Train Neural Network Weights ▶'}
                  </span>
                </button>
              </div>
            </div>

            {/* Right: Live Test & Prediction Confidence */}
            <div className="lg:col-span-6 bg-slate-950 rounded-2xl border border-slate-800 p-6 text-white space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span className="font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
                  <Scan className="w-4 h-4" /> Inference Engine Output
                </span>
                <span className="font-mono text-[10px] text-slate-400">Layer: Softmax</span>
              </div>

              {/* Select object to test */}
              <div className="flex gap-2">
                {[
                  { id: 'rover', label: 'Rover 🤖' },
                  { id: 'drone', label: 'Drone 🛸' },
                  { id: 'arm', label: 'Robo-Arm 🦾' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => { setTestObject(item.id as any); labAudio.playClick(650); }}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition ${
                      testObject === item.id
                        ? 'bg-purple-600 text-white'
                        : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {/* Confidence bars */}
              <div className="space-y-3 pt-2">
                <div>
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span>Autonomous Rover:</span>
                    <span className="font-bold text-emerald-400">{aiProbs.rover}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 transition-all duration-300"
                      style={{ width: `${aiProbs.rover}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span>Aerial Drone:</span>
                    <span className="font-bold text-sky-400">{aiProbs.drone}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-sky-500 transition-all duration-300"
                      style={{ width: `${aiProbs.drone}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span>Robotic Arm:</span>
                    <span className="font-bold text-purple-400">{aiProbs.arm}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-purple-500 transition-all duration-300"
                      style={{ width: `${aiProbs.arm}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          LAB 4: SMART SOIL IOT AUTOMATION
          ========================================================================= */}
      {activeTab === 'smart_iot' && (
        <div className="bg-white dark:bg-[#111d2e] border border-[#e6edf7] dark:border-[#1e304d] rounded-[28px] p-6 sm:p-9 shadow-[0_15px_40px_rgba(24,57,105,0.08)]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 px-3 py-1 rounded-full text-xs font-bold">
                <span>🌱 IoT & Environmental Sensing</span> • Grades 3–6
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-[#10233f] dark:text-white">
                Smart Soil Hydration & Auto-Watering Pump
              </h2>
              <p className="text-xs sm:text-sm text-[#61708a] dark:text-slate-300 leading-relaxed">
                Kids connect analog soil hygrometer pins to an Arduino microcontroller. When soil dries below 30%, a mini 5V submersible water pump activates automatically to save the plant!
              </p>

              {/* Interactive Soil Slider */}
              <div className="bg-[#f8fbff] dark:bg-[#16243a] border border-[#e4ecf7] dark:border-[#1e304d] rounded-2xl p-5 space-y-3">
                <div className="flex justify-between items-center text-xs font-bold text-[#10233f] dark:text-white">
                  <span>Adjust Simulated Soil Moisture:</span>
                  <span className={`font-mono text-base ${moisture < 30 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                    {moisture}% ({moisture < 30 ? 'Dry Soil · Thirsty' : 'Moist & Healthy'})
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="85"
                  value={moisture}
                  onChange={(e) => handleMoistureChange(Number(e.target.value))}
                  className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                <div className="flex justify-between text-[11px] font-semibold text-[#61708a] dark:text-slate-400">
                  <span>0% (Bone Dry)</span>
                  <span className="text-amber-600 dark:text-amber-400 font-bold">30% Threshold</span>
                  <span>100% (Fully Saturated)</span>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => onBookDemo('Smart Plant Monitor Project')}
                  className="bg-[#1769ff] hover:bg-[#1258d6] text-white px-5 py-3 rounded-xl font-bold text-xs transition flex items-center gap-2 shadow-sm"
                >
                  <span>Build This in Demo Class</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Simulation Canvas / Graphic */}
            <div className="lg:col-span-5 bg-gradient-to-br from-emerald-50 to-teal-100/50 dark:from-[#112423] dark:to-[#0d1c1c] rounded-2xl border border-emerald-200/60 dark:border-emerald-800/40 p-6 flex flex-col items-center justify-center text-center relative overflow-hidden min-h-[300px]">
              <div className="text-7xl mb-3 transform transition-transform duration-300 hover:scale-110">
                {moisture < 30 ? '🥀' : '🌿'}
              </div>
              <div className="font-extrabold text-lg text-[#10233f] dark:text-white">
                {moisture < 30 ? 'Plant Needs Water!' : 'Plant is Happy!'}
              </div>
              <div className="text-xs text-[#61708a] dark:text-slate-400 mt-1 mb-4 font-mono">
                Sensor: Analog A0 = {Math.round(moisture * 10.23)} / 1023
              </div>

              {/* Pump status card */}
              <div className={`px-4 py-2.5 rounded-xl border font-bold text-xs flex items-center gap-2 ${
                isPumpActive 
                  ? 'bg-emerald-500 text-white border-emerald-600 animate-pulse shadow-md' 
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
              }`}>
                <Droplets className="w-4 h-4" />
                <span>{isPumpActive ? 'Water Pump: ACTIVE 💦' : 'Water Pump: STANDBY 💤'}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
