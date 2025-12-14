import React, { useState } from 'react';
import { Goal, Habit } from '../types';
import { Plus, Flame, Check, Calendar, Trophy, ArrowRight, Target, MoreHorizontal, CheckCircle2, Circle } from 'lucide-react';
import { GoalPlanner } from './GoalPlanner';

interface GoalsAndHabitsProps {
  goals: Goal[];
  habits: Habit[];
  onAddGoal: (goal: Goal) => void;
  onAddHabit: (habit: Habit) => void;
  onToggleGoalMilestone: (goalId: string, milestoneIndex: number) => void;
  onToggleHabit: (habitId: string) => void;
}

export const GoalsAndHabits: React.FC<GoalsAndHabitsProps> = ({
  goals,
  habits,
  onAddGoal,
  onAddHabit,
  onToggleGoalMilestone,
  onToggleHabit
}) => {
  const [showGoalPlanner, setShowGoalPlanner] = useState(false);
  const [showAddHabit, setShowAddHabit] = useState(false);
  const [newHabitTitle, setNewHabitTitle] = useState('');

  const today = new Date().toISOString().split('T')[0];
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split('T')[0];
  });

  const getDayLabel = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { weekday: 'narrow' });
  };

  const handleCreateHabit = () => {
    if (!newHabitTitle.trim()) return;
    const newHabit: Habit = {
      id: crypto.randomUUID(),
      title: newHabitTitle,
      category: 'Personal',
      streak: 0,
      completedDates: []
    };
    onAddHabit(newHabit);
    setNewHabitTitle('');
    setShowAddHabit(false);
  };

  return (
    <div className="space-y-8 pb-24 animate-fade-in max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Goals & Habits</h1>
          <p className="text-slate-500 mt-1">Build consistency and achieve your dreams.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setShowAddHabit(true)}
            className="px-4 py-2 bg-white border border-slate-200 text-slate-700 font-medium rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-2"
          >
            <Plus size={18} /> Habit
          </button>
          <button 
            onClick={() => setShowGoalPlanner(true)}
            className="px-4 py-2 bg-slate-900 text-white font-medium rounded-xl hover:bg-slate-800 transition-colors flex items-center gap-2 shadow-lg shadow-slate-200"
          >
            <Plus size={18} /> New Goal
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Habits Section - Left/Top */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Calendar size={22} className="text-emerald-500" />
              Daily Habits
            </h2>

            {showAddHabit && (
              <div className="mb-6 p-4 bg-slate-50 rounded-2xl border border-slate-200 animate-in fade-in slide-in-from-top-2">
                <input
                  type="text"
                  value={newHabitTitle}
                  onChange={(e) => setNewHabitTitle(e.target.value)}
                  placeholder="E.g., Drink 2L water, Read 10 mins..."
                  className="w-full p-3 rounded-xl border-slate-200 focus:border-emerald-500 focus:ring-0 mb-3"
                  autoFocus
                />
                <div className="flex gap-2">
                  <button 
                    onClick={handleCreateHabit}
                    className="flex-1 bg-emerald-600 text-white py-2 rounded-lg font-medium hover:bg-emerald-700"
                  >
                    Add Habit
                  </button>
                  <button 
                    onClick={() => setShowAddHabit(false)}
                    className="px-4 py-2 text-slate-500 hover:text-slate-700 font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {habits.length === 0 ? (
                <div className="text-center py-8 text-slate-400">
                  <p>No habits tracked yet.</p>
                </div>
              ) : (
                habits.map(habit => {
                  const isCompletedToday = habit.completedDates.includes(today);
                  return (
                    <div key={habit.id} className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-md transition-all group">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-bold text-slate-800 text-lg">{habit.title}</h3>
                          <div className="flex items-center gap-1.5 text-xs font-bold text-orange-500 mt-1">
                            <Flame size={14} className="fill-current" />
                            <span>{habit.streak} Day Streak</span>
                          </div>
                        </div>
                        <button
                          onClick={() => onToggleHabit(habit.id)}
                          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 transform active:scale-90 ${
                            isCompletedToday 
                              ? 'bg-emerald-500 text-white shadow-emerald-200 shadow-lg' 
                              : 'bg-white border-2 border-slate-200 text-slate-300 hover:border-emerald-300'
                          }`}
                        >
                          <Check size={20} strokeWidth={3} />
                        </button>
                      </div>
                      
                      {/* Weekly Visualization */}
                      <div className="flex justify-between items-center gap-1">
                        {last7Days.map((date, idx) => {
                          const isDone = habit.completedDates.includes(date);
                          const isToday = date === today;
                          return (
                            <div key={idx} className="flex flex-col items-center gap-1">
                              <div 
                                className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold transition-all ${
                                  isDone 
                                    ? 'bg-emerald-500 text-white' 
                                    : isToday 
                                      ? 'bg-white border-2 border-slate-300 text-slate-400'
                                      : 'bg-slate-200 text-slate-400'
                                }`}
                              >
                                {isDone ? <Check size={12} strokeWidth={4} /> : null}
                              </div>
                              <span className={`text-[10px] ${isToday ? 'text-emerald-600 font-bold' : 'text-slate-400'}`}>
                                {getDayLabel(date)}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Goals Section - Right/Bottom */}
        <div className="lg:col-span-7 space-y-6">
           <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
             <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <Target size={22} className="text-indigo-500" />
                Active Goals
             </h2>
             
             <div className="space-y-6">
                {goals.length === 0 ? (
                  <div className="text-center py-12 text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    <Trophy size={48} className="mx-auto mb-3 opacity-20" />
                    <p>No active goals.</p>
                    <button onClick={() => setShowGoalPlanner(true)} className="text-indigo-600 font-bold mt-2 hover:underline">Start a new goal</button>
                  </div>
                ) : (
                  goals.map(goal => (
                    <div key={goal.id} className="border border-slate-100 rounded-2xl p-5 hover:border-indigo-100 transition-colors bg-white shadow-sm">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                             <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-600">
                                {goal.category}
                             </span>
                             {goal.isAIGenerated && (
                               <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-purple-50 text-purple-600 flex items-center gap-1">
                                  AI Plan
                               </span>
                             )}
                          </div>
                          <h3 className="text-lg font-bold text-slate-900">{goal.title}</h3>
                        </div>
                        <div className="radial-progress text-indigo-500 text-xs font-bold" style={{"--value": goal.progress, "--size": "2.5rem", "--thickness": "3px"} as any}>
                          {Math.round(goal.progress)}%
                        </div>
                      </div>

                      {/* Milestones */}
                      <div className="space-y-3 bg-slate-50 rounded-xl p-3">
                        {goal.milestones.map((ms, idx) => (
                           <button 
                            key={idx}
                            onClick={() => onToggleGoalMilestone(goal.id, idx)}
                            className="w-full flex items-center gap-3 text-left group hover:bg-white p-2 rounded-lg transition-colors"
                          >
                            {ms.completed ? (
                              <CheckCircle2 size={20} className="text-emerald-500 shrink-0" />
                            ) : (
                              <Circle size={20} className="text-slate-300 group-hover:text-indigo-400 shrink-0" />
                            )}
                            <div className="flex-1 min-w-0">
                               <p className={`text-sm font-medium truncate ${ms.completed ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                                 {ms.title}
                               </p>
                               <p className="text-[10px] text-slate-400">{ms.estimatedTime}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))
                )}
             </div>
           </div>
        </div>
      </div>

      {/* Goal Planner Modal */}
      {showGoalPlanner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
           <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm" onClick={() => setShowGoalPlanner(false)}></div>
           <div className="relative w-full h-full md:w-auto md:h-auto">
              <GoalPlanner 
                onSave={(goal) => {
                  onAddGoal(goal);
                  setShowGoalPlanner(false);
                }} 
                onCancel={() => setShowGoalPlanner(false)} 
              />
           </div>
        </div>
      )}
    </div>
  );
};
