import React, { useState } from 'react';
import { generateGoalBreakdown } from '../services/geminiService';
import { Goal } from '../types';
import { Sparkles, ArrowRight, CheckCircle2, Loader2, X } from 'lucide-react';

interface GoalPlannerProps {
  onSave: (goal: Goal) => void;
  onCancel: () => void;
}

export const GoalPlanner: React.FC<GoalPlannerProps> = ({ onSave, onCancel }) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedGoal, setGeneratedGoal] = useState<Goal | null>(null);

  const handleGenerate = async () => {
    if (!input.trim()) return;
    setIsLoading(true);
    try {
      const goal = await generateGoalBreakdown(input);
      setGeneratedGoal(goal);
    } catch (error) {
      console.error("Failed to generate goal", error);
      // Fallback simple goal if AI fails
      setGeneratedGoal({
        id: crypto.randomUUID(),
        title: input,
        category: "Personal",
        progress: 0,
        // Fix: Added missing 'completed' property to meet SubTask interface requirements
        milestones: [{ title: "Get started", estimatedTime: "Today", completed: false }],
        isAIGenerated: false
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirm = () => {
    if (generatedGoal) {
      onSave(generatedGoal);
    }
  };

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
      <div className="p-6 max-w-2xl mx-auto h-full flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-slate-900">New Goal</h2>
          <button onClick={onCancel} className="p-2 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200">
            <X size={24} />
          </button>
        </div>

        {!generatedGoal ? (
          <div className="flex-1 flex flex-col justify-center">
            <label className="text-lg font-medium text-slate-700 mb-3">What do you want to achieve?</label>
            <div className="relative">
              <textarea 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="e.g., I want to run a 5k marathon in 3 months..."
                className="w-full p-6 text-xl rounded-3xl bg-slate-50 border-2 border-slate-100 focus:border-emerald-500 focus:ring-0 transition-all resize-none h-48 placeholder-slate-400"
              />
              <div className="absolute bottom-4 right-4">
                <button 
                  onClick={handleGenerate}
                  disabled={isLoading || !input}
                  className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 hover:bg-emerald-700 disabled:opacity-50 transition-all shadow-lg shadow-emerald-200"
                >
                  {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
                  <span>Plan with AI</span>
                </button>
              </div>
            </div>
            <p className="mt-4 text-center text-slate-400 text-sm">
              Kairos will break this down into actionable steps for you.
            </p>
          </div>
        ) : (
          <div className="flex-1 flex flex-col animate-fade-in">
            <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100 mb-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold text-emerald-900">{generatedGoal.title}</h3>
                <span className="px-3 py-1 bg-white rounded-full text-xs font-bold text-emerald-600 uppercase tracking-wide">
                  {generatedGoal.category}
                </span>
              </div>
              <p className="text-emerald-700/80">Here is your tailored roadmap:</p>
            </div>

            <div className="space-y-4 mb-8 flex-1 overflow-y-auto">
              {generatedGoal.milestones.map((ms, idx) => (
                <div key={idx} className="flex gap-4 items-start p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
                  <div className="mt-1 bg-slate-100 text-slate-500 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0">
                    {idx + 1}
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800">{ms.title}</h4>
                    <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md mt-1 inline-block">
                      {ms.estimatedTime}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="sticky bottom-0 bg-white pt-4 pb-8">
              <button 
                onClick={handleConfirm}
                className="w-full bg-slate-900 text-white p-4 rounded-2xl font-bold text-lg hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 flex justify-center items-center gap-2"
              >
                <span>Commit to Goal</span>
                <ArrowRight size={20} />
              </button>
              <button 
                onClick={() => setGeneratedGoal(null)}
                className="w-full mt-3 text-slate-500 font-medium py-2 hover:text-slate-800"
              >
                Try Again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};