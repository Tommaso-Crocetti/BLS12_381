//errore, codice di inizializzazione troppo grande:
//Trying to send a deployment transaction whose init code length is 105475. 
//The max length allowed by EIP-3860 is 49152.
//Enable the 'allowUnlimitedContractSize' option to allow init codes of any length.

import { ethers } from "hardhat";
import { expect } from "chai";
import { BigFiniteField, BigFiniteField__factory, BigNumbers, BigNumbers__factory } from "../typechain-types"; // Assicurati che il percorso sia corretto
import { QuadraticExtension, QuadraticExtension__factory } from "../typechain-types"
import { SexticExtension, SexticExtension__factory } from "../typechain-types";
import { TwelveExtension, TwelveExtension__factory } from "../typechain-types";
import { BigNumberStruct, BigNumberStructOutput } from "../typechain-types/BigNumber.sol/BigNumbers";
import { ZpStruct, ZpStructOutput } from "../typechain-types/field/BigFiniteField";
import { Zp_2Struct, Zp_2StructOutput } from "../typechain-types/field/quadraticExtension.sol/QuadraticExtension";
import { Zp_6Struct, Zp_6StructOutput } from "../typechain-types/field/sexticExtension.sol/SexticExtension";
import { Zp_12Struct, Zp_12StructOutput } from "../typechain-types/field/twelveExtension.sol/TwelveExtension";
import { PointZp, PointZp__factory } from "../typechain-types";
import { PointZp_2, PointZp_2__factory } from "../typechain-types";
import { PointZp_12, PointZp_12__factory } from "../typechain-types";
import { Point_ZpStruct, Point_ZpStructOutput } from "../typechain-types/point/pointZp.sol/PointZp";
import { Point_Zp_2Struct, Point_Zp_2StructOutput } from "../typechain-types/point/pointZp_2.sol/PointZp_2";
import { Point_Zp_12Struct, Point_Zp_12StructOutput } from "../typechain-types/point/pointZp_12.sol/PointZp_12";
import { Curve, Curve__factory } from "../typechain-types"


function toBigNumber(input: BigNumberStructOutput): BigNumberStruct {
    return {val: input.val, neg: input.neg, bitlen: input.bitlen };
}

function toZpStruct(output: ZpStructOutput): ZpStruct {
    return { value: toBigNumber(output.value) }; // Restituisce un oggetto con la proprietà value
}

function toZp_2Struct(output: Zp_2StructOutput): Zp_2Struct {
    return { a: toZpStruct(output.a), b: toZpStruct(output.b) }; // Restituisce un oggetto con la proprietà value
}

function toZp_6Struct(output: Zp_6StructOutput): Zp_6Struct {
    return {
      a: toZp_2Struct(output.a),
      b: toZp_2Struct(output.b),
      c: toZp_2Struct(output.c),
    };
  }

function toZp_12Struct(output: Zp_12StructOutput): Zp_12Struct {
    return { a: toZp_6Struct(output.a), b: toZp_6Struct(output.b)};
}

function toPoint_ZpStruct(input: Point_ZpStructOutput): Point_ZpStruct {
    return {pointType: input.pointType, x: toZpStruct(input.x), y: toZpStruct(input.y)};
}

function toPoint_Zp_2Struct(input: Point_Zp_2StructOutput): Point_Zp_2Struct {
    return {pointType: input.pointType, x: toZp_2Struct(input.x), y: toZp_2Struct(input.y)};
}

function toPoint_Zp_12Struct(input: Point_Zp_12StructOutput): Point_Zp_12Struct {
    return {pointType: input.pointType, x: toZp_12Struct(input.x), y: toZp_12Struct(input.y)};
}

describe("Gas Curve", function () {
    let bigNumbers: BigNumbers;
    let bigFiniteField: BigFiniteField;
    let quadraticExtension: QuadraticExtension;
    let sexticExtension: SexticExtension;
    let twelveExtension: TwelveExtension;
    let pointZp: PointZp;
    let pointZp_2: PointZp_2;
    let pointZp_12: PointZp_12;
    let curve: Curve;
    let g0: Point_ZpStruct;
    let g1: Point_Zp_2Struct;
    let g12: Point_Zp_12Struct;
    beforeEach(async function () {
        const bigNumbersFactory: BigNumbers__factory = await ethers.getContractFactory("BigNumbers") as BigNumbers__factory;
        bigNumbers = await bigNumbersFactory.deploy();
        const bigFiniteFieldFactory: BigFiniteField__factory = await ethers.getContractFactory("BigFiniteField", {
            libraries: {
                BigNumbers: await bigNumbers.getAddress()
              }
        }) as BigFiniteField__factory;
        bigFiniteField = await bigFiniteFieldFactory.deploy(toBigNumber(await bigNumbers.init__("0x1a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffffffffaaab", false)));
        const pointZpFactory: PointZp__factory = await ethers.getContractFactory("PointZp", {
            libraries: {
                BigNumbers: await bigNumbers.getAddress()
              }
        }) as PointZp__factory;
        pointZp = await pointZpFactory.deploy(bigFiniteField);
        const quadraticExtensionFactory: QuadraticExtension__factory = await ethers.getContractFactory("QuadraticExtension") as QuadraticExtension__factory;
        quadraticExtension = await quadraticExtensionFactory.deploy(bigFiniteField);
        const SexticExtensionFactory: SexticExtension__factory = (await ethers.getContractFactory("SexticExtension")) as SexticExtension__factory;
        sexticExtension = await SexticExtensionFactory.deploy(quadraticExtension);

        const TwelveExtensionFactory: TwelveExtension__factory = (await ethers.getContractFactory("TwelveExtension")) as TwelveExtension__factory;
        twelveExtension = await TwelveExtensionFactory.deploy(sexticExtension);
        const pointZp_2Factory: PointZp_2__factory = await ethers.getContractFactory("PointZp_2", {
            libraries: {
                BigNumbers: await bigNumbers.getAddress()
              }
        }) as PointZp_2__factory;
        pointZp_2 = await pointZp_2Factory.deploy(quadraticExtension);
        const pointZp_12Factory: PointZp_12__factory = await ethers.getContractFactory("PointZp_12") as PointZp_12__factory;
        pointZp_12 = await pointZp_12Factory.deploy(twelveExtension);
        const curveFactory: Curve__factory = await ethers.getContractFactory("Curve", {
        libraries: {
            BigNumbers: await bigNumbers.getAddress()
        }
    }) as Curve__factory;
        curve = await curveFactory.deploy();
        g0 = toPoint_ZpStruct(await curve.get_g0());
        g1 = toPoint_Zp_2Struct(await curve.get_g1());
        //g12 = await curve.untwist(g1);
    });
    
    it("gas usage", async function() {
        await curve.get_prime();
        await curve.get_order();
        await curve.isOnCurve(g0);
        await curve.isOnCurveTwist(g1);
    })

    it("gas usage", async function() {
        g12 = toPoint_Zp_12Struct(await curve.untwist(g1));
        await curve.isOnCurve_12(g12);
    })
});
