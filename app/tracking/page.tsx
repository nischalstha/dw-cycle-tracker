"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Droplets,
  Heart,
  Activity,
  Save,
  Smile,
  Frown,
  Meh,
  ThermometerSun,
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  ArrowLeft,
  Loader2
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import Link from "next/link";
import { useCycleData } from "@/hooks/use-cycle-data";
import { useToast } from "@/components/ui/use-toast";

export default function TrackingPage() {
  const { toast } = useToast();
  const { isLoading, error, activePeriod, logPeriodStart, logPeriodEnd } =
    useCycleData();

  const [date, setDate] = useState<Date | null>(null);
  useEffect(() => {
    setDate(new Date());
  }, []);

  const [flow, setFlow] = useState<"light" | "medium" | "heavy" | null>(null);
  const [mood, setMood] = useState<"happy" | "neutral" | "sad" | null>(null);
  const [painLevel, setPainLevel] = useState<number[]>([0]);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [notes, setNotes] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const symptoms = [
    { id: "headache", label: "Headache" },
    { id: "cramps", label: "Cramps" },
    { id: "bloating", label: "Bloating" },
    { id: "fatigue", label: "Fatigue" },
    { id: "acne", label: "Acne" },
    { id: "cravings", label: "Cravings" },
    { id: "insomnia", label: "Insomnia" },
    { id: "nausea", label: "Nausea" }
  ];

  const formatDisplayDate = (date: Date | null) => {
    if (!date) return "";
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric"
    });
  };

  const goToPreviousDay = () => {
    if (!date) return;
    const prevDay = new Date(date);
    prevDay.setDate(prevDay.getDate() - 1);
    setDate(prevDay);
  };

  const goToNextDay = () => {
    if (!date) return;
    const nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);
    setDate(nextDay);
  };

  const isToday = (date: Date | null) => {
    if (!date) return false;
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms(prev =>
      prev.includes(symptom)
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    );
  };

  const handleSave = async () => {
    if (!date) return;
    console.log("handleSave called with:", {
      flow,
      mood,
      painLevel: painLevel[0],
      selectedSymptoms,
      notes,
      date: date.toISOString()
    });

    if (!flow && !activePeriod) {
      console.log("No flow selected, showing error toast");
      toast({
        title: "Please select a flow level",
        description: "Flow level is required to start a period",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      if (activePeriod) {
        // End period
        console.log("Ending period...");
        await logPeriodEnd(date, {
          pain_level: painLevel[0],
          mood: mood || undefined,
          symptoms: selectedSymptoms.length > 0 ? selectedSymptoms : undefined,
          notes: notes.trim() !== "" ? notes : undefined
        });

        toast({
          title: "Period ended",
          description: "Your period has been successfully ended"
        });
      } else {
        // Start period
        if (!flow) return; // This should never happen due to the check above

        console.log("Starting period with data:", {
          flow,
          pain_level: painLevel[0],
          mood: mood || undefined,
          symptoms: selectedSymptoms.length > 0 ? selectedSymptoms : undefined,
          notes: notes.trim() !== "" ? notes : undefined
        });

        const result = await logPeriodStart(date, {
          flow,
          pain_level: painLevel[0],
          mood: mood || undefined,
          symptoms: selectedSymptoms.length > 0 ? selectedSymptoms : undefined,
          notes: notes.trim() !== "" ? notes : undefined
        });

        console.log("Period start result:", result);

        toast({
          title: "Period started",
          description: "Your period has been successfully logged"
        });
      }

      // Reset form
      setFlow(null);
      setMood(null);
      setPainLevel([0]);
      setSelectedSymptoms([]);
      setNotes("");
    } catch (err) {
      console.error("Error saving period data:", err);
      toast({
        title: "Error",
        description: "There was an error saving your data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || !date) {
    return (
      <div className="dw-container max-w-2xl mx-auto flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-dw-blush" />
        <p className="ml-2">Loading your cycle data...</p>
      </div>
    );
  }

  return (
    <div className="dw-container max-w-2xl mx-auto">
      {/* Back Button */}
      <Button
        variant="ghost"
        className="mb-6 -ml-2 text-dw-text/60 hover:text-dw-text"
        asChild
      >
        <Link href="/">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Link>
      </Button>

      <div className="mb-6">
        <h1 className="text-2xl font-medium text-dw-text mb-2">
          {activePeriod ? "End Your Period" : "Start Your Period"}
        </h1>
        <p className="text-dw-text/60">
          {activePeriod
            ? "Log the end of your current period with any symptoms or notes"
            : "Log your period, mood, and symptoms to help us understand your cycle better"}
        </p>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex items-center text-dw-text/60">
          <CalendarIcon className="h-5 w-5 mr-2 text-dw-blush" />
          Select date to log
        </div>

        <div className="flex items-center space-x-2 self-stretch md:self-auto">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full border-dw-gray/30 hover:bg-dw-blush/5"
            onClick={goToPreviousDay}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="rounded-full border-dw-gray/30 hover:bg-dw-blush/5 min-w-[180px] justify-center"
              >
                {isToday(date) ? "Today" : formatDisplayDate(date)}
                <CalendarIcon className="h-4 w-4 ml-2" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="center">
              <Calendar
                mode="single"
                selected={date}
                onSelect={date => date && setDate(date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <Button
            variant="outline"
            size="icon"
            className="rounded-full border-dw-gray/30 hover:bg-dw-blush/5"
            onClick={goToNextDay}
            disabled={isToday(date)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Card className="mb-6 p-6">
        <div className="space-y-6">
          {/* Period Flow - Only show when starting a period */}
          {!activePeriod && (
            <div>
              <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                <Droplets className="h-4 w-4 text-dw-blush" />
                Period Flow
              </h3>
              <p className="text-dw-text/60 text-sm mb-3">
                How heavy is your flow today?
              </p>
              <div className="flex gap-2">
                {[
                  { id: "light", label: "Light" },
                  { id: "medium", label: "Medium" },
                  { id: "heavy", label: "Heavy" }
                ].map(level => (
                  <Button
                    key={level.id}
                    variant="outline"
                    size="sm"
                    className={cn(
                      "flex-1 rounded-xl",
                      flow === level.id
                        ? "bg-dw-blush/10 border-dw-blush text-dw-text"
                        : ""
                    )}
                    onClick={() =>
                      setFlow(level.id as "light" | "medium" | "heavy")
                    }
                  >
                    {level.label}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Mood */}
          <div>
            <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
              <Heart className="h-4 w-4 text-dw-blush" />
              Mood
            </h3>
            <p className="text-dw-text/60 text-sm mb-3">
              How are you feeling emotionally?
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  "flex-1 rounded-xl",
                  mood === "happy"
                    ? "bg-dw-sage/10 border-dw-sage text-dw-text"
                    : ""
                )}
                onClick={() => setMood("happy")}
              >
                <Smile className="h-4 w-4 mr-2" />
                Happy
              </Button>
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  "flex-1 rounded-xl",
                  mood === "neutral"
                    ? "bg-dw-cream/20 border-dw-cream text-dw-text"
                    : ""
                )}
                onClick={() => setMood("neutral")}
              >
                <Meh className="h-4 w-4 mr-2" />
                Neutral
              </Button>
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  "flex-1 rounded-xl",
                  mood === "sad"
                    ? "bg-dw-blush/10 border-dw-blush text-dw-text"
                    : ""
                )}
                onClick={() => setMood("sad")}
              >
                <Frown className="h-4 w-4 mr-2" />
                Sad
              </Button>
            </div>
          </div>

          {/* Pain Level */}
          <div>
            <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
              <Activity className="h-4 w-4 text-dw-blush" />
              Pain Level
            </h3>
            <p className="text-dw-text/60 text-sm mb-3">
              Rate your discomfort level today
            </p>
            <Slider
              value={painLevel}
              min={0}
              max={10}
              step={1}
              onValueChange={setPainLevel}
              className="py-4"
            />
            <div className="flex justify-between text-xs text-dw-text/60">
              <span>None</span>
              <span>Mild</span>
              <span>Moderate</span>
              <span>Severe</span>
            </div>
          </div>

          {/* Symptoms */}
          <div>
            <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
              <ThermometerSun className="h-4 w-4 text-dw-blush" />
              Symptoms
            </h3>
            <p className="text-dw-text/60 text-sm mb-3">
              Select any symptoms you're experiencing
            </p>
            <div className="grid grid-cols-2 gap-2">
              {symptoms.map(symptom => (
                <Button
                  key={symptom.id}
                  variant="outline"
                  size="sm"
                  className={cn(
                    "justify-start rounded-xl",
                    selectedSymptoms.includes(symptom.id)
                      ? "bg-dw-blush/10 border-dw-blush text-dw-text"
                      : ""
                  )}
                  onClick={() => toggleSymptom(symptom.id)}
                >
                  {symptom.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
              Notes
            </h3>
            <textarea
              className="w-full p-3 border border-dw-gray/30 rounded-xl text-sm"
              rows={3}
              placeholder="Add any additional notes here..."
              value={notes}
              onChange={e => setNotes(e.target.value)}
            />
          </div>

          {/* Save Button */}
          <Button
            className="w-full bg-dw-blush hover:bg-dw-blush/90 text-white rounded-xl"
            onClick={handleSave}
            disabled={isSubmitting || (!flow && !activePeriod)}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                {activePeriod ? "End Period" : "Start Period"}
              </>
            )}
          </Button>
        </div>
      </Card>
    </div>
  );
}
