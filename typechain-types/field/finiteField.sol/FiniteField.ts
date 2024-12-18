/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumberish,
  BytesLike,
  FunctionFragment,
  Result,
  Interface,
  ContractRunner,
  ContractMethod,
  Listener,
} from "ethers";
import type {
  TypedContractEvent,
  TypedDeferredTopicFilter,
  TypedEventLog,
  TypedListener,
  TypedContractMethod,
} from "../../common";

export type ZpStruct = { value: BigNumberish };

export type ZpStructOutput = [value: bigint] & { value: bigint };

export interface FiniteFieldInterface extends Interface {
  getFunction(
    nameOrSignature:
      | "createElement"
      | "div"
      | "equals"
      | "exp"
      | "inverse"
      | "mul"
      | "mul_nonres"
      | "p"
      | "sub"
      | "sum"
      | "zero"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "createElement",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "div",
    values: [ZpStruct, ZpStruct]
  ): string;
  encodeFunctionData(
    functionFragment: "equals",
    values: [ZpStruct, ZpStruct]
  ): string;
  encodeFunctionData(
    functionFragment: "exp",
    values: [BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "inverse", values: [ZpStruct]): string;
  encodeFunctionData(
    functionFragment: "mul",
    values: [ZpStruct, ZpStruct]
  ): string;
  encodeFunctionData(
    functionFragment: "mul_nonres",
    values: [ZpStruct]
  ): string;
  encodeFunctionData(functionFragment: "p", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "sub",
    values: [ZpStruct, ZpStruct]
  ): string;
  encodeFunctionData(
    functionFragment: "sum",
    values: [ZpStruct, ZpStruct]
  ): string;
  encodeFunctionData(functionFragment: "zero", values?: undefined): string;

  decodeFunctionResult(
    functionFragment: "createElement",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "div", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "equals", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "exp", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "inverse", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "mul", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "mul_nonres", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "p", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "sub", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "sum", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "zero", data: BytesLike): Result;
}

export interface FiniteField extends BaseContract {
  connect(runner?: ContractRunner | null): FiniteField;
  waitForDeployment(): Promise<this>;

  interface: FiniteFieldInterface;

  queryFilter<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;
  queryFilter<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;

  on<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  on<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  once<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  once<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  listeners<TCEvent extends TypedContractEvent>(
    event: TCEvent
  ): Promise<Array<TypedListener<TCEvent>>>;
  listeners(eventName?: string): Promise<Array<Listener>>;
  removeAllListeners<TCEvent extends TypedContractEvent>(
    event?: TCEvent
  ): Promise<this>;

  createElement: TypedContractMethod<
    [value: BigNumberish],
    [ZpStructOutput],
    "view"
  >;

  div: TypedContractMethod<
    [a: ZpStruct, b: ZpStruct],
    [ZpStructOutput],
    "view"
  >;

  equals: TypedContractMethod<[a: ZpStruct, b: ZpStruct], [boolean], "view">;

  exp: TypedContractMethod<
    [base: BigNumberish, exponent: BigNumberish],
    [bigint],
    "view"
  >;

  inverse: TypedContractMethod<[a: ZpStruct], [ZpStructOutput], "view">;

  mul: TypedContractMethod<
    [a: ZpStruct, b: ZpStruct],
    [ZpStructOutput],
    "view"
  >;

  mul_nonres: TypedContractMethod<[a: ZpStruct], [ZpStructOutput], "view">;

  p: TypedContractMethod<[], [bigint], "view">;

  sub: TypedContractMethod<
    [a: ZpStruct, b: ZpStruct],
    [ZpStructOutput],
    "view"
  >;

  sum: TypedContractMethod<
    [a: ZpStruct, b: ZpStruct],
    [ZpStructOutput],
    "view"
  >;

  zero: TypedContractMethod<[], [ZpStructOutput], "view">;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "createElement"
  ): TypedContractMethod<[value: BigNumberish], [ZpStructOutput], "view">;
  getFunction(
    nameOrSignature: "div"
  ): TypedContractMethod<[a: ZpStruct, b: ZpStruct], [ZpStructOutput], "view">;
  getFunction(
    nameOrSignature: "equals"
  ): TypedContractMethod<[a: ZpStruct, b: ZpStruct], [boolean], "view">;
  getFunction(
    nameOrSignature: "exp"
  ): TypedContractMethod<
    [base: BigNumberish, exponent: BigNumberish],
    [bigint],
    "view"
  >;
  getFunction(
    nameOrSignature: "inverse"
  ): TypedContractMethod<[a: ZpStruct], [ZpStructOutput], "view">;
  getFunction(
    nameOrSignature: "mul"
  ): TypedContractMethod<[a: ZpStruct, b: ZpStruct], [ZpStructOutput], "view">;
  getFunction(
    nameOrSignature: "mul_nonres"
  ): TypedContractMethod<[a: ZpStruct], [ZpStructOutput], "view">;
  getFunction(nameOrSignature: "p"): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "sub"
  ): TypedContractMethod<[a: ZpStruct, b: ZpStruct], [ZpStructOutput], "view">;
  getFunction(
    nameOrSignature: "sum"
  ): TypedContractMethod<[a: ZpStruct, b: ZpStruct], [ZpStructOutput], "view">;
  getFunction(
    nameOrSignature: "zero"
  ): TypedContractMethod<[], [ZpStructOutput], "view">;

  filters: {};
}
