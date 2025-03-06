"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Calendar,
  Clock,
  Droplets,
  LineChart,
  Plus,
  User,
  Moon,
  Sun,
  Flower,
  Heart,
  Leaf,
  Activity,
  Sparkles,
  CalendarDays,
  ThermometerSun,
  Pill,
  Waves,
  Smile,
  Frown,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  Baby,
  Loader2,
  Bell
} from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { useToast } from "@/components/ui/use-toast";
import { useCycleData } from "@/hooks/use-cycle-data";

// Add this at the top of the file after imports
const ClientOnly = ({ children }: { children: React.ReactNode }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  return <>{children}</>;
};

// Add cycle phase calculation helper
const getCyclePhase = (dayOfCycle: number, cycleLength: number) => {
  // Menstrual Phase (typically days 1-5)
  if (dayOfCycle <= 5) {
    return {
      phase: "Menstrual",
      icon: Droplets,
      color: "text-dw-blush",
      bgColor: "bg-dw-blush/10",
      description: "Your period phase",
      symptoms: ["Cramps", "Fatigue", "Mood swings", "Headaches", "Bloating"],
      wellness: [
        "Rest more",
        "Gentle exercise",
        "Iron-rich foods",
        "Warm drinks",
        "Extra sleep"
      ],
      energy: "Low"
    };
  }

  // Follicular Phase (typically days 6-13)
  if (dayOfCycle <= 13) {
    return {
      phase: "Follicular",
      icon: Leaf,
      color: "text-dw-sage",
      bgColor: "bg-dw-sage/10",
      description: "Your body preparing for ovulation",
      symptoms: [
        "Increased energy",
        "Better mood",
        "Glowing skin",
        "Improved focus",
        "Higher libido"
      ],
      wellness: [
        "Intense workouts",
        "Strength training",
        "Socializing",
        "High-protein foods",
        "Creative projects"
      ],
      energy: "High"
    };
  }

  // Ovulation Phase (day 14)
  if (dayOfCycle === 14) {
    return {
      phase: "Ovulation",
      icon: Sun,
      color: "text-yellow-500",
      bgColor: "bg-yellow-50",
      description: "Peak fertility day",
      symptoms: [
        "Peak confidence",
        "Heightened senses",
        "Increased attraction",
        "Possible mild cramps",
        "Clear stretchy cervical mucus"
      ],
      wellness: [
        "Plan important events",
        "Antioxidant-rich foods",
        "Track fertility signs",
        "Stay hydrated"
      ],
      energy: "Peak"
    };
  }

  // Early Luteal Phase (days 15-20)
  if (dayOfCycle <= 20) {
    return {
      phase: "Early Luteal",
      icon: Moon,
      color: "text-dw-lavender",
      bgColor: "bg-dw-lavender/10",
      description: "Post-ovulation calm phase",
      symptoms: [
        "Calm mood",
        "Relaxed feeling",
        "Increased appetite",
        "Stable energy"
      ],
      wellness: [
        "Light exercise",
        "Balanced meals",
        "Mindfulness",
        "Creative activities"
      ],
      energy: "Medium"
    };
  }

  // Late Luteal Phase / PMS (days 21-28)
  return {
    phase: "Late Luteal (PMS)",
    icon: Moon,
    color: "text-purple-500",
    bgColor: "bg-purple-50",
    description: "Pre-menstrual phase",
    symptoms: [
      "Mood swings",
      "Irritability",
      "Bloating",
      "Food cravings",
      "Breast tenderness",
      "Fatigue"
    ],
    wellness: [
      "Gentle yoga",
      "Magnesium-rich foods",
      "Stress management",
      "Warm baths",
      "Meditation"
    ],
    energy: "Low to Medium"
  };
};

// Add mood options
const moodOptions = [
  {
    icon: Smile,
    label: "Happy",
    color: "text-green-500",
    description: "Feeling good and positive"
  },
  {
    icon: Frown,
    label: "Low",
    color: "text-blue-500",
    description: "Not feeling my best today"
  },
  {
    icon: Sparkles,
    label: "Energetic",
    color: "text-yellow-500",
    description: "Full of energy and motivation"
  },
  {
    icon: Heart,
    label: "Loved",
    color: "text-rose-500",
    description: "Feeling connected and supported"
  },
  {
    icon: Moon,
    label: "Tired",
    color: "text-purple-500",
    description: "Need some rest and relaxation"
  },
  {
    icon: Sun,
    label: "Calm",
    color: "text-orange-500",
    description: "Peaceful and balanced"
  }
];

// Add quick log symptoms
const quickLogSymptoms = [
  { icon: Waves, label: "Cramps", color: "text-red-400" },
  { icon: ThermometerSun, label: "Temperature", color: "text-orange-400" },
  { icon: Pill, label: "Medication", color: "text-purple-400" }
];

