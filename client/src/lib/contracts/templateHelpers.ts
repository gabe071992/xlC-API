
import { TokenFeatures } from './types';
import { BEP20_ABI, BEP20_BYTECODE } from './ContractFactory';

const FEATURE_SNIPPETS = {
  burnable: `
  function burn(uint256 amount) public {
    _burn(msg.sender, amount);
  }
  
  function burnFrom(address account, uint256 amount) public {
    uint256 currentAllowance = allowance(account, msg.sender);
    require(currentAllowance >= amount, "Burn amount exceeds allowance");
    _approve(account, msg.sender, currentAllowance - amount);
    _burn(account, amount);
  }`,
  
  mintable: `
  function mint(address account, uint256 amount) public onlyOwner {
    _mint(account, amount);
  }`,
  
  pausable: `
  bool public paused;
  
  modifier whenNotPaused() {
    require(!paused, "Token transfers are paused");
    _;
  }
  
  function _beforeTokenTransfer(address from, address to, uint256 amount) internal virtual override whenNotPaused {
    super._beforeTokenTransfer(from, to, amount);
  }
  
  function pause() public onlyOwner {
    paused = true;
    emit Paused(msg.sender);
  }
  
  function unpause() public onlyOwner {
    paused = false;
    emit Unpaused(msg.sender);
  }`,
  
  reflective: `
  uint256 public reflectionFee = 2;
  uint256 private _totalReflected;
  
  function _transfer(address sender, address recipient, uint256 amount) internal virtual override {
    require(sender != address(0), "Transfer from zero address");
    require(recipient != address(0), "Transfer to zero address");
    
    uint256 reflectionAmount = amount * reflectionFee / 100;
    uint256 transferAmount = amount - reflectionAmount;
    
    super._transfer(sender, address(this), reflectionAmount);
    super._transfer(sender, recipient, transferAmount);
    
    _totalReflected += reflectionAmount;
    _redistribute(reflectionAmount);
  }
  
  function _redistribute(uint256 amount) private {
    uint256 totalSupply = totalSupply();
    require(totalSupply > 0, "No supply for redistribution");
    
    uint256 perTokenDistribution = amount / totalSupply;
    require(perTokenDistribution > 0, "Distribution too small");
    
    _totalReflected -= amount;
  }`,

  taxable: `
  uint256 public taxFee = 5;
  address public taxWallet;
  
  constructor() {
    taxWallet = msg.sender;
  }
  
  function _transfer(address sender, address recipient, uint256 amount) internal virtual override {
    require(sender != address(0), "Transfer from zero address");
    require(recipient != address(0), "Transfer to zero address");
    
    uint256 taxAmount = amount * taxFee / 100;
    uint256 transferAmount = amount - taxAmount;
    
    super._transfer(sender, taxWallet, taxAmount);
    super._transfer(sender, recipient, transferAmount);
  }
  
  function setTaxFee(uint256 newTaxFee) public onlyOwner {
    require(newTaxFee <= 10, "Tax fee cannot exceed 10%");
    taxFee = newTaxFee;
  }
  
  function setTaxWallet(address newTaxWallet) public onlyOwner {
    require(newTaxWallet != address(0), "New tax wallet is zero address");
    taxWallet = newTaxWallet;
  }`
};

export function generateTokenSource(features: TokenFeatures): string {
  let importStatements = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/BEP20/BEP20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
${features.pausable ? 'import "@openzeppelin/contracts/security/Pausable.sol";' : ''}
`;

  let contractDefinition = `contract CustomToken is BEP20, Ownable${features.pausable ? ', Pausable' : ''} {
  constructor(
    string memory name,
    string memory symbol,
    uint256 initialSupply
  ) BEP20(name, symbol) {
    _mint(msg.sender, initialSupply);
  }
  
  // Override transfer function to implement custom logic
  function _transfer(
    address sender,
    address recipient,
    uint256 amount
  ) internal virtual override {
    super._transfer(sender, recipient, amount);
  }
`;

  // Add selected features
  Object.entries(features).forEach(([feature, enabled]) => {
    if (enabled && FEATURE_SNIPPETS[feature]) {
      contractDefinition += FEATURE_SNIPPETS[feature];
    }
  });

  // Close contract
  contractDefinition += `}`;

  return importStatements + contractDefinition;
}
