
import { ethers } from 'ethers';
import { DeploymentStatus } from './types';

const BEP20_ABI = [
  "constructor(string name, string symbol, uint8 decimals, uint256 totalSupply, address owner)",
  "event Transfer(address indexed from, address indexed to, uint256 value)",
  "event Approval(address indexed owner, address indexed spender, uint256 value)",
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address account) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function transferFrom(address from, address to, uint256 amount) returns (bool)"
];

const BEP20_BYTECODE = "0x608060405234801561001057600080fd5b5060405161091f38038061091f83398101604081905261002f91610151565b600362000046838361042860201b60201c565b50600462000055828261042860201b60201c565b5060ff811660805260a08290526080518190526000908152600160205260408120919091556001600160a01b0316600281905560038290556004558051610578610098833960608181016040526000815291012090565b600580546001600160a01b0319166001600160a01b0392909216919091179055506104ec915050565b634e487b7160e01b600052604160045260246000fd5b600082601f8301126100e057600080fd5b81516001600160401b03808211156100fa576100fa6100b9565b604051601f8301601f19908116603f01168101908282118183101715610122576101226100b9565b8160405283815286602085880101111561013b57600080fd5b836020870160208301376000602085830101528094505050505092915050565b600080600080600060a0868803121561016957600080fd5b85516001600160401b038082111561018057600080fd5b61018c89838a016100cf565b965060208801519150808211156101a257600080fd5b6101ae89838a016100cf565b9450604088015160ff811681146101c457600080fd5b935060608801519150808211156101da57600080fd5b506101e7888289016100cf565b925050608086015190509295509295909350565b600181811c9082168061020e57607f821691505b60208210810361022e57634e487b7160e01b600052602260045260246000fd5b50919050565b601f82111561027e57600081815260208120601f850160051c8101602086101561025b5750805b601f850160051c820191505b8181101561027a57828155600101610267565b5050505b505050565b815167ffffffffffffffff8111156102a0576102a06100b9565b6102b4816102ae8454610200565b84610234565b602080601f8311600181146102e957600084156102d15750858301515b600019600386901b1c1916600185901b178555610349565b600085815260208120601f198616915b8281101561031857888601518255948401946001909101908401610300565b508582101561033657878501515b600019600388901b60f8161c191681555b5050505050565b815167ffffffffffffffff81111561036a5761036a6100b9565b61037e816102ae8454610200565b84610234565b602080601f8311600181146103b357600084156103d75750858301515b600019600386901b1c1916600185901b178555610349565b600085815260208120601f198616915b828110156103e2578886015182559484019460019091019084016103c3565b50858210156104005787850151600019600388901b60f8161c1916825580555b505050505050565b634e487b7160e01b600052602160045260246000fd5b634e487b7160e01b600052603260045260246000fd5b600181811c9082168061043c57607f821691505b60208210810361045c57634e487b7160e01b600052602260045260246000fd5b50919050565b601f82111561027e57600081815260208120601f850160051c8101602086101561048a5750805b601f850160051c820191505b818110156104a957828155600101610496565b5050505b505050565b815167ffffffffffffffff8111156104cc576104cc6100b9565b6104e0816104da8454610428565b84610463565b602080601f8311600181146104f557600084156105155750858301515b600019600386901b1c1916600185901b178555610349565b600085815260208120601f198616915b82811015610544578886015182559484019460019091019084016105255b50858210156105625787850151600019600388901b60f8161c1916825580555b505050505050565b634e487b7160e01b600052602160045260246000fd5b634e487b7160e01b600052603260045260246000fd5b600181811c908216806105a957607f821691505b6020821081036105c957634e487b7160e01b600052602260045260246000fd5b50919050565b601f82111561027e57600081815260208120601f850160051c8101602086101561060a5750805b601f850160051c820191505b81811015610629578281556001016106165b5050505b505050565b815167ffffffffffffffff81111561064c5761064c6100b9565b610660816106588454610595565b846105df565b602080601f831160018114610695576000841561067d5750858301515b600019600386901b1c1916600185901b178555610349565b600085815260208120601f198616915b828110156106c4578886015182559484019460019091019084016106a5565b50858210156106e25787850151600019600388901b60f8161c1916825580555b505050505050565b634e487b7160e01b600052602160045260246000fd5b634e487b7160e01b600052603260045260246000fd5b600181811c908216806107265760ff821692505b60208210810361074657634e487b7160e01b600052602260045260246000fd5b50919050565b601f82111561027e57600081815260208120601f850160051c8101602086101561076a5750805b601f850160051c820191505b81811015610789578281556001016106165b5050505b505050565b815167ffffffffffffffff8111156107ac576107ac6100b9565b6107c0816107b88454610712565b8461073f565b602080601f8311600181146107f55760008415610795578086015182559084019460019091019084016107d9565b50858210156108135787850151600019600388901b60f8161c1916825580555b505050505050565b634e487b7160e01b600052602160045260246000fd5b634e487b7160e01b600052603260045260246000fd5b600181811c908216806108595760ff821692505b60208210810361087957634e487b7160e01b600052602260045260246000fd5b50919050565b601f82111561027e57600081815260208120601f850160051c8101602086101561089d5750805b601f850160051c820191505b818110156108bc5782815560010161089a565b5050505b505050565b815167ffffffffffffffff8111156108df576108df6100b9565b6108f3816108eb84546108a6565b84610883565b602080601f831160018114610928576000841561090c5750858301515b600019600386901b1c1916600185901b178555610349565b600085815260208120601f198616915b82811015610957578886015182559484019460019091019084016109385b50858210156109755787850151600019600388901b60f8161c1916825580555b505050505050565b634e487b7160e01b600052602160045260246000fd5b634e487b7160e01b600052603260045260246000fd5b60805160a0516109e66000396000818160c9015261016f01526000818160e30152610188015260006101a10152610578565b610a5d8061034e6000396000f3fe608060405234801561001057600080fd5b50600436106100a95760003560e01c806370a082311161007157806370a08231146101295780638da5cb5b1461015257806395d89b411461016757806396e494e81461016f578063a9059cbb14610177578063dd62ed3e1461018a57600080fd5b806306fdde03146100ae578063095ea7b3146100cc57806318160ddd146100e457806323b872dd146100f657806370548f3014610109575b600080fd5b6100b66101c3565b6040516100c39190610464565b60405180910390f35b6100df6100da366004610478565b610251565b005b6100df6100f2366004610478565b610281565b6100df6101043660046104a2565b6102b1565b610116600160005403146102e1565b6040519081526020016100c3565b610116610137366004610478565b6001600160a01b031660009081526001602052604090205490565b61015a6102e3565b6040516100c39190610464565b6100b661031d565b6100b6610325565b6100df610185366004610478565b61032d565b61011661019836600461049a565b6001600160a01b03918216600090815260036020908152604080832093909416825291909152205490565b6060600480546101d2906104d6565b80601f01602080910402602001604051908101604052809291908181526020018280546101fe906104d6565b801561024b5780601f106102205761010080835404028352916020019161024b565b820191906000526020600020905b81548152906001019060200180831161022e57829003601f168201915b5050505050905090565b806001600160a01b0316600260005460405161026d91906104ef565b6001600160a01b03909116815260200160405180910390a250565b806001600160a01b0316600260005460405161029d91906104ef565b6001600160a01b03909116815260200160405180910390a250565b806001600160a01b0316600260005460405161026d91906104ef565b90565b6060600580546101d2906104d6565b6060600480546101d2906104d6565b6060600580546101d2906104d6565b806001600160a01b0316600260005460405161034991906104ef565b6001600160a01b03909116815260200160405180910390a25050505050505050505050505050505050565b6000815180845260005b8181101561039c57602081850181015186830182015201610380565b506000602082860101526020601f19601f83011685010191505092915050565b60006001600160a01b0380871683526020818601908401526040604085018281528551808652606087019150848801945082019350915080830190506060850152601f909301601f191690910190509392505050565b60006001600160a01b0380881683526020818601908401526040818501908401526060808501908401526080808501908401526001600160a01b0380871660a08601526020604086018281528751808852838701945083019350915080830190506060850152601f909301601f191690910190509392505050565b60208152600061047b6020830184610376565b92915050565b60006001600160a01b0380881683526020818601908401526040604085018281528551808652606087019150848801945082019350915080830190506060850152601f909301601f191690910190509392505050565b60006001600160a01b0380881683526020818601908401526040818501908401526060808501908401526080808501908401526001600160a01b0380871660a08601526020604086018281528751808852838701945083019350915080830190506060850152601f909301601f191690910190509392505050565b600181811c908216806104ea57607f821691505b60208210810361050a57634e487b7160e01b600052602260045260246000fd5b50919050565b601f82111561055a57600081815260208120601f850160051c810160208610156105375750805b601f850160051c820191505b81811015610556578281556001016105435b5050505b505050565b815167ffffffffffffffff81111561057d5761057d6100b9565b610591816105888454610200565b84610510565b602080601f8311600181146105c657600084156105ae5750858301515b600019600386901b1c1916600185901b17855561055a565b600085815260208120601f198616915b828110156105f55788860151825594840194600190910190840161057d565b50858210156106135787850151600019600388901b60f8161c191681555b5050505050565b634e487b7160e01b600052602160045260246000fd5b634e487b7160e01b600052603260045260246000fd5b600181811c908216806106575760ff821692505b60208210810361067757634e487b7160e01b600052602260045260246000fd5b50919050565b601f82111561027e57600081815260208120601f850160051c810160208610156106a45750805b601f850160051c820191505b818110156106c35782815560010161057d565b5050505b505050565b815167ffffffffffffffff8111156106e6576106e66100b9565b6106fa816106f28454610643565b8461067e565b602080601f831160018114610729576000841561070d5750858301515b600019600386901b1c1916600185901b178555610349565b600085815260208120601f198616915b828110156107585788860151825594840194600190910190840161073f565b50858210156107765787850151600019600388901b60f8161c1916825580555b505050505050565b634e487b7160e01b600052602160045260246000fd5b634e487b7160e01b600052603260045260246000fd5b600181811c908216806107bc5760ff821692505b60208210810361067757634e487b7160e01b600052602260045260246000fd5b601f82111561027e57600081815260208120601f850160051c810160208610156106a45750805b601f850160051c820191505b818110156106c35782815560010161057d565b815167ffffffffffffffff81111561084b5761084b6100b9565b61085f8161085784546107a8565b846107e3565b602080601f831160018114610729576000841561070d5750858301515b600019600386901b1c1916600185901b178555610349565b634e487b7160e01b600052602160045260246000fd5b634e487b7160e01b600052603260045260246000fd5b600181811c908216806108cd5760ff821692505b60208210810361067757634e487b7160e01b600052602260045260246000fd5b601f82111561027e57600081815260208120601f850160051c810160208610156106a45750805b601f850160051c820191505b818110156106c35782815560010161057d565b815167ffffffffffffffff81111561095c5761095c6100b9565b6109708161096884546108b9565b846108f4565b602080601f831160018114610729576000841561070d5750858301515b600019600386901b1c1916600185901b178555610349565b634e487b7160e01b600052602160045260246000fd5b634e487b7160e01b600052603260045260246000fd5b60006001600160a01b0380881683526020818601908401526040818501908401526060808501908401526080808501908401526001600160a01b0380871660a08601526020604086018281528751808852838701945083019350915080830190506060850152601f909301601f191690910190509392505050565b60006001600160a01b0380881683526020818601908401526040818501908401526060808501908401526080808501908401526001600160a01b0380871660a08601526020604086018281528751808852838701945083019350915080830190506060850152601f909301601f191690910190509392505050565b60006001600160a01b0380881683526020818601908401526040818501908401526060808501908401526080808501908401526001600160a01b0380871660a08601526020604086018281528751808852838701945083019350915080830190506060850152601f909301601f191690910190509392505050565b60006001600160a01b0380881683526020818601908401526040818501908401526060808501908401526080808501908401526001600160a01b0380871660a08601526020604086018281528751808852838701945083019350915080830190506060850152601f909301601f191690910190509392505050565b60006001600160a01b0380881683526020818601908401526040818501908401526060808501908401526080808501908401526001600160a01b0380871660a08601526020604086018281528751808852838701945083019350915080830190506060850152601f909301601f191690910190509392505050565b60006001600160a01b0380881683526020818601908401526040818501908401526060808501908401526080808501908401526001600160a01b0380871660a08601526020604086018281528751808852838701945083019350915080830190506060850152601f909301601f191690910190509392505050565b60006001600160a01b0380881683526020818601908401526040818501908401526060808501908401526080808501908401526001600160a01b0380871660a08601526020604086018281528751808852838701945083019350915080830190506060850152601f909301601f191690910190509392505050565b60006001600160a01b0380881683526020818601908401526040818501908401526060808501908401526080808501908401526001600160a01b0380871660a08601526020604086018281528751808852838701945083019350915080830190506060850152601f909301601f191690910190509392505050565b60006001600160a01b0380881683526020818601908401526040818501908401526060808501908401526080808501908401526001600160a01b0380871660a08601526020604086018281528751808852838701945083019350915080830190506060850152601f909301601f191690910190509392505050565b60006001600160a01b0380881683526020818601908401526040818501908401526060808501908401526080808501908401526001600160a01b0380871660a08601526020604086018281528751808852838701945083019350915080830190506060850152601f909301601f191690910190509392505050565b60006001600160a01b0380881683526020818601908401526040818501908401526060808501908401526080808501908401526001600160a01b0380871660a08601526020604086018281528751808852838701945083019350915080830190506060850152601f909301601f191690910190509392505050565b60006001600160a01b0380881683526020818601908401526040818501908401526060808501908401526080808501908401526001600160a01b0380871660a08601526020604086018281528751808852838701945083019350915080830190506060850152601f909301601f191690910190509392505050565b60006001600160a01b0380881683526020818601908401526040818501908401526060808501908401526080808501908401526001600160a01b0380871660a08601526020604086018281528751808852838701945083019350915080830190506060850152601f909301601f191690910190509392505050565b60006001600160a01b0380881683526020818601908401526040818501908401526060808501908401526080808501908401526001600160a01b0380871660a08601526020604086018281528751808852838701945083019350915080830190506060850152601f909301601f191690910190509392505050565b60006001600160a01b0380881683526020818601908401526040818501908401526060808501908401526080808501908401526001600160a01b0380871660a08601526020604086018281528751808852838701945083019350915080830190506060850152601f909301601f191690910190509392505050565b60006001600160a01b0380881683526020818601908401526040818501908401526060808501908401526080808501908401526001600160a01b0380871660a08601526020604086018281528751808852838701945083019350915080830190506060850152601f909301601f191690910190509392505050565b60006001600160a01b0380881683526020818601908401526040818501908401526060808501908401526080808501908401526001600160a01b0380871660a08601526020604086018281528751808852838701945083019350915080830190506060850152601f909301<truncated>

