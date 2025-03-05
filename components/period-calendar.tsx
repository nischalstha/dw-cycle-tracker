"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { isWithinInterval } from "date-fns"

type PeriodLog = {
  start: Date
  end: Date
}

export function PeriodCalendar() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [periodLogs, setPeriodLogs] = useState<PeriodLog[]>([])
  const [isLoggingPeriod, setIsLoggingPeriod] = useState(false)
  const [currentLog, setCurrentLog] = useState<Partial<PeriodLog>>({})

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return
    setSelectedDate(date)

    if (isLoggingPeriod) {
      if (!currentLog.start) {
        setCurrentLog({ start: date })
      } else if (date >= currentLog.start) {
        const newLog = { start: currentLog.start, end: date }
        setPeriodLogs([...periodLogs, newLog as PeriodLog])
        setCurrentLog({})
        setIsLoggingPeriod(false)
      }
    }
  }

  const startLoggingPeriod = () => {
    setIsLoggingPeriod(true)
    setCurrentLog({})
  }

  const isPeriodDay = (date: Date) => {
    return periodLogs.some((log) => isWithinInterval(date, { start: log.start, end: log.end }))
  }

  return (
    <div>
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={handleDateSelect}
        className="rounded-md border"
        modifiers={{ period: isPeriodDay }}
        modifiersStyles={{
          period: { backgroundColor: "#A67F8E", color: "white" },
        }}
      />
      <div className="mt-4 text-center">
        <Button
          onClick={startLoggingPeriod}
          disabled={isLoggingPeriod}
          className="bg-dw-accent text-white hover:bg-dw-accent/90"
        >
          {isLoggingPeriod ? "Select end date" : "Log new period"}
        </Button>
      </div>
    </div>
  )
}

