
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useState } from "react"
import { useMobile } from "@/hooks/use-mobile"

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const isMobile = useMobile()

  const TabNavigation = () => (
    <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-7">
      <TabsTrigger value="overview">Dashboard</TabsTrigger>
      <TabsTrigger value="tokens">Token Operations</TabsTrigger>
      <TabsTrigger value="users">User Management</TabsTrigger>
      <TabsTrigger value="api">API Management</TabsTrigger>
      <TabsTrigger value="distribution">Distribution</TabsTrigger>
      <TabsTrigger value="contracts">Contract Deployment</TabsTrigger>
      <TabsTrigger value="transactions">Transactions</TabsTrigger>
    </TabsList>
  )

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl md:text-4xl font-bold"></h1>
        {isMobile && (
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <nav className="flex flex-col gap-4">
                <Button 
                  variant={activeTab === "overview" ? "default" : "ghost"}
                  className="w-full justify-start" 
                  onClick={() => setActiveTab("overview")}
                >
                  Dashboard
                </Button>
                <Button 
                  variant={activeTab === "tokens" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("tokens")}
                >
                  Token Operations
                </Button>
                {/* Add other navigation buttons */}
              </nav>
            </SheetContent>
          </Sheet>
        )}
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        {!isMobile && <TabNavigation />}

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-medium">Total Balance</h3>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tokens">Token Operations content</TabsContent>
        <TabsContent value="users">User Management content</TabsContent>
        <TabsContent value="api">API Management content</TabsContent>
        <TabsContent value="distribution">Distribution content</TabsContent>
        <TabsContent value="contracts">Contract Deployment content</TabsContent>
        <TabsContent value="transactions">Transactions content</TabsContent>
      </Tabs>
    </div>
  )
}
