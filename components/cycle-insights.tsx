"use client"

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts"

export function CycleInsights() {
  // Example data for cycle length over time
  const cycleData = [
    { month: "Jan", length: 28 },
    { month: "Feb", length: 29 },
    { month: "Mar", length: 27 },
    { month: "Apr", length: 28 },
    { month: "May", length: 30 },
    { month: "Jun", length: 28 },
  ]

  // Example data for symptom frequency
  const symptomData = [
    { name: "Headache", frequency: 8 },
    { name: "Cramps", frequency: 12 },
    { name: "Bloating", frequency: 15 },
    { name: "Fatigue", frequency: 18 },
    { name: "Acne", frequency: 6 },
  ]

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-sm font-medium">Cycle Length Trends</h3>
        <div className="h-[180px] w-full">
          <ChartContainer>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={cycleData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                <YAxis
                  domain={[25, 35]}
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}d`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="length"
                  stroke="#F5A9B8"
                  strokeWidth={2}
                  dot={{ fill: "#F5A9B8", strokeWidth: 2, r: 4 }}
                  activeDot={{ fill: "#F5A9B8", strokeWidth: 2, r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium">Common Symptoms</h3>
        <div className="space-y-2">
          {symptomData.map((symptom) => (
            <div key={symptom.name} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>{symptom.name}</span>
                <span className="text-muted-foreground">{symptom.frequency} days</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full"
                  style={{ width: `${(symptom.frequency / 30) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <ChartTooltip>
        <ChartTooltipContent>
          <div className="text-xs font-medium">{label}</div>
          <div className="text-xs text-muted-foreground">Cycle: {payload[0].value} days</div>
        </ChartTooltipContent>
      </ChartTooltip>
    )
  }

  return null
}

