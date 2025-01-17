
import { useState } from 'react';
import { ContractFactory } from '../contracts/ContractFactory';
import { DeploymentStatus, DeploymentState } from '../contracts/types';
import { useWeb3 } from './useWeb3';

export function useContractDeployment() {
  const { provider, signer } = useWeb3();
  const [deploymentState, setDeploymentState] = useState<DeploymentState>({
    status: DeploymentStatus.PENDING
  });

  const deploy = async (
    name: string,
    symbol: string,
    decimals: number,
    totalSupply: string,
    owner: string
  ) => {
    if (!provider || !signer) {
      throw new Error('Web3 not initialized');
    }

    try {
      setDeploymentState({
        status: DeploymentStatus.DEPLOYING
      });

      const factory = new ContractFactory(provider, signer);
      
      // Estimate gas first
      const gasEstimate = await factory.estimateGas(
        name,
        symbol,
        decimals,
        totalSupply
      );

      // Deploy the contract
      const contractAddress = await factory.deployToken(
        name,
        symbol,
        decimals,
        totalSupply,
        owner
      );

      setDeploymentState({
        status: DeploymentStatus.SUCCESS,
        contractAddress,
        gasEstimate
      });

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
