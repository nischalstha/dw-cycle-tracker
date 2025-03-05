import { cn } from "@/lib/utils"

interface CyclePhaseIndicatorProps {
  phase: string
  dayOfCycle: number
  cycleLength: number
}

export function CyclePhaseIndicator({ phase, dayOfCycle, cycleLength }: CyclePhaseIndicatorProps) {
  // Calculate percentage of cycle completed
  const percentComplete = (dayOfCycle / cycleLength) * 100

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">{phase} Phase</h3>
        <span className="text-sm text-muted-foreground">{cycleLength - dayOfCycle} days until next period</span>
      </div>

      <div className="relative pt-1">
        <div className="flex mb-2 items-center justify-between">
          <div>
            <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full bg-blush-light text-primary-foreground">
              Day {dayOfCycle}
            </span>
          </div>
          <div className="text-right">
            <span className="text-xs font-semibold inline-block text-muted-foreground">
              {percentComplete.toFixed(0)}%
            </span>
          </div>
        </div>
        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded-full bg-muted">
          <div
            style={{ width: `${percentComplete}%` }}
            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-blush to-primary"
          ></div>
        </div>

        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Menstrual</span>
          <span>Follicular</span>
          <span>Ovulation</span>
          <span>Luteal</span>
        </div>

        <div className="flex mt-1">
          <div className={cn("h-1 flex-1 rounded-l-full", phase === "Menstrual" ? "bg-primary" : "bg-muted")}></div>
          <div className={cn("h-1 flex-1", phase === "Follicular" ? "bg-primary" : "bg-muted")}></div>
          <div className={cn("h-1 flex-1", phase === "Ovulation" ? "bg-secondary" : "bg-muted")}></div>
          <div className={cn("h-1 flex-1 rounded-r-full", phase === "Luteal" ? "bg-primary" : "bg-muted")}></div>
        </div>
      </div>
    </div>
  )
}

