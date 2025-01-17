
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
