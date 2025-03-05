"use client";

import { useState, useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Droplets,
  Sun,
  Heart,
  Moon,
  Info,
  Calendar,
  AlertCircle,
  Pencil,
  Eye
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface CycleCalendarProps {
  currentDate: Date;
  cycleData: {
    dayOfCycle: number;
    cycleLength: number;
    periodLength: number;
    lastPeriod: {
      start: Date;
      end: Date;
    };
    nextPeriod: Date;
  };
}

// Type for a complete cycle
interface CycleInfo {
  periodStart: Date;
  periodEnd: Date;
  ovulation: Date;
  fertileWindow: {
    start: Date;
    end: Date;
  };
  nextPeriod: Date;
}

export function CycleCalendar({ currentDate, cycleData }: CycleCalendarProps) {
  const [viewDate, setViewDate] = useState(new Date(currentDate));
  const [mode, setMode] = useState<"view" | "log">("view");
  const [periodStart, setPeriodStart] = useState<Date | null>(null);
  const [periodEnd, setPeriodEnd] = useState<Date | null>(null);
  const [isSelectingPeriod, setIsSelectingPeriod] = useState(false);

  // Calculate a single cycle's information
  const calculateCycle = (startDate: Date): CycleInfo => {
    const periodStart = new Date(startDate);
    const periodEnd = new Date(startDate);
    periodEnd.setDate(periodEnd.getDate() + cycleData.periodLength - 1);

    const ovulation = new Date(startDate);
    ovulation.setDate(ovulation.getDate() + 14); // Ovulation on day 14

    const fertileStart = new Date(ovulation);
    fertileStart.setDate(fertileStart.getDate() - 5); // Fertile window starts 5 days before ovulation

    const fertileEnd = new Date(ovulation);
    fertileEnd.setDate(fertileEnd.getDate() + 1); // Fertile window ends 1 day after ovulation

    const nextPeriod = new Date(startDate);
    nextPeriod.setDate(nextPeriod.getDate() + cycleData.cycleLength);

    return {
      periodStart,
      periodEnd,
      ovulation,
      fertileWindow: {
        start: fertileStart,
        end: fertileEnd
      },
      nextPeriod
    };
  };

  // Calculate cycles for the calendar view (current and next 2 cycles)
  const cycles = useMemo(() => {
    const results: CycleInfo[] = [];
    let startDate = new Date(cycleData.lastPeriod.start);

    for (let i = 0; i < 3; i++) {
      const cycle = calculateCycle(startDate);
      results.push(cycle);
      startDate = cycle.nextPeriod;
    }

    return results;
  }, [
    cycleData.lastPeriod.start,
    cycleData.cycleLength,
    cycleData.periodLength
  ]);

  // Current cycle is the first one in the array
  const currentCycle = cycles[0];

  const daysInMonth = new Date(
    viewDate.getFullYear(),
    viewDate.getMonth() + 1,
    0
  ).getDate();
  const firstDayOfMonth = new Date(
    viewDate.getFullYear(),
    viewDate.getMonth(),
    1
  ).getDay();

  const prevMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };

  const monthName = viewDate.toLocaleString("default", { month: "long" });
  const year = viewDate.getFullYear();

  const getDayInfo = (day: number) => {
    const date = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);

    let info = {
      isPeriod: false,
      isOvulation: false,
      isFertile: false,
      isPrediction: date > today,
      cycleDay: null as number | null,
      daysUntil: Math.ceil(
        (date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
      ),
      phase: "",
      details: [] as string[]
    };

    // Find which cycle this date belongs to
    const cycle = cycles.find(
      c => date >= c.periodStart && date < c.nextPeriod
    );
    if (!cycle) return info;

    // Calculate cycle day
    info.cycleDay =
      Math.floor(
        (date.getTime() - cycle.periodStart.getTime()) / (1000 * 60 * 60 * 24)
      ) + 1;

    // Check if date is in current period
    if (
      date >= cycleData.lastPeriod.start &&
      date <= cycleData.lastPeriod.end
    ) {
      info.isPeriod = true;
      info.phase = "Menstrual";
      const dayOfPeriod =
        Math.floor(
          (date.getTime() - cycleData.lastPeriod.start.getTime()) /
            (1000 * 60 * 60 * 24)
        ) + 1;
      info.details.push(
        `Period day ${dayOfPeriod} of ${cycleData.periodLength}`
      );
      return info;
    }

    // Check if date is in predicted next period
    if (
      date >= cycleData.nextPeriod &&
      date <=
        new Date(
          cycleData.nextPeriod.getTime() +
            (cycleData.periodLength - 1) * 24 * 60 * 60 * 1000
        )
    ) {
      info.isPeriod = true;
      info.isPrediction = true;
      info.phase = "Menstrual";
      const dayOfPeriod =
        Math.floor(
          (date.getTime() - cycleData.nextPeriod.getTime()) /
            (1000 * 60 * 60 * 24)
        ) + 1;
      info.details.push(
        `Predicted period day ${dayOfPeriod} of ${cycleData.periodLength}`
      );
      info.details.push(`Expected in ${info.daysUntil} days`);
      return info;
    }

    // Check ovulation day
    if (isSameDay(date, cycle.ovulation)) {
      info.isOvulation = true;
      info.phase = "Ovulation";
      if (info.isPrediction) {
        info.details.push("Predicted peak fertility day");
        info.details.push(`Expected in ${info.daysUntil} days`);
      } else {
        info.details.push("Peak fertility day");
      }
      return info;
    }

    // Check fertile window
    if (date >= cycle.fertileWindow.start && date <= cycle.fertileWindow.end) {
      info.isFertile = true;
      info.phase = "Fertile";
      if (info.isPrediction) {
        info.details.push("Predicted fertile day");
      } else {
        info.details.push("Fertile day");
      }
      info.details.push("High chance of conception");
      return info;
    }

    // Set phase based on cycle day
    if (info.cycleDay <= 5) {
      info.phase = "Menstrual";
    } else if (info.cycleDay <= 13) {
      info.phase = "Follicular";
    } else if (info.cycleDay === 14) {
      info.phase = "Ovulation";
    } else {
      info.phase = "Luteal";
    }

    if (info.isPrediction) {
      info.details.push(`Predicted ${info.phase.toLowerCase()} phase`);
    }

    return info;
  };

  // Helper function to compare dates without time
  const isSameDay = (date1: Date, date2: Date) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      viewDate.getMonth() === today.getMonth() &&
      viewDate.getFullYear() === today.getFullYear()
    );
  };

  const handleDayClick = (date: Date) => {
    if (mode !== "log") return;

    if (!isSelectingPeriod) {
      // Start selecting period
      setPeriodStart(date);
      setPeriodEnd(null);
      setIsSelectingPeriod(true);
    } else if (periodStart) {
      // Finish selecting period
      if (date >= periodStart) {
        setPeriodEnd(date);
        // Here you would typically save the period data
        console.log("Period logged:", {
          start: periodStart,
          end: date
        });
      } else {
        // If end date is before start date, swap them
        setPeriodEnd(periodStart);
        setPeriodStart(date);
      }
      setIsSelectingPeriod(false);
    }
  };

  const dayClasses = (day: number) => {
    const date = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    const info = getDayInfo(day);

    if (mode === "log") {
      const isInSelection =
        periodStart &&
        ((periodEnd && date >= periodStart && date <= periodEnd) ||
          (!periodEnd && date.getTime() === periodStart.getTime()));

      return cn(
        "relative w-full h-full rounded-lg flex flex-col items-center justify-center transition-all duration-200",
        {
          "ring-2 ring-dw-blush bg-white": isToday(day),
          "bg-dw-period": isInSelection,
          "hover:bg-dw-period/30 cursor-pointer":
            !isInSelection && isSelectingPeriod,
          "hover:bg-dw-gray/20 cursor-pointer":
            !isInSelection && !isSelectingPeriod
        }
      );
    }

    return cn(
      "relative w-full h-full rounded-lg flex flex-col items-center justify-center transition-all duration-200",
      {
        "ring-2 ring-dw-blush bg-white": isToday(day),
        "bg-dw-period": !info.isPrediction && info.isPeriod,
        "bg-dw-ovulation": !info.isPrediction && info.isOvulation,
        "bg-dw-fertile": !info.isPrediction && info.isFertile,
        "bg-dw-luteal": !info.isPrediction && info.phase === "Luteal",
        "bg-dw-period/40": info.isPrediction && info.isPeriod,
        "bg-dw-ovulation/40": info.isPrediction && info.isOvulation,
        "bg-dw-fertile/40": info.isPrediction && info.isFertile,
        "bg-dw-luteal/40": info.isPrediction && info.phase === "Luteal"
      }
    );
  };

  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="space-y-6 p-4">
      {/* Header with Mode Toggle and Navigation */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-medium">
              {monthName} {year}
            </h2>
            <ToggleGroup
              type="single"
              value={mode}
              onValueChange={value => value && setMode(value as "view" | "log")}
            >
              <ToggleGroupItem value="view" aria-label="View mode">
                <Eye className="h-4 w-4" />
              </ToggleGroupItem>
              <ToggleGroupItem value="log" aria-label="Log mode">
                <Pencil className="h-4 w-4" />
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
          <div className="flex gap-1">
            <Button variant="outline" size="icon" onClick={prevMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={nextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Mode-specific Instructions */}
        {mode === "log" && (
          <div className="bg-dw-cream/10 p-3 rounded-xl text-sm text-dw-text/70 flex items-center gap-2">
            <Info className="h-4 w-4 text-dw-blush" />
            {!isSelectingPeriod
              ? "Click on a date to start logging a period"
              : "Click on an end date to complete period logging"}
          </div>
        )}

        {/* Cycle Information Cards */}
        {mode === "view" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-dw-period/5 p-4 rounded-xl border border-dw-period/20">
              <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                <Droplets className="h-4 w-4 text-dw-period" />
                Period Details
              </h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-dw-text/60">Last Start:</span>
                  <span className="font-medium">
                    {currentCycle.periodStart.toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-dw-text/60">Last End:</span>
                  <span className="font-medium">
                    {currentCycle.periodEnd.toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-dw-text/60">Next Expected:</span>
                  <span className="font-medium">
                    {currentCycle.nextPeriod.toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-dw-ovulation/5 p-4 rounded-xl border border-dw-ovulation/20">
              <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                <Sun className="h-4 w-4 text-dw-ovulation" />
                Cycle Status
              </h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-dw-text/60">Current Day:</span>
                  <span className="font-medium">
                    Day {cycleData.dayOfCycle}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-dw-text/60">Cycle Length:</span>
                  <span className="font-medium">
                    {cycleData.cycleLength} days
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-dw-text/60">Period Length:</span>
                  <span className="font-medium">
                    {cycleData.periodLength} days
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-dw-fertile/5 p-4 rounded-xl border border-dw-fertile/20">
              <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                <Heart className="h-4 w-4 text-dw-fertile" />
                Fertility Window
              </h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-dw-text/60">Next Ovulation:</span>
                  <span className="font-medium">
                    {currentCycle.ovulation.toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-dw-text/60">Fertile Start:</span>
                  <span className="font-medium">
                    {currentCycle.fertileWindow.start.toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-dw-text/60">Fertile End:</span>
                  <span className="font-medium">
                    {currentCycle.fertileWindow.end.toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Phase Timeline */}
      <div className="relative h-2 bg-dw-cream/20 rounded-full overflow-hidden">
        <div
          className="absolute left-0 h-full bg-gradient-to-r from-dw-blush via-dw-sage to-dw-lavender transition-all duration-300"
          style={{
            width: `${(cycleData.dayOfCycle / cycleData.cycleLength) * 100}%`
          }}
        />
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {weekdays.map(day => (
          <div
            key={day}
            className="text-xs font-medium text-dw-text/60 text-center py-2"
          >
            {day}
          </div>
        ))}

        {Array.from({ length: firstDayOfMonth }).map((_, index) => (
          <div key={`empty-${index}`} />
        ))}

        {Array.from({ length: daysInMonth }).map((_, index) => {
          const day = index + 1;
          const date = new Date(
            viewDate.getFullYear(),
            viewDate.getMonth(),
            day
          );
          const info = getDayInfo(day);

          return (
            <div key={day} className="aspect-square p-0.5 relative">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      className="w-full h-full focus:outline-none focus:ring-2 focus:ring-dw-blush/50 rounded-lg shadow-sm"
                      onClick={() => handleDayClick(date)}
                    >
                      <div className={dayClasses(day)}>
                        <span
                          className={cn(
                            "text-sm font-medium",
                            isToday(day) ? "text-dw-text" : "text-dw-text/80"
                          )}
                        >
                          {day}
                        </span>
                        {info.cycleDay && mode === "view" && (
                          <span className="text-[10px] text-dw-text/60 mt-0.5">
                            Day {info.cycleDay}
                          </span>
                        )}
                        {info.phase && mode === "view" && (
                          <div
                            className={cn(
                              "absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full border-[1.5px] border-white shadow-sm",
                              {
                                "bg-dw-period": info.isPeriod,
                                "bg-dw-ovulation": info.isOvulation,
                                "bg-dw-fertile": info.isFertile,
                                "bg-dw-luteal":
                                  info.phase === "Luteal" ||
                                  info.phase === "Follicular"
                              }
                            )}
                          />
                        )}
                      </div>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent
                    side="top"
                    className="bg-white p-2 rounded-lg shadow-lg border border-gray-200"
                  >
                    {mode === "log" ? (
                      <div className="space-y-1">
                        <p className="text-sm font-medium">
                          {isSelectingPeriod
                            ? "Select period end date"
                            : "Click to log period"}
                        </p>
                        {periodStart &&
                          date.getTime() === periodStart.getTime() && (
                            <p className="text-xs text-dw-text/60">
                              Period start date
                            </p>
                          )}
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="font-medium flex items-center gap-2">
                          {info.phase} Phase
                          {info.cycleDay && ` - Day ${info.cycleDay}`}
                        </div>
                        {info.details.map((detail, i) => (
                          <p key={i} className="text-xs text-dw-text/60">
                            {detail}
                          </p>
                        ))}
                        {!info.details.length && info.phase && (
                          <p className="text-xs text-dw-text/60">
                            {info.phase === "Follicular" &&
                              "Your body is preparing for ovulation"}
                            {info.phase === "Luteal" && "Post-ovulation phase"}
                          </p>
                        )}
                        {info.daysUntil !== null && info.daysUntil > 0 && (
                          <p className="text-xs font-medium text-dw-blush">
                            In {info.daysUntil} days
                          </p>
                        )}
                      </div>
                    )}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          );
        })}
      </div>

      {/* Show legend only in view mode */}
      {mode === "view" && (
        <>
          {/* Enhanced Legend with Phase Information */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex flex-col gap-3 bg-dw-period/10 p-4 rounded-xl border border-dw-period/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-dw-period/20 flex items-center justify-center">
                  <Droplets className="h-5 w-5 text-dw-period" />
                </div>
                <div>
                  <p className="text-sm font-medium text-dw-text">
                    Menstrual Phase
                  </p>
                  <p className="text-xs text-dw-text/60">Days 1-5</p>
                </div>
              </div>
              <div className="text-xs space-y-1 text-dw-text/60">
                <p>• Uterine lining sheds</p>
                <p>• May experience cramps</p>
                <p>• Energy levels may be lower</p>
              </div>
            </div>

            <div className="flex flex-col gap-3 bg-dw-ovulation/10 p-4 rounded-xl border border-dw-ovulation/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-dw-ovulation/20 flex items-center justify-center">
                  <Sun className="h-5 w-5 text-dw-ovulation" />
                </div>
                <div>
                  <p className="text-sm font-medium text-dw-text">
                    Ovulation Phase
                  </p>
                  <p className="text-xs text-dw-text/60">~Day 14 (±2 days)</p>
                </div>
              </div>
              <div className="text-xs space-y-1 text-dw-text/60">
                <p>• Peak fertility day</p>
                <p>• Increased energy levels</p>
                <p>• Cervical mucus changes</p>
              </div>
            </div>

            <div className="flex flex-col gap-3 bg-dw-fertile/10 p-4 rounded-xl border border-dw-fertile/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-dw-fertile/20 flex items-center justify-center">
                  <Heart className="h-5 w-5 text-dw-fertile" />
                </div>
                <div>
                  <p className="text-sm font-medium text-dw-text">
                    Fertile Window
                  </p>
                  <p className="text-xs text-dw-text/60">Days 10-15</p>
                </div>
              </div>
              <div className="text-xs space-y-1 text-dw-text/60">
                <p>• High chance of conception</p>
                <p>• Includes days before ovulation</p>
                <p>• Track using BBT & OPK tests</p>
              </div>
            </div>

            <div className="flex flex-col gap-3 bg-dw-luteal/10 p-4 rounded-xl border border-dw-luteal/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-dw-luteal/20 flex items-center justify-center">
                  <Moon className="h-5 w-5 text-dw-luteal" />
                </div>
                <div>
                  <p className="text-sm font-medium text-dw-text">
                    Luteal Phase
                  </p>
                  <p className="text-xs text-dw-text/60">Days 15-28</p>
                </div>
              </div>
              <div className="text-xs space-y-1 text-dw-text/60">
                <p>• Post-ovulation phase</p>
                <p>• Possible PMS symptoms</p>
                <p>• Temperature remains elevated</p>
              </div>
            </div>
          </div>

          {/* Medical Disclaimer */}
          <div className="flex items-start gap-2 text-sm text-dw-text/60 bg-dw-cream/5 p-4 rounded-xl">
            <AlertCircle className="h-4 w-4 text-dw-blush shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p>
                Predictions are based on your average cycle length of{" "}
                {cycleData.cycleLength} days. Cycle variations are normal and
                these predictions are estimates only.
              </p>
              <p className="text-xs">
                Track additional symptoms and use ovulation tests for more
                accuracy. Always consult healthcare providers for medical
                advice.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
