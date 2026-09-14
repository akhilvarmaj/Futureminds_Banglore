import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Volume2, VolumeX, Code, ArrowRight, Trophy, Zap, ShieldAlert, Sparkles } from 'lucide-react';
import { labAudio } from '../utils/labAudio';

export const InteractiveHeroRobot: React.FC<{ onBookDemo: () => void }> = ({ onBookDemo }) => {
  const [mode, setMode] = useState<'robot' | 'game' | 'code'>('robot');
  const [isMuted, setIsMuted] = useState<boolean>(false);
  
  // Robot simulator state
  const [distance, setDistance] = useState<number>(28);
  const [robotStatus, setRobotStatus] = useState<string>('Cruising Forward · Ultrasonic Radar Clear');
  const [robotDirection, setRobotDirection] = useState<'forward' | 'left' | 'right' | 'stopped'>('forward');
  const [soundBeep, setSoundBeep] = useState<boolean>(false);

  // Mini-Game state: Obstacle Dodger
  const [gameActive, setGameActive] = useState<boolean>(false);
  const [roverLane, setRoverLane] = useState<number>(1); // 0 = Left, 1 = Center, 2 = Right
  const [gameScore, setGameScore] = useState<number>(0);
  const [gameBatteries, setGameBatteries] = useState<number>(0);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [obstacleY, setObstacleY] = useState<number>(0);
  const [obstacleLane, setObstacleLane] = useState<number>(0);
  const [itemType, setItemType] = useState<'barrier' | 'battery'>('barrier');
  const gameLoopRef = useRef<number | null>(null);

  const toggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    labAudio.setMuted(next);
    if (!next) {
      labAudio.playBuzzerBeep(880, 0.12);
    }
  };

  const handleDistanceChange = (newVal: number) => {
    setDistance(newVal);
    if (newVal < 15) {
      setRobotStatus('🚨 Emergency Stop! Obstacle (<15cm). Reverse Activated.');
      setRobotDirection('stopped');
      setSoundBeep(true);
      labAudio.playCollisionAlarm();
      setTimeout(() => setSoundBeep(false), 600);
    } else if (newVal < 25) {
      setRobotStatus(`⚠️ Object Detected at ${newVal}cm! Autonomous Turn Left`);
      setRobotDirection('left');
      setSoundBeep(true);
      labAudio.playRadarPing(newVal);
      setTimeout(() => setSoundBeep(false), 300);
    } else {
      setRobotStatus(`✅ Track Clear (${newVal}cm) · Motors at 180 RPM`);
      setRobotDirection('forward');
      labAudio.playClick(500);
    }
  };

  const triggerBeep = () => {
    setSoundBeep(true);
    labAudio.playBuzzerBeep(920, 0.2, 'square');
    setTimeout(() => setSoundBeep(false), 400);
  };

  // Game Engine logic
  const handleRoverMove = (targetLane: number) => {
    setRoverLane(targetLane);
    labAudio.playClick(650);
  };

  const resetGame = () => {
    setGameOver(false);
    setGameScore(0);
    setGameBatteries(0);
    setRoverLane(1);
    setObstacleY(0);
    setObstacleLane(Math.floor(Math.random() * 3));
    setItemType(Math.random() > 0.4 ? 'barrier' : 'battery');
    setGameActive(true);
    labAudio.playBuzzerBeep(523, 0.1);
  };

  const checkCollisionOrPickup = useCallback((currentY: number, curObsLane: number, curItem: 'barrier' | 'battery') => {
    if (currentY >= 80 && currentY <= 98) {
      if (curObsLane === roverLane) {
        if (curItem === 'barrier') {
          // Collision!
          setGameOver(true);
          setGameActive(false);
          labAudio.playCollisionAlarm();
        } else {
          // Battery Collected!
          setGameBatteries((b) => b + 1);
          setGameScore((s) => s + 50);
          labAudio.playSuccessChime();
          setObstacleY(0);
          setObstacleLane(Math.floor(Math.random() * 3));
          setItemType(Math.random() > 0.4 ? 'barrier' : 'battery');
        }
      }
    }
  }, [roverLane]);

  useEffect(() => {
    if (!gameActive || gameOver) {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
      return;
    }

    let lastTime = performance.now();
    const tick = (time: number) => {
      const delta = (time - lastTime) / 1000;
      lastTime = time;

      setObstacleY((prevY) => {
        const nextY = prevY + delta * 65;
        if (nextY > 105) {
          // Passed safely
          setGameScore((s) => s + 10);
          labAudio.playRadarPing(40);
          setObstacleLane(Math.floor(Math.random() * 3));
          setItemType(Math.random() > 0.35 ? 'barrier' : 'battery');
          return 0;
        }
        checkCollisionOrPickup(nextY, obstacleLane, itemType);
        return nextY;
      });

      gameLoopRef.current = requestAnimationFrame(tick);
    };

    gameLoopRef.current = requestAnimationFrame(tick);

    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [gameActive, gameOver, obstacleLane, itemType, checkCollisionOrPickup]);

  return (
    <div className="w-full bg-white dark:bg-[#111d2e] rounded-[28px] border border-[#e6edf7] dark:border-[#1e304d] shadow-[0_20px_50px_rgba(23,105,255,0.12)] overflow-hidden transition-all">
      {/* Top Header with Tab Switcher & Live Indicator */}
      <div className="px-5 py-3.5 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-black tracking-wider uppercase text-slate-200">
            Interactive STEM Simulator
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Sound Mute/Unmute quick toggle */}
          <button
            onClick={toggleMute}
            className={`px-2 py-1 rounded-md text-[11px] font-bold flex items-center gap-1 transition ${
              isMuted ? 'bg-slate-800 text-slate-400 hover:text-white' : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
            }`}
            title={isMuted ? "Unmute Lab Audio" : "Mute Lab Audio"}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-amber-400 animate-pulse" />}
            <span>{isMuted ? 'Muted' : 'Sound ON'}</span>
          </button>

          <div className="flex items-center bg-slate-800 p-0.5 rounded-lg text-xs font-bold">
            <button
              onClick={() => { setMode('robot'); setGameActive(false); }}
              className={`px-2.5 py-1 rounded-md transition ${
                mode === 'robot' ? 'bg-[#1769ff] text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Rover Radar
            </button>
            <button
              onClick={() => { setMode('game'); setGameActive(true); }}
              className={`px-2.5 py-1 rounded-md transition flex items-center gap-1 ${
                mode === 'game' ? 'bg-[#1769ff] text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>🎮 Lab Game</span>
            </button>
            <button
              onClick={() => { setMode('code'); setGameActive(false); }}
              className={`px-2.5 py-1 rounded-md transition ${
                mode === 'code' ? 'bg-[#1769ff] text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Code Logic
            </button>
          </div>
        </div>
      </div>

      {mode === 'robot' ? (
        /* ================= Mode 1: Interactive Rover Radar Console ================= */
        <div className="p-5 sm:p-6 bg-gradient-to-br from-[#f8fbff] via-white to-[#f0f7ff] dark:from-[#101b2c] dark:via-[#111d2e] dark:to-[#0d1624]">
          {/* Visual Arena Screen */}
          <div className="bg-slate-950 rounded-2xl p-4 sm:p-5 border border-slate-800 relative overflow-hidden mb-5 shadow-inner">
            {/* Grid Pattern Background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:16px_16px] opacity-30"></div>

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

            {/* Dynamic Status Bar with sound indicator */}
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-300 font-medium">
              <span className="truncate">{robotStatus}</span>
              {soundBeep && (
                <span className="flex items-center gap-1 text-amber-400 animate-pulse font-bold shrink-0 ml-2">
                  <Volume2 className="w-4 h-4 animate-bounce" /> BUZZER BEEP!
                </span>
              )}
            </div>
          </div>

          {/* Interactive Controls: Ultrasonic Distance Slider */}
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center text-xs font-bold text-[#10233f] dark:text-slate-100 mb-1.5">
                <span>Slide to test obstacle proximity sensor:</span>
                <span className="text-[#1769ff] dark:text-blue-400 font-mono font-bold">{distance} cm</span>
              </div>
              <input
                type="range"
                min="5"
                max="50"
                value={distance}
                onChange={(e) => handleDistanceChange(Number(e.target.value))}
                className="w-full h-2.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#1769ff]"
              />
              <div className="flex justify-between text-[11px] font-semibold mt-1">
                <span className="text-rose-600 dark:text-rose-400">5cm (Collision Buzzer)</span>
                <span className="text-amber-600 dark:text-amber-400">20cm (Autonomous Turn)</span>
                <span className="text-emerald-600 dark:text-emerald-400">50cm (Clear Path)</span>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="grid grid-cols-4 gap-2 pt-1">
              <button
                onClick={() => { setRobotDirection('left'); setRobotStatus('Manually Steered Left'); labAudio.playClick(600); }}
                className="p-2.5 rounded-xl border border-[#e6edf7] dark:border-[#1e304d] bg-white dark:bg-[#16243a] hover:bg-slate-50 dark:hover:bg-[#1b2d49] text-[#10233f] dark:text-slate-100 font-bold text-xs shadow-sm transition active:scale-95"
              >
                ↰ Steer Left
              </button>
              <button
                onClick={() => { setRobotDirection('forward'); setRobotStatus('Moving Straight Ahead'); labAudio.playClick(700); }}
                className="p-2.5 rounded-xl border border-[#e6edf7] dark:border-[#1e304d] bg-white dark:bg-[#16243a] hover:bg-slate-50 dark:hover:bg-[#1b2d49] text-[#10233f] dark:text-slate-100 font-bold text-xs shadow-sm transition active:scale-95"
              >
                ↑ Forward
              </button>
              <button
                onClick={() => { setRobotDirection('right'); setRobotStatus('Manually Steered Right'); labAudio.playClick(600); }}
                className="p-2.5 rounded-xl border border-[#e6edf7] dark:border-[#1e304d] bg-white dark:bg-[#16243a] hover:bg-slate-50 dark:hover:bg-[#1b2d49] text-[#10233f] dark:text-slate-100 font-bold text-xs shadow-sm transition active:scale-95"
              >
                Steer Right ↱
              </button>
              <button
                onClick={triggerBeep}
                className="p-2.5 rounded-xl border border-amber-300 dark:border-amber-600/40 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/50 text-amber-900 dark:text-amber-200 font-bold text-xs shadow-sm transition active:scale-95 flex items-center justify-center gap-1"
              >
                <Volume2 className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span>Test Beep</span>
              </button>
            </div>
          </div>
        </div>
      ) : mode === 'game' ? (
        /* ================= Mode 2: Interactive Obstacle Dodge Rover Game ================= */
        <div className="p-5 sm:p-6 bg-slate-950 text-white select-none">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-[11px] font-bold uppercase text-emerald-400 tracking-wider flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5" /> Obstacle Avoidance Rover Run
              </div>
              <div className="text-xs text-slate-400 mt-0.5">
                Steer lanes to dodge barriers and grab STEM power cells!
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-slate-900 border border-slate-800 px-3 py-1 rounded-lg text-right">
                <div className="text-[10px] text-slate-400 uppercase">Score</div>
                <div className="text-base font-black font-mono text-emerald-400">{gameScore}</div>
              </div>
              <div className="bg-slate-900 border border-slate-800 px-3 py-1 rounded-lg text-right">
                <div className="text-[10px] text-slate-400 uppercase">Power</div>
                <div className="text-base font-black font-mono text-amber-400">{gameBatteries} ⚡</div>
              </div>
            </div>
          </div>

          {/* 3-Lane Track Simulation Arena */}
          <div className="relative h-56 bg-slate-900 rounded-2xl border-2 border-slate-800 overflow-hidden">
            {/* Lane Dividers */}
            <div className="absolute inset-0 grid grid-cols-3 pointer-events-none">
              <div className="border-r border-dashed border-slate-700/60"></div>
              <div className="border-r border-dashed border-slate-700/60"></div>
              <div></div>
            </div>

            {/* Falling Obstacle or Battery */}
            {gameActive && !gameOver && (
              <div
                className="absolute transition-all duration-75 text-2xl flex items-center justify-center"
                style={{
                  top: `${obstacleY}%`,
                  left: `${obstacleLane * 33.33 + 16.66}%`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                {itemType === 'barrier' ? (
                  <span className="filter drop-shadow-[0_0_8px_rgba(244,63,94,0.8)]">🛑</span>
                ) : (
                  <span className="filter drop-shadow-[0_0_8px_rgba(251,191,36,0.8)] animate-bounce">⚡</span>
                )}
              </div>
            )}

            {/* Rover in lane */}
            <div
              className="absolute bottom-3 text-3xl transition-all duration-150 flex flex-col items-center"
              style={{
                left: `${roverLane * 33.33 + 16.66}%`,
                transform: 'translateX(-50%)',
              }}
            >
              <div className="relative">
                🤖
                {/* Radar beam visual */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full border border-sky-400/80 animate-ping pointer-events-none"></div>
              </div>
              <span className="text-[9px] font-mono text-sky-300 font-bold bg-slate-950/80 px-1.5 rounded mt-0.5">
                L{roverLane + 1}
              </span>
            </div>

            {/* Game Over Screen */}
            {gameOver && (
              <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm flex flex-col items-center justify-center p-4 text-center z-20">
                <ShieldAlert className="w-10 h-10 text-rose-500 mb-1 animate-bounce" />
                <div className="text-lg font-black text-white">Obstacle Collision Detected!</div>
                <p className="text-xs text-slate-300 mt-1 mb-3">
                  Score: <strong className="text-emerald-400">{gameScore} pts</strong> | Batteries:{' '}
                  <strong className="text-amber-400">{gameBatteries} ⚡</strong>
                </p>
                <button
                  onClick={resetGame}
                  className="bg-[#1769ff] hover:bg-[#1258d6] text-white px-5 py-2 rounded-xl font-extrabold text-xs transition shadow-lg flex items-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Restart Mission</span>
                </button>
              </div>
            )}

            {/* Start Overlay */}
            {!gameActive && !gameOver && (
              <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center p-4 text-center z-20">
                <div className="text-base font-black text-white mb-1">Rover Lane Navigator</div>
                <p className="text-xs text-slate-300 max-w-xs mb-3">
                  Test your real-time obstacle avoidance reflexes! Avoid roadblocks and pick up lithium batteries.
                </p>
                <button
                  onClick={resetGame}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2.5 rounded-xl font-extrabold text-xs transition shadow-lg flex items-center gap-1.5"
                >
                  <Zap className="w-4 h-4" />
                  <span>Start Game Run</span>
                </button>
              </div>
            )}
          </div>

          {/* D-Pad Controls */}
          <div className="grid grid-cols-3 gap-2 mt-4">
            <button
              onClick={() => handleRoverMove(0)}
              disabled={gameOver}
              className={`py-3 rounded-xl border text-xs font-black transition active:scale-95 flex items-center justify-center gap-1 ${
                roverLane === 0 ? 'bg-[#1769ff] border-[#1769ff] text-white' : 'bg-slate-900 border-slate-800 text-slate-200 hover:bg-slate-800'
              }`}
            >
              ← Lane 1 (Left)
            </button>
            <button
              onClick={() => handleRoverMove(1)}
              disabled={gameOver}
              className={`py-3 rounded-xl border text-xs font-black transition active:scale-95 flex items-center justify-center gap-1 ${
                roverLane === 1 ? 'bg-[#1769ff] border-[#1769ff] text-white' : 'bg-slate-900 border-slate-800 text-slate-200 hover:bg-slate-800'
              }`}
            >
              Lane 2 (Center)
            </button>
            <button
              onClick={() => handleRoverMove(2)}
              disabled={gameOver}
              className={`py-3 rounded-xl border text-xs font-black transition active:scale-95 flex items-center justify-center gap-1 ${
                roverLane === 2 ? 'bg-[#1769ff] border-[#1769ff] text-white' : 'bg-slate-900 border-slate-800 text-slate-200 hover:bg-slate-800'
              }`}
            >
              Lane 3 (Right) →
            </button>
          </div>
        </div>
      ) : (
        /* ================= Mode 3: Block vs Python Comparison ================= */
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
      <div className="px-5 py-3 bg-[#eaf2ff] dark:bg-[#16243a] border-t border-[#d8e6fa] dark:border-[#1e304d] flex items-center justify-between text-xs">
        <div className="text-[#1458d7] dark:text-sky-300 font-extrabold flex items-center gap-1.5">
          <span>Small Batches (4–5 kids) · Ananth Nagar Lab</span>
        </div>
        <button
          onClick={onBookDemo}
          className="font-extrabold text-[#1769ff] dark:text-blue-400 hover:text-[#1258d6] dark:hover:text-blue-300 hover:underline flex items-center gap-1"
        >
          Book 1-on-1 Trial <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
