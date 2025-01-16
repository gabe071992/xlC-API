import { Card, CardContent } from "@/components/ui/card"

export default function Dashboard() {
  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl md:text-4xl font-bold">Dashboard</h1>
      </div>

      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-medium">Total Balance</h3>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}