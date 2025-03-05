import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, Calendar, LineChart } from "lucide-react";

export default function InsightsPage() {
  return (
    <div className="dw-container">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-medium text-dw-text">Insights</h1>
        <div className="bg-dw-cream/30 rounded-full p-1">
          <Tabs defaultValue="overview">
            <TabsList className="bg-transparent">
              <TabsTrigger
                value="overview"
                className="data-[state=active]:bg-dw-blush data-[state=active]:text-white rounded-full"
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="cycles"
                className="data-[state=active]:bg-dw-blush data-[state=active]:text-white rounded-full"
              >
                <Calendar className="h-4 w-4 mr-2" />
                Cycles
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsContent value="overview" className="mt-0 space-y-6">
          <Card className="dw-card">
            <h2 className="text-lg font-medium text-dw-text mb-4">
              Cycle Summary
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-dw-blush/10 rounded-xl p-4 text-center">
                <p className="text-sm text-dw-text/60 mb-1">Average Cycle</p>
                <p className="text-2xl font-medium text-dw-text">28 days</p>
              </div>

              <div className="bg-dw-sage/10 rounded-xl p-4 text-center">
                <p className="text-sm text-dw-text/60 mb-1">Average Period</p>
                <p className="text-2xl font-medium text-dw-text">5 days</p>
              </div>

              <div className="bg-dw-lavender/30 rounded-xl p-4 text-center">
                <p className="text-sm text-dw-text/60 mb-1">Regularity</p>
                <p className="text-2xl font-medium text-dw-text">Regular</p>
              </div>
            </div>

            <div className="h-64 flex items-center justify-center bg-dw-cream/30 rounded-xl mb-4">
              <div className="text-center">
                <BarChart3 className="h-10 w-10 text-dw-blush/50 mx-auto mb-2" />
                <p className="text-dw-text/60">Cycle length visualization</p>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="dw-card">
              <h2 className="text-lg font-medium text-dw-text mb-4">
                Top Symptoms
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-dw-text/80">Cramps</span>
                  <div className="w-32 bg-dw-gray/30 rounded-full h-2">
                    <div
                      className="bg-dw-blush h-2 rounded-full"
                      style={{ width: "85%" }}
                    ></div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-dw-text/80">Fatigue</span>
                  <div className="w-32 bg-dw-gray/30 rounded-full h-2">
                    <div
                      className="bg-dw-blush h-2 rounded-full"
                      style={{ width: "70%" }}
                    ></div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-dw-text/80">Headache</span>
                  <div className="w-32 bg-dw-gray/30 rounded-full h-2">
                    <div
                      className="bg-dw-blush h-2 rounded-full"
                      style={{ width: "55%" }}
                    ></div>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="dw-card">
              <h2 className="text-lg font-medium text-dw-text mb-4">
                Mood Patterns
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-dw-text/80">Irritable</span>
                  <div className="w-32 bg-dw-gray/30 rounded-full h-2">
                    <div
                      className="bg-dw-sage h-2 rounded-full"
                      style={{ width: "75%" }}
                    ></div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-dw-text/80">Anxious</span>
                  <div className="w-32 bg-dw-gray/30 rounded-full h-2">
                    <div
                      className="bg-dw-sage h-2 rounded-full"
                      style={{ width: "60%" }}
                    ></div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-dw-text/80">Emotional</span>
                  <div className="w-32 bg-dw-gray/30 rounded-full h-2">
                    <div
                      className="bg-dw-sage h-2 rounded-full"
                      style={{ width: "45%" }}
                    ></div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="cycles" className="mt-0">
          <Card className="dw-card">
            <h2 className="text-lg font-medium text-dw-text mb-4">
              Past Cycles
            </h2>
            <div className="space-y-4">
              {[
                {
                  start: "Mar 10, 2024",
                  end: "Mar 15, 2024",
                  length: 5,
                  cycleLength: 28
                },
                {
                  start: "Feb 11, 2024",
                  end: "Feb 16, 2024",
                  length: 5,
                  cycleLength: 29
                },
                {
                  start: "Jan 14, 2024",
                  end: "Jan 19, 2024",
                  length: 5,
                  cycleLength: 28
                },
                {
                  start: "Dec 17, 2023",
                  end: "Dec 22, 2023",
                  length: 5,
                  cycleLength: 27
                }
              ].map((cycle, index) => (
                <div
                  key={index}
                  className="border border-dw-gray/20 rounded-xl p-4"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-dw-text">
                        {cycle.start} - {cycle.end}
                      </p>
                      <p className="text-sm text-dw-text/60">
                        Period: {cycle.length} days
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-dw-text">
                        Cycle: {cycle.cycleLength} days
                      </p>
                      <p className="text-sm text-dw-text/60">
                        {cycle.cycleLength === 28
                          ? "Regular"
                          : cycle.cycleLength < 28
                          ? "Shorter"
                          : "Longer"}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
