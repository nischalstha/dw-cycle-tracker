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
  Baby
} from "lucide-react";
import { defaultCycleData, calculateDayOfCycle } from "@/lib/cycle-data";

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
      symptoms: ["Cramps", "Fatigue", "Lower back pain"],
      wellness: ["Rest", "Light exercise", "Iron-rich foods"],
      energy: "Low to Medium"
    };
  }

  // Follicular Phase (typically days 6-14)
  if (dayOfCycle <= 14) {
    return {
      phase: "Follicular",
      icon: Leaf,
      color: "text-dw-sage",
      bgColor: "bg-dw-sage/10",
      description: "Your body preparing for ovulation",
      symptoms: ["Increased energy", "Better mood", "Clear skin"],
      wellness: [
        "High-intensity workouts",
        "Start new projects",
        "Social activities"
      ],
      energy: "High"
    };
  }

  // Ovulation Phase (typically day 14-16)
  if (dayOfCycle <= 16) {
    return {
      phase: "Ovulation",
      icon: Sun,
      color: "text-yellow-500",
      bgColor: "bg-yellow-50",
      description: "Peak fertility window",
      symptoms: ["Increased libido", "Breast tenderness", "Mild cramping"],
      wellness: ["Stay hydrated", "Moderate exercise", "Track fertility signs"],
      energy: "Peak"
    };
  }

  // Luteal Phase (typically days 17-28)
  return {
    phase: "Luteal",
    icon: Moon,
    color: "text-dw-lavender",
    bgColor: "bg-dw-lavender/10",
    description: "Post-ovulation phase",
    symptoms: ["Mood changes", "Bloating", "Food cravings"],
    wellness: ["Gentle yoga", "Self-care", "Balanced meals"],
    energy: "Medium to Low"
  };
};

// Add mood options
const moodOptions = [
  { icon: Smile, label: "Happy", color: "text-green-500" },
  { icon: Frown, label: "Low", color: "text-blue-500" },
  { icon: Sparkles, label: "Energetic", color: "text-yellow-500" }
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
    const isOvulation = cycleDay >= 13 && cycleDay <= 15;
    const isFertile = cycleDay >= 11 && cycleDay <= 17;

    days.push({
      date: currentDate,
      dayName: dayNames[currentDate.getDay()],
      dayOfMonth: currentDate.getDate(),
      isToday: i === 0,
      isPeriod,
      isNextPeriod,
      isOvulation,
      isFertile,
      cycleDay
    });
  }
  return days;
};

// Add fertility prediction helper
const getFertilityStatus = (dayOfCycle: number) => {
  if (dayOfCycle >= 12 && dayOfCycle <= 16) {
    return {
      status: "High",
      color: "text-rose-500",
      bgColor: "bg-rose-50",
      description: "Peak fertility window"
    };
  } else if (dayOfCycle >= 10 && dayOfCycle <= 18) {
    return {
      status: "Medium",
      color: "text-amber-500",
      bgColor: "bg-amber-50",
      description: "Possible fertility window"
    };
  }
  return {
    status: "Low",
    color: "text-green-500",
    bgColor: "bg-green-50",
    description: "Low fertility window"
  };
};

