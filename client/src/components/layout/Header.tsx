import { AuthStatus } from "@/components/auth/AuthStatus";

import { Wallet } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useWeb3Modal } from '@web3modal/wagmi/react'

export function Header() {
  const { open } = useWeb3Modal()

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <h1 className="text-xl font-bold">xlC API v1 "Flatter"</h1>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => open()}>
            <Wallet className="h-5 w-5" />
          </Button>
          <AuthStatus />
        </div>
      </div>
    </header>
  );
}
