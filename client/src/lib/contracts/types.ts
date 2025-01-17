
export enum DeploymentStatus {
  PENDING = 'PENDING',
  DEPLOYING = 'DEPLOYING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED'
}

export interface DeploymentState {
  status: DeploymentStatus;
  txHash?: string;
  contractAddress?: string;
  error?: string;
  gasEstimate?: string;
}
export interface ContractParameter {
  name: string;
  type: string;
  defaultValue?: any;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
}

export interface TokenFeatures {
  burnable: boolean;
  mintable: boolean;
  pausable: boolean;
  reflective: boolean;
  taxable: boolean;
}

export interface ContractTemplate {
  id: string;
  name: string;
  description: string;
  category: 'token' | 'nft' | 'defi';
  version: string;
  parameters: ContractParameter[];
  features?: TokenFeatures;
  abi: any[];
  bytecode: string;
  source: string;
  createdAt: number;
  updatedAt: number;
}

export interface TemplateVersion {
  version: string;
  changes: string[];
  timestamp: number;
  abi: any[];
  bytecode: string;
  source: string;
}
