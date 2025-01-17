
import { useEffect, useState } from 'react';
import { useAccount, useConnect, useDisconnect, useConfig, useWalletClient, usePublicClient, Chain } from 'wagmi';

export function useWeb3() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const config = useConfig();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  const [chain, setChain] = useState<Chain>(config.chains[0]);

  useEffect(() => {
    if (walletClient?.chain) {
      setChain(walletClient.chain);
    }
  }, [walletClient]);

  return {
    address,
    isConnected,
    connect,
    disconnect,
    chain,
    provider: publicClient,
    signer: walletClient,
    connectors
  };
}