export default function HomePage() {
  // Get today's date
  const today = new Date();

  // State for cycle data with corrected dates
  const [cycleData, setCycleData] = useState(defaultCycleData);

  // Calculate days until next period
  const daysUntilNextPeriod = Math.max(
    0,
    Math.ceil(
      (cycleData.nextPeriod.getTime() - today.getTime()) / (1000 * 3600 * 24)
    )
  );

  // Calculate percentage of cycle completed
  const cyclePercentage = Math.min(
    100,
    Math.round((cycleData.dayOfCycle / cycleData.cycleLength) * 100)
  );

  // Format date to display month and day
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric"
    });
  };

  // Simulate progress bar animation
  useEffect(() => {
    const timer = setInterval(() => {
      setCycleData(prev => {
        const newDayOfCycle =
          prev.dayOfCycle < prev.cycleLength ? prev.dayOfCycle + 1 : 1;

        // If cycle resets, update last period and next period
        if (newDayOfCycle === 1) {
          const lastPeriodStart = prev.nextPeriod;
          const lastPeriodEnd = new Date(lastPeriodStart);
          lastPeriodEnd.setDate(
            lastPeriodEnd.getDate() + prev.periodLength - 1
          );

          const nextPeriodDate = new Date(lastPeriodStart);
          nextPeriodDate.setDate(nextPeriodDate.getDate() + prev.cycleLength);

          return {
            ...prev,
            dayOfCycle: newDayOfCycle,
            lastPeriod: {
              start: lastPeriodStart,
              end: lastPeriodEnd
            },
            nextPeriod: nextPeriodDate
          };
        }

        return {
          ...prev,
          dayOfCycle: newDayOfCycle
        };
      });
    }, 86400000); // Update every 24 hours

    return () => clearInterval(timer);
  }, []);

  // Quick action animations
  const [activeAction, setActiveAction] = useState<string | null>(null);

  // Get current cycle phase info
  const phaseInfo = getCyclePhase(cycleData.dayOfCycle, cycleData.cycleLength);
  const PhaseIcon = phaseInfo.icon;

  // Add mood state
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  // Get calendar days with cycle information
  const calendarDays = getCalendarDays(today, 10, cycleData);

  // Get fertility status
  const fertilityStatus = getFertilityStatus(cycleData.dayOfCycle);

  // Calculate days until ovulation (from current cycle day to day 14)
  const daysUntilOvulation =
    cycleData.dayOfCycle <= 14
      ? 14 - cycleData.dayOfCycle
      : cycleData.cycleLength - cycleData.dayOfCycle + 14;

  return (
    <div className="dw-container">
      {/* Welcome Section with Quick Add */}
      <section className="mb-8 flex justify-between items-center">
        <div className="text-left">
          <h1 className="text-2xl font-medium text-dw-text mb-2 animate-fade-in">
            Welcome back
          </h1>
          <p className="text-dw-text/60">How are you feeling today?</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            {moodOptions.map(mood => {
              const MoodIcon = mood.icon;
              return (
                <button
                  key={mood.label}
                  onClick={() => setSelectedMood(mood.label)}
                  className={`p-2 rounded-full transition-all duration-300 ${
                    selectedMood === mood.label
                      ? "bg-dw-cream/50 scale-110"
                      : "hover:bg-dw-cream/30"
                  }`}
                >
                  <MoodIcon className={`h-6 w-6 ${mood.color}`} />
                </button>
              );
            })}
          </div>
          <Button className="dw-button-primary" asChild>
            <Link href="/tracking">
              <Plus className="h-4 w-4 mr-2" />
              Log Today
            </Link>
          </Button>
        </div>
      </section>

      {/* Next Period Prediction */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <Card className="p-4 bg-dw-blush/5 hover:shadow-md transition-all duration-300">
          <h3 className="text-sm font-medium text-dw-text mb-2">Last Period</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-dw-text/60">Started</p>
              <p className="text-lg font-medium text-dw-text">
                {formatDate(cycleData.lastPeriod.start)}
              </p>
              <p className="text-xs text-dw-text/60">
                {cycleData.periodLength} days
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-dw-text/60">Days Since</p>
              <p className="text-2xl font-medium text-dw-text">
                {cycleData.dayOfCycle}
              </p>
              <p className="text-xs text-dw-text/60">days ago</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-dw-sage/5 hover:shadow-md transition-all duration-300">
          <h3 className="text-sm font-medium text-dw-text mb-2">Next Period</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-dw-text/60">Expected</p>
              <p className="text-lg font-medium text-dw-text">
                {formatDate(cycleData.nextPeriod)}
              </p>
              <p className="text-xs text-dw-text/60">
                ~{cycleData.periodLength} days
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-dw-text/60">Days Until</p>
              <p className="text-2xl font-medium text-dw-text">
                {daysUntilNextPeriod}
              </p>
              <p className="text-xs text-dw-text/60">days away</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Enhanced Calendar View */}
      <Card className="mb-8 p-6 hover:shadow-md transition-all duration-300">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-medium text-dw-text">
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
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-dw-blush"></div>
              <span className="text-sm text-dw-text/60">Current Period</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-dw-blush/30"></div>
              <span className="text-sm text-dw-text/60">Next Period</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-dw-sage"></div>
              <span className="text-sm text-dw-text/60">Ovulation</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-10 gap-2">
          {calendarDays.map(day => (
            <div
              key={day.date.toISOString()}
              className={`relative p-4 rounded-xl text-center transition-all duration-300
                ${day.isToday ? "ring-2 ring-dw-blush" : ""}
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
              `}
            >
              <p className="text-xs text-dw-text/60 mb-1">{day.dayName}</p>
              <p className="text-lg font-medium text-dw-text mb-1">
                {day.dayOfMonth}
              </p>
              <p className="text-xs text-dw-text/60">Day {day.cycleDay}</p>
              {day.isPeriod && (
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2">
                  <Droplets className="h-3 w-3 text-dw-blush" />
                </div>
              )}
              {day.isNextPeriod && (
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2">
                  <Droplets className="h-3 w-3 text-dw-blush/40" />
                </div>
              )}
              {day.isOvulation && (
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2">
                  <Sun className="h-3 w-3 text-dw-sage" />
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Enhanced Cycle Status Card */}
      <Card className="mb-8 p-6 hover:shadow-md transition-all duration-300">
        {/* Cycle Progress Visualization with Labels */}
        <div className="relative mb-8">
          <div className="h-1 bg-dw-cream/30 rounded-full overflow-hidden">
            <div
              className="relative h-full bg-gradient-to-r from-dw-blush via-dw-sage to-dw-lavender transition-all duration-700 ease-in-out"
              style={{ width: `${cyclePercentage}%` }}
            >
              <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-white rounded-full shadow-md"></div>
            </div>
          </div>
          <div className="flex justify-between mt-2 text-xs text-dw-text/60">
            <span>
              Period
              <br />
              {formatDate(cycleData.lastPeriod.start)}
            </span>
            <span>
              Follicular
              <br />
              Phase
            </span>
            <span>
              Ovulation
              <br />
              Window
            </span>
            <span>
              Luteal
              <br />
              Phase
            </span>
          </div>
        </div>

        {/* Cycle Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {/* Cycle Day */}
          <div className="bg-dw-cream/30 rounded-xl p-4 hover:shadow-sm transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-dw-text/60">Cycle Day</p>
                <p className="text-2xl font-medium text-dw-text">
                  {cycleData.dayOfCycle}
                </p>
                <p className="text-xs text-dw-text/60">
                  of {cycleData.cycleLength} days
                </p>
              </div>
              <Clock className="h-6 w-6 text-dw-blush" />
            </div>
          </div>

          {/* Ovulation Countdown */}
          <div className="bg-dw-sage/20 rounded-xl p-4 hover:shadow-sm transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-dw-text/60">Days until Ovulation</p>
                <p className="text-2xl font-medium text-dw-text">
                  {daysUntilOvulation}
                </p>
                <p className="text-xs text-dw-text/60">
                  Expected{" "}
                  {formatDate(
                    new Date(
                      today.getTime() + daysUntilOvulation * 24 * 60 * 60 * 1000
                    )
                  )}
                </p>
              </div>
              <Sun className="h-6 w-6 text-dw-sage" />
            </div>
          </div>

          {/* Fertility Window */}
          <div
            className={`${fertilityStatus.bgColor} rounded-xl p-4 hover:shadow-sm transition-all duration-300`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-dw-text/60">Pregnancy Chances</p>
                <p className={`text-2xl font-medium ${fertilityStatus.color}`}>
                  {fertilityStatus.status}
                </p>
                <p className="text-xs text-dw-text/60">
                  {fertilityStatus.description}
                </p>
              </div>
              <Baby className={`h-6 w-6 ${fertilityStatus.color}`} />
            </div>
          </div>
        </div>

        {/* Enhanced Phase Information with Timeline */}
        <div
          className={`mb-6 p-6 rounded-xl ${phaseInfo.bgColor} hover:shadow-sm transition-all duration-300`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <PhaseIcon className={`h-6 w-6 mr-2 ${phaseInfo.color}`} />
              <div>
                <h3 className="text-lg font-medium text-dw-text">
                  {phaseInfo.phase} Phase
                </h3>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-dw-text/60">
                    {phaseInfo.description}
                  </p>
                  <div className="h-1 w-16 bg-dw-cream/30 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${phaseInfo.bgColor} transition-all duration-300`}
                      style={{
                        width: `${
                          ((cycleData.dayOfCycle %
                            (phaseInfo.phase === "Menstrual"
                              ? 5
                              : phaseInfo.phase === "Follicular"
                              ? 9
                              : phaseInfo.phase === "Ovulation"
                              ? 3
                              : 12)) /
                            (phaseInfo.phase === "Menstrual"
                              ? 5
                              : phaseInfo.phase === "Follicular"
                              ? 9
                              : phaseInfo.phase === "Ovulation"
                              ? 3
                              : 12)) *
                          100
                        }%`
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-dw-text/60 hover:text-dw-text"
              asChild
            >
              <Link href="/insights">
                <MessageCircle className="h-4 w-4 mr-1" />
                Learn More
              </Link>
            </Button>
          </div>

          {/* Enhanced Phase Timeline */}
          <div className="relative flex justify-between mb-6 mt-4">
            {["Menstrual", "Follicular", "Ovulation", "Luteal"].map(
              (phase, index) => (
                <div
                  key={phase}
                  className="flex flex-col items-center relative group"
                >
                  <div className="absolute bottom-full mb-2 w-48 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <div className="bg-white p-2 rounded-lg shadow-lg text-xs text-dw-text/80">
                      {phase === "Menstrual"
                        ? "Days 1-5"
                        : phase === "Follicular"
                        ? "Days 6-14"
                        : phase === "Ovulation"
                        ? "Days 14-16"
                        : "Days 17-28"}
                    </div>
                  </div>
                  <div
                    className={`w-3 h-3 rounded-full ${
                      phaseInfo.phase === phase
                        ? "ring-2 ring-offset-2 ring-dw-blush scale-125"
                        : "bg-dw-cream"
                    } transition-all duration-300`}
                  ></div>
                  <span className="text-xs text-dw-text/60 mt-2">{phase}</span>
                  {index < 3 && (
                    <div
                      className={`absolute top-1.5 left-full w-full h-px ${
                        phaseInfo.phase === phase
                          ? "bg-dw-blush"
                          : "bg-dw-cream/50"
                      }`}
                    ></div>
                  )}
                </div>
              )
            )}
          </div>

          {/* Enhanced Phase Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/50 p-4 rounded-xl hover:shadow-sm transition-all duration-300">
              <h4 className="text-sm font-medium text-dw-text flex items-center gap-2 mb-3">
                <Activity className="h-4 w-4" />
                Common Symptoms
              </h4>
              <ul className="text-sm text-dw-text/60 space-y-2">
                {phaseInfo.symptoms.map((symptom, index) => (
                  <li key={index} className="flex items-center">
                    <div className="w-1 h-1 rounded-full bg-dw-text/20 mr-2"></div>
                    {symptom}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white/50 p-4 rounded-xl hover:shadow-sm transition-all duration-300">
              <h4 className="text-sm font-medium text-dw-text flex items-center gap-2 mb-3">
                <Heart className="h-4 w-4" />
                Wellness Tips
              </h4>
              <ul className="text-sm text-dw-text/60 space-y-2">
                {phaseInfo.wellness.map((tip, index) => (
                  <li key={index} className="flex items-center">
                    <div className="w-1 h-1 rounded-full bg-dw-text/20 mr-2"></div>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white/50 p-4 rounded-xl hover:shadow-sm transition-all duration-300">
              <h4 className="text-sm font-medium text-dw-text flex items-center gap-2 mb-3">
                <Flower className="h-4 w-4" />
                Energy Level
              </h4>
              <div className="flex flex-col gap-2">
                <span className="text-sm text-dw-text/60">
                  {phaseInfo.energy}
                </span>
                <div className="h-1 w-full bg-dw-cream/30 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${phaseInfo.bgColor} transition-all duration-300`}
                    style={{
                      width: `${
                        phaseInfo.energy === "Low to Medium"
                          ? "35%"
                          : phaseInfo.energy === "High"
                          ? "75%"
                          : phaseInfo.energy === "Peak"
                          ? "100%"
                          : "50%"
                      }`
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Log Section */}
        {/* <div className="p-4 bg-dw-cream/20 rounded-xl hover:shadow-sm transition-all duration-300">
          <h3 className="text-sm font-medium text-dw-text mb-4">Quick Log</h3>
          <div className="flex flex-wrap gap-3">
            {quickLogSymptoms.map(symptom => {
              const SymptomIcon = symptom.icon;
              return (
                <button
                  key={symptom.label}
                  className="flex items-center px-3 py-2 rounded-lg bg-white/50 hover:bg-white/80 transition-all duration-300"
                >
                  <SymptomIcon className={`h-4 w-4 mr-2 ${symptom.color}`} />
                  <span className="text-sm text-dw-text/80">
                    {symptom.label}
                  </span>
                </button>
              );
            })}
            <Button className="dw-button-outline" asChild>
              <Link href="/tracking">
                <Plus className="h-4 w-4 mr-1" />
                More
              </Link>
            </Button>
          </div>
        </div> */}
      </Card>

      {/* Quick Actions */}
      <h3 className="text-lg font-medium text-dw-text mb-4">Quick Access</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
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
