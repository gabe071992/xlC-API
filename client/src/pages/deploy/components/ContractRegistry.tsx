
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface Contract {
  name: string
  address: string
  network: string
  version: string
  features: string[]
  verified: boolean
  audited: boolean
}

export default function ContractRegistry() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Contract Registry</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Input placeholder="Search contracts..." className="max-w-sm" />
            <Button>Search</Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Network</TableHead>
                <TableHead>Version</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Example Token</TableCell>
                <TableCell>0x1234...</TableCell>
                <TableCell>BSC</TableCell>
                <TableCell>1.0.0</TableCell>
                <TableCell>
                  <div className="space-x-1">
                    <Badge>Verified</Badge>
                    <Badge variant="secondary">Audited</Badge>
                  </div>
                </TableCell>
                <TableCell>
                  <Button variant="outline" size="sm">View</Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
