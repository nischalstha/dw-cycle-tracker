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
  Eye,
  Clock
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
  const [isSelectingPeriod, setIsSelectingPeriod] = useState(false);
  const [periodStart, setPeriodStart] = useState<Date | null>(null);

  // Normalize dates by setting hours to 0 for consistent comparison
  const normalizeDate = (date: Date): Date => {
    const newDate = new Date(date);
    newDate.setHours(0, 0, 0, 0);
    return newDate;
  };

  // Calculate a single cycle's information with normalized dates
  const calculateCycle = (startDate: Date): CycleInfo => {
    // Normalize the input date
    const normalizedStartDate = normalizeDate(startDate);

    // Calculate period end (period start + period length - 1)
    const periodEnd = new Date(normalizedStartDate);
    periodEnd.setDate(periodEnd.getDate() + cycleData.periodLength - 1);

    // Calculate ovulation (typically cycle length - 14)
    const ovulation = new Date(normalizedStartDate);
    ovulation.setDate(ovulation.getDate() + cycleData.cycleLength - 14);

    // Calculate fertile window (typically 5 days before ovulation + ovulation day)
    const fertileStart = new Date(ovulation);
    fertileStart.setDate(fertileStart.getDate() - 5);

    const fertileEnd = new Date(ovulation);
    fertileEnd.setDate(fertileEnd.getDate() + 1);

    // Calculate next period (period start + cycle length)
    const nextPeriod = new Date(normalizedStartDate);
    nextPeriod.setDate(nextPeriod.getDate() + cycleData.cycleLength);

    return {
      periodStart: normalizedStartDate,
      periodEnd,
      ovulation,
      fertileWindow: {
        start: fertileStart,
        end: fertileEnd
      },
      nextPeriod
    };
  };

  // Calculate current cycle with normalized dates
  const currentCycle = calculateCycle(
    normalizeDate(cycleData.lastPeriod.start)
  );

  // Calculate the current day of cycle consistently
  const getCurrentCycleDay = () => {
    const today = normalizeDate(new Date());
    const cycleStartDate = normalizeDate(currentCycle.periodStart);

    // If today is before the cycle start, return 0 (not started)
    if (today < cycleStartDate) {
      return 0;
    }

    // Calculate days since cycle start (add 1 because day 1 is the start date)
    const diffTime = today.getTime() - cycleStartDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;

    // If we're in a new cycle, calculate based on cycle length
    if (diffDays > cycleData.cycleLength) {
      // Calculate how many complete cycles have passed
      const cyclesPassed = Math.floor(diffDays / cycleData.cycleLength);
      // Calculate the day in the current cycle
      const dayInCurrentCycle = diffDays - cyclesPassed * cycleData.cycleLength;
      return dayInCurrentCycle === 0
        ? cycleData.cycleLength
        : dayInCurrentCycle;
    }

    return diffDays;
  };

  // Use the calculated cycle day for consistency
  const currentCycleDay = getCurrentCycleDay();

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

  // Get information about a specific day
  const getDayInfo = (day: number) => {
    // Create date object for this day and normalize it
    const date = normalizeDate(
      new Date(viewDate.getFullYear(), viewDate.getMonth(), day)
    );
    const today = normalizeDate(new Date());

    // Calculate cycle day for this specific date
    const getCycleDayForDate = (date: Date) => {
      const normalizedDate = normalizeDate(date);
      const cycleStartDate = normalizeDate(currentCycle.periodStart);

      // If date is before cycle start, it's not in this cycle
      if (normalizedDate < cycleStartDate) {
        return null;
      }

      // Calculate days since cycle start using UTC to avoid timezone issues
      const utcDate = Date.UTC(
        normalizedDate.getFullYear(),
        normalizedDate.getMonth(),
        normalizedDate.getDate()
      );
      const utcStartDate = Date.UTC(
        cycleStartDate.getFullYear(),
        cycleStartDate.getMonth(),
        cycleStartDate.getDate()
      );

      // Calculate difference in days (using milliseconds)
      const diffTime = utcDate - utcStartDate;
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;

      // If we're in a new cycle, calculate based on cycle length
      if (diffDays > cycleData.cycleLength) {
        // For predicted future cycles
        const cyclesPassed = Math.floor((diffDays - 1) / cycleData.cycleLength);
        const dayInCurrentCycle =
          diffDays - cyclesPassed * cycleData.cycleLength;
        return dayInCurrentCycle === 0
          ? cycleData.cycleLength
          : dayInCurrentCycle;
      }

      return diffDays;
    };

    // Get the cycle day for this date
    const cycleDay = getCycleDayForDate(date);

    // Initialize info object
    let info = {
      phase: null as string | null,
      isPeriod: false,
      isOvulation: false,
      isFertile: false,
      isPrediction: date > today,
      cycleDay: cycleDay,
      daysUntil: Math.ceil(
        (date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
      ),
      details: [] as string[]
    };

    // Find which cycle this date belongs to
    let cycle = null;

    // Check if date is in current cycle
    if (
      date >= normalizeDate(currentCycle.periodStart) &&
      date < normalizeDate(currentCycle.nextPeriod)
    ) {
      cycle = currentCycle;
    }
    // Check if date is in next cycle
    else if (date >= normalizeDate(currentCycle.nextPeriod)) {
      // Calculate next cycle start
      const nextCycleStart = normalizeDate(currentCycle.nextPeriod);
      cycle = calculateCycle(nextCycleStart);
      info.isPrediction = true;
    }

    if (!cycle) return info;

    // Check if date is in period
    if (
      date >= normalizeDate(cycle.periodStart) &&
      date <= normalizeDate(cycle.periodEnd)
    ) {
      info.phase = "Menstrual";
      info.isPeriod = true;

      // Calculate exact period day using UTC
      const utcDate = Date.UTC(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
      );
      const utcStartDate = Date.UTC(
        cycle.periodStart.getFullYear(),
        cycle.periodStart.getMonth(),
        cycle.periodStart.getDate()
      );
      const periodDayDiff =
        Math.floor((utcDate - utcStartDate) / (1000 * 60 * 60 * 24)) + 1;

      info.details.push(
        `Period day ${periodDayDiff} of ${cycleData.periodLength}`
      );
    }
    // Check if date is ovulation
    else if (isSameDay(date, normalizeDate(cycle.ovulation))) {
      info.phase = "Ovulation";
      info.isOvulation = true;
      info.details.push("Peak fertility day");
    }
    // Check if date is in fertile window
    else if (
      date >= normalizeDate(cycle.fertileWindow.start) &&
      date <= normalizeDate(cycle.fertileWindow.end)
    ) {
      info.phase = "Fertile";
      info.isFertile = true;
      info.details.push("High chance of conception");
    }
    // Check if date is in follicular phase (after period, before fertile window)
    else if (
      date > normalizeDate(cycle.periodEnd) &&
      date < normalizeDate(cycle.fertileWindow.start)
    ) {
      info.phase = "Follicular";
    }
    // Check if date is in luteal phase (after ovulation, before next period)
    else if (
      date > normalizeDate(cycle.ovulation) &&
      date < normalizeDate(cycle.nextPeriod)
    ) {
      info.phase = "Luteal";
    }

    // Add date information to details for debugging
    if (mode === "view" && info.cycleDay) {
      // Calculate days since cycle start using UTC
      const utcDate = Date.UTC(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
      );
      const utcStartDate = Date.UTC(
        cycle.periodStart.getFullYear(),
        cycle.periodStart.getMonth(),
        cycle.periodStart.getDate()
      );
      const daysSinceCycleStart =
        Math.floor((utcDate - utcStartDate) / (1000 * 60 * 60 * 24)) + 1;

      info.details.push(`Days since cycle start: ${daysSinceCycleStart}`);
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
      setIsSelectingPeriod(true);
    } else if (periodStart) {
      // Finish selecting period
      if (date >= periodStart) {
        // Here you would typically save the period data
        console.log("Period logged:", {
          start: periodStart,
          end: date
        });
      } else {
        // If end date is before start date, swap them
        setPeriodStart(date);
      }
      setIsSelectingPeriod(false);
    }
  };

  // Day classes function to determine styling
  const dayClasses = (day: number) => {
    const date = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    const info = getDayInfo(day);

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
        "bg-dw-luteal/40":
          info.isPrediction &&
          (info.phase === "Luteal" || info.phase === "Follicular"),
        // Add styling for days without specific phase info
        "bg-gradient-to-br from-gray-50 to-gray-100/30 border border-gray-100/50 shadow-sm":
          !info.phase
      }
    );
  };

  return (
    <div className="space-y-4">
      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium text-dw-text">
          {viewDate.toLocaleDateString("en-US", {
            month: "long",
            year: "numeric"
          })}
        </h2>
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="icon"
              onClick={prevMonth}
              className="h-9 w-9 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={nextMonth}
              className="h-9 w-9 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Visual Cycle Timeline */}
      {mode === "view" && (
        <div className="bg-gradient-to-br from-white via-teal-50/20 to-teal-50/30 rounded-lg p-4 border border-dw-cream/20 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-medium text-dw-text">
              Cycle Overview
            </h3>
            <span className="text-sm font-medium text-dw-text">
              Day {currentCycleDay} of {cycleData.cycleLength}
            </span>
          </div>

          {/* Key Dates - Simplified */}
          <div className="flex justify-between items-center text-sm px-4">
            <div className="flex flex-col">
              <span className="text-dw-text/60 mb-1">Period</span>
              <div className="flex items-center gap-1.5 text-dw-period font-medium">
                <Droplets className="h-4 w-4" />
                <span>
                  {currentCycle.periodStart.toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric"
                  })}{" "}
                  -{" "}
                  {currentCycle.periodEnd.toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric"
                  })}
                </span>
              </div>
            </div>

            <div className="flex flex-col">
              <span className="text-dw-text/60 mb-1">Ovulation</span>
              <div className="flex items-center gap-1.5 text-dw-ovulation font-medium">
                <Sun className="h-4 w-4" />
                <span>
                  {currentCycle.ovulation.toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric"
                  })}
                </span>
              </div>
            </div>

            <div className="flex flex-col">
              <span className="text-dw-text/60 mb-1">Next Period</span>
              <div className="flex items-center gap-1.5 text-dw-period font-medium">
                <Calendar className="h-4 w-4" />
                <span>
                  {currentCycle.nextPeriod.toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric"
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Calendar Days Header */}
      <div className="grid grid-cols-7 text-center mb-1">
        {["S", "M", "T", "W", "T", "F", "S"].map(day => (
          <div key={day} className="text-sm text-dw-text/60 font-medium">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid - With proper styling for real vs predicted dates */}
      <div className="grid grid-cols-7 gap-1">
        {/* Day labels */}
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
          <div
            key={day}
            className="text-center text-xs font-medium text-dw-text/60 py-1"
          >
            {day}
          </div>
        ))}

        {/* Empty cells for days before the first day of the month */}
        {Array.from({ length: firstDayOfMonth }).map((_, i) => (
          <div key={`empty-start-${i}`} className="p-1" />
        ))}

        {/* Calendar days */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const date = new Date(
            viewDate.getFullYear(),
            viewDate.getMonth(),
            day
          );
          const info = getDayInfo(day);

          return (
            <TooltipProvider key={`day-${day}`} delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={() => handleDayClick(date)}
                    className={cn(
                      "relative p-1 w-full aspect-square rounded-md transition-all duration-200 hover:bg-opacity-80 hover:shadow-sm hover:scale-105"
                    )}
                  >
                    <div className={dayClasses(day)}>
                      {/* Calendar date number with enhanced styling */}
                      <span
                        className={cn(
                          "text-sm font-medium",
                          isToday(day) ? "text-dw-text" : "text-dw-text/80",
                          // Add a subtle highlight effect to the date number
                          !info.phase &&
                            "bg-white/70 px-1.5 py-0.5 rounded-full"
                        )}
                      >
                        {day}
                      </span>

                      {/* Add a decorative dot for days without phase info */}
                      {!info.phase && (
                        <div className="w-1 h-1 rounded-full bg-gray-200 mt-1"></div>
                      )}

                      {/* Rest of the existing elements */}
                      {info.cycleDay && mode === "view" && (
                        <span className="text-xs text-dw-text/60 mt-0.5">
                          Day {info.cycleDay}
                        </span>
                      )}

                      {/* Visual Indicators for phase */}
                      {info.phase && mode === "view" && (
                        <div
                          className={cn(
                            "absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full border-[1.5px] border-white shadow-sm",
                            {
                              "bg-dw-period":
                                !info.isPrediction && info.isPeriod,
                              "bg-dw-ovulation":
                                !info.isPrediction && info.isOvulation,
                              "bg-dw-fertile":
                                !info.isPrediction && info.isFertile,
                              "bg-dw-luteal":
                                !info.isPrediction &&
                                (info.phase === "Luteal" ||
                                  info.phase === "Follicular"),
                              "bg-dw-period/40":
                                info.isPrediction && info.isPeriod,
                              "bg-dw-ovulation/40":
                                info.isPrediction && info.isOvulation,
                              "bg-dw-fertile/40":
                                info.isPrediction && info.isFertile,
                              "bg-dw-luteal/40":
                                info.isPrediction &&
                                (info.phase === "Luteal" ||
                                  info.phase === "Follicular")
                            }
                          )}
                        />
                      )}

                      {/* Prediction indicator */}
                      {info.isPrediction && info.phase && mode === "view" && (
                        <div className="absolute bottom-0.5 right-0.5">
                          <Clock className="h-2.5 w-2.5 text-dw-text/40" />
                        </div>
                      )}
                    </div>
                  </button>
                </TooltipTrigger>
                <TooltipContent
                  side="top"
                  className="bg-white p-3 rounded-lg shadow-lg border border-gray-200 max-w-[250px] z-50"
                  sideOffset={5}
                >
                  <div className="space-y-2">
                    <div className="text-sm font-medium flex items-center gap-2">
                      {info.phase && (
                        <>
                          {info.isPeriod && (
                            <Droplets className="h-4 w-4 text-dw-period" />
                          )}
                          {info.isOvulation && (
                            <Sun className="h-4 w-4 text-dw-ovulation" />
                          )}
                          {info.isFertile && !info.isOvulation && (
                            <Heart className="h-4 w-4 text-dw-fertile" />
                          )}
                          {!info.isPeriod && !info.isFertile && (
                            <Moon className="h-4 w-4 text-dw-luteal" />
                          )}
                        </>
                      )}
                      {info.phase} Phase
                      {info.isPrediction && " (Predicted)"}
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
                        {info.isPeriod && "Menstruation phase"}
                        {info.isOvulation && "Peak fertility day"}
                        {info.isFertile &&
                          !info.isOvulation &&
                          "High chance of conception"}
                      </p>
                    )}
                    {info.daysUntil !== null && info.daysUntil > 0 && (
                      <p className="text-xs font-medium text-dw-blush">
                        In {info.daysUntil} days
                      </p>
                    )}
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        })}

        {/* Empty cells for days after the last day of the month */}
        {Array.from({ length: 42 - daysInMonth - firstDayOfMonth }).map(
          (_, i) => (
            <div key={`empty-end-${i}`} className="p-1" />
          )
        )}
      </div>

      {/* Legend with distinction between actual and predicted */}
      {mode === "view" && (
        <div className="flex flex-wrap gap-3 mt-3">
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-dw-period/20">
            <Droplets className="h-4 w-4 text-dw-period" />
            <span className="text-sm">Period</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-dw-ovulation/20">
            <Sun className="h-4 w-4 text-dw-ovulation" />
            <span className="text-sm">Ovulation</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-dw-fertile/20">
            <Heart className="h-4 w-4 text-dw-fertile" />
            <span className="text-sm">Fertile</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-dw-luteal/10">
            <Moon className="h-4 w-4 text-dw-luteal" />
            <span className="text-sm">Luteal</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-dw-cream/10">
            <Clock className="h-4 w-4 text-dw-text/60" />
            <span className="text-sm">Predicted</span>
          </div>
        </div>
      )}
    </div>
  );
}
