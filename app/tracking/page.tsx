"use client";

import { useState } from "react";
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
  ArrowLeft
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

export default function TrackingPage() {
  const [date, setDate] = useState<Date>(new Date());
  const [flow, setFlow] = useState<string | null>(null);
  const [mood, setMood] = useState<string | null>(null);
  const [painLevel, setPainLevel] = useState<number[]>([0]);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);

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

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric"
    });
  };

  const goToPreviousDay = () => {
    const prevDay = new Date(date);
    prevDay.setDate(prevDay.getDate() - 1);
    setDate(prevDay);
  };

  const goToNextDay = () => {
    const nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);
    setDate(nextDay);
  };

  const isToday = (date: Date) => {
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

  const handleSave = () => {
    // TODO: Implement save functionality
    console.log({
      date,
      flow,
      mood,
      painLevel: painLevel[0],
      symptoms: selectedSymptoms
    });
  };

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
          Track Your Cycle
        </h1>
        <p className="text-dw-text/60">
          Log your period, mood, and symptoms to help us understand your cycle
          better.
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
                {isToday(date) ? "Today" : formatDate(date)}
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
          {/* Period Flow */}
          <div>
            <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
              <Droplets className="h-4 w-4 text-dw-blush" />
              Period Flow
            </h3>
            <p className="text-dw-text/60 text-sm mb-3">
              How heavy is your flow today?
            </p>
            <div className="flex gap-2">
              {["None", "Light", "Medium", "Heavy"].map(level => (
                <Button
                  key={level}
                  variant="outline"
                  size="sm"
                  className={cn(
                    "flex-1 rounded-xl",
                    flow === level
                      ? "bg-dw-blush/10 border-dw-blush text-dw-text"
                      : ""
                  )}
                  onClick={() => setFlow(level)}
                >
                  {level}
                </Button>
              ))}
            </div>
          </div>

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

          {/* Save Button */}
          <Button
            className="w-full bg-dw-blush hover:bg-dw-blush/90 text-white rounded-xl"
            onClick={handleSave}
          >
            <Save className="h-4 w-4 mr-2" />
            Save Entry
          </Button>
        </div>
      </Card>
    </div>
  );
}
