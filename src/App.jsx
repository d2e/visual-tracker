import React, { useState, useEffect, useRef } from 'react';
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
  Loader2,
  BookHeart,
  Trees,
  Settings,
  Volume2,
  VolumeX,
  Sparkles,
  Gift,
  Zap,
  Wind,
  CloudRain,
  ArrowRight,
  AlertCircle,
  HelpCircle,
  MessageSquare,
  Bell,
  CircleOff,
  Volume,
  Eye,
  Hand,
  TreePine,
  Palette
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
  BookHeart,
  Trees,
  TreePine,
  Palette,
  Bell,
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
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [scheduleType, setScheduleType] = useState(null);
  
  // Timer State
  const [activeTimerId, setActiveTimerId] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [initialTime, setInitialTime] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);

  // New Features State
  const [stars, setStars] = useState({});
  const [showSettings, setShowSettings] = useState(false);
  const [showBreathingExercise, setShowBreathingExercise] = useState(false);
  const [settings, setSettings] = useState({
    soundEnabled: true,
    animationsEnabled: true,
    breakReminders: true
  });
  const [showCelebration, setShowCelebration] = useState(false);
  const [lastCompletedTask, setLastCompletedTask] = useState(null);
  const [showFireworks, setShowFireworks] = useState(false);
  const audioContextRef = useRef(null);

  // Autism-Friendly Visual Features State
  const [show5MinWarning, setShow5MinWarning] = useState(false);
  const [sensoryLevel, setSensoryLevel] = useState('green'); // green, yellow, red
  const [showBreakMenu, setShowBreakMenu] = useState(false);
  const [showCommunicationHelper, setShowCommunicationHelper] = useState(false);
  const [tokens, setTokens] = useState(0);
  const [currentSteps, setCurrentSteps] = useState({});

  const safeDayIndex = Math.max(0, Math.min(4, currentDayIndex));
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const currentDay = days[safeDayIndex];

  // Cookie management functions
  const setCookie = (name, value, hours = 24) => {
    const expires = new Date();
    expires.setTime(expires.getTime() + hours * 60 * 60 * 1000);
    document.cookie = `${name}=${JSON.stringify(value)};expires=${expires.toUTCString()};path=/`;
  };

  const getCookie = (name) => {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) {
        try {
          return JSON.parse(c.substring(nameEQ.length, c.length));
        } catch {
          return null;
        }
      }
    }
    return null;
  };

  const deleteCookie = (name) => {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
  };

  const clearAllData = () => {
    // Clear cookies
    deleteCookie('activityTrackerState');
    deleteCookie('activityTrackerSettings');
    deleteCookie('activityTrackerStars');
    deleteCookie('activityTrackerCompletedItems');
    deleteCookie('activityTrackerSelectedProfile');
    
    // Clear localStorage
    localStorage.removeItem('activityTrackerSettings');
    localStorage.removeItem('activityTrackerStars');
    
    // Reset state
    setSelectedProfile(null);
    setScheduleType(null);
    setCompletedItems({});
    setStars({});
    setSettings({
      soundEnabled: true,
      animationsEnabled: true,
      breakReminders: true
    });
    setActiveTimerId(null);
    setTimerRunning(false);
  };

  // Load state from cookies on mount
  useEffect(() => {
    const savedSettings = getCookie('activityTrackerSettings') || localStorage.getItem('activityTrackerSettings');
    const savedStars = getCookie('activityTrackerStars') || localStorage.getItem('activityTrackerStars');
    const savedCompletedItems = getCookie('activityTrackerCompletedItems');
    const savedProfile = getCookie('activityTrackerSelectedProfile');
    
    if (savedSettings) {
      setSettings(typeof savedSettings === 'string' ? JSON.parse(savedSettings) : savedSettings);
    }
    if (savedStars) {
      setStars(typeof savedStars === 'string' ? JSON.parse(savedStars) : savedStars);
    }
    if (savedCompletedItems) {
      setCompletedItems(savedCompletedItems);
    }
    if (savedProfile && config) {
      setSelectedProfile(savedProfile);
    }
  }, [config]);

  // Save state to cookies when it changes
  useEffect(() => {
    setCookie('activityTrackerSettings', settings);
    localStorage.setItem('activityTrackerSettings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    setCookie('activityTrackerStars', stars);
    localStorage.setItem('activityTrackerStars', JSON.stringify(stars));
  }, [stars]);

  useEffect(() => {
    if (Object.keys(completedItems).length > 0) {
      setCookie('activityTrackerCompletedItems', completedItems);
    }
  }, [completedItems]);

  useEffect(() => {
    if (selectedProfile) {
      setCookie('activityTrackerSelectedProfile', selectedProfile);
    }
  }, [selectedProfile]);

  // Load profile list from JSON file
  useEffect(() => {
    fetch('./profiles.json')
      .then(response => {
        if (!response.ok) throw new Error('Failed to load profiles');
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

  // Load individual profile data when profile is selected
  const loadProfileData = (profile) => {
    setLoading(true);
    fetch(`./${profile.file}`)
      .then(response => {
        if (!response.ok) throw new Error(`Failed to load profile: ${profile.name}`);
        return response.json();
      })
      .then(data => {
        setSelectedProfile({
          ...profile,
          schoolActivities: data.schoolActivities || data.activities || [],
          homeActivities: data.homeActivities || data.activities || [],
          mascots: data.mascots
        });
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  };

  // Get activities based on schedule type
  const getActivities = () => {
    if (!selectedProfile) return [];
    if (scheduleType === 'school') return selectedProfile.schoolActivities;
    if (scheduleType === 'home') return selectedProfile.homeActivities;
    return [];
  };

  // Helper function to get icon component
  const getIcon = (iconName, isMain) => {
    const IconComponent = iconMap[iconName] || Coffee;
    const baseSize = isMain ? 'w-10 h-10 sm:w-16 sm:h-16 md:w-20 md:h-20' : 'w-8 h-8 sm:w-12 sm:h-12 md:w-14 md:h-14';
    return <IconComponent className={baseSize} />;
  };

  // Sound Effects System
  const playSound = (type) => {
    if (!settings.soundEnabled) return;
    
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    const ctx = audioContextRef.current;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    switch(type) {
      case 'complete':
        oscillator.frequency.value = 523.25; // C5
        gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.5);
        setTimeout(() => {
          const osc2 = ctx.createOscillator();
          const gain2 = ctx.createGain();
          osc2.connect(gain2);
          gain2.connect(ctx.destination);
          osc2.frequency.value = 659.25; // E5
          gain2.gain.setValueAtTime(0.3, ctx.currentTime);
          gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
          osc2.start(ctx.currentTime);
          osc2.stop(ctx.currentTime + 0.5);
        }, 200);
        break;
      case 'start':
        oscillator.frequency.value = 440; // A4
        gainNode.gain.setValueAtTime(0.2, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.3);
        break;
      case 'star':
        oscillator.frequency.value = 783.99; // G5
        gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.8);
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.8);
        break;
    }
  };

  // Award star for completing task
  const awardStar = (profileId, taskId) => {
    const key = `${profileId}-${currentDay}`;
    setStars(prev => ({
      ...prev,
      [key]: (prev[key] || 0) + 1
    }));
    playSound('star');
    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 2000);
  };

  // Timer Ticking Logic
  useEffect(() => {
    let interval = null;
    if (timerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          // Show 5-minute warning
          if (prev === 300 && !show5MinWarning) {
            setShow5MinWarning(true);
            playSound('start');
            setTimeout(() => setShow5MinWarning(false), 10000);
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timeLeft === 0 && timerRunning) {
      setTimerRunning(false);
      
      // Auto-complete the activity when timer ends
      if (activeTimerId) {
        const key = `${currentDay}-${activeTimerId}`;
        if (!completedItems[key]) {
          toggleTask(currentDay, activeTimerId);
        }
      }
      
      setActiveTimerId(null);
    }
    return () => clearInterval(interval);
  }, [timerRunning, timeLeft, show5MinWarning, activeTimerId, currentDay, completedItems]);

  const startTaskTimer = (id, mins) => {
    setActiveTimerId(id);
    setInitialTime(mins * 60);
    setTimeLeft(mins * 60);
    setTimerRunning(true);
    playSound('start');
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleTask = (day, taskId) => {
    const key = `${day}-${taskId}`;
    const wasCompleted = completedItems[key];
    
    const newCompletedItems = {
      ...completedItems,
      [key]: !completedItems[key]
    };
    
    setCompletedItems(newCompletedItems);
    
    // Award star and token when completing (not uncompleting)
    if (!wasCompleted && selectedProfile) {
      playSound('complete');
      awardStar(selectedProfile.id, taskId);
      setLastCompletedTask(taskId);
      setTokens(prev => prev + 1);
      
      // Check if all activities are now complete
      const currentActivities = scheduleType === 'school' 
        ? selectedProfile.schoolActivities 
        : selectedProfile.homeActivities;
      
      const allComplete = currentActivities.every(activity => 
        newCompletedItems[`${day}-${activity.id}`]
      );
      
      if (allComplete) {
        setShowFireworks(true);
        playSound('star');
        setTimeout(() => setShowFireworks(false), 5000);
      }
    }
    
    if (activeTimerId === taskId) {
      setTimerRunning(false);
      setActiveTimerId(null);
    }
  };

  const resetDay = () => {
    if (!currentProfile) return;
    const newItems = { ...completedItems };
    currentProfile.activities.forEach(item => delete newItems[`${currentDay}-${item.id}`]);
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

  // Profile Selection Screen
  if (!selectedProfile && config && config.profiles) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-100 via-indigo-100 to-purple-100 flex items-center justify-center p-4">
        <div className="max-w-4xl w-full">
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-800 mb-3">
              Activity Tracker
            </h1>
            <p className="text-lg sm:text-xl text-slate-600 font-medium">
              Choose Your Profile
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {config.profiles.map((profile) => (
              <button
                key={profile.id}
                onClick={() => loadProfileData(profile)}
                className="group bg-white rounded-3xl p-6 sm:p-8 shadow-xl hover:shadow-2xl active:scale-95 transition-all duration-200 border-4 border-white hover:border-indigo-300"
              >
                <div className={`w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4 rounded-full bg-${profile.color}-100 flex items-center justify-center text-5xl sm:text-6xl group-hover:scale-110 transition-transform`}>
                  {profile.emoji}
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-800 group-hover:text-indigo-600 transition-colors">
                  {profile.name}
                </h3>
                <p className="text-sm text-slate-500 mt-2">
                  Click to view activities
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Schedule Type Selection Screen
  if (selectedProfile && !scheduleType) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-100 via-indigo-100 to-purple-100 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          <div className="text-center mb-8 sm:mb-12">
            <div className="text-6xl sm:text-7xl mb-4">{selectedProfile.emoji}</div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-800 mb-3">
              Hi {selectedProfile.name}!
            </h1>
            <p className="text-lg sm:text-xl text-slate-600 font-medium">
              What's your day like today?
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <button
              onClick={() => setScheduleType('school')}
              className="group bg-white rounded-3xl p-8 sm:p-10 shadow-xl hover:shadow-2xl active:scale-95 transition-all duration-200 border-4 border-white hover:border-blue-300"
            >
              <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                <BookOpen className="w-12 h-12 sm:w-14 sm:h-14 text-blue-600" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-800 group-hover:text-blue-600 transition-colors">
                School Day
              </h3>
              <p className="text-sm text-slate-500 mt-2">
                Time for learning!
              </p>
            </button>

            <button
              onClick={() => setScheduleType('home')}
              className="group bg-white rounded-3xl p-8 sm:p-10 shadow-xl hover:shadow-2xl active:scale-95 transition-all duration-200 border-4 border-white hover:border-green-300"
            >
              <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Heart className="w-12 h-12 sm:w-14 sm:h-14 text-green-600" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-800 group-hover:text-green-600 transition-colors">
                Home Day
              </h3>
              <p className="text-sm text-slate-500 mt-2">
                Time for fun!
              </p>
            </button>
          </div>

          <button
            onClick={() => { setSelectedProfile(null); setScheduleType(null); }}
            className="mt-6 w-full py-3 bg-white/50 hover:bg-white text-slate-700 font-bold rounded-2xl transition-all"
          >
            ← Back to Profiles
          </button>
        </div>
      </div>
    );
  }

  // Ensure we have a valid profile and schedule type before rendering tracker
  if (!selectedProfile || !scheduleType) {
    return null;
  }

  const currentActivities = getActivities();
  const currentProfile = { ...selectedProfile, activities: currentActivities };
  const completedCount = currentActivities.filter(item => completedItems[`${currentDay}-${item.id}`]).length;
  const progressPercent = currentActivities.length > 0 ? (completedCount / currentActivities.length) * 100 : 0;
  const totalStars = stars[`${currentProfile.id}-${currentDay}`] || 0;
  
  // Find next incomplete activity
  const nextActivity = currentActivities.find(item => !completedItems[`${currentDay}-${item.id}`]);
  
  // Find current, then, and next activities for First-Then-Next
  const currentActivityIndex = currentActivities.findIndex(item => item.id === activeTimerId || !completedItems[`${currentDay}-${item.id}`]);
  const currentActivityObj = currentActivities[currentActivityIndex];
  const thenActivity = currentActivities[currentActivityIndex + 1];
  const nextAfterActivity = currentActivities[currentActivityIndex + 2];

  // Visual Countdown Pie Chart
  const PieTimer = ({ percentage }) => {
    const radius = 50;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;
    
    // Color based on time remaining
    let color = '#10b981'; // green
    if (percentage < 30) color = '#ef4444'; // red
    else if (percentage < 60) color = '#f59e0b'; // yellow
    
    return (
      <svg width="120" height="120" className="transform -rotate-90">
        <circle cx="60" cy="60" r={radius} fill="none" stroke="#e5e7eb" strokeWidth="10" />
        <circle 
          cx="60" cy="60" r={radius} fill="none" 
          stroke={color} strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-1000"
        />
      </svg>
    );
  };

  // 5-Minute Warning Component
  const FiveMinuteWarning = () => (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="bg-yellow-100 rounded-3xl p-8 max-w-md w-full shadow-2xl border-4 border-yellow-400 animate-pulse">
        <div className="text-center">
          <Bell className="w-24 h-24 text-yellow-600 mx-auto mb-4 animate-bounce" />
          <h3 className="text-3xl font-black text-yellow-900 mb-2">5 Minutes Left!</h3>
          <p className="text-xl text-yellow-800 font-bold">Time to finish up soon</p>
        </div>
      </div>
    </div>
  );

  // First-Then-Next Visual Board
  const FirstThenNext = () => (
    <div className="bg-white rounded-2xl p-4 shadow-lg border-4 border-indigo-200 mb-4">
      <h3 className="text-lg font-black text-center text-indigo-600 mb-3">My Schedule</h3>
      <div className="grid grid-cols-3 gap-2">
        {/* FIRST (Current) */}
        {currentActivityObj && (
          <div className="bg-gradient-to-br from-green-100 to-green-50 rounded-xl p-3 border-4 border-green-400">
            <div className="text-xs font-black text-green-700 uppercase text-center mb-2">FIRST</div>
            <div className={`${colorMap[currentActivityObj.color]} rounded-lg p-2 flex items-center justify-center mb-2`}>
              {getIcon(currentActivityObj.icon, false)}
            </div>
            <div className="text-xs font-bold text-center text-green-900">{currentActivityObj.task}</div>
          </div>
        )}
        
        {/* THEN (Next) */}
        {thenActivity && (
          <div className="bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl p-3 border-2 border-blue-300">
            <div className="text-xs font-black text-blue-700 uppercase text-center mb-2">THEN</div>
            <div className={`${colorMap[thenActivity.color]} rounded-lg p-2 flex items-center justify-center mb-2`}>
              {getIcon(thenActivity.icon, false)}
            </div>
            <div className="text-xs font-bold text-center text-blue-900">{thenActivity.task}</div>
          </div>
        )}
        
        {/* NEXT (After That) */}
        {nextAfterActivity && (
          <div className="bg-gradient-to-br from-purple-100 to-purple-50 rounded-xl p-3 border border-purple-200 opacity-75">
            <div className="text-xs font-black text-purple-700 uppercase text-center mb-2">NEXT</div>
            <div className={`${colorMap[nextAfterActivity.color]} rounded-lg p-2 flex items-center justify-center mb-2`}>
              {getIcon(nextAfterActivity.icon, false)}
            </div>
            <div className="text-xs font-bold text-center text-purple-900">{nextAfterActivity.task}</div>
          </div>
        )}
      </div>
    </div>
  );

  // Traffic Light Sensory System
  const TrafficLightSensory = () => (
    <div className="fixed bottom-4 right-4 z-40 flex flex-col gap-2">
      <button
        onClick={() => setSensoryLevel('green')}
        className={`w-16 h-16 rounded-full ${sensoryLevel === 'green' ? 'bg-green-500 ring-4 ring-green-300' : 'bg-green-200'} flex items-center justify-center shadow-lg transition-all`}
      >
        <Smile className={`w-8 h-8 ${sensoryLevel === 'green' ? 'text-white' : 'text-green-600'}`} />
      </button>
      <button
        onClick={() => setSensoryLevel('yellow')}
        className={`w-16 h-16 rounded-full ${sensoryLevel === 'yellow' ? 'bg-yellow-500 ring-4 ring-yellow-300' : 'bg-yellow-200'} flex items-center justify-center shadow-lg transition-all`}
      >
        <AlertCircle className={`w-8 h-8 ${sensoryLevel === 'yellow' ? 'text-white' : 'text-yellow-600'}`} />
      </button>
      <button
        onClick={() => {
          setSensoryLevel('red');
          setShowBreakMenu(true);
        }}
        className={`w-16 h-16 rounded-full ${sensoryLevel === 'red' ? 'bg-red-500 ring-4 ring-red-300' : 'bg-red-200'} flex items-center justify-center shadow-lg transition-all`}
      >
        <Hand className={`w-8 h-8 ${sensoryLevel === 'red' ? 'text-white' : 'text-red-600'}`} />
      </button>
    </div>
  );

  // Visual Break Menu
  const BreakMenu = () => (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowBreakMenu(false)}>
      <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-2xl font-black text-slate-800 mb-4 text-center">Choose Your Break</h3>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => { setShowBreathingExercise(true); setShowBreakMenu(false); }}
            className="bg-blue-100 rounded-xl p-6 flex flex-col items-center gap-2 active:scale-95 transition-all"
          >
            <Wind className="w-12 h-12 text-blue-600" />
            <span className="font-bold text-blue-900">Deep Breaths</span>
          </button>
          <button
            onClick={() => { playSound('complete'); setShowBreakMenu(false); }}
            className="bg-green-100 rounded-xl p-6 flex flex-col items-center gap-2 active:scale-95 transition-all"
          >
            <Music className="w-12 h-12 text-green-600" />
            <span className="font-bold text-green-900">Quiet Time</span>
          </button>
          <button
            onClick={() => { setShowBreakMenu(false); }}
            className="bg-purple-100 rounded-xl p-6 flex flex-col items-center gap-2 active:scale-95 transition-all"
          >
            <Eye className="w-12 h-12 text-purple-600" />
            <span className="font-bold text-purple-900">Close Eyes</span>
          </button>
          <button
            onClick={() => { setShowBreakMenu(false); }}
            className="bg-orange-100 rounded-xl p-6 flex flex-col items-center gap-2 active:scale-95 transition-all"
          >
            <Hand className="w-12 h-12 text-orange-600" />
            <span className="font-bold text-orange-900">Stretch</span>
          </button>
        </div>
        <button 
          onClick={() => setShowBreakMenu(false)}
          className="w-full mt-4 py-3 bg-slate-200 text-slate-700 rounded-xl font-bold"
        >
          I'm OK Now
        </button>
      </div>
    </div>
  );

  // Communication Helper Buttons
  const CommunicationHelper = () => (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowCommunicationHelper(false)}>
      <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-2xl font-black text-slate-800 mb-4 text-center">I Need Help</h3>
        <div className="space-y-3">
          <button className="w-full bg-red-100 rounded-xl p-4 flex items-center gap-3 active:scale-95 transition-all">
            <Volume className="w-8 h-8 text-red-600" />
            <span className="font-bold text-red-900 text-left">It's too loud</span>
          </button>
          <button className="w-full bg-yellow-100 rounded-xl p-4 flex items-center gap-3 active:scale-95 transition-all">
            <Eye className="w-8 h-8 text-yellow-600" />
            <span className="font-bold text-yellow-900 text-left">It's too bright</span>
          </button>
          <button className="w-full bg-blue-100 rounded-xl p-4 flex items-center gap-3 active:scale-95 transition-all">
            <HelpCircle className="w-8 h-8 text-blue-600" />
            <span className="font-bold text-blue-900 text-left">I don't understand</span>
          </button>
          <button className="w-full bg-green-100 rounded-xl p-4 flex items-center gap-3 active:scale-95 transition-all">
            <Clock className="w-8 h-8 text-green-600" />
            <span className="font-bold text-green-900 text-left">I need more time</span>
          </button>
          <button className="w-full bg-purple-100 rounded-xl p-4 flex items-center gap-3 active:scale-95 transition-all">
            <MessageSquare className="w-8 h-8 text-purple-600" />
            <span className="font-bold text-purple-900 text-left">I want to talk</span>
          </button>
        </div>
        <button 
          onClick={() => setShowCommunicationHelper(false)}
          className="w-full mt-4 py-3 bg-indigo-500 text-white rounded-xl font-bold"
        >
          Close
        </button>
      </div>
    </div>
  );

  // Token Board Rewards
  const TokenBoard = () => {
    const maxTokens = 10;
    const filledTokens = Math.min(tokens, maxTokens);
    
    return (
      <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-2xl p-4 border-4 border-yellow-400 mb-4">
        <h3 className="text-center font-black text-yellow-900 mb-2 flex items-center justify-center gap-2">
          <Gift className="w-5 h-5" />
          My Tokens: {filledTokens}/{maxTokens}
        </h3>
        <div className="flex gap-1 justify-center flex-wrap">
          {Array.from({ length: maxTokens }).map((_, i) => (
            <div
              key={i}
              className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                i < filledTokens 
                  ? 'bg-yellow-400 border-yellow-600' 
                  : 'bg-white border-slate-300'
              }`}
            >
              {i < filledTokens && <Star className="w-6 h-6 fill-yellow-600 text-yellow-600" />}
            </div>
          ))}
        </div>
        {filledTokens >= maxTokens && (
          <div className="mt-3 text-center">
            <span className="inline-block bg-green-500 text-white px-4 py-2 rounded-full font-black animate-bounce">
              🎉 You earned a prize! 🎉
            </span>
          </div>
        )}
      </div>
    );
  };

  // Breathing Exercise Component
  const BreathingExercise = () => (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowBreathingExercise(false)}>
      <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-2xl font-black text-slate-800 mb-4 text-center">Take a Deep Breath 🌈</h3>
        <div className="relative w-48 h-48 mx-auto mb-6">
          <div className={`absolute inset-0 rounded-full bg-gradient-to-br from-blue-200 to-purple-200 ${settings.animationsEnabled ? 'animate-pulse' : ''}`}></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Wind className="w-24 h-24 text-indigo-500" />
          </div>
        </div>
        <p className="text-center text-slate-600 mb-4">Breathe in... Breathe out...</p>
        <button 
          onClick={() => setShowBreathingExercise(false)}
          className="w-full py-3 bg-indigo-500 text-white rounded-xl font-bold active:bg-indigo-600"
        >
          I Feel Better Now
        </button>
      </div>
    </div>
  );

  // Settings Panel Component
  const SettingsPanel = () => (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowSettings(false)}>
      <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-2xl font-black text-slate-800 mb-6 flex items-center gap-2">
          <Settings className="w-6 h-6" />
          Settings
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
            <div className="flex items-center gap-2">
              {settings.soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              <span className="font-bold">Sound Effects</span>
            </div>
            <button 
              onClick={() => setSettings(prev => ({ ...prev, soundEnabled: !prev.soundEnabled }))}
              className={`w-12 h-6 rounded-full transition-colors ${settings.soundEnabled ? 'bg-green-500' : 'bg-slate-300'}`}
            >
              <div className={`w-5 h-5 bg-white rounded-full transition-transform ${settings.soundEnabled ? 'translate-x-6' : 'translate-x-1'}`}></div>
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              <span className="font-bold">Animations</span>
            </div>
            <button 
              onClick={() => setSettings(prev => ({ ...prev, animationsEnabled: !prev.animationsEnabled }))}
              className={`w-12 h-6 rounded-full transition-colors ${settings.animationsEnabled ? 'bg-green-500' : 'bg-slate-300'}`}
            >
              <div className={`w-5 h-5 bg-white rounded-full transition-transform ${settings.animationsEnabled ? 'translate-x-6' : 'translate-x-1'}`}></div>
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
            <div className="flex items-center gap-2">
              <CloudRain className="w-5 h-5" />
              <span className="font-bold">Break Reminders</span>
            </div>
            <button 
              onClick={() => setSettings(prev => ({ ...prev, breakReminders: !prev.breakReminders }))}
              className={`w-12 h-6 rounded-full transition-colors ${settings.breakReminders ? 'bg-green-500' : 'bg-slate-300'}`}
            >
              <div className={`w-5 h-5 bg-white rounded-full transition-transform ${settings.breakReminders ? 'translate-x-6' : 'translate-x-1'}`}></div>
            </button>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <button 
            onClick={() => { setScheduleType(null); setShowSettings(false); }}
            className="w-full py-3 bg-blue-500 text-white rounded-xl font-bold active:bg-blue-600 flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            Change Schedule Type
          </button>
          
          <button 
            onClick={() => setShowSettings(false)}
            className="w-full py-3 bg-indigo-500 text-white rounded-xl font-bold active:bg-indigo-600"
          >
            Close Settings
          </button>
          
          <button 
            onClick={() => {
              if (window.confirm('Are you sure you want to exit? All progress will be saved in cookies for 24 hours.')) {
                clearAllData();
                setShowSettings(false);
              }
            }}
            className="w-full py-3 bg-red-500 text-white rounded-xl font-bold active:bg-red-600 flex items-center justify-center gap-2"
          >
            <ChevronLeft className="w-5 h-5" />
            Exit & Clear Data
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-sky-100 p-2 sm:p-4 md:p-8 lg:p-12 font-sans pb-20">
      {/* Fireworks Celebration - All Activities Complete */}
      {showFireworks && (
        <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
          {/* Fireworks particles */}
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-4 h-4 rounded-full animate-ping"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                backgroundColor: ['#ff6b6b', '#4ecdc4', '#ffe66d', '#a8e6cf', '#ff8b94'][i % 5],
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${1 + Math.random()}s`
              }}
            />
          ))}
          {/* Main celebration message */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white px-8 py-6 rounded-3xl shadow-2xl animate-bounce">
              <div className="text-5xl sm:text-6xl md:text-7xl font-black text-center mb-4">
                🎉 🎊 🎆
              </div>
              <div className="text-3xl sm:text-4xl md:text-5xl font-black text-center">
                ALL DONE!
              </div>
              <div className="text-xl sm:text-2xl font-bold text-center mt-2">
                Amazing Job! 🌟
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Celebration Overlay */}
      {showCelebration && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
          <div className={`text-8xl ${settings.animationsEnabled ? 'animate-bounce' : ''}`}>
            🌟⭐✨
          </div>
        </div>
      )}

      {/* 5-Minute Warning */}
      {show5MinWarning && <FiveMinuteWarning />}

      {/* Settings Panel */}
      {showSettings && <SettingsPanel />}

      {/* Breathing Exercise */}
      {showBreathingExercise && <BreathingExercise />}

      {/* Break Menu */}
      {showBreakMenu && <BreakMenu />}

      {/* Communication Helper */}
      {showCommunicationHelper && <CommunicationHelper />}

      {/* Traffic Light Sensory System */}
      <TrafficLightSensory />

      {/* Floating Stars Counter */}
      <div className="fixed left-4 top-24 z-40 bg-gradient-to-br from-yellow-300 to-yellow-400 text-yellow-900 px-4 py-3 rounded-2xl shadow-2xl border-4 border-yellow-500">
        <div className="flex flex-col items-center gap-2">
          {/* Stars Display */}
          <div className="flex flex-col items-center">
            <Star className="w-8 h-8 sm:w-10 sm:h-10 fill-current animate-spin" style={{ animationDuration: '3s' }} />
            <span className="text-2xl sm:text-3xl font-black">{totalStars}</span>
            <span className="text-xs font-bold uppercase tracking-wide">Stars</span>
          </div>
          
          {/* Tokens Display */}
          <div className="w-full border-t-2 border-yellow-500 pt-2">
            <div className="flex flex-col items-center">
              <Gift className="w-6 h-6 sm:w-8 sm:h-8" />
              <span className="text-xl sm:text-2xl font-black">{Math.min(tokens, 10)}/10</span>
              <span className="text-xs font-bold uppercase tracking-wide">Tokens</span>
            </div>
          </div>
        </div>
      </div>

      {/* Communication Helper Button */}
      <button
        onClick={() => setShowCommunicationHelper(true)}
        className="fixed bottom-24 right-4 z-40 w-16 h-16 bg-indigo-500 text-white rounded-full shadow-lg flex items-center justify-center active:scale-95 transition-all"
      >
        <MessageSquare className="w-8 h-8" />
      </button>
      {/* Fixed Progress Bar at top of screen */}
      <div className="fixed top-0 left-0 right-0 z-50 h-3 sm:h-4 md:h-6 bg-slate-100 w-full overflow-hidden shadow-md">
        <div 
          className="h-full bg-gradient-to-r from-yellow-400 via-orange-500 via-red-500 to-pink-500 animate-gradient transition-all duration-1000 ease-out flex items-center justify-end"
          style={{ width: `${progressPercent}%` }}
        >
          <div className="w-3 h-3 sm:w-4 sm:h-4 md:w-6 md:h-6 bg-white rounded-full flex items-center justify-center mr-0.5 sm:mr-1 shadow-sm">
            <Star className="w-1.5 h-1.5 sm:w-2 sm:h-2 md:w-3 md:h-3 text-yellow-500 fill-current" />
          </div>
        </div>
      </div>

      {/* Fixed Header with Kid's Name */}
      <div className="fixed top-3 sm:top-4 md:top-6 left-0 right-0 z-40 px-2 sm:px-4 md:px-8 lg:px-12">
        <div className="max-w-md md:max-w-2xl lg:max-w-3xl mx-auto">
          <div className="bg-gradient-to-b from-indigo-600 to-indigo-500 p-4 sm:p-6 md:p-8 text-white text-center relative rounded-2xl sm:rounded-3xl shadow-2xl border-4 sm:border-8 border-white">
            {/* Settings Button */}
            <button 
              onClick={() => setShowSettings(true)}
              className="absolute top-2 right-2 sm:top-3 sm:right-3 p-2 bg-white/10 active:bg-white/20 rounded-lg transition-all"
            >
              <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            <div className="flex items-center justify-between gap-2 sm:gap-0">
              <button 
                onClick={() => setCurrentDayIndex(prev => Math.max(0, prev - 1))}
                className="p-2 sm:p-3 md:p-4 bg-white/10 active:bg-white/20 rounded-xl sm:rounded-2xl transition-all disabled:opacity-30 touch-manipulation"
                disabled={safeDayIndex === 0}
              >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8" />
              </button>
              <div className="flex flex-col flex-1">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-tight leading-none mb-1">{currentProfile.name}</h1>
                <div className="flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-3 md:px-4 py-1 md:py-2 rounded-full w-fit mx-auto">
                  <span className="text-xs sm:text-sm md:text-base font-medium text-indigo-100">{currentDay}</span>
                  <span className="text-indigo-300 mx-1">•</span>
                  <span className="text-xs sm:text-sm md:text-base font-bold text-white">
                    {scheduleType === 'school' ? '🎓 School' : '🏠 Home'}
                  </span>
                </div>
                <div className="text-xs sm:text-sm text-indigo-200 mt-1">
                  {completedCount} of {currentProfile.activities.length} completed
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
        </div>
      </div>
      
      <div className="max-w-md md:max-w-2xl lg:max-w-3xl mx-auto bg-white rounded-3xl sm:rounded-[40px] shadow-2xl overflow-hidden border-4 sm:border-8 border-white relative text-slate-900 mt-3 sm:mt-4 md:mt-6">
        
        {/* Spacer for fixed header */}
        <div className="h-20 sm:h-24 md:h-32 lg:h-36"></div>

        {/* Main Checklist */}
        <div className="p-3 sm:p-4 md:p-6 lg:p-8 space-y-3 sm:space-y-4 md:space-y-6 bg-slate-50/50">
          {/* First-Then-Next Visual Board */}
          <FirstThenNext />

          {/* What's Next Preview */}
          {nextActivity && (
            <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-2xl p-4 border-2 border-cyan-200 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <ArrowRight className="w-5 h-5 text-cyan-600" />
                <span className="text-sm font-black text-cyan-600 uppercase tracking-wide">What's Next</span>
              </div>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl ${colorMap[nextActivity.color] || colorMap.blue}`}>
                  {getIcon(nextActivity.icon, false)}
                </div>
                <div>
                  <div className="font-bold text-slate-800">{nextActivity.task}</div>
                  <div className="text-xs text-slate-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {nextActivity.time}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Breathing Exercise Button */}
          <button 
            onClick={() => setShowBreathingExercise(true)}
            className="w-full bg-gradient-to-r from-purple-100 to-blue-100 rounded-2xl p-4 border-2 border-purple-200 mb-4 active:scale-95 transition-all"
          >
            <div className="flex items-center justify-center gap-2">
              <Wind className="w-5 h-5 text-purple-600" />
              <span className="font-black text-purple-600">Need a Break? Take a Breath</span>
            </div>
          </button>

          {currentProfile.activities.map((item) => {
            const isCompleted = completedItems[`${currentDay}-${item.id}`];
            const mascot = currentProfile.mascots.find(m => m.name === item.mascot);
            const isTimerActive = activeTimerId === item.id;
            const timerPercentage = isTimerActive ? (timeLeft / initialTime) * 100 : 0;
            const colorClass = colorMap[item.color] || colorMap.blue;
            const mascotColorClass = mascotColorMap[mascot?.color] || mascotColorMap.blue;
            
            return (
              <div key={item.id} className="relative overflow-hidden rounded-2xl sm:rounded-[32px]">
                {/* Timer Progress Overlay - covers entire activity */}
                {isTimerActive && !isCompleted && (
                  <div className="absolute inset-0 pointer-events-none z-0">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-400/20 via-purple-500/20 via-pink-500/20 to-red-500/20 animate-gradient transition-all duration-1000 ease-linear"
                      style={{ width: `${timerPercentage}%` }}
                    />
                  </div>
                )}
                
                <div
                  onClick={() => toggleTask(currentDay, item.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') toggleTask(currentDay, item.id); }}
                  className={`w-full group flex flex-col p-3 sm:p-4 md:p-6 rounded-2xl sm:rounded-[32px] border-b-4 sm:border-b-8 transition-all duration-200 cursor-pointer active:scale-[0.97] touch-manipulation relative z-10 ${
                    isCompleted 
                      ? 'bg-slate-200 border-slate-300 opacity-50 translate-y-2 shadow-none' 
                      : isTimerActive
                        ? 'bg-gradient-to-r from-purple-100 to-indigo-100 border-purple-400 shadow-2xl ring-4 ring-purple-200'
                        : 'bg-white border-slate-200 shadow-xl'
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
                        <div className={`absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-8 h-8 sm:w-10 sm:h-10 md:w-14 md:h-14 rounded-full border-2 sm:border-4 border-white flex items-center justify-center text-base sm:text-lg md:text-2xl shadow-lg ${isTimerActive ? 'animate-bounce' : ''} ${mascotColorClass} overflow-hidden`}>
                          {mascot.image ? (
                            <img src={mascot.image} alt={mascot.name} className="w-full h-full object-cover" />
                          ) : (
                            <span>{mascot.emoji}</span>
                          )}
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
                        <div className="flex flex-col gap-1 md:gap-2 items-center">
                          {/* Visual Pie Timer */}
                          {isTimerActive && (
                            <div className="relative">
                              <PieTimer percentage={timerPercentage} />
                              <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-lg font-black text-slate-700">{formatTime(timeLeft)}</span>
                              </div>
                            </div>
                          )}
                          
                          {!isTimerActive ? (
                            <div className="flex gap-1 md:gap-2 flex-wrap justify-end max-w-[140px]">
                              {[1, 2, 5, 10].map(m => (
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
                    <div className="mt-3 sm:mt-4 md:mt-6 w-full h-4 sm:h-5 md:h-6 bg-slate-100 rounded-full overflow-hidden border-2 border-slate-200 shadow-inner">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-400 via-purple-500 via-pink-500 to-red-500 animate-gradient transition-all duration-1000 ease-linear shadow-[0_0_12px_rgba(139,92,246,0.6)]"
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
      <div className="mt-6 sm:mt-8 md:mt-10 flex justify-between items-center gap-2 sm:gap-3 md:gap-4 px-2 sm:px-4 pb-4">
        <button
          onClick={() => setSelectedProfile(null)}
          className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-md active:scale-95 transition-all text-slate-600 font-bold text-sm"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>
        <div className="flex gap-2 sm:gap-3 md:gap-4 overflow-x-auto no-scrollbar">
          {currentProfile.mascots.map((mascot, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <div className={`w-9 h-9 sm:w-10 sm:h-10 md:w-14 md:h-14 rounded-lg sm:rounded-xl ${mascotColorMap[mascot.color] || 'bg-blue-500'} flex items-center justify-center text-lg sm:text-xl md:text-2xl shadow-md border-2 border-white flex-shrink-0 overflow-hidden`}>
                {mascot.image ? (
                  <img src={mascot.image} alt={mascot.name} className="w-full h-full object-cover" />
                ) : (
                  <span>{mascot.emoji}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;
