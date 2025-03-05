// Shared cycle data for the application
export const defaultCycleData = {
  dayOfCycle: calculateDayOfCycle(new Date("2025-02-27T12:00:00Z")),
  cycleLength: 28,
  periodLength: 5,
  lastPeriod: {
    start: new Date("2025-02-27T12:00:00Z"),
    end: new Date("2025-03-03T12:00:00Z")
  },
  nextPeriod: new Date("2025-03-27T12:00:00Z"), // 28 days after last period start
  ovulationDate: new Date("2025-03-12T12:00:00Z") // Day 14 of cycle
};

// Function to calculate current day of cycle
export function calculateDayOfCycle(startDate: Date) {
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - startDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}
