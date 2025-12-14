import React, { useEffect, useState, useRef } from 'react';
import { Mic, MicOff, PhoneOff, BarChart3 } from 'lucide-react';
import { LiveClient } from '../services/geminiService';

interface LiveSessionProps {
  onEndSession: () => void;
}

export const LiveSession: React.FC<LiveSessionProps> = ({ onEndSession }) => {
  const [status, setStatus] = useState<'disconnected' | 'connecting' | 'connected' | 'error'>('disconnected');
  const [isMuted, setIsMuted] = useState(false);
  const clientRef = useRef<LiveClient | null>(null);

  useEffect(() => {
    // Auto-connect on mount
    const client = new LiveClient((newStatus) => {
      setStatus(newStatus);
    });
    clientRef.current = client;
    client.connect();

    return () => {
      client.disconnect();
    };
  }, []);

  const toggleMute = () => {
    // Note: A real mute implementation would toggle the MediaStream track enabled state
    // For simplicity in this demo, we just toggle UI state, but in production 
    // you would access clientRef.current.stream.getAudioTracks()[0].enabled
    setIsMuted(!isMuted);
  };

  const handleDisconnect = () => {
    clientRef.current?.disconnect();
    onEndSession();
  };

  return (
    <div className="fixed inset-0 bg-slate-900 z-50 flex flex-col items-center justify-between py-12 px-6 text-white">
      {/* Top Info */}
      <div className="text-center space-y-2 mt-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-full text-sm font-medium text-slate-300">
           <div className={`w-2 h-2 rounded-full ${status === 'connected' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
           {status === 'connecting' ? 'Connecting to Kairos...' : status === 'connected' ? 'Live Session Active' : 'Disconnected'}
        </div>
        <h2 className="text-3xl font-light tracking-tight text-white/90">Voice Coaching</h2>
      </div>

      {/* Visualizer / Avatar Placeholder */}
      <div className="relative w-64 h-64 flex items-center justify-center">
        {/* Decorative Circles */}
        <div className={`absolute inset-0 rounded-full border border-white/10 ${status === 'connected' ? 'animate-[ping_3s_ease-in-out_infinite]' : ''}`}></div>
        <div className={`absolute inset-8 rounded-full border border-white/20 ${status === 'connected' ? 'animate-[ping_3s_ease-in-out_infinite_delay-700]' : ''}`}></div>
        
        <div className="bg-slate-800 w-32 h-32 rounded-full flex items-center justify-center shadow-2xl shadow-emerald-900/50 relative z-10">
          <BarChart3 className={`w-12 h-12 text-emerald-400 ${status === 'connected' ? 'animate-bounce' : ''}`} />
        </div>
      </div>

      {/* Controls */}
      <div className="w-full max-w-sm space-y-8 mb-8">
        <div className="text-center text-slate-400 text-sm min-h-[20px]">
           {status === 'connected' ? "Listening... Speak naturally." : "Establishing secure connection..."}
        </div>

        <div className="flex items-center justify-center gap-8">
          <button 
            onClick={toggleMute}
            className={`p-6 rounded-full transition-all duration-200 ${isMuted ? 'bg-slate-700 text-slate-400' : 'bg-slate-800 text-white hover:bg-slate-700'}`}
          >
            {isMuted ? <MicOff size={28} /> : <Mic size={28} />}
          </button>

          <button 
            onClick={handleDisconnect}
            className="p-8 bg-red-500 rounded-full text-white shadow-lg shadow-red-900/50 hover:bg-red-600 transform hover:scale-105 transition-all"
          >
            <PhoneOff size={32} />
          </button>
        </div>
      </div>
    </div>
  );
};
