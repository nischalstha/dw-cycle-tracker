import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import {
  getUserSettings,
  createOrUpdateUserSettings,
  getPeriods,
  getLastPeriod,
  getActivePeriod,
  startPeriod,
  endPeriod,
  getPeriodStats
} from "@/lib/database";
import { Period } from "@/lib/supabase";

export function useCycleData() {
  const { user, isLoaded: isUserLoaded } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // User settings
  const [cycleLength, setCycleLength] = useState(28);
  const [periodLength, setPeriodLength] = useState(5);

  // Period data
  const [periods, setPeriods] = useState<Period[]>([]);
  const [lastPeriod, setLastPeriod] = useState<Period | null>(null);
  const [activePeriod, setActivePeriod] = useState<Period | null>(null);
  const [dayOfCycle, setDayOfCycle] = useState(1);

  // Calculated dates
  const [nextPeriodDate, setNextPeriodDate] = useState<Date | null>(null);
  const [ovulationDate, setOvulationDate] = useState<Date | null>(null);
  const [fertileWindow, setFertileWindow] = useState<{
    start: Date | null;
    end: Date | null;
  }>({
    start: null,
    end: null
  });

  // Load user data
  useEffect(() => {
    async function loadUserData() {
      if (!isUserLoaded || !user || !user.id) {
        console.log("User not loaded or not available", {
          isUserLoaded,
          hasUser: !!user,
          hasUserId: !!user?.id
        });
        return;
      }

      const userId = user.id;
      console.log("Loading user data...", userId);
      setIsLoading(true);
      setError(null);

      try {
        // Get all period stats in one call
        console.log("Fetching period stats...");
        const stats = await getPeriodStats(userId);
        console.log("Full period stats:", JSON.stringify(stats, null, 2));

        // Update state with all the data
        setPeriods(stats.periods);
        setDayOfCycle(stats.currentCycle.dayOfCycle);
        setCycleLength(stats.averages.cycleLength);
        setPeriodLength(stats.averages.periodLength);
        setNextPeriodDate(stats.predictions.nextPeriod);
        setOvulationDate(stats.predictions.ovulation);
        setFertileWindow({
          start: stats.predictions.fertile.start,
          end: stats.predictions.fertile.end
        });

        console.log("Updated state with stats:", {
          dayOfCycle: stats.currentCycle.dayOfCycle,
          cycleLength: stats.averages.cycleLength,
          periodLength: stats.averages.periodLength,
          nextPeriodDate: stats.predictions.nextPeriod,
          ovulationDate: stats.predictions.ovulation
        });

        // Get active period
        console.log("Fetching active period...");
        const activePeriodData = await getActivePeriod(userId);
        console.log("Active period data:", activePeriodData);
        setActivePeriod(activePeriodData);

        // Get last period
        console.log("Fetching last period...");
        const lastPeriodData = await getLastPeriod(userId);
        console.log("Last period data:", lastPeriodData);
        setLastPeriod(lastPeriodData);

        console.log("All data loaded successfully");
      } catch (err) {
        console.error("Error loading user data:", err);
        setError("Failed to load your cycle data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }

    loadUserData();
  }, [isUserLoaded, user]);

  // Function to start a new period
  const logPeriodStart = async (
    date: Date = new Date(),
    periodData: {
      flow: "light" | "medium" | "heavy";
      pain_level?: number;
      mood?: "happy" | "neutral" | "sad";
      symptoms?: string[];
      notes?: string;
    }
  ) => {
    if (!user) return null;

    try {
      const newPeriod = await startPeriod(user.id, date, periodData);
      if (newPeriod) {
        // Update local state
        setPeriods(prev => [newPeriod, ...prev]);
        setLastPeriod(newPeriod);
        setActivePeriod(newPeriod);

        // Reset day of cycle
        setDayOfCycle(1);

        // Recalculate stats
        const stats = await getPeriodStats(user.id);
        setCycleLength(stats.averages.cycleLength);
        setPeriodLength(stats.averages.periodLength);
        setNextPeriodDate(stats.predictions.nextPeriod);
        setOvulationDate(stats.predictions.ovulation);
        setFertileWindow({
          start: stats.predictions.fertile.start,
          end: stats.predictions.fertile.end
        });

        return newPeriod;
      }
    } catch (err) {
      console.error("Error starting period:", err);
      setError("Failed to start period. Please try again.");
      return null;
    }
  };

  // Function to end the current period
  const logPeriodEnd = async (
    date: Date = new Date(),
    endData?: {
      pain_level?: number;
      mood?: "happy" | "neutral" | "sad";
      symptoms?: string[];
      notes?: string;
    }
  ) => {
    if (!user || !activePeriod) return null;

    try {
      const updatedPeriod = await endPeriod(activePeriod.id, date, endData);
      if (updatedPeriod) {
        // Update local state
        setPeriods(prev =>
          prev.map(p => (p.id === updatedPeriod.id ? updatedPeriod : p))
        );
        setActivePeriod(null);

        // Recalculate stats
        const stats = await getPeriodStats(user.id);
        setCycleLength(stats.averages.cycleLength);
        setPeriodLength(stats.averages.periodLength);

        return updatedPeriod;
      }
    } catch (err) {
      console.error("Error ending period:", err);
      setError("Failed to end period. Please try again.");
      return null;
    }
  };

  // Function to update user settings
  const updateSettings = async (
    newCycleLength: number,
    newPeriodLength: number
  ) => {
    if (!user) return null;

    try {
      const updatedSettings = await createOrUpdateUserSettings(user.id, {
        cycle_length: newCycleLength,
        period_length: newPeriodLength
      });

      if (updatedSettings) {
        // Update local state
        setCycleLength(updatedSettings.cycle_length);
        setPeriodLength(updatedSettings.period_length);

        // Recalculate dates if we have a last period
        if (lastPeriod) {
          const lastPeriodStartDate = new Date(lastPeriod.start_date);

          // Update next period date
          const nextPeriod = new Date(lastPeriodStartDate);
          nextPeriod.setDate(
            nextPeriod.getDate() + updatedSettings.cycle_length
          );
          setNextPeriodDate(nextPeriod);

          // Update ovulation date
          const ovulation = new Date(nextPeriod);
          ovulation.setDate(ovulation.getDate() - 14);
          setOvulationDate(ovulation);

          // Update fertile window
          const fertileStart = new Date(ovulation);
          fertileStart.setDate(fertileStart.getDate() - 5);
          setFertileWindow({
            start: fertileStart,
            end: ovulation
          });
        }

        return updatedSettings;
      }
    } catch (err) {
      console.error("Error updating settings:", err);
      setError("Failed to update settings. Please try again.");
      return null;
    }
  };

  // Get the current phase of the cycle
  const getCurrentPhase = () => {
    if (!lastPeriod) return "unknown";

    if (activePeriod) {
      return "menstrual";
    }

    // Follicular phase (after period ends until ovulation)
    if (dayOfCycle > periodLength && dayOfCycle < cycleLength - 14) {
      return "follicular";
    }

    // Ovulation phase (typically around day 14 before next period)
    if (dayOfCycle >= cycleLength - 14 && dayOfCycle <= cycleLength - 12) {
      return "ovulation";
    }

    // Luteal phase (after ovulation until next period)
    if (dayOfCycle > cycleLength - 12) {
      return "luteal";
    }

    return "unknown";
  };

  return {
    isLoading,
    error,
    // User settings
    cycleLength,
    periodLength,
    updateSettings,
    // Period data
    periods,
    lastPeriod,
    activePeriod,
    dayOfCycle,
    // Calculated dates
    nextPeriodDate,
    ovulationDate,
    fertileWindow,
    // Current phase
    currentPhase: getCurrentPhase(),
    // Actions
    logPeriodStart,
    logPeriodEnd
  };
}
