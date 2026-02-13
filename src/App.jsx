import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  Coffee, 
  BookOpen, 
  PauseCircle, 
  Calculator, 
  Trophy, 
  Car, 
  Star,
  Utensils,
  RotateCcw,
  Play,
  Pause,
  Timer,
  ChevronRight,
  ChevronLeft,
  Music,
  Gamepad2,
  Pencil,
  Bath,
  Bed,
  Tv,
  Apple,
  Heart,
  Smile,
  Sun,
  Moon,
  Loader2
} from 'lucide-react';

// Icon mapping from string names to components
const iconMap = {
  Coffee,
  BookOpen,
  PauseCircle,
  Calculator,
  Trophy,
  Car,
  Utensils,
  Music,
  Gamepad2,
  Pencil,
  Bath,
  Bed,
  Tv,
  Apple,
  Heart,
  Smile,
  Sun,
  Moon,
};

// Color mapping for activity backgrounds
const colorMap = {
  orange: 'bg-orange-100 text-orange-600',
  blue: 'bg-blue-100 text-blue-600',
  green: 'bg-green-100 text-green-600',
  purple: 'bg-purple-100 text-purple-600',
  yellow: 'bg-yellow-100 text-yellow-600',
  red: 'bg-red-100 text-red-600',
  cyan: 'bg-cyan-100 text-cyan-600',
  pink: 'bg-pink-100 text-pink-600',
  indigo: 'bg-indigo-100 text-indigo-600',
  teal: 'bg-teal-100 text-teal-600',
};

// Color mapping for mascot badges
const mascotColorMap = {
  red: 'bg-red-500',
  blue: 'bg-blue-500',
  pink: 'bg-pink-400',
  yellow: 'bg-yellow-400',
  green: 'bg-green-500',
  orange: 'bg-orange-500',
  purple: 'bg-purple-500',
  cyan: 'bg-cyan-500',
  indigo: 'bg-indigo-500',
  teal: 'bg-teal-500',
};

