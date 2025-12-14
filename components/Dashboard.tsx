import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MoodEntry, Goal, Habit, ViewState } from '../types';
import { Activity, Zap, Lightbulb, Sparkles, Check, CalendarDays, ArrowRight, Play, Book, Plus, Target, TrendingUp, Filter } from 'lucide-react';

interface DashboardProps {
  moodHistory: MoodEntry[];
  goals: Goal[];
  habits: Habit[];
  onAddGoal: () => void;
  onCheckIn: () => void;
  onToggleGoal: (goalId: string, milestoneIndex: number) => void;
  onToggleSuggestedTask: (taskId: string) => void;
  onNavigate: (view: ViewState) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ 
  moodHistory, 
  goals, 
  habits,
  onAddGoal, 
  onCheckIn, 
  onToggleGoal,
  onToggleSuggestedTask,
  onNavigate
}) => {
  const [chartFilter, setChartFilter] = useState<'both' | 'mood' | 'energy'>('both');

  const lastEntry = moodHistory[moodHistory.length - 1];
  const currentMood = lastEntry || { score: 5, energy: 5 };
  const latestTip = lastEntry?.aiTip;
  const suggestedTasks = lastEntry?.suggestedTasks || [];

  // Greeting Logic
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';

  // Habit Stats
  const today = new Date().toISOString().split('T')[0];
  const completedHabits = habits.filter(h => h.completedDates.includes(today)).length;
  const totalHabits = habits.length;
  const habitProgress = totalHabits > 0 ? (completedHabits / totalHabits) * 100 : 0;

  // Upcoming Milestones
  const upcomingMilestones = goals
    .flatMap(g => g.milestones.map((m, idx) => ({ ...m, goalId: g.id, goalTitle: g.title, index: idx })))
    .filter(m => !m.completed)
    .slice(0, 3);

  return (
    <div className="space-y-8 pb-24 lg:pb-0 animate-fade-in">
      {/* Header & Quick Actions */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight">{greeting}, Alex</h1>
          <p className="text-slate-500 mt-2 text-lg">Here is your daily overview.</p>
        </div>
        
        <div className="flex flex-wrap gap-3">
           <button 
             onClick={() => onNavigate(ViewState.JOURNAL)}
             className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all flex items-center gap-2 shadow-sm"
           >
             <Book size={18} />
             <span>Journal</span>
           </button>
           <button 
             onClick={() => onNavigate(ViewState.ZEN_ZONE)}
             className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all flex items-center gap-2 shadow-sm"
           >
             <Play size={18} />
             <span>Breathe</span>
           </button>
           <button 
             onClick={onCheckIn}
             className="px-6 py-2.5 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 flex items-center gap-2"
           >
             <Activity size={18} />
             <span>Check-in</span>
           </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Mood Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2.5 bg-emerald-50 rounded-xl text-emerald-600 group-hover:scale-110 transition-transform">
              <Activity size={20} />
            </div>
            {currentMood.score >= 7 && <div className="text-xs font-bold bg-green-100 text-green-700 px-2 py-1 rounded-full">Great!</div>}
          </div>
          <div className="text-3xl font-bold text-slate-900 mb-1">{currentMood.score}<span className="text-base text-slate-400 font-normal">/10</span></div>
          <p className="text-sm text-slate-500">Current Mood</p>
        </div>

        {/* Energy Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2.5 bg-amber-50 rounded-xl text-amber-600 group-hover:scale-110 transition-transform">
              <Zap size={20} />
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-900 mb-1">{currentMood.energy}<span className="text-base text-slate-400 font-normal">/10</span></div>
          <p className="text-sm text-slate-500">Energy Level</p>
        </div>

        {/* Habit Progress Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group cursor-pointer" onClick={() => onNavigate(ViewState.GOALS)}>
          <div className="flex justify-between items-start mb-4">
            <div className="p-2.5 bg-blue-50 rounded-xl text-blue-600 group-hover:scale-110 transition-transform">
              <TrendingUp size={20} />
            </div>
            <div className="text-xs font-bold text-slate-400 flex items-center gap-1">
               {completedHabits}/{totalHabits} Done
            </div>
          </div>
          <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden mb-3">
             <div className="h-full bg-blue-500 rounded-full transition-all duration-1000" style={{ width: `${habitProgress}%` }}></div>
          </div>
          <p className="text-sm text-slate-500">Daily Habits</p>
        </div>

         {/* Tip Card */}
         <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-5 rounded-2xl shadow-lg text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
               <Sparkles size={64} />
            </div>
            <div className="relative z-10 flex flex-col h-full justify-between">
               <div className="flex items-center gap-2 text-indigo-200 text-xs font-bold uppercase tracking-wider mb-2">
                  <Lightbulb size={14} /> Daily Insight
               </div>
               <p className="font-medium leading-snug">
                  "{latestTip || "Log your mood to unlock personalized AI coaching insights."}"
               </p>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Main Chart Section */}
        <div className="xl:col-span-2 bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
               Wellness Trends
            </h3>
            <div className="flex p-1 bg-slate-100 rounded-xl">
               <button 
                  onClick={() => setChartFilter('both')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${chartFilter === 'both' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
               >
                  Overview
               </button>
               <button 
                  onClick={() => setChartFilter('mood')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${chartFilter === 'mood' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
               >
                  Mood
               </button>
               <button 
                  onClick={() => setChartFilter('energy')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${chartFilter === 'energy' ? 'bg-white text-amber-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
               >
                  Energy
               </button>
            </div>
          </div>
          
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={moodHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorEnergy" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis hide domain={[0, 10]} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px' }}
                  cursor={{ stroke: '#cbd5e1', strokeWidth: 1 }}
                />
                
                {(chartFilter === 'both' || chartFilter === 'mood') && (
                   <Area 
                     type="monotone" 
                     dataKey="score" 
                     name="Mood"
                     stroke="#10b981" 
                     strokeWidth={3} 
                     fillOpacity={1} 
                     fill="url(#colorMood)" 
                   />
                )}
                
                {(chartFilter === 'both' || chartFilter === 'energy') && (
                   <Area 
                     type="monotone" 
                     dataKey="energy" 
                     name="Energy"
                     stroke="#f59e0b" 
                     strokeWidth={3} 
                     fillOpacity={1} 
                     fill="url(#colorEnergy)" 
                   />
                )}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Suggested Tasks */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col h-full">
             <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Sparkles size={18} className="text-indigo-500" />
                Recommended Actions
             </h3>
             
             {suggestedTasks.length > 0 ? (
                <div className="space-y-3">
                   {suggestedTasks.map(task => (
                      <button 
                        key={task.id}
                        onClick={() => onToggleSuggestedTask(task.id)}
                        className={`w-full flex items-start gap-3 p-3 rounded-xl border transition-all text-left group ${
                           task.completed 
                             ? 'bg-indigo-50 border-indigo-100' 
                             : 'bg-white border-slate-100 hover:border-indigo-200'
                        }`}
                      >
                         <div className={`mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors ${
                            task.completed ? 'border-indigo-500 bg-indigo-500' : 'border-slate-300 group-hover:border-indigo-400'
                         }`}>
                            {task.completed && <Check size={12} className="text-white" />}
                         </div>
                         <span className={`text-sm font-medium leading-tight ${task.completed ? 'text-indigo-800 line-through opacity-70' : 'text-slate-700'}`}>
                            {task.text}
                         </span>
                      </button>
                   ))}
                </div>
             ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-4 text-slate-400 border-2 border-dashed border-slate-100 rounded-xl">
                   <p className="text-sm">Complete a check-in to get AI tasks!</p>
                </div>
             )}
          </div>
        </div>
      </div>

      {/* Bottom Section: Active Goals & Milestones */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
         {/* Goals Preview */}
         <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
             <div className="flex justify-between items-center mb-6">
               <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <Target size={20} className="text-emerald-500" />
                  Active Goals
               </h3>
               <button onClick={() => onNavigate(ViewState.GOALS)} className="text-slate-400 hover:text-slate-600 transition-colors">
                  <ArrowRight size={20} />
               </button>
             </div>
             
             <div className="space-y-4">
               {goals.slice(0, 3).map(goal => (
                  <div key={goal.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-emerald-200 transition-colors group cursor-pointer" onClick={() => onNavigate(ViewState.GOALS)}>
                     <div className="flex justify-between items-start mb-2">
                        <span className="font-bold text-slate-800">{goal.title}</span>
                        <span className="text-xs font-bold text-slate-400">{Math.round(goal.progress)}%</span>
                     </div>
                     <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${goal.progress}%` }}></div>
                     </div>
                  </div>
               ))}
               {goals.length === 0 && (
                  <div className="text-center py-8 text-slate-400">No active goals.</div>
               )}
             </div>
         </div>

         {/* Upcoming Milestones */}
         <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
             <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                <CalendarDays size={20} className="text-amber-500" />
                Upcoming Milestones
             </h3>
             
             <div className="space-y-4">
                {upcomingMilestones.length > 0 ? (
                  upcomingMilestones.map((ms, i) => (
                    <div key={`${ms.goalId}-${ms.index}`} className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                       <div className="w-10 h-10 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center text-slate-300 font-bold shrink-0">
                          {i + 1}
                       </div>
                       <div className="flex-1">
                          <p className="font-bold text-slate-800">{ms.title}</p>
                          <p className="text-xs text-slate-500 uppercase tracking-wide font-medium mt-0.5">{ms.goalTitle}</p>
                       </div>
                       <button 
                          onClick={() => onToggleGoal(ms.goalId, ms.index)}
                          className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-300 hover:border-emerald-400 hover:text-emerald-500 transition-all"
                       >
                          <Check size={16} />
                       </button>
                    </div>
                  ))
                ) : (
                   <div className="text-center py-8 text-slate-400">All caught up!</div>
                )}
             </div>
         </div>
      </div>
    </div>
  );
};