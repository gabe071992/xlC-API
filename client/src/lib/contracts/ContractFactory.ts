import { ethers } from 'ethers';
import { DeploymentStatus } from './types';
import { PublicClient, WalletClient } from 'wagmi';

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

      const address = this.signer.account?.address;
      if (!address) {
        throw new Error("Could not get wallet address");
      }

      const factory = new ethers.ContractFactory(
        BEP20_ABI,
        BEP20_BYTECODE,
        this.signer
      );

      const contract = await factory.deploy(
        name,
        symbol,
        decimals,
        ethers.utils.parseUnits(totalSupply, decimals),
        owner
      );

      updateStatus(DeploymentStatus.DEPLOYING, { txHash: contract.deployTransaction.hash });

      await contract.deployed();

      updateStatus(DeploymentStatus.SUCCESS, { 
        contractAddress: contract.address,
        txHash: contract.deployTransaction.hash 
      });

      return contract.address;
    } catch (error) {
      updateStatus(DeploymentStatus.FAILED, { error: error.message });
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