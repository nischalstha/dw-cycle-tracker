"use client"

import type React from "react"

import { useState } from "react"
import { CalendarDays, Droplets, Heart, Moon, Sun, Thermometer, BarChart3 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CycleCalendar } from "@/components/cycle-calendar"
import { CyclePhaseIndicator } from "@/components/cycle-phase-indicator"
import { SymptomTracker } from "@/components/symptom-tracker"
import { CycleInsights } from "@/components/cycle-insights"

export function Dashboard() {
  const [currentDate] = useState(new Date())

  // Example cycle data
  const cycleData = {
    currentPhase: "Follicular",
    dayOfCycle: 8,
    cycleLength: 28,
    periodLength: 5,
    nextPeriod: new Date(currentDate.getTime() + 20 * 24 * 60 * 60 * 1000),
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-medium">Welcome back, Sarah</h1>
        <p className="text-muted-foreground mt-1">Track your cycle and discover insights about your body</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <CalendarDays size={18} className="text-primary" />
              Cycle Overview
            </CardTitle>
            <CardDescription>Track your cycle and upcoming events</CardDescription>
          </CardHeader>
          <CardContent>
            <CycleCalendar currentDate={currentDate} cycleData={cycleData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Heart size={18} className="text-primary" />
              Current Phase
            </CardTitle>
            <CardDescription>Day {cycleData.dayOfCycle} of your cycle</CardDescription>
          </CardHeader>
          <CardContent>
            <CyclePhaseIndicator
              phase={cycleData.currentPhase}
              dayOfCycle={cycleData.dayOfCycle}
              cycleLength={cycleData.cycleLength}
            />

            <div className="mt-4 space-y-3">
              <PhaseInfo icon={<Sun size={16} className="text-secondary" />} label="Energy" value="Increasing" />
              <PhaseInfo icon={<Moon size={16} className="text-primary" />} label="Mood" value="Stable" />
              <PhaseInfo icon={<Thermometer size={16} className="text-primary" />} label="Temperature" value="Rising" />
              <PhaseInfo
                icon={<Droplets size={16} className="text-secondary" />}
                label="Fertility"
                value="Increasing"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Heart size={18} className="text-primary" />
              Today's Tracking
            </CardTitle>
            <CardDescription>Log your symptoms and mood</CardDescription>
          </CardHeader>
          <CardContent>
            <SymptomTracker />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart3 size={18} className="text-primary" />
              Cycle Insights
            </CardTitle>
            <CardDescription>Patterns and trends from your data</CardDescription>
          </CardHeader>
          <CardContent>
            <CycleInsights />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

interface PhaseInfoProps {
  icon: React.ReactNode
  label: string
  value: string
}

function PhaseInfo({ icon, label, value }: PhaseInfoProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
      <span className="text-sm font-medium">{value}</span>
    </div>
  )
}

