import { addDays, differenceInDays } from "date-fns"

export type CyclePhase = "menstrual" | "follicular" | "ovulatory" | "luteal"

export interface CycleData {
  phases: Record<
    CyclePhase,
    {
      name: string
      duration: number
      symptoms: string[]
    }
  >
  currentPhase: CyclePhase
  cycleStartDate: Date
}

export function calculateCurrentPhase(cycleData: CycleData, currentDate: Date): CyclePhase {
  const { phases, cycleStartDate } = cycleData
  const daysSinceCycleStart = differenceInDays(currentDate, cycleStartDate)

  let daysAccumulated = 0
  for (const [phase, data] of Object.entries(phases)) {
    daysAccumulated += data.duration
    if (daysSinceCycleStart < daysAccumulated) {
      return phase as CyclePhase
    }
  }

  // If we've gone through all phases, start over
  return "menstrual"
}

export function getNextPhase(currentPhase: CyclePhase): CyclePhase {
  const phases: CyclePhase[] = ["menstrual", "follicular", "ovulatory", "luteal"]
  const currentIndex = phases.indexOf(currentPhase)
  return phases[(currentIndex + 1) % phases.length]
}

export function calculateNextPeriodDate(cycleData: CycleData): Date {
  const { phases, cycleStartDate } = cycleData
  const cycleDuration = Object.values(phases).reduce((sum, phase) => sum + phase.duration, 0)
  return addDays(cycleStartDate, cycleDuration)
}

