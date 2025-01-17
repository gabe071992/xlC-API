import { ethers } from 'ethers';
import { DeploymentStatus } from './types';

export class ContractFactory {
  private provider: ethers.providers.Provider;
  private signer: ethers.Signer;

  constructor(provider: ethers.providers.Provider, signer: ethers.Signer) {
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

      // Initiate verification
      updateStatus(DeploymentStatus.VERIFYING);
      const verificationGuid = await verifyContract({
        contractAddress: contract.address,
        sourceCode: contract.interface.format('full'),
        contractName: 'Token',
        compilerVersion: '0.8.0',
        optimizationUsed: 1,
        runs: 200,
        constructorArguments: contract.interface.encodeDeploy([name, symbol, decimals, totalSupply, owner])
      });

      // Check verification status
      const isVerified = await checkVerificationStatus(verificationGuid);
      if (isVerified) {
        updateStatus(DeploymentStatus.VERIFIED);
      }

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

export const BEP20_BYTECODE = "0x608060405234801561001057600080fd5b506040516108..."; // Add your bytecode here