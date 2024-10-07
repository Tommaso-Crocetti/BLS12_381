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
import type { Curve, CurveInterface } from "../../curve.sol/Curve";

const _abi = [
  {
    inputs: [
      {
        internalType: "contract FiniteField",
        name: "f",
        type: "address",
      },
      {
        components: [
          {
            internalType: "enum Curve.PointType",
            name: "pointType",
            type: "uint8",
          },
          {
            internalType: "contract FiniteField",
            name: "field",
            type: "address",
          },
          {
            components: [
              {
                internalType: "uint256",
                name: "value",
                type: "uint256",
              },
            ],
            internalType: "struct FiniteField.Zp",
            name: "x",
            type: "tuple",
          },
          {
            components: [
              {
                internalType: "uint256",
                name: "value",
                type: "uint256",
              },
            ],
            internalType: "struct FiniteField.Zp",
            name: "y",
            type: "tuple",
          },
        ],
        internalType: "struct Curve.Point_0",
        name: "p",
        type: "tuple",
      },
    ],
    name: "isOnCurve_0",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract QuadraticExtension",
        name: "q",
        type: "address",
      },
      {
        components: [
          {
            internalType: "enum Curve.PointType",
            name: "pointType",
            type: "uint8",
          },
          {
            internalType: "contract QuadraticExtension",
            name: "field",
            type: "address",
          },
          {
            components: [
              {
                components: [
                  {
                    internalType: "uint256",
                    name: "value",
                    type: "uint256",
                  },
                ],
                internalType: "struct FiniteField.Zp",
                name: "a",
                type: "tuple",
              },
              {
                components: [
                  {
                    internalType: "uint256",
                    name: "value",
                    type: "uint256",
                  },
                ],
                internalType: "struct FiniteField.Zp",
                name: "b",
                type: "tuple",
              },
            ],
            internalType: "struct QuadraticExtension.Zp_2",
            name: "x",
            type: "tuple",
          },
          {
            components: [
              {
                components: [
                  {
                    internalType: "uint256",
                    name: "value",
                    type: "uint256",
                  },
                ],
                internalType: "struct FiniteField.Zp",
                name: "a",
                type: "tuple",
              },
              {
                components: [
                  {
                    internalType: "uint256",
                    name: "value",
                    type: "uint256",
                  },
                ],
                internalType: "struct FiniteField.Zp",
                name: "b",
                type: "tuple",
              },
            ],
            internalType: "struct QuadraticExtension.Zp_2",
            name: "y",
            type: "tuple",
          },
        ],
        internalType: "struct Curve.Point_1",
        name: "p",
        type: "tuple",
      },
    ],
    name: "isOnCurve_1",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

