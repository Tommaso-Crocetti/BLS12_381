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

export declare namespace FiniteField {
  export type ZpStruct = { value: BigNumberish };

  export type ZpStructOutput = [value: bigint] & { value: bigint };
}

export declare namespace QuadraticExtension {
  export type Zp_2Struct = { a: FiniteField.ZpStruct; b: FiniteField.ZpStruct };

  export type Zp_2StructOutput = [
    a: FiniteField.ZpStructOutput,
    b: FiniteField.ZpStructOutput
  ] & { a: FiniteField.ZpStructOutput; b: FiniteField.ZpStructOutput };
}

export declare namespace SexticExtension {
  export type Zp_6Struct = {
    a: QuadraticExtension.Zp_2Struct;
    b: QuadraticExtension.Zp_2Struct;
    c: QuadraticExtension.Zp_2Struct;
  };

  export type Zp_6StructOutput = [
    a: QuadraticExtension.Zp_2StructOutput,
    b: QuadraticExtension.Zp_2StructOutput,
    c: QuadraticExtension.Zp_2StructOutput
  ] & {
    a: QuadraticExtension.Zp_2StructOutput;
    b: QuadraticExtension.Zp_2StructOutput;
    c: QuadraticExtension.Zp_2StructOutput;
  };
}

export declare namespace TwelveExtension {
  export type Zp_12Struct = {
    a: SexticExtension.Zp_6Struct;
    b: SexticExtension.Zp_6Struct;
  };

  export type Zp_12StructOutput = [
    a: SexticExtension.Zp_6StructOutput,
    b: SexticExtension.Zp_6StructOutput
  ] & {
    a: SexticExtension.Zp_6StructOutput;
    b: SexticExtension.Zp_6StructOutput;
  };
}

export interface TwelveExtensionInterface extends Interface {
  getFunction(
    nameOrSignature: "createElement" | "inverse" | "mul" | "sub" | "sum"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "createElement",
    values: [SexticExtension.Zp_6Struct, SexticExtension.Zp_6Struct]
  ): string;
  encodeFunctionData(
    functionFragment: "inverse",
    values: [TwelveExtension.Zp_12Struct]
  ): string;
  encodeFunctionData(
    functionFragment: "mul",
    values: [TwelveExtension.Zp_12Struct, TwelveExtension.Zp_12Struct]
  ): string;
  encodeFunctionData(
    functionFragment: "sub",
    values: [TwelveExtension.Zp_12Struct, TwelveExtension.Zp_12Struct]
  ): string;
  encodeFunctionData(
    functionFragment: "sum",
    values: [TwelveExtension.Zp_12Struct, TwelveExtension.Zp_12Struct]
  ): string;

  decodeFunctionResult(
    functionFragment: "createElement",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "inverse", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "mul", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "sub", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "sum", data: BytesLike): Result;
}

export interface TwelveExtension extends BaseContract {
  connect(runner?: ContractRunner | null): TwelveExtension;
  waitForDeployment(): Promise<this>;

  interface: TwelveExtensionInterface;

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
    [x: SexticExtension.Zp_6Struct, y: SexticExtension.Zp_6Struct],
    [TwelveExtension.Zp_12StructOutput],
    "view"
  >;

  inverse: TypedContractMethod<
    [x: TwelveExtension.Zp_12Struct],
    [TwelveExtension.Zp_12StructOutput],
    "view"
  >;

  mul: TypedContractMethod<
    [x: TwelveExtension.Zp_12Struct, y: TwelveExtension.Zp_12Struct],
    [TwelveExtension.Zp_12StructOutput],
    "view"
  >;

  sub: TypedContractMethod<
    [x: TwelveExtension.Zp_12Struct, y: TwelveExtension.Zp_12Struct],
    [TwelveExtension.Zp_12StructOutput],
    "view"
  >;

  sum: TypedContractMethod<
    [x: TwelveExtension.Zp_12Struct, y: TwelveExtension.Zp_12Struct],
    [TwelveExtension.Zp_12StructOutput],
    "view"
  >;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "createElement"
  ): TypedContractMethod<
    [x: SexticExtension.Zp_6Struct, y: SexticExtension.Zp_6Struct],
    [TwelveExtension.Zp_12StructOutput],
    "view"
  >;
  getFunction(
    nameOrSignature: "inverse"
  ): TypedContractMethod<
    [x: TwelveExtension.Zp_12Struct],
    [TwelveExtension.Zp_12StructOutput],
    "view"
  >;
  getFunction(
    nameOrSignature: "mul"
  ): TypedContractMethod<
    [x: TwelveExtension.Zp_12Struct, y: TwelveExtension.Zp_12Struct],
    [TwelveExtension.Zp_12StructOutput],
    "view"
  >;
  getFunction(
    nameOrSignature: "sub"
  ): TypedContractMethod<
    [x: TwelveExtension.Zp_12Struct, y: TwelveExtension.Zp_12Struct],
    [TwelveExtension.Zp_12StructOutput],
    "view"
  >;
  getFunction(
    nameOrSignature: "sum"
  ): TypedContractMethod<
    [x: TwelveExtension.Zp_12Struct, y: TwelveExtension.Zp_12Struct],
    [TwelveExtension.Zp_12StructOutput],
    "view"
  >;

  filters: {};
}
