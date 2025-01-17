
import { useEffect, useState } from 'react';
import { useAccount, useConnect, useDisconnect, useNetwork, useProvider, useSigner } from 'wagmi';

export function useWeb3() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { chain } = useNetwork();
  const provider = useProvider();
  const { data: signer } = useSigner();

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
