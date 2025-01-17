
import { ethers } from 'ethers';

const BSCSCAN_API_URL = 'https://api.bscscan.com/api';
const BSCSCAN_API_KEY = process.env.BSCSCAN_API_KEY;

export interface VerificationParams {
  contractAddress: string;
  sourceCode: string;
  contractName: string;
  compilerVersion: string;
  optimizationUsed: number;
  runs: number;
  constructorArguments: string;
}

export async function verifyContract(params: VerificationParams): Promise<string> {
  const body = new URLSearchParams({
    apikey: BSCSCAN_API_KEY || '',
    module: 'contract',
    action: 'verifysourcecode',
    sourceCode: params.sourceCode,
    contractaddress: params.contractAddress,
    codeformat: 'solidity-single-file',
    contractname: params.contractName,
    compilerversion: params.compilerVersion,
    optimizationUsed: params.optimizationUsed.toString(),
    runs: params.runs.toString(),
    constructorArguements: params.constructorArguments
  });

  const response = await fetch(BSCSCAN_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString()
  });

  const data = await response.json();
  if (data.status !== '1') {
    throw new Error(data.result);
  }

  return data.result;
}

export async function checkVerificationStatus(guid: string): Promise<boolean> {
  const params = new URLSearchParams({
    apikey: BSCSCAN_API_KEY || '',
    module: 'contract',
    action: 'checkverifystatus',
    guid: guid
  });

  const response = await fetch(`${BSCSCAN_API_URL}?${params}`);
  const data = await response.json();
  
  if (data.result === 'Pending in queue') {
    return false;
  }
  
  if (data.result === 'Pass - Verified') {
    return true;
  }
  
  throw new Error(data.result);
}
