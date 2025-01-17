
import { useEffect, useState } from 'react';
import { 
  useAccount, 
  useConnect, 
  useDisconnect, 
  useNetwork,
  usePublicClient,
  useWalletClient
} from 'wagmi/react';

export function useWeb3() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { chain } = useNetwork();
  const provider = usePublicClient();
  const { data: signer } = useWalletClient();

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
