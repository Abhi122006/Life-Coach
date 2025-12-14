import React, { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { generateDailyCheckIn } from '../services/geminiService';
import { MoodEntry, TaskItem } from '../types';

interface CheckInModalProps {
  onClose: () => void;
  onSave: (entry: MoodEntry) => void;
}

export const CheckInModal: React.FC<CheckInModalProps> = ({ onClose, onSave }) => {
  const [mood, setMood] = useState(5);
  const [energy, setEnergy] = useState(5);
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const { tip, tasks } = await generateDailyCheckIn(mood, energy, note);
      
      const taskItems: TaskItem[] = tasks.map(t => ({
        id: crypto.randomUUID(),
        text: t,
        completed: false
      }));

      const newEntry: MoodEntry = {
        date: new Date().toLocaleDateString('en-US', { weekday: 'short' }),
        score: mood,
        energy: energy,
        note: note,
        aiTip: tip,
        suggestedTasks: taskItems
      };
      
      onSave(newEntry);
      onClose();
    } catch (error) {
      console.error(error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl transform transition-all">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-900">Daily Check-in</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={24} />
          </button>
        </div>
        
        <div className="p-6 space-y-8">
          {/* Mood Slider */}
          <div className="space-y-3">
            <div className="flex justify-between text-sm font-medium text-slate-600">
              <span>Mood</span>
              <span className="text-emerald-600 font-bold">{mood}/10</span>
            </div>
            <input 
              type="range" 
              min="1" 
              max="10" 
              value={mood} 
              onChange={(e) => setMood(Number(e.target.value))}
              className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            <div className="flex justify-between text-xs text-slate-400">
              <span>Rough day</span>
              <span>Amazing</span>
            </div>
          </div>

          {/* Energy Slider */}
          <div className="space-y-3">
            <div className="flex justify-between text-sm font-medium text-slate-600">
              <span>Energy</span>
              <span className="text-amber-600 font-bold">{energy}/10</span>
            </div>
            <input 
              type="range" 
              min="1" 
              max="10" 
              value={energy} 
              onChange={(e) => setEnergy(Number(e.target.value))}
              className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
            <div className="flex justify-between text-xs text-slate-400">
              <span>Exhausted</span>
              <span>Charged</span>
            </div>
          </div>

          {/* Note */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-600">What's on your mind?</label>
            <textarea 
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Briefly describe your feelings..."
              className="w-full p-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none resize-none h-24 text-slate-700"
            />
          </div>
        </div>

        <div className="p-6 bg-slate-50 border-t border-slate-100">
          <button 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full bg-slate-900 text-white py-3 rounded-xl font-semibold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                <span>Analyzing...</span>
              </>
            ) : (
              <span>Save & Get Advice</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};