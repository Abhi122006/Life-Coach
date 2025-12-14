import React from 'react';
import { Sparkles, Mic, Target, Shield, ArrowRight, Brain } from 'lucide-react';

interface WelcomeScreenProps {
  onGetStarted: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Navbar */}
      <nav className="p-6 flex justify-between items-center max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2 text-emerald-600">
          <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-emerald-200/50">K</div>
          <span className="text-2xl font-bold text-slate-900 tracking-tight">Kairos</span>
        </div>
        <button 
          onClick={onGetStarted}
          className="text-slate-600 font-medium hover:text-slate-900"
        >
          Login
        </button>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20 relative overflow-hidden">
        {/* Decorative Blobs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-200/20 rounded-full blur-3xl -z-10 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl -z-10 animate-pulse delay-1000"></div>

        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-full text-slate-600 text-sm font-medium mb-8 shadow-sm">
          <Sparkles size={16} className="text-amber-400 fill-current" />
          <span>Your Personal AI Life Architect</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold text-slate-900 tracking-tight mb-6 max-w-4xl leading-tight">
          Master your <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">mindset</span>,<br />
          conquer your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-500">goals</span>.
        </h1>
        
        <p className="text-xl text-slate-500 max-w-2xl mb-10 leading-relaxed">
          Kairos combines advanced AI voice coaching, mood tracking, and intelligent goal planning to help you become the best version of yourself.
        </p>

        <button 
          onClick={onGetStarted}
          className="group relative inline-flex items-center justify-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 hover:shadow-2xl hover:-translate-y-1"
        >
          <span>Start Your Journey</span>
          <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
        </button>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 max-w-6xl w-full text-left">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-6">
              <Mic size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Live Voice Coaching</h3>
            <p className="text-slate-500 leading-relaxed">
              Real-time, empathetic conversations with an AI coach that adapts to your emotional state and needs.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-6">
              <Brain size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Adaptive Mood Tracking</h3>
            <p className="text-slate-500 leading-relaxed">
              Understand your patterns with daily check-ins. Get personalized tasks based on your energy levels.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 mb-6">
              <Target size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Smart Goal Planning</h3>
            <p className="text-slate-500 leading-relaxed">
              Turn vague aspirations into concrete, actionable roadmaps generated instantly by AI.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 text-center text-slate-400 text-sm">
        <p>© 2024 Kairos AI. Built for the future of wellness.</p>
      </footer>
    </div>
  );
};