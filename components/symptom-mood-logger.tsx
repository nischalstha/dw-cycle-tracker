"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

const symptoms = ["Cramps", "Bloating", "Fatigue", "Headache", "Backache"]
const moods = ["Happy", "Sad", "Anxious", "Irritable", "Calm"]

type Log = {
  date: Date
  symptoms: string[]
  mood: string
  notes: string
}

export function SymptomMoodLogger() {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([])
  const [selectedMood, setSelectedMood] = useState<string>("")
  const [notes, setNotes] = useState<string>("")
  const [logs, setLogs] = useState<Log[]>([])

  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms((prev) => (prev.includes(symptom) ? prev.filter((s) => s !== symptom) : [...prev, symptom]))
  }

  const saveLog = () => {
    const newLog: Log = {
      date: new Date(),
      symptoms: selectedSymptoms,
      mood: selectedMood,
      notes: notes,
    }
    setLogs([...logs, newLog])
    setSelectedSymptoms([])
    setSelectedMood("")
    setNotes("")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Log Symptoms & Mood</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium mb-2">Symptoms</h3>
            <div className="flex flex-wrap gap-2">
              {symptoms.map((symptom) => (
                <Button
                  key={symptom}
                  variant={selectedSymptoms.includes(symptom) ? "default" : "outline"}
                  onClick={() => toggleSymptom(symptom)}
                >
                  {symptom}
                </Button>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2">Mood</h3>
            <div className="flex flex-wrap gap-2">
              {moods.map((mood) => (
                <Button
                  key={mood}
                  variant={selectedMood === mood ? "default" : "outline"}
                  onClick={() => setSelectedMood(mood)}
                >
                  {mood}
                </Button>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2">Notes</h3>
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Any additional notes..." />
          </div>
          <Button onClick={saveLog}>Save Log</Button>
        </div>
        <div className="mt-8">
          <h3 className="text-lg font-medium mb-2">Recent Logs</h3>
          {logs.map((log, index) => (
            <div key={index} className="mb-4 p-4 border rounded">
              <p>Date: {log.date.toLocaleDateString()}</p>
              <p>Symptoms: {log.symptoms.join(", ")}</p>
              <p>Mood: {log.mood}</p>
              <p>Notes: {log.notes}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

