import { AuthStatus } from "@/components/auth/AuthStatus";
import { Wallet } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useWeb3Modal } from '@web3modal/wagmi/react'
import { useWeb3 } from '@/lib/hooks/useWeb3'

export function Header() {
  const { open } = useWeb3Modal()
  const { isConnected, address } = useWeb3()

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <h1 className="text-xl font-bold">xlC API v1 "Flatter"</h1>
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={() => open()}
            className="flex items-center gap-2"
          >
            <Wallet className="h-5 w-5" />
            {isConnected ? 
              <span className="text-sm">{address?.slice(0, 6)}...{address?.slice(-4)}</span> :
              <span className="text-sm">Connect Wallet</span>
            }
          </Button>
          <AuthStatus />
        </div>
      </div>
    </header>
  );
}
