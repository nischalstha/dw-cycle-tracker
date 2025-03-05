"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const data = [
  { month: "Jan", cycleLength: 28 },
  { month: "Feb", cycleLength: 30 },
  { month: "Mar", cycleLength: 29 },
  { month: "Apr", cycleLength: 28 },
  { month: "May", cycleLength: 31 },
  { month: "Jun", cycleLength: 29 },
]

export function InsightsChart() {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Cycle Length Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="cycleLength" stroke="#A67F8E" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