// Modify calendar day helper to include cycle information
const getCalendarDays = (date: Date, count: number, cycleData: any) => {
  const days = [];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  for (let i = -4; i < count - 4; i++) {
    const currentDate = new Date(date);
    currentDate.setDate(date.getDate() + i);

    // Calculate if this day is part of period or ovulation
    const isPeriod =
      currentDate >= cycleData.lastPeriod.start &&
      currentDate <= cycleData.lastPeriod.end;
    const isNextPeriod =
      currentDate >= cycleData.nextPeriod &&
      currentDate <=
        new Date(
          cycleData.nextPeriod.getTime() +
            cycleData.periodLength * 24 * 60 * 60 * 1000
        );

    const daysSinceLastPeriod = Math.floor(
      (currentDate.getTime() - cycleData.lastPeriod.start.getTime()) /
        (1000 * 60 * 60 * 24)
    );
    const cycleDay = (daysSinceLastPeriod % cycleData.cycleLength) + 1;

    // Ovulation is on day 14
    const isOvulation = cycleDay === 14;

    // Fertile window is days 10-15 (with peak on days 13-14)
    const isFertile = cycleDay >= 10 && cycleDay <= 15;

    // Determine the phase for styling
    let phaseClass = "";
    if (cycleDay <= 5) phaseClass = "menstrual";
    else if (cycleDay <= 13) phaseClass = "follicular";
    else if (cycleDay === 14) phaseClass = "ovulation";
    else if (cycleDay <= 20) phaseClass = "early-luteal";
    else phaseClass = "late-luteal";

    days.push({
      date: currentDate,
      dayName: dayNames[currentDate.getDay()],
      dayOfMonth: currentDate.getDate(),
      isToday: i === 0,
      isPeriod,
      isNextPeriod,
      isOvulation,
      isFertile,
      cycleDay,
      phaseClass
    });
  }
  return days;
};

// Add fertility prediction helper
const getFertilityStatus = (dayOfCycle: number) => {
  // Peak fertility during ovulation (day 14) and day before (day 13)
  if (dayOfCycle === 13 || dayOfCycle === 14) {
    return {
      status: "High",
      color: "text-rose-500",
      bgColor: "bg-rose-50",
      description: "Peak fertility window - highest chance of conception"
    };
  }
  // Medium fertility in the days before and after peak (fertile window days 10-12, 15)
  else if ((dayOfCycle >= 10 && dayOfCycle <= 12) || dayOfCycle === 15) {
    return {
      status: "Medium",
      color: "text-amber-500",
      bgColor: "bg-amber-50",
      description: "Possible fertility window - conception may occur"
    };
  }
  // Low fertility for the rest of the cycle
  return {
    status: "Low",
    color: "text-green-500",
    bgColor: "bg-green-50",
    description: "Low fertility window - conception unlikely"
  };
};

// Add cycle phase data
const CYCLE_PHASES = [
  {
    name: "Menstrual",
    days: "Days 1-5",
    icon: Droplets,
    color: "text-dw-blush",
    bgColor: "bg-dw-blush",
    description: "Period phase - uterine lining sheds"
  },
  {
    name: "Follicular",
    days: "Days 6-13",
    icon: Leaf,
    color: "text-dw-sage",
    bgColor: "bg-dw-sage",
    description: "Body prepares for ovulation"
  },
  {
    name: "Ovulation",
    days: "Day 14",
    icon: Sun,
    color: "text-yellow-500",
    bgColor: "bg-yellow-500",
    description: "Peak fertility day"
  },
  {
    name: "Early Luteal",
    days: "Days 15-20",
    icon: Moon,
    color: "text-dw-lavender",
    bgColor: "bg-dw-lavender",
    description: "Post-ovulation calm phase"
  },
  {
    name: "Late Luteal (PMS)",
    days: "Days 21-28",
    icon: Moon,
    color: "text-purple-500",
    bgColor: "bg-purple-500",
    description: "Pre-menstrual phase"
  }
] as const;

