import { useState, useCallback } from 'react';
import { ContractFactory } from '../contracts/ContractFactory';
import { DeploymentStatus, DeploymentState } from '../contracts/types';
import { useWeb3 } from '@/lib/hooks/useWeb3';
import type { PublicClient, WalletClient } from 'wagmi';

export function useContractDeployment() {
  const { provider: publicClient, signer: walletClient } = useWeb3();
  const [deploymentState, setDeploymentState] = useState<DeploymentState>({
    status: DeploymentStatus.PENDING
  });

  const updateStatus = useCallback((status: DeploymentStatus, data?: any) => {
    setDeploymentState(prev => ({
      ...prev,
      status,
      ...data
    }));
  }, []);

  const deploy = async (
    name: string,
    symbol: string,
    decimals: number,
    totalSupply: string,
    owner: string
  ) => {
    if (!publicClient || !walletClient) {
      throw new Error('Web3 not initialized');
    }

    try {
      const factory = new ContractFactory(publicClient, walletClient);
      const contractAddress = await factory.deployToken(
        name,
        symbol,
        decimals,
        totalSupply,
        owner,
        updateStatus
      );

      return contractAddress;
    } catch (error) {
      setDeploymentState({
        status: DeploymentStatus.FAILED,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      });
      throw error;
    }
  };

  return {
    deploymentState,
    deploy
  };
}