import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const pastCycles = [
  { start: "2024-03-10", end: "2024-03-15", length: 28 },
  { start: "2024-02-11", end: "2024-02-16", length: 30 },
  { start: "2024-01-14", end: "2024-01-19", length: 29 },
]

export function PastCycles() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Past Cycles</CardTitle>
      </CardHeader>
      <CardContent>
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left">Start Date</th>
              <th className="text-left">End Date</th>
              <th className="text-left">Cycle Length</th>
            </tr>
          </thead>
          <tbody>
            {pastCycles.map((cycle, index) => (
              <tr key={index}>
                <td>{cycle.start}</td>
                <td>{cycle.end}</td>
                <td>{cycle.length} days</td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  )
}

