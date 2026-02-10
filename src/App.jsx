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
  ChevronLeft
} from 'lucide-react';

const App = () => {
  const [currentDayIndex, setCurrentDayIndex] = useState(new Date().getDay() - 1);
  const [completedItems, setCompletedItems] = useState({});
  
  // Timer State
  const [activeTimerId, setActiveTimerId] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [initialTime, setInitialTime] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);

  const safeDayIndex = Math.max(0, Math.min(4, currentDayIndex));
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const currentDay = days[safeDayIndex];

  const oddbods = [
    { name: 'Fuse', color: 'bg-red-500', emoji: '🔴' },
    { name: 'Pogo', color: 'bg-blue-500', emoji: '🔵' },
    { name: 'Newt', color: 'bg-pink-400', emoji: '💗' },
    { name: 'Bubbles', color: 'bg-yellow-400', emoji: '💛' },
    { name: 'Zee', color: 'bg-green-500', emoji: '💚' },
    { name: 'Slick', color: 'bg-orange-500', emoji: '🟠' },
    { name: 'Jeff', color: 'bg-purple-500', emoji: '💜' },
  ];

  const scheduleTemplate = [
    { id: 'breakfast', time: '07:30', task: 'Breakfast Time', icon: <Coffee className="w-8 h-8" />, color: 'bg-orange-100 text-orange-600', mascot: 'Slick' },
    { id: 'study', time: '08:15', task: 'Specific Study', icon: <BookOpen className="w-8 h-8" />, color: 'bg-blue-100 text-blue-600', mascot: 'Jeff' },
    { id: 'break1', time: '09:00', task: 'Short Break', icon: <PauseCircle className="w-8 h-8" />, color: 'bg-green-100 text-green-600', mascot: 'Zee' },
    { id: 'math', time: '09:15', task: 'Math Activity', icon: <Calculator className="w-12 h-12" />, color: 'bg-purple-100 text-purple-600', mascot: 'Bubbles', isMain: true },
    { id: 'break2', time: '10:00', task: 'Snack & Break', icon: <PauseCircle className="w-8 h-8" />, color: 'bg-green-100 text-green-600', mascot: 'Zee' },
    { id: 'sports', time: '10:30', task: 'Sports Play', icon: <Trophy className="w-12 h-12" />, color: 'bg-yellow-100 text-yellow-600', mascot: 'Fuse', isMain: true },
    { id: 'lunch', time: '11:30', task: 'Lunch & Ready', icon: <Utensils className="w-8 h-8" />, color: 'bg-cyan-100 text-cyan-600', mascot: 'Newt' },
    { id: 'departure', time: '12:30', task: 'Leaving for School', icon: <Car className="w-10 h-10" />, color: 'bg-red-100 text-red-600', mascot: 'Pogo' },
  ];

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
    const newItems = { ...completedItems };
    scheduleTemplate.forEach(item => delete newItems[`${currentDay}-${item.id}`]);
    setCompletedItems(newItems);
    setActiveTimerId(null);
    setTimerRunning(false);
  };

  const completedCount = scheduleTemplate.filter(item => completedItems[`${currentDay}-${item.id}`]).length;
  const progressPercent = (completedCount / scheduleTemplate.length) * 100;

  return (
    <div className="min-h-screen bg-sky-100 p-4 md:p-8 font-sans pb-24">
      <div className="max-w-md mx-auto bg-white rounded-[40px] shadow-2xl overflow-hidden border-8 border-white relative text-slate-900">
        
        {/* Header */}
        <div className="bg-gradient-to-b from-indigo-600 to-indigo-500 p-6 text-white text-center relative">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => setCurrentDayIndex(prev => Math.max(0, prev - 1))}
              className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-all disabled:opacity-30"
              disabled={safeDayIndex === 0}
            >
              <ChevronLeft />
            </button>
            <div className="flex flex-col">
               <h1 className="text-3xl font-black tracking-tight leading-none mb-1">{currentDay}</h1>
               <div className="flex items-center justify-center gap-2 bg-black/10 px-3 py-1 rounded-full w-fit mx-auto">
                 <span className="text-[10px] font-black tracking-widest text-indigo-100 uppercase tracking-tighter">Super Aahan</span>
                 <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
               </div>
            </div>
            <button 
              onClick={() => setCurrentDayIndex(prev => Math.min(4, prev + 1))}
              className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-all disabled:opacity-30"
              disabled={safeDayIndex === 4}
            >
              <ChevronRight />
            </button>
          </div>
        </div>

        {/* Global School Prep Progress Bar */}
        <div className="h-4 bg-slate-100 w-full relative overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 transition-all duration-1000 ease-out flex items-center justify-end"
            style={{ width: `${progressPercent}%` }}
          >
            <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center mr-1 shadow-sm">
               <Star className="w-2 h-2 text-yellow-500 fill-current" />
            </div>
          </div>
        </div>

        {/* Main Checklist */}
        <div className="p-4 space-y-4 bg-slate-50/50">
          {scheduleTemplate.map((item) => {
            const isCompleted = completedItems[`${currentDay}-${item.id}`];
            const oddbod = oddbods.find(o => o.name === item.mascot);
            const isTimerActive = activeTimerId === item.id;
            const timerPercentage = isTimerActive ? (timeLeft / initialTime) * 100 : 0;
            
            return (
              <div key={item.id} className="relative">
                <div
                  onClick={() => toggleTask(currentDay, item.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') toggleTask(currentDay, item.id); }}
                  className={`w-full group flex flex-col p-4 rounded-[32px] border-b-8 transition-all duration-200 cursor-pointer active:scale-[0.97] ${
                    isCompleted 
                      ? 'bg-slate-200 border-slate-300 opacity-50 translate-y-2 shadow-none' 
                      : `bg-white border-slate-200 shadow-xl`
                  }`}
                >
                  <div className="flex items-center gap-4 w-full">
                    {/* Activity Picture with Timer Ring */}
                    <div className={`relative p-3 rounded-3xl flex flex-col items-center justify-center transition-all flex-shrink-0 ${item.color} ${item.isMain ? 'w-24 h-24' : 'w-16 h-16'}`}>
                      
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

                      {item.icon}
                      
                      {/* Mascot badge */}
                      <div className={`absolute -top-2 -right-2 w-8 h-8 rounded-full border-4 border-white flex items-center justify-center text-sm shadow-md ${oddbod?.color}`}>
                        {oddbod?.emoji}
                      </div>
                    </div>
                    
                    <div className="flex-1 text-left min-w-0">
                      <div className="flex items-center gap-1 text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">
                        <Clock className="w-3 h-3" />
                        {item.time}
                      </div>
                      <div className={`text-xl font-black tracking-tight leading-tight truncate ${isCompleted ? 'line-through text-slate-500' : 'text-slate-800'}`}>
                        {item.task}
                      </div>
                      
                      {/* Countdown Text */}
                      {isTimerActive && (
                        <div className="mt-1 inline-flex items-center gap-2 text-indigo-600 font-black tabular-nums text-sm">
                          <Timer size={14} className="animate-pulse" />
                          {formatTime(timeLeft)}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col items-center justify-center gap-2 flex-shrink-0">
                      {isCompleted ? (
                        <div className="bg-emerald-500 w-12 h-12 rounded-full flex items-center justify-center shadow-lg transform rotate-6 scale-110">
                          <CheckCircle2 className="w-8 h-8 text-white" />
                        </div>
                      ) : (
                        <div className="flex flex-col gap-1">
                          {!isTimerActive ? (
                            <div className="flex gap-1">
                              {[5, 10].map(m => (
                                <button 
                                  key={m}
                                  onClick={(e) => { e.stopPropagation(); startTaskTimer(item.id, m); }}
                                  className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl font-black text-xs border-2 border-indigo-100 hover:bg-indigo-100 transition-colors"
                                >
                                  {m}m
                                </button>
                              ))}
                            </div>
                          ) : (
                            <button 
                              onClick={(e) => { e.stopPropagation(); setTimerRunning(!timerRunning); }}
                              className={`w-10 h-10 rounded-xl text-white shadow-md flex items-center justify-center ${timerRunning ? 'bg-red-500' : 'bg-green-500'}`}
                            >
                              {timerRunning ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-0.5" />}
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Horizontal Timer Progress Bar (Only visible when timer is active) */}
                  {isTimerActive && !isCompleted && (
                    <div className="mt-4 w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
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
        <div className="p-8 bg-white border-t-2 border-slate-50 flex flex-col gap-4">
          <button 
            onClick={resetDay}
            className="flex items-center justify-center gap-2 py-4 px-6 bg-slate-100 text-slate-500 rounded-2xl font-bold hover:bg-slate-200 active:bg-slate-300 transition-colors uppercase tracking-widest text-sm"
          >
            <RotateCcw className="w-5 h-5" />
            Reset {currentDay}
          </button>
        </div>
      </div>
      
      {/* Oddbods Legend */}
      <div className="mt-8 flex justify-center gap-3 px-4 overflow-x-auto pb-4 no-scrollbar">
        {oddbods.map((ob, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <div className={`w-10 h-10 rounded-xl ${ob.color} flex items-center justify-center text-xl shadow-md border-2 border-white`}>
              {ob.emoji}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
