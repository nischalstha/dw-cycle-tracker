"use client";

import { CycleCalendar } from "@/components/cycle-calendar";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, CalendarRange } from "lucide-react";
import { defaultCycleData } from "@/lib/cycle-data";

export default function CalendarPage() {
  // Use the shared cycle data
  const currentDate = new Date();
  const cycleData = defaultCycleData;

  return (
    <div className="dw-container">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-medium text-dw-text">Calendar</h1>
        </div>
        <div className="bg-dw-cream/30 rounded-full p-1">
          <Tabs defaultValue="month">
            <TabsList className="bg-transparent">
              <TabsTrigger
                value="month"
                className="data-[state=active]:bg-dw-blush data-[state=active]:text-white rounded-full"
              >
                <Calendar className="h-4 w-4 mr-2" />
                Month
              </TabsTrigger>
              <TabsTrigger
                value="cycle"
                className="data-[state=active]:bg-dw-blush data-[state=active]:text-white rounded-full"
              >
                <CalendarRange className="h-4 w-4 mr-2" />
                Cycle
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <Card className="dw-card mb-6">
        <Tabs defaultValue="month" className="w-full">
          <TabsContent value="month" className="mt-0">
            <CycleCalendar currentDate={currentDate} cycleData={cycleData} />
          </TabsContent>
          <TabsContent value="cycle" className="mt-0">
            <div className="p-4 text-center">
              <p className="text-dw-text/60">Cycle view coming soon</p>
            </div>
          </TabsContent>
        </Tabs>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="dw-card">
          <h3 className="text-lg font-medium text-dw-text mb-3">
            Cycle Summary
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-dw-text/60">Current cycle day:</span>
              <span className="font-medium">{cycleData.dayOfCycle}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-dw-text/60">Average cycle length:</span>
              <span className="font-medium">{cycleData.cycleLength} days</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-dw-text/60">Average period length:</span>
              <span className="font-medium">{cycleData.periodLength} days</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-dw-text/60">Next period:</span>
              <span className="font-medium">
                {cycleData.nextPeriod.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric"
                })}
              </span>
            </div>
          </div>
        </Card>

        <Card className="dw-card">
          <h3 className="text-lg font-medium text-dw-text mb-3">Legend</h3>
          <div className="space-y-3">
            <div className="flex items-center">
              <div className="w-5 h-5 rounded-full bg-dw-period/20 border border-dw-period/30 mr-3"></div>
              <span className="text-dw-text/60">Period days</span>
            </div>
            <div className="flex items-center">
              <div className="w-5 h-5 rounded-full bg-dw-ovulation/20 border border-dw-ovulation/30 mr-3"></div>
              <span className="text-dw-text/60">Ovulation</span>
            </div>
            <div className="flex items-center">
              <div className="w-5 h-5 rounded-full bg-dw-fertile/20 border border-dw-fertile/30 mr-3"></div>
              <span className="text-dw-text/60">Fertile window</span>
            </div>
            <div className="flex items-center">
              <div className="w-5 h-5 rounded-full bg-dw-today/20 border border-dw-today/30 mr-3"></div>
              <span className="text-dw-text/60">Today</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