export default function HomePage() {
  // State declarations
  const [mounted, setMounted] = useState(false);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [selectedPhase, setSelectedPhase] = useState<string | null>(null);
  const [activeAction, setActiveAction] = useState<string | null>(null);
  const [isMobileView, setIsMobileView] = useState(false);
  const [currentDate, setCurrentDate] = useState<Date | null>(null);

  // Hooks
  const { toast } = useToast();
  const { user, isLoaded: isUserLoaded } = useUser();
  const {
    isLoading,
    error,
    cycleLength,
    periodLength,
    dayOfCycle,
    activePeriod,
    nextPeriodDate,
    ovulationDate,
    fertileWindow,
    currentPhase
  } = useCycleData();

  // Handle window-specific code
  useEffect(() => {
    setMounted(true);
    setCurrentDate(new Date());

    const checkMobile = () => {
      setIsMobileView(window.innerWidth < 640);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // If not mounted or loading, show loading state
  if (!mounted || isLoading) {
    return (
      <div className="dw-container flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-dw-blush" />
        <p className="ml-2">Loading your cycle data...</p>
      </div>
    );
  }

  // If there's an error, show error state
  if (error) {
    return (
      <div className="dw-container">
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-medium mb-2">Error Loading Data</h2>
          <p className="text-dw-text/60 mb-4">{error}</p>
          <Button
            onClick={() => window.location.reload()}
            className="bg-dw-blush hover:bg-dw-blush/90 text-white"
          >
            Try Again
          </Button>
        </Card>
      </div>
    );
  }

  // If there's no data yet, show a welcome message
  if (!activePeriod && !nextPeriodDate) {
    return (
      <div className="dw-container px-4 sm:px-6 max-w-7xl mx-auto">
        <Card className="p-6 sm:p-8 mb-6">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="bg-dw-blush/10 p-4 rounded-full mb-4">
              <Flower className="h-12 w-12 text-dw-blush" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-medium mb-3">
              Welcome to Your Cycle Tracker
            </h2>
            <p className="text-dw-text/60 max-w-2xl mb-6">
              Start your journey to better understanding your menstrual cycle.
              Track your periods, monitor symptoms, and get personalized
              insights to make informed decisions about your health.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {[
              {
                icon: Calendar,
                title: "Track Your Cycle",
                description:
                  "Log your periods and symptoms to get accurate predictions for future cycles."
              },
              {
                icon: LineChart,
                title: "Get Insights",
                description:
                  "Understand your patterns and receive personalized health recommendations."
              },
              {
                icon: Bell,
                title: "Stay Informed",
                description:
                  "Receive reminders for upcoming periods and fertile windows."
              }
            ].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="flex flex-col items-center text-center p-4 bg-dw-cream/10 rounded-xl"
                >
                  <div className="bg-white p-3 rounded-full mb-3">
                    <Icon className="h-6 w-6 text-dw-blush" />
                  </div>
                  <h3 className="font-medium mb-2">{feature.title}</h3>
                  <p className="text-sm text-dw-text/60">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="bg-dw-cream/20 p-6 rounded-xl mb-8">
            <h3 className="font-medium mb-4 text-center">
              What you can track:
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                {
                  icon: Droplets,
                  label: "Period Flow",
                  color: "text-dw-blush"
                },
                {
                  icon: ThermometerSun,
                  label: "Symptoms",
                  color: "text-dw-sage"
                },
                { icon: Heart, label: "Mood", color: "text-rose-500" },
                {
                  icon: MessageCircle,
                  label: "Notes",
                  color: "text-dw-lavender"
                }
              ].map((item, index) => {
                const Icon = item.icon;
                return (
                  <div
                    key={index}
                    className="flex items-center gap-2 justify-center"
                  >
                    <Icon className={`h-5 w-5 ${item.color}`} />
                    <span className="text-sm">{item.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              className="bg-dw-blush hover:bg-dw-blush/90 text-white w-full sm:w-auto"
              size="lg"
              asChild
            >
              <Link href="/tracking">
                <Plus className="h-4 w-4 mr-2" />
                Log Your First Period
              </Link>
            </Button>
            <Button
              variant="outline"
              className="w-full sm:w-auto"
              size="lg"
              asChild
            >
              <Link href="/insights">
                <LineChart className="h-4 w-4 mr-2" />
                Learn More
              </Link>
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // Get cycle phase information
  const phaseInfo = getCyclePhase(dayOfCycle, cycleLength);
  const PhaseIcon = phaseInfo.icon;

  // Calculate cycle progress
  const cycleProgress = Math.round((dayOfCycle / cycleLength) * 100);

  // Get calendar days
  const calendarDays = currentDate
    ? getCalendarDays(currentDate, 9, {
        lastPeriod: {
          start: activePeriod ? new Date(activePeriod.start_date) : new Date(),
          end:
            activePeriod && activePeriod.end_date
              ? new Date(activePeriod.end_date)
              : new Date()
        },
        nextPeriod: nextPeriodDate || new Date(),
        cycleLength,
        periodLength
      })
    : [];

  // Get fertility status
  const fertilityStatus = getFertilityStatus(dayOfCycle);

  // Calculate days until ovulation (from current cycle day to day 14)
  const daysUntilOvulation =
    dayOfCycle <= 14 ? 14 - dayOfCycle : cycleLength - dayOfCycle + 14;

  // Calculate days until next period
  const daysUntilNextPeriod =
    nextPeriodDate && currentDate
      ? Math.max(
          0,
          Math.ceil(
            (nextPeriodDate.getTime() - currentDate.getTime()) /
              (1000 * 3600 * 24)
          )
        )
      : "--";

  // Format date to display month and day
  const formatDate = (date: Date | null) => {
    if (!mounted || !date) return "";
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric"
    });
  };

  // Format time to display hour and minute
  const formatTime = (date: Date | null) => {
    if (!mounted || !date) return "";
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric"
    });
  };

  // Update mood selection handler
  const handleMoodSelection = (mood: string) => {
    setSelectedMood(mood);
    toast({
      title: "Mood Tracked Successfully! 🎉",
      description: `Thank you for sharing that you're feeling ${mood.toLowerCase()}. Your emotional well-being is an important part of your cycle tracking journey.`,
      duration: 5000
    });
  };

  // Handle phase selection
  const handlePhaseClick = (phaseName: string) => {
    if (mounted && isMobileView) {
      setSelectedPhase(phaseName === selectedPhase ? null : phaseName);
    }
  };

  return (
    <div className="dw-container px-4 sm:px-6 max-w-7xl mx-auto">
      {/* Welcome Section with Mood Check-in */}
      <section className="mb-6 sm:mb-8">
        <div className="flex flex-col gap-4">
          {/* Welcome and Mood Selection in one line */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-medium text-dw-text">
                Welcome
                {isUserLoaded && user?.firstName ? `, ${user.firstName}` : ""}
              </h1>
              <p className="text-sm sm:text-base text-dw-text/60">
                How are you feeling today?
              </p>
            </div>

            {/* Mood Selection */}
            <div className="flex flex-wrap justify-center sm:justify-start gap-2 sm:gap-3">
              {moodOptions.map(mood => {
                const MoodIcon = mood.icon;
                return (
                  <div key={mood.label} className="relative group">
                    <button
                      onClick={() => handleMoodSelection(mood.label)}
                      className={`p-2.5 sm:p-3 rounded-full transition-all duration-300 
                        ${
                          selectedMood === mood.label
                            ? "bg-dw-cream/50 scale-110 ring-2 ring-dw-cream ring-offset-2"
                            : "hover:bg-dw-cream/30"
                        }`}
                    >
                      <MoodIcon
                        className={`h-5 w-5 sm:h-6 sm:w-6 ${mood.color}`}
                      />
                    </button>
                    {/* Mood Tooltip */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-32 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-50">
                      <div className="bg-white p-2 rounded-lg shadow-lg border border-gray-100 text-center">
                        <p className="text-sm font-medium mb-0.5">
                          {mood.label}
                        </p>
                        <p className="text-xs text-dw-text/60">
                          {mood.description}
                        </p>
                      </div>
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white rotate-45 border-r border-b border-gray-100"></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Log Period Button - Full Width on Mobile */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end bg-dw-cream/10 p-4 rounded-xl">
            <div className="flex-1">
              <p className="text-sm font-medium text-dw-text">
                Track Your Cycle
              </p>
              <p className="text-xs text-dw-text/60">
                Log your period and symptoms to get personalized insights
              </p>
            </div>
            <Button
              className="dw-button-primary text-sm sm:text-base px-6 w-full sm:w-auto mt-2 sm:mt-0"
              asChild
            >
              <Link href="/tracking">
                <Plus className="h-4 w-4 mr-2" />
                Log Period
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Next Period Prediction - Enhanced grid for mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
        <Card className="p-4 bg-dw-blush/5 hover:shadow-md transition-all duration-300">
          <h3 className="text-sm font-medium text-dw-text mb-2">Last Period</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-dw-text/60">Started</p>
              <p className="text-base sm:text-lg font-medium text-dw-text">
                {formatDate(
                  activePeriod ? new Date(activePeriod.start_date) : new Date()
                )}
              </p>
              <p className="text-xs text-dw-text/60">{periodLength} days</p>
            </div>
            <div className="text-right">
              <p className="text-xs sm:text-sm text-dw-text/60">Days Since</p>
              <p className="text-xl sm:text-2xl font-medium text-dw-text">
                {dayOfCycle}
              </p>
              <p className="text-xs text-dw-text/60">days ago</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-dw-sage/5 hover:shadow-md transition-all duration-300">
          <h3 className="text-sm font-medium text-dw-text mb-2">Next Period</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-dw-text/60">Expected</p>
              <p className="text-base sm:text-lg font-medium text-dw-text">
                {formatDate(nextPeriodDate || new Date())}
              </p>
              <p className="text-xs text-dw-text/60">~{periodLength} days</p>
            </div>
            <div className="text-right">
              <p className="text-xs sm:text-sm text-dw-text/60">Days Until</p>
              <p className="text-xl sm:text-2xl font-medium text-dw-text">
                {daysUntilNextPeriod}
              </p>
              <p className="text-xs text-dw-text/60">days away</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Enhanced Calendar View - Better mobile layout */}
      <Card className="mb-6 sm:mb-8 p-4 sm:p-6 hover:shadow-md transition-all duration-300">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 sm:mb-6">
          <div className="flex items-center gap-3">
            <h2 className="text-base sm:text-lg font-medium text-dw-text">
              Your Cycle Calendar
            </h2>
            <Button
              variant="ghost"
              size="sm"
              className="text-dw-text/60 hover:text-dw-text hover:bg-dw-cream/20 -ml-2"
              asChild
            >
              <Link href="/calendar">
                <CalendarDays className="h-4 w-4" />
                <span className="sr-only">View Full Calendar</span>
              </Link>
            </Button>
          </div>
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-dw-blush"></div>
              <span className="text-dw-text/60">Current Period</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-dw-blush/30"></div>
              <span className="text-dw-text/60">Next Period</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-dw-sage"></div>
              <span className="text-dw-text/60">Ovulation</span>
            </div>
          </div>
        </div>

        {/* Calendar Grid - Fixed ring cutoff */}
        <div className="overflow-x-auto -mx-4 sm:mx-0 pb-4 sm:pb-0">
          <div className="min-w-[640px] sm:min-w-0">
            <div className="grid grid-cols-10 gap-2 sm:gap-3 p-2 sm:p-3">
              {calendarDays.map(day => (
                <div
                  key={day.date.toISOString()}
                  className={`relative p-3 sm:p-4 rounded-xl text-center transition-all duration-300
                    ${
                      day.isToday
                        ? "ring-2 ring-dw-blush ring-offset-4 bg-white"
                        : ""
                    }
                    ${day.isPeriod ? "bg-dw-blush/10" : ""}
                    ${
                      day.isNextPeriod
                        ? "bg-dw-blush/5 border border-dw-blush/20"
                        : ""
                    }
                    ${day.isOvulation ? "bg-dw-sage/10" : ""}
                    ${day.isFertile && !day.isOvulation ? "bg-yellow-50" : ""}
                    ${
                      !day.isPeriod &&
                      !day.isOvulation &&
                      !day.isFertile &&
                      !day.isNextPeriod
                        ? "hover:bg-dw-cream/20"
                        : ""
                    }
                    h-[110px] sm:h-[120px] flex flex-col justify-between
                  `}
                >
                  <p className="text-xs text-dw-text/60 mb-1">{day.dayName}</p>
                  <p className="text-base sm:text-lg font-medium text-dw-text mb-1">
                    {day.dayOfMonth}
                  </p>
                  <div className="flex flex-col items-center gap-1">
                    <p className="text-xs text-dw-text/60">
                      Day {day.cycleDay}
                    </p>
                    {day.isPeriod && (
                      <Droplets className="h-3.5 w-3.5 text-dw-blush mt-0.5" />
                    )}
                    {day.isNextPeriod && (
                      <Droplets className="h-3.5 w-3.5 text-dw-blush/40 mt-0.5" />
                    )}
                    {day.isOvulation && (
                      <Sun className="h-3.5 w-3.5 text-dw-sage mt-0.5" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Enhanced Cycle Status Card - Better mobile layout */}
      <Card className="mb-6 sm:mb-8 p-4 sm:p-6 hover:shadow-md transition-all duration-300">
        {/* Cycle Stats Grid - Responsive layout */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
          {/* Cycle Day */}
          <div className="bg-dw-cream/30 rounded-xl p-3 sm:p-4 hover:shadow-sm transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-dw-text/60">Cycle Day</p>
                <p className="text-xl sm:text-2xl font-medium text-dw-text">
                  {dayOfCycle}
                </p>
                <p className="text-xs text-dw-text/60">of {cycleLength} days</p>
              </div>
              <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-dw-blush" />
            </div>
          </div>

          {/* Ovulation Countdown */}
          <div className="bg-dw-sage/20 rounded-xl p-3 sm:p-4 hover:shadow-sm transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-dw-text/60">
                  Days until Ovulation
                </p>
                <p className="text-xl sm:text-2xl font-medium text-dw-text">
                  {daysUntilOvulation}
                </p>
                <p className="text-xs text-dw-text/60">
                  Expected{" "}
                  {formatDate(
                    new Date(
                      (currentDate?.getTime() ?? Date.now()) +
                        daysUntilOvulation * 24 * 60 * 60 * 1000
                    )
                  )}
                </p>
              </div>
              <Sun className="h-5 w-5 sm:h-6 sm:w-6 text-dw-sage" />
            </div>
          </div>

          {/* Fertility Window */}
          <div
            className={`${fertilityStatus.bgColor} rounded-xl p-3 sm:p-4 hover:shadow-sm transition-all duration-300`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-dw-text/60">
                  Pregnancy Chances
                </p>
                <p
                  className={`text-xl sm:text-2xl font-medium ${fertilityStatus.color}`}
                >
                  {fertilityStatus.status}
                </p>
                <p className="text-xs text-dw-text/60">
                  {fertilityStatus.description}
                </p>
              </div>
              <Baby
                className={`h-5 w-5 sm:h-6 sm:w-6 ${fertilityStatus.color}`}
              />
            </div>
          </div>
        </div>

        {/* Enhanced Phase Information - Better mobile layout */}
        <div
          className={`mb-6 p-4 sm:p-6 rounded-xl ${phaseInfo.bgColor} hover:shadow-sm transition-all duration-300`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div className="flex items-center">
              <PhaseIcon
                className={`h-5 w-5 sm:h-6 sm:w-6 mr-2 ${phaseInfo.color}`}
              />
              <div>
                <h3 className="text-base sm:text-lg font-medium text-dw-text">
                  {phaseInfo.phase} Phase
                </h3>
                <div className="flex items-center gap-2">
                  <p className="text-xs sm:text-sm text-dw-text/60">
                    {phaseInfo.description}
                  </p>
                  <div className="h-1 w-12 sm:w-16 bg-dw-cream/30 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${phaseInfo.bgColor} transition-all duration-300`}
                      style={{
                        width: `${cycleProgress}%`
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-dw-text/60 hover:text-dw-text self-start sm:self-center"
              asChild
            >
              <Link href="/insights">
                <MessageCircle className="h-4 w-4 mr-1" />
                Learn More
              </Link>
            </Button>
          </div>

          {/* Enhanced Phase Timeline - Mobile Optimized */}
          <div className="relative py-4 sm:py-6">
            {/* Cycle Progress Visualization */}
            <div className="relative mb-6 sm:mb-8">
              <div className="h-1 bg-dw-cream/30 rounded-full overflow-hidden">
                <div
                  className="relative h-full bg-gradient-to-r from-dw-blush via-dw-sage to-dw-lavender transition-all duration-700 ease-in-out"
                  style={{ width: `${cycleProgress}%` }}
                >
                  <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-white rounded-full shadow-md"></div>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="relative flex justify-between items-center px-2 sm:px-0">
              {CYCLE_PHASES.map((phase, index) => {
                const Icon = phase.icon;
                const isActive = phaseInfo.phase === phase.name;
                return (
                  <div
                    key={phase.name}
                    className="flex flex-col items-center relative group"
                  >
                    {/* Desktop Tooltip */}
                    <div className="hidden sm:block absolute bottom-full mb-2 w-48 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:-translate-y-1 z-50">
                      <div className="bg-white p-2.5 rounded-xl shadow-lg border border-gray-100">
                        <div className="flex items-center gap-2 mb-1">
                          <Icon className={`h-4 w-4 ${phase.color}`} />
                          <span className="font-medium text-sm">
                            {phase.name}
                          </span>
                        </div>
                        <p className="text-xs text-dw-text/60 mb-0.5">
                          {phase.days}
                        </p>
                        <p className="text-xs text-dw-text/80">
                          {phase.description}
                        </p>
                      </div>
                      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white rotate-45 border-r border-b border-gray-100"></div>
                    </div>

                    {/* Timeline Node - Made Tappable on Mobile */}
                    <button
                      onClick={() => handlePhaseClick(phase.name)}
                      className={`w-8 h-8 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all duration-500 
                        ${
                          isActive
                            ? `${phase.bgColor}/20 ring-2 ring-offset-2 ring-${phase.bgColor} scale-110`
                            : "bg-gray-100"
                        }`}
                    >
                      <Icon
                        className={`h-4 w-4 sm:h-6 sm:w-6 ${
                          isActive ? phase.color : "text-gray-400"
                        } transition-all duration-500`}
                      />
                    </button>

                    {/* Phase Name - Smaller on Mobile */}
                    <span
                      className={`text-[10px] sm:text-sm mt-2 font-medium transition-all duration-500 ${
                        isActive ? phase.color : "text-gray-400"
                      }`}
                    >
                      {phase.name}
                    </span>

                    {/* Days - Hidden on Smallest Screens */}
                    <span className="hidden xs:block text-[10px] sm:text-xs text-dw-text/60 mt-0.5">
                      {phase.days}
                    </span>

                    {/* Connecting Line */}
                    {index < 3 && (
                      <div className="absolute top-4 sm:top-6 left-[calc(100%_-_4px)] w-[calc(100%_-_8px)] h-[2px]">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            isActive ? `${phase.bgColor}/50` : "bg-gray-200"
                          }`}
                        ></div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Mobile Phase Details */}
            <div className="sm:hidden mt-4">
              {selectedPhase && (
                <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 animate-in slide-in-from-top duration-300">
                  {(() => {
                    const selectedPhaseData = CYCLE_PHASES.find(
                      p => p.name === selectedPhase
                    );
                    if (!selectedPhaseData) return null;
                    const PhaseIcon = selectedPhaseData.icon;
                    return (
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <PhaseIcon
                            className={`h-5 w-5 ${selectedPhaseData.color}`}
                          />
                          <span className="font-medium">
                            {selectedPhaseData.name}
                          </span>
                        </div>
                        <p className="text-sm text-dw-text/60">
                          {selectedPhaseData.days}
                        </p>
                        <p className="text-sm text-dw-text/80">
                          {selectedPhaseData.description}
                        </p>
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
          </div>

          {/* Phase Information Grid - Optimized height */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-4">
            {/* Common Symptoms - Enhanced with icons and interactive elements */}
            <div className="bg-white/50 p-3 rounded-xl hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
              <h4 className="text-sm font-medium text-dw-text flex items-center gap-2 mb-3">
                <Activity className="h-4 w-4" />
                Common Symptoms
              </h4>
              <ul className="space-y-2.5">
                {phaseInfo.symptoms.map((symptom, index) => {
                  // Assign different icons based on symptom type
                  let SymptomIcon;
                  let iconColor;

                  if (
                    symptom.toLowerCase().includes("cramp") ||
                    symptom.toLowerCase().includes("pain")
                  ) {
                    SymptomIcon = Waves;
                    iconColor = "text-red-400";
                  } else if (
                    symptom.toLowerCase().includes("mood") ||
                    symptom.toLowerCase().includes("irritability")
                  ) {
                    SymptomIcon = Frown;
                    iconColor = "text-purple-400";
                  } else if (
                    symptom.toLowerCase().includes("energy") ||
                    symptom.toLowerCase().includes("fatigue")
                  ) {
                    SymptomIcon = Activity;
                    iconColor = "text-blue-400";
                  } else if (
                    symptom.toLowerCase().includes("skin") ||
                    symptom.toLowerCase().includes("glow")
                  ) {
                    SymptomIcon = Sparkles;
                    iconColor = "text-amber-400";
                  } else if (
                    symptom.toLowerCase().includes("libido") ||
                    symptom.toLowerCase().includes("attraction")
                  ) {
                    SymptomIcon = Heart;
                    iconColor = "text-rose-400";
                  } else if (
                    symptom.toLowerCase().includes("bloating") ||
                    symptom.toLowerCase().includes("tender")
                  ) {
                    SymptomIcon = ThermometerSun;
                    iconColor = "text-orange-400";
                  } else {
                    SymptomIcon = Droplets;
                    iconColor = "text-teal-400";
                  }

                  return (
                    <li key={index} className="flex items-center gap-2 group">
                      <div
                        className={`w-6 h-6 rounded-full ${phaseInfo.bgColor}/20 flex items-center justify-center group-hover:scale-110 transition-all duration-300`}
                      >
                        <SymptomIcon className={`h-3.5 w-3.5 ${iconColor}`} />
                      </div>
                      <span className="text-xs sm:text-sm text-dw-text/80 group-hover:text-dw-text transition-colors duration-300">
                        {symptom}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Wellness Tips - Enhanced with interactive cards */}
            <div className="bg-white/50 p-3 rounded-xl hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
              <h4 className="text-sm font-medium text-dw-text flex items-center gap-2 mb-3">
                <Heart className="h-4 w-4" />
                Wellness Tips
              </h4>
              <div className="space-y-2.5">
                {phaseInfo.wellness.map((tip, index) => {
                  // Assign different background colors for variety
                  const bgColors = [
                    "bg-dw-sage/10",
                    "bg-dw-blush/10",
                    "bg-dw-lavender/10",
                    "bg-yellow-50",
                    "bg-purple-50"
                  ];
                  const bgColor = bgColors[index % bgColors.length];

                  return (
                    <div
                      key={index}
                      className={`${bgColor} p-2 rounded-lg cursor-pointer hover:shadow-sm transition-all duration-300 group`}
                    >
                      <p className="text-xs sm:text-sm text-dw-text/80 group-hover:text-dw-text transition-colors duration-300">
                        {tip}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Energy Level - Enhanced with animated gauge */}
            <div className="bg-white/50 p-3 rounded-xl hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
              <h4 className="text-sm font-medium text-dw-text flex items-center gap-2 mb-3">
                <Flower className="h-4 w-4" />
                Energy Level
              </h4>

              {/* Energy gauge visualization */}
              <div className="flex flex-col items-center">
                {/* Energy meter */}
                <div className="relative w-full h-32 mb-2">
                  {/* Energy level gauge background */}
                  <div className="absolute bottom-0 left-0 right-0 h-full bg-gray-100 rounded-lg overflow-hidden">
                    {/* Energy level fill - dynamically sized based on energy level */}
                    <div
                      className={`absolute bottom-0 left-0 right-0 ${phaseInfo.bgColor} transition-all duration-1000 ease-in-out`}
                      style={{
                        height:
                          phaseInfo.energy === "Low"
                            ? "25%"
                            : phaseInfo.energy === "Medium"
                            ? "50%"
                            : phaseInfo.energy === "High"
                            ? "75%"
                            : phaseInfo.energy === "Peak"
                            ? "95%"
                            : phaseInfo.energy === "Low to Medium"
                            ? "35%"
                            : "50%"
                      }}
                    >
                      {/* Animated bubbles for visual effect */}
                      <div className="absolute w-3 h-3 rounded-full bg-white/30 animate-float-slow left-1/4 bottom-1/2"></div>
                      <div className="absolute w-2 h-2 rounded-full bg-white/30 animate-float-medium left-2/3 bottom-1/4"></div>
                      <div className="absolute w-4 h-4 rounded-full bg-white/30 animate-float-fast left-1/2 bottom-3/4"></div>
                    </div>
                  </div>

                  {/* Energy level indicator */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <span className={`text-xl font-bold ${phaseInfo.color}`}>
                        {phaseInfo.energy}
                      </span>
                      <div className="flex items-center justify-center mt-1">
                        {/* Dynamic energy icons based on level */}
                        {phaseInfo.energy === "Low" && (
                          <Moon className={`h-5 w-5 ${phaseInfo.color}`} />
                        )}
                        {(phaseInfo.energy === "Medium" ||
                          phaseInfo.energy === "Low to Medium") && (
                          <div className="flex">
                            <Moon className={`h-5 w-5 ${phaseInfo.color}`} />
                            <Sun className={`h-5 w-5 ${phaseInfo.color}`} />
                          </div>
                        )}
                        {phaseInfo.energy === "High" && (
                          <Sun className={`h-5 w-5 ${phaseInfo.color}`} />
                        )}
                        {phaseInfo.energy === "Peak" && (
                          <div className="flex">
                            <Sun className={`h-5 w-5 ${phaseInfo.color}`} />
                            <Sparkles
                              className={`h-5 w-5 ${phaseInfo.color}`}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Energy level description */}
                <p className="text-xs text-center text-dw-text/60 mt-1">
                  {phaseInfo.energy === "Low"
                    ? "Take it easy and rest when needed"
                    : phaseInfo.energy === "Medium" ||
                      phaseInfo.energy === "Low to Medium"
                    ? "Balanced energy for moderate activities"
                    : phaseInfo.energy === "High"
                    ? "Great time for challenging activities"
                    : "Your energy is at its highest point"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Quick Actions - Better mobile grid */}
      <h3 className="text-base sm:text-lg font-medium text-dw-text mb-3 sm:mb-4">
        Quick Access
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
        {[
          {
            href: "/tracking",
            icon: Droplets,
            label: "Track",
            bgColor: "bg-dw-blush/10",
            iconColor: "text-dw-blush",
            hoverBg: "hover:bg-dw-blush/20"
          },
          {
            href: "/calendar",
            icon: Calendar,
            label: "Calendar",
            bgColor: "bg-dw-sage/20",
            iconColor: "text-dw-sage",
            hoverBg: "hover:bg-dw-sage/30"
          },
          {
            href: "/insights",
            icon: LineChart,
            label: "Insights",
            bgColor: "bg-dw-lavender/30",
            iconColor: "text-dw-text",
            hoverBg: "hover:bg-dw-lavender/40"
          },
          {
            href: "/profile",
            icon: User,
            label: "Profile",
            bgColor: "bg-dw-cream/50",
            iconColor: "text-dw-text",
            hoverBg: "hover:bg-dw-cream/60"
          }
        ].map((action, index) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.href}
              href={action.href}
              className={`dw-card flex flex-col items-center text-center p-4 transition-all duration-300 
                hover:shadow-md ${action.hoverBg} transform hover:scale-102
                ${activeAction === action.label ? "scale-95" : ""}`}
              onMouseEnter={() => setActiveAction(action.label)}
              onMouseLeave={() => setActiveAction(null)}
              onClick={() => {
                setActiveAction(action.label);
                setTimeout(() => setActiveAction(null), 200);
              }}
            >
              <div
                className={`${action.bgColor} p-3 rounded-full mb-2 transition-transform duration-300 group-hover:scale-110`}
              >
                <Icon className={`h-5 w-5 ${action.iconColor}`} />
              </div>
              <span className="text-sm font-medium text-dw-text">
                {action.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
