/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Contract,
  ContractFactory,
  ContractTransactionResponse,
  Interface,
} from "ethers";
import type { Signer, ContractDeployTransaction, ContractRunner } from "ethers";
import type { NonPayableOverrides } from "../../common";
import type { Token, TokenInterface } from "../../token.sol/Token";

const _abi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "_from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "_to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

const _bytecode =
  "0x60806040526040518060400160405280601081526020017f4d79204861726468617420546f6b656e0000000000000000000000000000000081525060009081610048919061037e565b506040518060400160405280600381526020017f4d485400000000000000000000000000000000000000000000000000000000008152506001908161008d919061037e565b50620f42406002553480156100a157600080fd5b50600254600460003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000208190555033600360006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550610450565b600081519050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b600060028204905060018216806101af57607f821691505b6020821081036101c2576101c1610168565b5b50919050565b60008190508160005260206000209050919050565b60006020601f8301049050919050565b600082821b905092915050565b60006008830261022a7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff826101ed565b61023486836101ed565b95508019841693508086168417925050509392505050565b6000819050919050565b6000819050919050565b600061027b6102766102718461024c565b610256565b61024c565b9050919050565b6000819050919050565b61029583610260565b6102a96102a182610282565b8484546101fa565b825550505050565b600090565b6102be6102b1565b6102c981848461028c565b505050565b5b818110156102ed576102e26000826102b6565b6001810190506102cf565b5050565b601f82111561033257610303816101c8565b61030c846101dd565b8101602085101561031b578190505b61032f610327856101dd565b8301826102ce565b50505b505050565b600082821c905092915050565b600061035560001984600802610337565b1980831691505092915050565b600061036e8383610344565b9150826002028217905092915050565b6103878261012e565b67ffffffffffffffff8111156103a05761039f610139565b5b6103aa8254610197565b6103b58282856102f1565b600060209050601f8311600181146103e857600084156103d6578287015190505b6103e08582610362565b865550610448565b601f1984166103f6866101c8565b60005b8281101561041e578489015182556001820191506020850194506020810190506103f9565b8683101561043b5784890151610437601f891682610344565b8355505b6001600288020188555050505b505050505050565b6109ac8061045f6000396000f3fe608060405234801561001057600080fd5b50600436106100625760003560e01c806306fdde031461006757806318160ddd1461008557806370a08231146100a35780638da5cb5b146100d357806395d89b41146100f1578063a9059cbb1461010f575b600080fd5b61006f61012b565b60405161007c91906105f9565b60405180910390f35b61008d6101b9565b60405161009a9190610634565b60405180910390f35b6100bd60048036038101906100b891906106b2565b6101bf565b6040516100ca9190610634565b60405180910390f35b6100db610208565b6040516100e891906106ee565b60405180910390f35b6100f961022e565b60405161010691906105f9565b60405180910390f35b61012960048036038101906101249190610735565b6102bc565b005b60008054610138906107a4565b80601f0160208091040260200160405190810160405280929190818152602001828054610164906107a4565b80156101b15780601f10610186576101008083540402835291602001916101b1565b820191906000526020600020905b81548152906001019060200180831161019457829003601f168201915b505050505081565b60025481565b6000600460008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549050919050565b600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b6001805461023b906107a4565b80601f0160208091040260200160405190810160405280929190818152602001828054610267906107a4565b80156102b45780601f10610289576101008083540402835291602001916102b4565b820191906000526020600020905b81548152906001019060200180831161029757829003601f168201915b505050505081565b80600460003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054101561033e576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161033590610821565b60405180910390fd5b61036260405180606001604052806023815260200161095460239139338484610477565b80600460003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282546103b19190610870565b9250508190555080600460008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825461040791906108a4565b925050819055508173ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef8360405161046b9190610634565b60405180910390a35050565b6105138484848460405160240161049194939291906108d8565b6040516020818303038152906040527f8ef3f399000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19166020820180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff8381831617835250505050610519565b50505050565b61053081610528610533610554565b63ffffffff16565b50565b60006a636f6e736f6c652e6c6f679050600080835160208501845afa505050565b61055f819050919050565b610567610924565b565b600081519050919050565b600082825260208201905092915050565b60005b838110156105a3578082015181840152602081019050610588565b60008484015250505050565b6000601f19601f8301169050919050565b60006105cb82610569565b6105d58185610574565b93506105e5818560208601610585565b6105ee816105af565b840191505092915050565b6000602082019050818103600083015261061381846105c0565b905092915050565b6000819050919050565b61062e8161061b565b82525050565b60006020820190506106496000830184610625565b92915050565b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b600061067f82610654565b9050919050565b61068f81610674565b811461069a57600080fd5b50565b6000813590506106ac81610686565b92915050565b6000602082840312156106c8576106c761064f565b5b60006106d68482850161069d565b91505092915050565b6106e881610674565b82525050565b600060208201905061070360008301846106df565b92915050565b6107128161061b565b811461071d57600080fd5b50565b60008135905061072f81610709565b92915050565b6000806040838503121561074c5761074b61064f565b5b600061075a8582860161069d565b925050602061076b85828601610720565b9150509250929050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b600060028204905060018216806107bc57607f821691505b6020821081036107cf576107ce610775565b5b50919050565b7f4e6f7420656e6f75676820746f6b656e73000000000000000000000000000000600082015250565b600061080b601183610574565b9150610816826107d5565b602082019050919050565b6000602082019050818103600083015261083a816107fe565b9050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b600061087b8261061b565b91506108868361061b565b925082820390508181111561089e5761089d610841565b5b92915050565b60006108af8261061b565b91506108ba8361061b565b92508282019050808211156108d2576108d1610841565b5b92915050565b600060808201905081810360008301526108f281876105c0565b905061090160208301866106df565b61090e60408301856106df565b61091b6060830184610625565b95945050505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052605160045260246000fdfe5472616e7366666572696e672066726f6d20257320746f20257320257320746f6b656ea264697066735822122049d8494c0da51bf637194a6a98146ed1d391acd6cc3b604c730950f269eec53364736f6c634300081b0033";

type TokenConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: TokenConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class Token__factory extends ContractFactory {
  constructor(...args: TokenConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override getDeployTransaction(
    overrides?: NonPayableOverrides & { from?: string }
  ): Promise<ContractDeployTransaction> {
    return super.getDeployTransaction(overrides || {});
  }
  override deploy(overrides?: NonPayableOverrides & { from?: string }) {
    return super.deploy(overrides || {}) as Promise<
      Token & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): Token__factory {
    return super.connect(runner) as Token__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): TokenInterface {
    return new Interface(_abi) as TokenInterface;
  }
  static connect(address: string, runner?: ContractRunner | null): Token {
    return new Contract(address, _abi, runner) as unknown as Token;
  }
}