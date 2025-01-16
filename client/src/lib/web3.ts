
import { createConfig, http } from 'wagmi'
import { bsc } from 'wagmi/chains'
import { createWeb3Modal } from '@web3modal/wagmi/react'

const projectId = 'ca84b2c96e988f445924d2369e21ec7f'

export const config = createConfig({
  chains: [bsc],
  transports: {
    [bsc.id]: http('https://bsc-dataseed.binance.org')
  }
})

createWeb3Modal({
  wagmiConfig: config,
  projectId,
  chains: [bsc]
})
