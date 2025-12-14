import React, { useState, useEffect } from 'react';
import { ViewState, Goal, MoodEntry, JournalEntry, Habit } from './types';
import { Dashboard } from './components/Dashboard';
import { LiveSession } from './components/LiveSession';
import { GoalsAndHabits } from './components/GoalsAndHabits';
import { CheckInModal } from './components/CheckInModal';
import { Journal } from './components/Journal';
import { ZenZone } from './components/ZenZone';
import { WelcomeScreen } from './components/WelcomeScreen';
import { Settings } from './components/Settings';
import { LayoutDashboard, Mic, Target, Book, Home, Settings as SettingsIcon, LogOut, Menu, X, Wind, Flame, Trophy } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>(ViewState.WELCOME);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showCheckIn, setShowCheckIn] = useState(false);
  
  // Gamification State
  const [userLevel, setUserLevel] = useState(3);
  const [userXP, setUserXP] = useState(450); // Out of 1000
  const [streakDays, setStreakDays] = useState(5);
  
  // Data State
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: '1',
      title: 'Improve Sleep Schedule',
      category: 'Health',
      progress: 50,
      milestones: [
        { title: 'No screens after 10pm', estimatedTime: 'Daily', completed: true },
        { title: 'Read 20 mins before bed', estimatedTime: 'Daily', completed: false }
      ],
      isAIGenerated: false
    }
  ]);

  const [habits, setHabits] = useState<Habit[]>([
    {
      id: '1',
      title: 'Morning Meditation',
      category: 'Mindfulness',
      streak: 5,
      completedDates: [
         new Date(Date.now() - 86400000).toISOString().split('T')[0], // Yesterday
         new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0],
         new Date(Date.now() - 86400000 * 3).toISOString().split('T')[0],
         new Date(Date.now() - 86400000 * 4).toISOString().split('T')[0],
         new Date(Date.now() - 86400000 * 5).toISOString().split('T')[0],
      ]
    },
    {
      id: '2',
      title: 'Drink 2L Water',
      category: 'Health',
      streak: 2,
      completedDates: [
        new Date().toISOString().split('T')[0], // Today
        new Date(Date.now() - 86400000).toISOString().split('T')[0]
      ]
    }
  ]);
  
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([
    { date: 'Mon', score: 6, energy: 5 },
    { date: 'Tue', score: 7, energy: 6 },
    { date: 'Wed', score: 5, energy: 4 },
    { date: 'Thu', score: 8, energy: 7 },
    { date: 'Fri', score: 7, energy: 8 },
  ]);

  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([
    {
      id: 'j1',
      date: 'Today, 8:30 AM',
      content: 'I woke up feeling a bit anxious about the big presentation today, but after reviewing my notes one last time, I feel more prepared. I need to remember to breathe and take it one slide at a time.',
      sentiment: 'Mixed',
      emotions: ['Anxiety', 'Hope', 'Determination'],
      tags: ['Work', 'Presentation', 'Mindfulness'],
      aiInsight: 'Preparation is the best antidote to anxiety.',
      actionableTip: 'Do a 2-minute box breathing exercise right before the meeting starts.',
      reflectionQuestion: 'What is the worst that could happen, and do you have a plan for it?'
    }
  ]);

  // Handlers
  const addXP = (amount: number) => {
    setUserXP(prev => {
      const newXP = prev + amount;
      if (newXP >= 1000) {
        setUserLevel(l => l + 1);
        return newXP - 1000;
      }
      return newXP;
    });
  };

  const handleAddGoal = (goal: Goal) => {
    setGoals([goal, ...goals]);
    addXP(100);
  };

  const handleAddHabit = (habit: Habit) => {
    setHabits([...habits, habit]);
    addXP(50);
  };

  const handleToggleHabit = (habitId: string) => {
    const today = new Date().toISOString().split('T')[0];
    
    setHabits(prev => prev.map(h => {
      if (h.id !== habitId) return h;

      const isCompletedToday = h.completedDates.includes(today);
      let newCompletedDates;
      let newStreak = h.streak;

      if (isCompletedToday) {
        // Undo completion
        newCompletedDates = h.completedDates.filter(d => d !== today);
        // Simplified streak logic: if decreasing, just subtract 1 if > 0
        newStreak = Math.max(0, h.streak - 1);
      } else {
        // Complete
        newCompletedDates = [...h.completedDates, today];
        newStreak = h.streak + 1;
        addXP(10); // Reward
      }

      return {
        ...h,
        completedDates: newCompletedDates,
        streak: newStreak
      };
    }));
  };

  const handleToggleGoalMilestone = (goalId: string, milestoneIndex: number) => {
    setGoals(prevGoals => prevGoals.map(g => {
      if (g.id !== goalId) return g;
      
      const newMilestones = [...g.milestones];
      const wasCompleted = newMilestones[milestoneIndex].completed;
      newMilestones[milestoneIndex].completed = !wasCompleted;
      
      if (!wasCompleted) addXP(20); // Reward for completion

      const completedCount = newMilestones.filter(m => m.completed).length;
      const progress = (completedCount / newMilestones.length) * 100;
      
      return { ...g, milestones: newMilestones, progress };
    }));
  };

  const handleToggleSuggestedTask = (taskId: string) => {
    setMoodHistory(prev => {
      const newHistory = [...prev];
      const lastEntryIndex = newHistory.length - 1;
      if (lastEntryIndex >= 0) {
        const lastEntry = newHistory[lastEntryIndex];
        if (lastEntry.suggestedTasks) {
          const newTasks = lastEntry.suggestedTasks.map(t => {
            if (t.id === taskId) {
               if (!t.completed) addXP(15);
               return { ...t, completed: !t.completed };
            }
            return t;
          });
          newHistory[lastEntryIndex] = { ...lastEntry, suggestedTasks: newTasks };
        }
      }
      return newHistory;
    });
  };

  const handleAddJournalEntry = (entry: JournalEntry) => {
    setJournalEntries([entry, ...journalEntries]);
    addXP(50);
    setView(ViewState.JOURNAL);
  };

  const handleCheckInSave = (entry: MoodEntry) => {
    setMoodHistory([...moodHistory, entry]);
    addXP(30);
  };

  // If on Welcome Screen, render simplified view
  if (view === ViewState.WELCOME) {
    return <WelcomeScreen onGetStarted={() => setView(ViewState.DASHBOARD)} />;
  }

  // Navigation Items
  const navItems = [
    { id: ViewState.DASHBOARD, icon: Home, label: 'Dashboard' },
    { id: ViewState.GOALS, icon: Target, label: 'Goals & Habits' },
    { id: ViewState.JOURNAL, icon: Book, label: 'Journal' },
    { id: ViewState.ZEN_ZONE, icon: Wind, label: 'Zen Zone' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">
      
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-200 h-screen sticky top-0 z-40">
        <div className="p-8 pb-4">
          <div className="flex items-center gap-2 text-emerald-600 mb-6">
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-emerald-200">K</div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">Kairos</span>
          </div>

          {/* Gamification Widget */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 mb-2">
            <div className="flex justify-between items-center mb-2">
               <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Level {userLevel}</span>
               <div className="flex items-center gap-1 text-orange-500 font-bold text-xs">
                  <Flame size={12} className="fill-current animate-pulse" />
                  <span>{streakDays} Day Streak</span>
               </div>
            </div>
            <div className="flex items-center gap-2 mb-1">
               <Trophy size={16} className="text-emerald-500" />
               <span className="text-sm font-bold text-slate-800">Mindful Achiever</span>
            </div>
            <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
               <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${(userXP / 1000) * 100}%` }}></div>
            </div>
            <div className="text-[10px] text-slate-400 mt-1 text-right">{userXP} / 1000 XP</div>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
                view === item.id 
                  ? 'bg-slate-900 text-white shadow-lg shadow-slate-200' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </button>
          ))}
          
          <div className="pt-4 mt-2 border-t border-slate-100">
             <button
              onClick={() => setView(ViewState.SETTINGS)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
                view === ViewState.SETTINGS
                  ? 'bg-slate-900 text-white shadow-lg shadow-slate-200' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <SettingsIcon size={20} />
              <span>Settings</span>
            </button>
          </div>
        </nav>

        <div className="p-4 border-t border-slate-100 bg-white">
          <button 
            onClick={() => setView(ViewState.LIVE_SESSION)}
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white p-4 rounded-2xl shadow-lg shadow-emerald-200 hover:shadow-emerald-300 transition-all flex items-center justify-center gap-2 group transform hover:-translate-y-0.5"
          >
            <Mic size={20} className="group-hover:scale-110 transition-transform" />
            <span className="font-semibold">Start Session</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="lg:hidden bg-white border-b border-slate-100 p-4 sticky top-0 z-30 flex justify-between items-center backdrop-blur-sm bg-white/90">
          <div className="flex items-center gap-2">
             <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white font-bold shadow-md">K</div>
             <span className="font-bold text-lg text-slate-900">Kairos</span>
          </div>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-slate-600 hover:bg-slate-50 rounded-lg">
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </header>

        {/* Mobile Nav Overlay */}
        {isMobileMenuOpen && (
           <div className="lg:hidden fixed inset-0 z-20 bg-slate-900/50 backdrop-blur-sm transition-opacity" onClick={() => setIsMobileMenuOpen(false)}>
              <div className="absolute right-0 top-0 h-full w-72 bg-white shadow-2xl p-6 flex flex-col" onClick={e => e.stopPropagation()}>
                 <div className="flex justify-between items-center mb-8">
                    <span className="font-bold text-xl text-slate-900">Menu</span>
                    <button onClick={() => setIsMobileMenuOpen(false)}><X className="text-slate-400" /></button>
                 </div>
                 <div className="space-y-2">
                    {navItems.map(item => (
                      <button
                        key={item.id}
                        onClick={() => {
                          setView(item.id);
                          setIsMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                          view === item.id ? 'bg-slate-100 text-slate-900 font-bold' : 'text-slate-500'
                        }`}
                      >
                        <item.icon size={20} />
                        <span>{item.label}</span>
                      </button>
                    ))}
                    <button
                        onClick={() => {
                          setView(ViewState.SETTINGS);
                          setIsMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                          view === ViewState.SETTINGS ? 'bg-slate-100 text-slate-900 font-bold' : 'text-slate-500'
                        }`}
                      >
                        <SettingsIcon size={20} />
                        <span>Settings</span>
                      </button>
                 </div>
                 
                 <div className="mt-auto pt-8">
                     <button onClick={() => setView(ViewState.WELCOME)} className="flex items-center gap-2 text-red-500 font-medium px-4">
                        <LogOut size={20} />
                        Logout
                     </button>
                 </div>
              </div>
           </div>
        )}

        <main className="flex-1 overflow-y-auto p-4 md:p-8 max-w-7xl mx-auto w-full">
          {view === ViewState.DASHBOARD && (
            <Dashboard 
              moodHistory={moodHistory} 
              goals={goals} 
              habits={habits}
              onAddGoal={() => setView(ViewState.GOALS)} 
              onCheckIn={() => setShowCheckIn(true)}
              onToggleGoal={handleToggleGoalMilestone}
              onToggleSuggestedTask={handleToggleSuggestedTask}
              onNavigate={setView}
            />
          )}

          {view === ViewState.JOURNAL && (
             <Journal entries={journalEntries} onAddEntry={handleAddJournalEntry} />
          )}

           {view === ViewState.GOALS && (
             <GoalsAndHabits
               goals={goals}
               habits={habits}
               onAddGoal={handleAddGoal}
               onAddHabit={handleAddHabit}
               onToggleGoalMilestone={handleToggleGoalMilestone}
               onToggleHabit={handleToggleHabit}
             />
           )}
           
           {view === ViewState.ZEN_ZONE && (
             <ZenZone />
           )}
           
           {view === ViewState.SETTINGS && (
             <Settings />
           )}
        </main>
      </div>

      {/* Overlays / Modals */}
      {showCheckIn && (
        <CheckInModal 
          onClose={() => setShowCheckIn(false)} 
          onSave={handleCheckInSave} 
        />
      )}

      {view === ViewState.LIVE_SESSION && (
        <LiveSession onEndSession={() => setView(ViewState.DASHBOARD)} />
      )}

      {/* Mobile Bottom Bar (only visible on mobile) */}
      <nav className="lg:hidden bg-white border-t border-slate-100 px-6 py-3 pb-safe fixed bottom-0 w-full z-20 flex justify-between items-center shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
         {navItems.map(item => (
            <button 
              key={item.id}
              onClick={() => setView(item.id)}
              className={`flex flex-col items-center gap-1 ${view === item.id ? 'text-slate-900' : 'text-slate-400'}`}
            >
              <item.icon size={24} strokeWidth={view === item.id ? 2.5 : 2} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
         ))}
         <button 
            onClick={() => setView(ViewState.LIVE_SESSION)}
            className="flex flex-col items-center gap-1 text-emerald-600"
         >
            <div className="bg-slate-900 text-white p-3 rounded-full shadow-lg shadow-slate-300 -mt-8 border-4 border-slate-50 transform hover:scale-105 transition-transform">
               <Mic size={24} />
            </div>
            <span className="text-[10px] font-bold mt-1">Talk</span>
         </button>
      </nav>
      
    </div>
  );
};

export default App;