export interface IContractFactory {
  deployToken(
    name: string,
    symbol: string,
    decimals: number,
    totalSupply: string,
    owner: string
  ): Promise<string>;
  
  estimateGas(
    name: string,
    symbol: string,
    decimals: number,
    totalSupply: string
  ): Promise<string>;
}

export class ContractFactory implements IContractFactory {
  private provider: ethers.providers.Provider;
  private signer: ethers.Signer;
  private contractABI: any[] = BEP20_ABI;
  private contractBytecode: string = BEP20_BYTECODE;

  constructor(provider: ethers.providers.Provider, signer: ethers.Signer) {
    this.provider = provider;
    this.signer = signer;
  }

  async deployToken(
    name: string,
    symbol: string,
    decimals: number,
    totalSupply: string,
    owner: string
  ): Promise<string> {
    try {
      const factory = new ethers.ContractFactory(
        this.contractABI,
        this.contractBytecode,
        this.signer
      );

      const contract = await factory.deploy(
        name,
        symbol,
        decimals,
        totalSupply,
        owner
      );

      await contract.deployed();
      return contract.address;
    } catch (error) {
      console.error('Error deploying token:', error);
      throw error;
    }
  }

  async estimateGas(
    name: string,
    symbol: string,
    decimals: number,
    totalSupply: string
  ): Promise<string> {
    try {
      const factory = new ethers.ContractFactory(
        this.contractABI,
        this.contractBytecode,
        this.signer
      );

      const deploymentTx = await factory.getDeployTransaction(
        name,
        symbol,
        decimals,
        totalSupply
      );

      const estimate = await this.provider.estimateGas(deploymentTx);
      return estimate.toString();
    } catch (error) {
      console.error('Error estimating gas:', error);
      throw error;
    }
  }
}
