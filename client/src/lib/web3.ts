
import { createConfig, configureChains } from 'wagmi'
import { bsc } from 'wagmi/chains'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'
import { createWeb3Modal } from '@web3modal/wagmi/react'

const projectId = 'ca84b2c96e988f445924d2369e21ec7f'

const { chains, publicClient } = configureChains(
  [bsc],
  [
    jsonRpcProvider({
      rpc: () => ({
        http: 'https://bsc-dataseed.binance.org'
      })
    })
  ]
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