const App = () => {
  const [currentDayIndex, setCurrentDayIndex] = useState(new Date().getDay() - 1);
  const [completedItems, setCompletedItems] = useState({});
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Timer State
  const [activeTimerId, setActiveTimerId] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [initialTime, setInitialTime] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);

  const safeDayIndex = Math.max(0, Math.min(4, currentDayIndex));
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const currentDay = days[safeDayIndex];

  // Load config from JSON file
  useEffect(() => {
    fetch('./activity.json')
      .then(response => {
        if (!response.ok) throw new Error('Failed to load config');
        return response.json();
      })
      .then(data => {
        setConfig(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Helper function to get icon component
  const getIcon = (iconName, isMain) => {
    const IconComponent = iconMap[iconName] || Coffee;
    const baseSize = isMain ? 'w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16' : 'w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10';
    return <IconComponent className={baseSize} />;
  };

  // Timer Ticking Logic
  useEffect(() => {
    let interval = null;
    if (timerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && timerRunning) {
      setTimerRunning(false);
      setActiveTimerId(null);
    }
    return () => clearInterval(interval);
  }, [timerRunning, timeLeft]);

  const startTaskTimer = (id, mins) => {
    setActiveTimerId(id);
    setInitialTime(mins * 60);
    setTimeLeft(mins * 60);
    setTimerRunning(true);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleTask = (day, taskId) => {
    const key = `${day}-${taskId}`;
    setCompletedItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
    if (activeTimerId === taskId) {
      setTimerRunning(false);
      setActiveTimerId(null);
    }
  };

  const resetDay = () => {
    if (!config) return;
    const newItems = { ...completedItems };
    config.activities.forEach(item => delete newItems[`${currentDay}-${item.id}`]);
    setCompletedItems(newItems);
    setActiveTimerId(null);
    setTimerRunning(false);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-sky-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-slate-600 font-medium">Loading activities...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-sky-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 shadow-xl text-center max-w-md">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Configuration Error</h2>
          <p className="text-slate-600">{error}</p>
          <p className="text-sm text-slate-400 mt-4">Make sure activity.json exists in the public folder.</p>
        </div>
      </div>
    );
  }

  const completedCount = config.activities.filter(item => completedItems[`${currentDay}-${item.id}`]).length;
  const progressPercent = (completedCount / config.activities.length) * 100;

  return (
    <div className="min-h-screen bg-sky-100 p-2 sm:p-4 md:p-8 lg:p-12 font-sans pb-20">
      <div className="max-w-md md:max-w-2xl lg:max-w-3xl mx-auto bg-white rounded-3xl sm:rounded-[40px] shadow-2xl overflow-hidden border-4 sm:border-8 border-white relative text-slate-900">
        
        {/* Header */}
        <div className="bg-gradient-to-b from-indigo-600 to-indigo-500 p-4 sm:p-6 md:p-8 text-white text-center relative">
          <div className="flex items-center justify-between gap-2 sm:gap-0">
            <button 
              onClick={() => setCurrentDayIndex(prev => Math.max(0, prev - 1))}
              className="p-2 sm:p-3 md:p-4 bg-white/10 active:bg-white/20 rounded-xl sm:rounded-2xl transition-all disabled:opacity-30 touch-manipulation"
              disabled={safeDayIndex === 0}
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8" />
            </button>
            <div className="flex flex-col flex-1">
               <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-tight leading-none mb-1">{currentDay}</h1>
               <div className="flex items-center justify-center gap-1 sm:gap-2 bg-black/10 px-2 sm:px-3 md:px-4 py-1 md:py-2 rounded-full w-fit mx-auto">
                 <span className="text-[9px] sm:text-[10px] md:text-xs font-black tracking-widest text-indigo-100 uppercase">{config.title}</span>
                 <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 fill-yellow-400 text-yellow-400" />
               </div>
            </div>
            <button 
              onClick={() => setCurrentDayIndex(prev => Math.min(4, prev + 1))}
              className="p-2 sm:p-3 md:p-4 bg-white/10 active:bg-white/20 rounded-xl sm:rounded-2xl transition-all disabled:opacity-30 touch-manipulation"
              disabled={safeDayIndex === 4}
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8" />
            </button>
          </div>
        </div>

        {/* Global School Prep Progress Bar */}
        <div className="h-3 sm:h-4 md:h-6 bg-slate-100 w-full relative overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 transition-all duration-1000 ease-out flex items-center justify-end"
            style={{ width: `${progressPercent}%` }}
          >
            <div className="w-3 h-3 sm:w-4 sm:h-4 md:w-6 md:h-6 bg-white rounded-full flex items-center justify-center mr-0.5 sm:mr-1 shadow-sm">
               <Star className="w-1.5 h-1.5 sm:w-2 sm:h-2 md:w-3 md:h-3 text-yellow-500 fill-current" />
            </div>
          </div>
        </div>

        {/* Main Checklist */}
        <div className="p-3 sm:p-4 md:p-6 lg:p-8 space-y-3 sm:space-y-4 md:space-y-6 bg-slate-50/50">
          {config.activities.map((item) => {
            const isCompleted = completedItems[`${currentDay}-${item.id}`];
            const mascot = config.mascots.find(m => m.name === item.mascot);
            const isTimerActive = activeTimerId === item.id;
            const timerPercentage = isTimerActive ? (timeLeft / initialTime) * 100 : 0;
            const colorClass = colorMap[item.color] || colorMap.blue;
            const mascotColorClass = mascotColorMap[mascot?.color] || mascotColorMap.blue;
            
            return (
              <div key={item.id} className="relative">
                <div
                  onClick={() => toggleTask(currentDay, item.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') toggleTask(currentDay, item.id); }}
                  className={`w-full group flex flex-col p-3 sm:p-4 md:p-6 rounded-2xl sm:rounded-[32px] border-b-4 sm:border-b-8 transition-all duration-200 cursor-pointer active:scale-[0.97] touch-manipulation ${
                    isCompleted 
                      ? 'bg-slate-200 border-slate-300 opacity-50 translate-y-2 shadow-none' 
                      : `bg-white border-slate-200 shadow-xl`
                  }`}
                >
                  <div className="flex items-center gap-3 sm:gap-4 md:gap-6 w-full">
                    {/* Activity Picture with Timer Ring */}
                    <div className={`relative p-2 sm:p-3 md:p-4 rounded-2xl sm:rounded-3xl flex flex-col items-center justify-center transition-all flex-shrink-0 ${colorClass} ${item.isMain ? 'w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32' : 'w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20'}`}>
                      
                      {/* Circular Timer Ring */}
                      {isTimerActive && (
                        <svg className="absolute inset-0 w-full h-full -rotate-90">
                          <circle
                            cx="50%" cy="50%" r="45%"
                            fill="none" stroke="currentColor" strokeWidth="4"
                            className="text-white/30"
                          />
                          <circle
                            cx="50%" cy="50%" r="45%"
                            fill="none" stroke="currentColor" strokeWidth="4"
                            strokeDasharray="283"
                            strokeDashoffset={283 - (283 * timerPercentage) / 100}
                            className="text-white transition-all duration-1000"
                          />
                        </svg>
                      )}

                      {getIcon(item.icon, item.isMain)}
                      
                      {/* Mascot badge */}
                      {mascot && (
                        <div className={`absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full border-2 sm:border-4 border-white flex items-center justify-center text-xs sm:text-sm md:text-base shadow-md ${mascotColorClass}`}>
                          {mascot.emoji}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 text-left min-w-0">
                      <div className="flex items-center gap-1 text-slate-400 text-[9px] sm:text-[10px] md:text-xs font-black uppercase tracking-wide sm:tracking-widest mb-0.5 sm:mb-1">
                        <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4" />
                        {item.time}
                      </div>
                      <div className={`text-base sm:text-xl md:text-2xl lg:text-3xl font-black tracking-tight leading-tight ${isCompleted ? 'line-through text-slate-500' : 'text-slate-800'}`}>
                        {item.task}
                      </div>
                      
                      {/* Countdown Text */}
                      {isTimerActive && (
                        <div className="mt-1 md:mt-2 inline-flex items-center gap-1 sm:gap-2 text-indigo-600 font-black tabular-nums text-xs sm:text-sm md:text-base">
                          <Timer className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-5 md:h-5 animate-pulse" />
                          {formatTime(timeLeft)}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col items-center justify-center gap-1 sm:gap-2 flex-shrink-0">
                      {isCompleted ? (
                        <div className="bg-emerald-500 w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center shadow-lg transform rotate-6 scale-110">
                          <CheckCircle2 className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-white" />
                        </div>
                      ) : (
                        <div className="flex flex-col gap-1 md:gap-2">
                          {!isTimerActive ? (
                            <div className="flex gap-1 md:gap-2">
                              {[5, 10].map(m => (
                                <button 
                                  key={m}
                                  onClick={(e) => { e.stopPropagation(); startTaskTimer(item.id, m); }}
                                  className="w-11 h-11 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-indigo-50 text-indigo-600 rounded-lg sm:rounded-xl font-black text-xs sm:text-sm border-2 border-indigo-100 active:bg-indigo-100 transition-colors touch-manipulation"
                                >
                                  {m}m
                                </button>
                              ))}
                            </div>
                          ) : (
                            <button 
                              onClick={(e) => { e.stopPropagation(); setTimerRunning(!timerRunning); }}
                              className={`w-11 h-11 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-lg sm:rounded-xl text-white shadow-md flex items-center justify-center touch-manipulation ${timerRunning ? 'bg-red-500 active:bg-red-600' : 'bg-green-500 active:bg-green-600'}`}
                            >
                              {timerRunning ? <Pause className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" /> : <Play className="w-5 h-5 sm:w-6 sm:h-6 ml-0.5" fill="currentColor" />}
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Horizontal Timer Progress Bar (Only visible when timer is active) */}
                  {isTimerActive && !isCompleted && (
                    <div className="mt-3 sm:mt-4 md:mt-6 w-full h-2 sm:h-3 md:h-4 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                      <div 
                        className="h-full bg-gradient-to-r from-indigo-400 to-indigo-600 transition-all duration-1000 ease-linear shadow-[0_0_8px_rgba(79,70,229,0.4)]"
                        style={{ width: `${timerPercentage}%` }}
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-6 md:p-8 lg:p-10 bg-white border-t-2 border-slate-50 flex flex-col gap-3 sm:gap-4">
          <button 
            onClick={resetDay}
            className="flex items-center justify-center gap-2 py-3 sm:py-4 md:py-5 px-4 sm:px-6 md:px-8 bg-slate-100 text-slate-500 rounded-xl sm:rounded-2xl font-bold active:bg-slate-300 transition-colors uppercase tracking-wide sm:tracking-widest text-xs sm:text-sm md:text-base touch-manipulation"
          >
            <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
            Reset {currentDay}
          </button>
        </div>
      </div>
      
      {/* Mascots Legend */}
      <div className="mt-6 sm:mt-8 md:mt-10 flex justify-center gap-2 sm:gap-3 md:gap-4 px-2 sm:px-4 overflow-x-auto pb-4 no-scrollbar">
        {config.mascots.map((mascot, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <div className={`w-9 h-9 sm:w-10 sm:h-10 md:w-14 md:h-14 rounded-lg sm:rounded-xl ${mascotColorMap[mascot.color] || 'bg-blue-500'} flex items-center justify-center text-lg sm:text-xl md:text-2xl shadow-md border-2 border-white flex-shrink-0`}>
              {mascot.emoji}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