const _bytecode =
  "0x6080604052348015600f57600080fd5b50610f228061001f6000396000f3fe608060405234801561001057600080fd5b50600436106100365760003560e01c80632832a3de1461003b578063f3bc61f81461006b575b600080fd5b61005560048036038101906100509190610a4f565b61009b565b6040516100629190610aaa565b60405180910390f35b61008560048036038101906100809190610bcb565b610459565b6040516100929190610aaa565b60405180910390f35b60006001808111156100b0576100af610c0b565b5b826000015160018111156100c7576100c6610c0b565b5b036100d55760009050610453565b60008373ffffffffffffffffffffffffffffffffffffffff1663b2eb1a5a846060015185606001516040518363ffffffff1660e01b815260040161011a929190610c65565b602060405180830381865afa158015610137573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061015b9190610cdf565b905060008473ffffffffffffffffffffffffffffffffffffffff1663a253aeee8673ffffffffffffffffffffffffffffffffffffffff1663b2eb1a5a8873ffffffffffffffffffffffffffffffffffffffff1663b2eb1a5a89604001518a604001516040518363ffffffff1660e01b81526004016101da929190610c65565b602060405180830381865afa1580156101f7573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061021b9190610cdf565b88604001516040518363ffffffff1660e01b815260040161023d929190610c65565b602060405180830381865afa15801561025a573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061027e9190610cdf565b8773ffffffffffffffffffffffffffffffffffffffff1663aa28c5be8973ffffffffffffffffffffffffffffffffffffffff1663c452494760046040518263ffffffff1660e01b81526004016102d49190610d51565b602060405180830381865afa1580156102f1573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906103159190610cdf565b6040518263ffffffff1660e01b81526004016103319190610d6c565b602060405180830381865afa15801561034e573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906103729190610cdf565b6040518363ffffffff1660e01b815260040161038f929190610c65565b602060405180830381865afa1580156103ac573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906103d09190610cdf565b90508473ffffffffffffffffffffffffffffffffffffffff1663d629f52883836040518363ffffffff1660e01b815260040161040d929190610c65565b602060405180830381865afa15801561042a573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061044e9190610db3565b925050505b92915050565b600060018081111561046e5761046d610c0b565b5b8260000151600181111561048557610484610c0b565b5b03610493576000905061082a565b60008373ffffffffffffffffffffffffffffffffffffffff166359607422846060015185606001516040518363ffffffff1660e01b81526004016104d8929190610e2b565b6040805180830381865afa1580156104f4573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906105189190610ea4565b905060008473ffffffffffffffffffffffffffffffffffffffff1663f73f27028673ffffffffffffffffffffffffffffffffffffffff1663596074228873ffffffffffffffffffffffffffffffffffffffff16635960742289604001518a604001516040518363ffffffff1660e01b8152600401610597929190610e2b565b6040805180830381865afa1580156105b3573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906105d79190610ea4565b88604001516040518363ffffffff1660e01b81526004016105f9929190610e2b565b6040805180830381865afa158015610615573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906106399190610ea4565b8773ffffffffffffffffffffffffffffffffffffffff16633edf76af8973ffffffffffffffffffffffffffffffffffffffff16632966679a60405180602001604052806004815250604051806020016040528060008152506040518363ffffffff1660e01b81526004016106ae929190610c65565b6040805180830381865afa1580156106ca573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906106ee9190610ea4565b6040518263ffffffff1660e01b815260040161070a9190610ed1565b6040805180830381865afa158015610726573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061074a9190610ea4565b6040518363ffffffff1660e01b8152600401610767929190610e2b565b6040805180830381865afa158015610783573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906107a79190610ea4565b90508473ffffffffffffffffffffffffffffffffffffffff16639d59dc9983836040518363ffffffff1660e01b81526004016107e4929190610e2b565b602060405180830381865afa158015610801573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906108259190610db3565b925050505b92915050565b6000604051905090565b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b600061086a8261083f565b9050919050565b600061087c8261085f565b9050919050565b61088c81610871565b811461089757600080fd5b50565b6000813590506108a981610883565b92915050565b600080fd5b6000601f19601f8301169050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b6108fd826108b4565b810181811067ffffffffffffffff8211171561091c5761091b6108c5565b5b80604052505050565b600061092f610830565b905061093b82826108f4565b919050565b6002811061094d57600080fd5b50565b60008135905061095f81610940565b92915050565b6000819050919050565b61097881610965565b811461098357600080fd5b50565b6000813590506109958161096f565b92915050565b6000602082840312156109b1576109b06108af565b5b6109bb6020610925565b905060006109cb84828501610986565b60008301525092915050565b6000608082840312156109ed576109ec6108af565b5b6109f76080610925565b90506000610a0784828501610950565b6000830152506020610a1b8482850161089a565b6020830152506040610a2f8482850161099b565b6040830152506060610a438482850161099b565b60608301525092915050565b60008060a08385031215610a6657610a6561083a565b5b6000610a748582860161089a565b9250506020610a85858286016109d7565b9150509250929050565b60008115159050919050565b610aa481610a8f565b82525050565b6000602082019050610abf6000830184610a9b565b92915050565b6000610ad08261085f565b9050919050565b610ae081610ac5565b8114610aeb57600080fd5b50565b600081359050610afd81610ad7565b92915050565b600060408284031215610b1957610b186108af565b5b610b236040610925565b90506000610b338482850161099b565b6000830152506020610b478482850161099b565b60208301525092915050565b600060c08284031215610b6957610b686108af565b5b610b736080610925565b90506000610b8384828501610950565b6000830152506020610b9784828501610aee565b6020830152506040610bab84828501610b03565b6040830152506080610bbf84828501610b03565b60608301525092915050565b60008060e08385031215610be257610be161083a565b5b6000610bf085828601610aee565b9250506020610c0185828601610b53565b9150509250929050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b610c4381610965565b82525050565b602082016000820151610c5f6000850182610c3a565b50505050565b6000604082019050610c7a6000830185610c49565b610c876020830184610c49565b9392505050565b600081519050610c9d8161096f565b92915050565b600060208284031215610cb957610cb86108af565b5b610cc36020610925565b90506000610cd384828501610c8e565b60008301525092915050565b600060208284031215610cf557610cf461083a565b5b6000610d0384828501610ca3565b91505092915050565b6000819050919050565b6000819050919050565b6000610d3b610d36610d3184610d0c565b610d16565b610965565b9050919050565b610d4b81610d20565b82525050565b6000602082019050610d666000830184610d42565b92915050565b6000602082019050610d816000830184610c49565b92915050565b610d9081610a8f565b8114610d9b57600080fd5b50565b600081519050610dad81610d87565b92915050565b600060208284031215610dc957610dc861083a565b5b6000610dd784828501610d9e565b91505092915050565b602082016000820151610df66000850182610c3a565b50505050565b604082016000820151610e126000850182610de0565b506020820151610e256020850182610de0565b50505050565b6000608082019050610e406000830185610dfc565b610e4d6040830184610dfc565b9392505050565b600060408284031215610e6a57610e696108af565b5b610e746040610925565b90506000610e8484828501610ca3565b6000830152506020610e9884828501610ca3565b60208301525092915050565b600060408284031215610eba57610eb961083a565b5b6000610ec884828501610e54565b91505092915050565b6000604082019050610ee66000830184610dfc565b9291505056fea2646970667358221220a0e10126f102b779eed65b6a736953147d351fcb9293d06b523d125eedb4bc1d64736f6c634300081b0033";

type CurveConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: CurveConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class Curve__factory extends ContractFactory {
  constructor(...args: CurveConstructorParams) {
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
      Curve & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): Curve__factory {
    return super.connect(runner) as Curve__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): CurveInterface {
    return new Interface(_abi) as CurveInterface;
  }
  static connect(address: string, runner?: ContractRunner | null): Curve {
    return new Contract(address, _abi, runner) as unknown as Curve;
  }
}