
import { createConfig, configureChains } from 'wagmi'
import { bsc } from 'wagmi/chains'
import { publicProvider } from '@wagmi/core/providers/public'
import { createWeb3Modal } from '@web3modal/wagmi/react'

const projectId = 'ca84b2c96e988f445924d2369e21ec7f'

const { chains, publicClient } = configureChains(
  [bsc],
  [publicProvider()]
)

export const config = createConfig({
  autoConnect: true,
  publicClient
})

createWeb3Modal({
  wagmiConfig: config,
  projectId,
  chains
})
