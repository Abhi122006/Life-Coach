import React, { useState, useEffect } from 'react';
import { generateMantra } from '../services/geminiService';
import { Play, RotateCcw, Wind, Music, Sparkles } from 'lucide-react';

export const ZenZone: React.FC = () => {
  const [mantra, setMantra] = useState<string>("Inhale courage, exhale fear.");
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale');
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    // Fetch a fresh mantra on mount
    const fetchMantra = async () => {
      const newMantra = await generateMantra();
      setMantra(newMantra);
    };
    fetchMantra();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isBreathing) {
      // Breathing Cycle: 4s Inhale, 4s Hold, 4s Exhale
      const cycleLength = 12000; 
      
      const updatePhase = () => {
         const now = Date.now();
         const elapsed = (now % cycleLength);
         
         if (elapsed < 4000) setBreathPhase('Inhale');
         else if (elapsed < 8000) setBreathPhase('Hold');
         else setBreathPhase('Exhale');
      };

      interval = setInterval(updatePhase, 100);
      
      // Timer
      const timerInterval = setInterval(() => {
         setTimer(t => t + 1);
      }, 1000);

      return () => {
        clearInterval(interval);
        clearInterval(timerInterval);
      };
    } else {
        setTimer(0);
        setBreathPhase('Inhale');
    }
  }, [isBreathing]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="h-full flex flex-col items-center justify-center relative overflow-hidden bg-slate-50 p-6">
       {/* Background Ambience */}
       <div className="absolute inset-0 bg-gradient-to-br from-teal-50 via-cyan-50 to-sky-100 opacity-50 z-0"></div>
       
       <div className="z-10 w-full max-w-lg text-center">
          <h2 className="text-3xl font-light text-slate-800 mb-2 flex items-center justify-center gap-2">
             <Wind className="text-teal-500" />
             Zen Zone
          </h2>
          <p className="text-slate-500 mb-12">Center your mind and body.</p>

          {/* Breathing Circle */}
          <div className="relative w-64 h-64 mx-auto mb-12 flex items-center justify-center">
             {/* Outer Glow */}
             <div className={`absolute inset-0 rounded-full bg-teal-200/30 blur-3xl transition-all duration-[4000ms] ease-in-out ${
                isBreathing && breathPhase === 'Inhale' ? 'scale-150 opacity-100' : 'scale-75 opacity-30'
             }`}></div>
             
             {/* Breathing Ring */}
             <div className={`w-full h-full rounded-full border-4 border-teal-100 flex items-center justify-center relative transition-all duration-[4000ms] ease-in-out ${
                isBreathing 
                  ? breathPhase === 'Inhale' ? 'scale-110 border-teal-300' 
                  : breathPhase === 'Exhale' ? 'scale-75 border-teal-200' 
                  : 'scale-100 border-teal-400'
                  : 'scale-100'
             }`}>
                <div className={`w-48 h-48 rounded-full bg-gradient-to-tr from-teal-400 to-cyan-300 shadow-lg flex items-center justify-center transition-all duration-[4000ms] ease-in-out ${
                   isBreathing 
                     ? breathPhase === 'Inhale' ? 'scale-110 shadow-teal-300/50' 
                     : breathPhase === 'Exhale' ? 'scale-75 shadow-teal-200/30' 
                     : 'scale-100'
                     : 'scale-100'
                }`}>
                   <span className="text-white text-2xl font-medium tracking-widest uppercase">
                      {isBreathing ? breathPhase : 'Ready'}
                   </span>
                </div>
             </div>
          </div>

          {/* Mantra Card */}
          <div className="bg-white/60 backdrop-blur-md p-6 rounded-2xl border border-white shadow-sm mb-8 transform transition-all hover:scale-105">
             <div className="flex justify-center mb-3">
                <Sparkles size={20} className="text-amber-400" />
             </div>
             <p className="text-lg font-serif italic text-slate-700 leading-relaxed">"{mantra}"</p>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-6">
             {!isBreathing ? (
                <button 
                  onClick={() => setIsBreathing(true)}
                  className="bg-teal-600 text-white px-8 py-3 rounded-full font-medium hover:bg-teal-700 transition-all shadow-lg shadow-teal-200 flex items-center gap-2 text-lg group"
                >
                   <Play size={20} className="fill-current" />
                   <span>Start Breathing</span>
                </button>
             ) : (
                <div className="flex items-center gap-4">
                   <div className="text-2xl font-mono text-slate-600 w-20">
                      {formatTime(timer)}
                   </div>
                   <button 
                     onClick={() => setIsBreathing(false)}
                     className="bg-slate-200 text-slate-600 p-3 rounded-full hover:bg-slate-300 transition-all"
                   >
                      <RotateCcw size={20} />
                   </button>
                </div>
             )}
          </div>
       </div>
    </div>
  );
};