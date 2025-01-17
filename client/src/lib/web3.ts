
import { createConfig, http } from 'wagmi'
import { bsc } from 'wagmi/chains'
import { createWeb3Modal } from '@web3modal/wagmi/react'
import { defaultWagmiConfig } from '@web3modal/wagmi/react/config'

const projectId = 'ca84b2c96e988f445924d2369e21ec7f'

const metadata = {
  name: 'xlC API v1 Flatter',
  description: 'xlC Admin Interface',
  url: 'https://xlc.com',
  icons: ['https://avatars.githubusercontent.com/u/37784886']
}

const chains = [bsc]
export const config = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
  enableWalletConnect: true,
  enableInjected: true,
  enableEIP6963: true,
})

createWeb3Modal({
  wagmiConfig: config,
  projectId,
  chains,
  themeMode: 'dark',
  themeVariables: {
    '--w3m-font-family': 'Inter, sans-serif',
    '--w3m-accent-color': '#000000'
  }
})
