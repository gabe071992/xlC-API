
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  LayoutDashboard, 
  Coins, 
  Users, 
  Settings, 
  Share2, 
  FileCode, 
  History 
} from "lucide-react"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
  const routes = [
    { 
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/client/src/pages/dashboard/index.tsx",
    },
    {
      label: "Token Operations",
      icon: Coins,
      href: "/token-operations",
    },
    {
      label: "User Management",
      icon: Users,
      href: "/users",
    },
    {
      label: "API Management",
      icon: Settings,
      href: "/api-management",
    },
    {
      label: "Distribution",
      icon: Share2,
      href: "/distribution",
    },
    {
      label: "Contract Deployment",
      icon: FileCode,
      href: "/deploy",
    },
    {
      label: "Transactions",
      icon: History,
      href: "/transactions",
    }
  ]

  return (
    <div className={cn("pb-12 border-r", className)}>
      <ScrollArea className="h-full py-6 px-3">
        <div className="space-y-4 py-4">
          <div className="px-3 py-2">
            <div className="space-y-1">
              {routes.map((route) => (
                <Button
                  key={route.href}
                  variant="ghost"
                  className="w-full justify-start"
                  asChild
                >
                  <a href={route.href}>
                    <route.icon className="mr-2 h-4 w-4" />
                    {route.label}
                  </a>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}
