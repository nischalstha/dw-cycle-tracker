"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { addDays, format } from "date-fns"

export function CycleTracker() {
  const [lastPeriodStart, setLastPeriodStart] = useState<Date | null>(null)
  const [cycleLength, setCycleLength] = useState(28)

  const startPeriod = () => {
    setLastPeriodStart(new Date())
  }

  const predictNextPeriod = () => {
    if (lastPeriodStart) {
      return addDays(lastPeriodStart, cycleLength)
    }
    return null
  }

  const nextPeriod = predictNextPeriod()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Tracker</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-medium">Last Period Start</h3>
          <p>{lastPeriodStart ? format(lastPeriodStart, "MMMM d, yyyy") : "Not set"}</p>
        </div>
        <div>
          <h3 className="font-medium">Predicted Next Period</h3>
          <p>{nextPeriod ? format(nextPeriod, "MMMM d, yyyy") : "Not available"}</p>
        </div>
        <Button onClick={startPeriod} className="w-full">
          Start New Period
        </Button>
      </CardContent>
    </Card>
  )
}

