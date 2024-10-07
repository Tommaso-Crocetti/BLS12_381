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
  AddressLike,
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
} from "../common";

export declare namespace FiniteField {
  export type ZpStruct = { value: BigNumberish };

  export type ZpStructOutput = [value: bigint] & { value: bigint };
}

export declare namespace Curve {
  export type Point_0Struct = {
    pointType: BigNumberish;
    field: AddressLike;
    x: FiniteField.ZpStruct;
    y: FiniteField.ZpStruct;
  };

  export type Point_0StructOutput = [
    pointType: bigint,
    field: string,
    x: FiniteField.ZpStructOutput,
    y: FiniteField.ZpStructOutput
  ] & {
    pointType: bigint;
    field: string;
    x: FiniteField.ZpStructOutput;
    y: FiniteField.ZpStructOutput;
  };

  export type Point_1Struct = {
    pointType: BigNumberish;
    field: AddressLike;
    x: QuadraticExtension.Zp_2Struct;
    y: QuadraticExtension.Zp_2Struct;
  };

  export type Point_1StructOutput = [
    pointType: bigint,
    field: string,
    x: QuadraticExtension.Zp_2StructOutput,
    y: QuadraticExtension.Zp_2StructOutput
  ] & {
    pointType: bigint;
    field: string;
    x: QuadraticExtension.Zp_2StructOutput;
    y: QuadraticExtension.Zp_2StructOutput;
  };
}

export declare namespace QuadraticExtension {
  export type Zp_2Struct = { a: FiniteField.ZpStruct; b: FiniteField.ZpStruct };

  export type Zp_2StructOutput = [
    a: FiniteField.ZpStructOutput,
    b: FiniteField.ZpStructOutput
  ] & { a: FiniteField.ZpStructOutput; b: FiniteField.ZpStructOutput };
}

export interface CurveInterface extends Interface {
  getFunction(nameOrSignature: "isOnCurve_0" | "isOnCurve_1"): FunctionFragment;

  encodeFunctionData(
    functionFragment: "isOnCurve_0",
    values: [AddressLike, Curve.Point_0Struct]
  ): string;
  encodeFunctionData(
    functionFragment: "isOnCurve_1",
    values: [AddressLike, Curve.Point_1Struct]
  ): string;

  decodeFunctionResult(
    functionFragment: "isOnCurve_0",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "isOnCurve_1",
    data: BytesLike
  ): Result;
}

export interface Curve extends BaseContract {
  connect(runner?: ContractRunner | null): Curve;
  waitForDeployment(): Promise<this>;

  interface: CurveInterface;

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

  isOnCurve_0: TypedContractMethod<
    [f: AddressLike, p: Curve.Point_0Struct],
    [boolean],
    "view"
  >;

  isOnCurve_1: TypedContractMethod<
    [q: AddressLike, p: Curve.Point_1Struct],
    [boolean],
    "view"
  >;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "isOnCurve_0"
  ): TypedContractMethod<
    [f: AddressLike, p: Curve.Point_0Struct],
    [boolean],
    "view"
  >;
  getFunction(
    nameOrSignature: "isOnCurve_1"
  ): TypedContractMethod<
    [q: AddressLike, p: Curve.Point_1Struct],
    [boolean],
    "view"
  >;

  filters: {};
}
