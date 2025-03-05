"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { differenceInDays } from "date-fns"

type PeriodLog = {
  start: Date
  end: Date
}

export function InsightsAnalytics() {
  const [periodLogs, setPeriodLogs] = useState<PeriodLog[]>([])

  useEffect(() => {
    // In a real app, you'd fetch this data from an API or local storage
    const mockPeriodLogs: PeriodLog[] = [
      { start: new Date(2023, 0, 1), end: new Date(2023, 0, 5) },
      { start: new Date(2023, 0, 28), end: new Date(2023, 1, 2) },
      { start: new Date(2023, 1, 25), end: new Date(2023, 2, 1) },
    ]
    setPeriodLogs(mockPeriodLogs)
  }, [])

  const calculateAverageCycleLength = () => {
    if (periodLogs.length < 2) return "Not enough data"
    let totalDays = 0
    for (let i = 1; i < periodLogs.length; i++) {
      totalDays += differenceInDays(periodLogs[i].start, periodLogs[i - 1].start)
    }
    return Math.round(totalDays / (periodLogs.length - 1))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cycle Insights</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium">Average Cycle Length</h3>
            <p>{calculateAverageCycleLength()} days</p>
          </div>
          <div>
            <h3 className="text-lg font-medium">Cycle History</h3>
            <table className="w-full mt-2">
              <thead>
                <tr>
                  <th className="text-left">Start Date</th>
                  <th className="text-left">End Date</th>
                  <th className="text-left">Duration</th>
                </tr>
              </thead>
              <tbody>
                {periodLogs.map((log, index) => (
                  <tr key={index}>
                    <td>{log.start.toLocaleDateString()}</td>
                    <td>{log.end.toLocaleDateString()}</td>
                    <td>{differenceInDays(log.end, log.start)} days</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

