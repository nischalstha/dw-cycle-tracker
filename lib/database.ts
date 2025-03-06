import { supabase, Period, UserSettings, DailyLog } from "./supabase";
import { UserResource } from "@clerk/types";

// User settings functions
export async function getUserSettings(
  userId: string
): Promise<UserSettings | null> {
  const { data, error } = await supabase
    .from("user_settings")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error) {
    console.error("Error fetching user settings:", error);
    return null;
  }

  return data;
}

export async function createOrUpdateUserSettings(
  userId: string,
  settings: Omit<UserSettings, "id" | "user_id" | "created_at" | "updated_at">
): Promise<UserSettings | null> {
  // First check if settings exist
  const existingSettings = await getUserSettings(userId);

  if (existingSettings) {
    // Update existing settings
    const { data, error } = await supabase
      .from("user_settings")
      .update({
        ...settings,
        updated_at: new Date().toISOString()
      })
      .eq("user_id", userId)
      .select()
      .single();

    if (error) {
      console.error("Error updating user settings:", error);
      return null;
    }

    return data;
  } else {
    // Create new settings
    const { data, error } = await supabase
      .from("user_settings")
      .insert({
        user_id: userId,
        ...settings,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating user settings:", error);
      return null;
    }

    return data;
  }
}

// Daily log functions
export async function getDailyLogs(
  userId: string,
  startDate?: Date,
  endDate?: Date
): Promise<DailyLog[]> {
  let query = supabase
    .from("daily_logs")
    .select("*")
    .eq("user_id", userId)
    .order("date", { ascending: false });

  if (startDate) {
    query = query.gte("date", startDate.toISOString().split("T")[0]);
  }

  if (endDate) {
    query = query.lte("date", endDate.toISOString().split("T")[0]);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching daily logs:", error);
    return [];
  }

  return data || [];
}

export async function getDailyLog(
  userId: string,
  date: Date
): Promise<DailyLog | null> {
  const dateString = date.toISOString().split("T")[0];

  const { data, error } = await supabase
    .from("daily_logs")
    .select("*")
    .eq("user_id", userId)
    .eq("date", dateString)
    .single();

  if (error) {
    // If no log found for this date, this is not an error
    if (error.code === "PGRST116") {
      return null;
    }
    console.error("Error fetching daily log:", error);
    return null;
  }

  return data;
}

export async function createOrUpdateDailyLog(
  userId: string,
  date: Date,
  logData: Partial<
    Omit<DailyLog, "id" | "user_id" | "date" | "created_at" | "updated_at">
  >
): Promise<DailyLog | null> {
  const dateString = date.toISOString().split("T")[0];
  const existingLog = await getDailyLog(userId, date);

  if (existingLog) {
    // Update existing log
    const { data, error } = await supabase
      .from("daily_logs")
      .update({
        ...logData,
        updated_at: new Date().toISOString()
      })
      .eq("id", existingLog.id)
      .select()
      .single();

    if (error) {
      console.error("Error updating daily log:", error);
      return null;
    }

    // If flow changed from null/none to a value, this might be a period start
    if (
      (existingLog.flow === null || existingLog.flow === "none") &&
      (logData.flow === "light" ||
        logData.flow === "medium" ||
        logData.flow === "heavy")
    ) {
      await detectAndHandlePeriodStart(userId, date);
    }

    // If flow changed from a value to none, this might be a period end
    if (
      (existingLog.flow === "light" ||
        existingLog.flow === "medium" ||
        existingLog.flow === "heavy") &&
      (logData.flow === "none" || logData.flow === null)
    ) {
      await detectAndHandlePeriodEnd(userId, date);
    }

    return data;
  } else {
    // Create new log
    const { data, error } = await supabase
      .from("daily_logs")
      .insert({
        user_id: userId,
        date: dateString,
        ...logData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating daily log:", error);
      return null;
    }

    // If this is a period flow, it might be a period start
    if (
      logData.flow === "light" ||
      logData.flow === "medium" ||
      logData.flow === "heavy"
    ) {
      await detectAndHandlePeriodStart(userId, date);
    }

    return data;
  }
}

// Period tracking functions
export async function getPeriods(userId: string): Promise<Period[]> {
  const { data, error } = await supabase
    .from("periods")
    .select("*")
    .eq("user_id", userId)
    .order("start_date", { ascending: false });

  if (error) {
    console.error("Error fetching periods:", error);
    return [];
  }

  return data || [];
}

export async function getLastPeriod(userId: string): Promise<Period | null> {
  const { data, error } = await supabase
    .from("periods")
    .select("*")
    .eq("user_id", userId)
    .order("start_date", { ascending: false })
    .limit(1)
    .single();

  if (error) {
    // If no periods found, this will error with 'No rows found'
    if (error.code === "PGRST116") {
      return null;
    }
    console.error("Error fetching last period:", error);
    return null;
  }

  return data;
}

export async function getActivePeriod(userId: string): Promise<Period | null> {
  const { data, error } = await supabase
    .from("periods")
    .select("*")
    .eq("user_id", userId)
    .is("end_date", null)
    .order("start_date", { ascending: false })
    .limit(1)
    .single();

  if (error) {
    // If no active period found, this is not an error
    if (error.code === "PGRST116") {
      return null;
    }
    console.error("Error fetching active period:", error);
    return null;
  }

  return data;
}

export async function startPeriod(
  userId: string,
  startDate: Date,
  periodData: {
    flow: "light" | "medium" | "heavy";
    pain_level?: number;
    mood?: "happy" | "neutral" | "sad";
    symptoms?: string[];
    notes?: string;
  }
): Promise<Period | null> {
  console.log("startPeriod called with:", { userId, startDate, periodData });

  try {
    // Check if there's already an active period
    const activePeriod = await getActivePeriod(userId);
    console.log("Active period check result:", activePeriod);

    if (activePeriod?.id) {
      // End the current period before starting a new one
      console.log("Ending active period before starting new one");
      await endPeriod(
        activePeriod.id,
        new Date(startDate.getTime() - 24 * 60 * 60 * 1000)
      );
    }

    const insertData = {
      user_id: userId,
      start_date: startDate.toISOString(),
      ...periodData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    console.log("Attempting to insert period with data:", insertData);

    // Set auth headers for this request
    const { data, error } = await supabase
      .from("periods")
      .insert(insertData)
      .select()
      .single();

    if (error) {
      console.error("Error starting period:", error);
      console.error("Error details:", {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint
      });

      // If it's an RLS error, try a different approach
      if (error.code === "42501") {
        console.log("Attempting alternative insert approach...");
        const { data: altData, error: altError } = await supabase.rpc(
          "insert_period",
          {
            p_user_id: userId,
            p_start_date: startDate.toISOString(),
            p_flow: periodData.flow,
            p_pain_level: periodData.pain_level,
            p_mood: periodData.mood,
            p_symptoms: periodData.symptoms,
            p_notes: periodData.notes
          }
        );

        if (altError) {
          console.error("Alternative insert also failed:", altError);
          throw altError;
        }

        return altData;
      }

      throw error;
    }

    if (!data) {
      console.error("No data returned from insert operation");
      throw new Error("No data returned from insert operation");
    }

    console.log("Successfully inserted period:", data);
    return data;
  } catch (err) {
    console.error("Error in startPeriod:", err);
    if (err instanceof Error) {
      console.error("Error message:", err.message);
      console.error("Error stack:", err.stack);
    }
    return null;
  }
}

export async function endPeriod(
  periodId: string,
  endDate: Date,
  endData?: {
    pain_level?: number;
    mood?: "happy" | "neutral" | "sad";
    symptoms?: string[];
    notes?: string;
  }
): Promise<Period | null> {
  const updateData: any = {
    end_date: endDate.toISOString(),
    updated_at: new Date().toISOString()
  };

  // Add any end period data if provided
  if (endData) {
    Object.assign(updateData, endData);
  }

  const { data, error } = await supabase
    .from("periods")
    .update(updateData)
    .eq("id", periodId)
    .select()
    .single();

  if (error) {
    console.error("Error ending period:", error);
    return null;
  }

  return data;
}

// Helper function to handle period detection
async function detectAndHandlePeriodStart(
  userId: string,
  date: Date
): Promise<void> {
  // Check if there's already an active period
  const activePeriod = await getActivePeriod(userId);

  if (!activePeriod) {
    // Check if there was a period that ended recently (within 1-2 days)
    const recentPeriods = await getPeriods(userId);
    const recentEndedPeriod = recentPeriods.find(period => {
      if (!period.end_date) return false;

      const endDate = new Date(period.end_date);
      const daysSinceEnd = Math.floor(
        (date.getTime() - endDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      return daysSinceEnd <= 2; // Within 2 days of the previous period ending
    });

    if (recentEndedPeriod?.id) {
      // This is likely a continuation of the previous period, so update its end date
      await supabase
        .from("periods")
        .update({ end_date: null })
        .eq("id", recentEndedPeriod.id);
    } else {
      // Start a new period with default flow
      await startPeriod(userId, date, { flow: "medium" });
    }
  }
}

// Helper function to handle period end
async function detectAndHandlePeriodEnd(
  userId: string,
  date: Date
): Promise<void> {
  // Check if there's an active period
  const activePeriod = await getActivePeriod(userId);

  if (activePeriod?.id) {
    // Check if there have been consecutive days with no flow
    const yesterday = new Date(date);
    yesterday.setDate(yesterday.getDate() - 1);

    const yesterdayLog = await getDailyLog(userId, yesterday);

    // If yesterday also had no flow, end the period as of yesterday
    if (
      yesterdayLog &&
      (yesterdayLog.flow === "none" || yesterdayLog.flow === null)
    ) {
      await endPeriod(activePeriod.id, yesterday);
    }
  }
}

// Smart calculation functions
export async function calculateCycleStats(userId: string): Promise<{
  averageCycleLength: number;
  averagePeriodLength: number;
  predictedNextPeriod: Date | null;
  predictedOvulation: Date | null;
}> {
  // Get all completed periods (with start and end dates)
  const { data: periods, error } = await supabase
    .from("periods")
    .select("*")
    .eq("user_id", userId)
    .not("end_date", "is", null)
    .order("start_date", { ascending: false });

  if (error || !periods || periods.length < 2) {
    // Not enough data to calculate cycle length
    // Return default values or user settings
    const settings = await getUserSettings(userId);
    console.log("Settings:", settings);

    // Get the last period even if we don't have enough historical data
    const lastPeriod = periods?.[0];
    let predictedNextPeriod = null;
    let predictedOvulation = null;

    // If we have at least one period, calculate predictions using default cycle length
    if (lastPeriod) {
      const cycleLength = settings?.cycle_length || 28;
      const lastPeriodStart = new Date(lastPeriod.start_date);
      const today = new Date();

      // Calculate how many cycles have passed
      const daysSinceLastPeriod = Math.round(
        (today.getTime() - lastPeriodStart.getTime()) / (1000 * 60 * 60 * 24)
      );
      const cyclesPassed = Math.floor(daysSinceLastPeriod / cycleLength);

      // Calculate next period date
      predictedNextPeriod = new Date(lastPeriodStart);
      predictedNextPeriod.setDate(
        lastPeriodStart.getDate() + (cyclesPassed + 1) * cycleLength
      );

      // Ensure the predicted date is in the future
      if (predictedNextPeriod <= today) {
        predictedNextPeriod.setDate(
          predictedNextPeriod.getDate() + cycleLength
        );
      }

      // Calculate ovulation (14 days before next period)
      predictedOvulation = new Date(predictedNextPeriod);
      predictedOvulation.setDate(predictedOvulation.getDate() - 14);
    }

    return {
      averageCycleLength: settings?.cycle_length || 28,
      averagePeriodLength: settings?.period_length || 5,
      predictedNextPeriod,
      predictedOvulation
    };
  }

  // Calculate average cycle length (from start date to next start date)
  let totalCycleDays = 0;
  let cycleCount = 0;

  for (let i = 0; i < periods.length - 1; i++) {
    const currentPeriodStart = new Date(periods[i + 1].start_date);
    const nextPeriodStart = new Date(periods[i].start_date);

    const cycleDays = Math.round(
      (nextPeriodStart.getTime() - currentPeriodStart.getTime()) /
        (1000 * 60 * 60 * 24)
    );

    // Only count reasonable cycle lengths (21-45 days)
    if (cycleDays >= 21 && cycleDays <= 45) {
      totalCycleDays += cycleDays;
      cycleCount++;
    }
  }

  // Calculate average period length
  let totalPeriodDays = 0;
  let periodCount = 0;

  for (const period of periods) {
    if (period.end_date) {
      const startDate = new Date(period.start_date);
      const endDate = new Date(period.end_date);

      const periodDays =
        Math.round(
          (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
        ) + 1;

      // Only count reasonable period lengths (2-10 days)
      if (periodDays >= 2 && periodDays <= 10) {
        totalPeriodDays += periodDays;
        periodCount++;
      }
    }
  }

  const averageCycleLength =
    cycleCount > 0 ? Math.round(totalCycleDays / cycleCount) : 28;
  const averagePeriodLength =
    periodCount > 0 ? Math.round(totalPeriodDays / periodCount) : 5;

  // Predict next period and ovulation
  const lastPeriod = periods[0];
  let predictedNextPeriod = null;
  let predictedOvulation = null;

  if (lastPeriod) {
    const lastPeriodStart = new Date(lastPeriod.start_date);
    const today = new Date();

    // Calculate how many cycles have passed and predict next period
    const daysSinceLastPeriod = Math.round(
      (today.getTime() - lastPeriodStart.getTime()) / (1000 * 60 * 60 * 24)
    );
    const cyclesPassed = Math.floor(daysSinceLastPeriod / averageCycleLength);

    // Calculate the next period date
    predictedNextPeriod = new Date(lastPeriodStart);
    predictedNextPeriod.setDate(
      lastPeriodStart.getDate() + (cyclesPassed + 1) * averageCycleLength
    );

    // Double check if predicted date is in the future, if not add another cycle
    if (predictedNextPeriod <= today) {
      predictedNextPeriod.setDate(
        predictedNextPeriod.getDate() + averageCycleLength
      );
    }

    // Predict ovulation (typically 14 days before next period)
    if (predictedNextPeriod) {
      predictedOvulation = new Date(predictedNextPeriod);
      predictedOvulation.setDate(predictedOvulation.getDate() - 14);
    }
  }

  // Update user settings with calculated values
  await createOrUpdateUserSettings(userId, {
    cycle_length: averageCycleLength,
    period_length: averagePeriodLength
  });

  return {
    averageCycleLength,
    averagePeriodLength,
    predictedNextPeriod,
    predictedOvulation
  };
}

// Get period data with calculated statistics
export async function getPeriodStats(userId: string): Promise<{
  periods: Period[];
  currentCycle: {
    dayOfCycle: number;
    totalDays: number;
    isOnPeriod: boolean;
  };
  predictions: {
    nextPeriod: Date | null;
    ovulation: Date | null;
    fertile: {
      start: Date | null;
      end: Date | null;
    };
  };
  averages: {
    cycleLength: number;
    periodLength: number;
  };
}> {
  console.log("getPeriodStats called for userId:", userId);

  try {
    // Get all periods
    console.log("Fetching periods...");
    const periods = await getPeriods(userId);
    console.log("Periods fetched:", periods.length);

    // Get active period
    console.log("Fetching active period...");
    const activePeriod = await getActivePeriod(userId);
    console.log("Active period:", activePeriod ? "found" : "not found");

    // Get last period (completed or active)
    const lastPeriod = periods.length > 0 ? periods[0] : null;
    console.log("Last period:", lastPeriod ? "found" : "not found");

    // Calculate cycle statistics
    console.log("Calculating cycle statistics...");
    const stats = await calculateCycleStats(userId);
    console.log("Cycle statistics calculated:", stats);

    // Calculate current day of cycle
    let dayOfCycle = 1;
    let isOnPeriod = false;

    if (lastPeriod) {
      const lastPeriodStart = new Date(lastPeriod.start_date);
      const today = new Date();

      dayOfCycle =
        Math.floor(
          (today.getTime() - lastPeriodStart.getTime()) / (1000 * 60 * 60 * 24)
        ) + 1;
      isOnPeriod = !!activePeriod;
    }

    // Calculate fertile window (typically 5 days before ovulation and ovulation day)
    let fertileStart = null;
    let fertileEnd = null;

    if (stats.predictedOvulation) {
      fertileStart = new Date(stats.predictedOvulation);
      fertileStart.setDate(fertileStart.getDate() - 5);

      fertileEnd = new Date(stats.predictedOvulation);
    }

    const result = {
      periods,
      currentCycle: {
        dayOfCycle,
        totalDays: stats.averageCycleLength,
        isOnPeriod
      },
      predictions: {
        nextPeriod: stats.predictedNextPeriod,
        ovulation: stats.predictedOvulation,
        fertile: {
          start: fertileStart,
          end: fertileEnd
        }
      },
      averages: {
        cycleLength: stats.averageCycleLength,
        periodLength: stats.averagePeriodLength
      }
    };

    console.log("getPeriodStats returning result:", result);
    return result;
  } catch (error) {
    console.error("Error in getPeriodStats:", error);
    throw error;
  }
}
