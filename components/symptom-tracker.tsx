"use client"

import { useState } from "react"
import { Smile, Frown, Meh, Droplets, Thermometer, Activity } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"

export function SymptomTracker() {
  const [mood, setMood] = useState<string | null>(null)
  const [painLevel, setPainLevel] = useState<number[]>([0])
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([])

  const symptoms = [
    { id: "headache", label: "Headache" },
    { id: "cramps", label: "Cramps" },
    { id: "bloating", label: "Bloating" },
    { id: "fatigue", label: "Fatigue" },
    { id: "acne", label: "Acne" },
    { id: "cravings", label: "Cravings" },
    { id: "insomnia", label: "Insomnia" },
    { id: "nausea", label: "Nausea" },
  ]

  const toggleSymptom = (symptom: string) => {
    if (selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms(selectedSymptoms.filter((s) => s !== symptom))
    } else {
      setSelectedSymptoms([...selectedSymptoms, symptom])
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-sm font-medium flex items-center gap-2">
          <Smile className="h-4 w-4 text-primary" />
          Mood
        </h3>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "flex-1 rounded-xl",
              mood === "happy" ? "bg-sage-light border-sage text-secondary-foreground" : "",
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
              mood === "neutral" ? "bg-lavender-light border-lavender text-accent-foreground" : "",
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
              mood === "sad" ? "bg-blush-light border-blush text-primary-foreground" : "",
            )}
            onClick={() => setMood("sad")}
          >
            <Frown className="h-4 w-4 mr-2" />
            Sad
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium flex items-center gap-2">
          <Activity className="h-4 w-4 text-primary" />
          Pain Level
        </h3>
        <Slider value={painLevel} min={0} max={10} step={1} onValueChange={setPainLevel} className="py-4" />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>None</span>
          <span>Mild</span>
          <span>Moderate</span>
          <span>Severe</span>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium flex items-center gap-2">
          <Thermometer className="h-4 w-4 text-primary" />
          Symptoms
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {symptoms.map((symptom) => (
            <Button
              key={symptom.id}
              variant="outline"
              size="sm"
              className={cn(
                "justify-start rounded-xl",
                selectedSymptoms.includes(symptom.id) ? "bg-blush-light border-blush text-primary-foreground" : "",
              )}
              onClick={() => toggleSymptom(symptom.id)}
            >
              {symptom.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium flex items-center gap-2">
          <Droplets className="h-4 w-4 text-primary" />
          Flow
        </h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1 rounded-xl">
            Light
          </Button>
          <Button variant="outline" size="sm" className="flex-1 rounded-xl">
            Medium
          </Button>
          <Button variant="outline" size="sm" className="flex-1 rounded-xl">
            Heavy
          </Button>
        </div>
      </div>

      <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl">
        Save Today's Data
      </Button>
    </div>
  )
}

