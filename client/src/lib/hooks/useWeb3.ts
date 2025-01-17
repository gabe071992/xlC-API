
import { useEffect, useState } from 'react';
import { useAccount, useConnect, useDisconnect, useConfig, useWalletClient, usePublicClient } from 'wagmi';

export function useWeb3() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const config = useConfig();
  const { data: signer } = useWalletClient();
  const provider = usePublicClient();
  const [chain, setChain] = useState(config.chains[0]);

  useEffect(() => {
    if (signer?.chain) {
      setChain(signer.chain);
    }
  }, [signer]);

  return {
    address,
    isConnected,
    connect,
    disconnect,
    chain,
    provider,
    signer,
    connectors
  };
}
