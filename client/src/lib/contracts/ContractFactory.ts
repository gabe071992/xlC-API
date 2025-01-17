import { WalletClient, PublicClient } from 'wagmi';
import { DeploymentStatus } from './types';
import { parseUnits } from 'viem';

export class ContractFactory {
  private provider: PublicClient;
  private signer: WalletClient;

  constructor(provider: PublicClient, signer: WalletClient) {
    this.provider = provider;
    this.signer = signer;
  }

  async deployToken(
    name: string,
    symbol: string,
    decimals: number,
    totalSupply: string,
    owner: string,
    updateStatus: (status: DeploymentStatus, data?: any) => void
  ): Promise<string> {
    try {
      updateStatus(DeploymentStatus.DEPLOYING);

      if (!this.signer) {
        throw new Error("Signer not available");
      }

      if (!this.signer?.account?.address) {
        throw new Error("Could not get wallet address");
      }
      const address = this.signer.account.address;

      const { request } = await this.provider.simulateContract({
        account: address,
        address: null as any,
        abi: BEP20_ABI,
        args: [name, symbol, decimals, parseUnits(totalSupply, decimals), owner],
        bytecode: BEP20_BYTECODE,
      });

      const hash = await this.signer.deployContract(request);

      updateStatus(DeploymentStatus.DEPLOYING, { txHash: hash });

      const receipt = await this.provider.waitForTransactionReceipt({ hash });

      updateStatus(DeploymentStatus.SUCCESS, { 
        contractAddress: receipt.contractAddress,
        txHash: hash 
      });

      return receipt.contractAddress || '';
    } catch (error) {
      updateStatus(DeploymentStatus.FAILED, { error: (error as Error).message });
      throw error;
    }
  }
}

export const BEP20_ABI = [
  "constructor(string memory name, string memory symbol, uint8 decimals, uint256 totalSupply, address owner)",
  "function name() public view returns (string)",
  "function symbol() public view returns (string)",
  "function decimals() public view returns (uint8)",
  "function totalSupply() public view returns (uint256)",
  "function balanceOf(address owner) public view returns (uint256)",
  "function transfer(address to, uint256 value) public returns (bool)",
  "function transferFrom(address from, address to, uint256 value) public returns (bool)",
  "function approve(address spender, uint256 value) public returns (bool)",
  "function allowance(address owner, address spender) public view returns (uint256)"
];
export const BEP20_BYTECODE = "0x608060405234801561001057600080fd5b506040516108..."; // Your bytecode here