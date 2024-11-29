//errore, codice di inizializzazione troppo grande:
//Trying to send a deployment transaction whose init code length is 105475. 
//The max length allowed by EIP-3860 is 49152.
//Enable the 'allowUnlimitedContractSize' option to allow init codes of any length.

import { ethers } from "hardhat";
import { expect } from "chai";
import { BigFiniteField, BigFiniteField__factory, BigNumbers, BigNumbers__factory, GetBits, GetBits__factory } from "../typechain-types"; // Assicurati che il percorso sia corretto
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
import {
    loadFixture
  } from "@nomicfoundation/hardhat-toolbox/network-helpers";


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

describe("Time and gas usage", function () {
    async function deploy() {

        let bigNumbers: BigNumbers;
        let getBits: GetBits;
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
        const bigNumbersFactory: BigNumbers__factory = await ethers.getContractFactory("BigNumbers") as BigNumbers__factory;
        bigNumbers = await bigNumbersFactory.deploy();
        const getBitsFactory: GetBits__factory = await ethers.getContractFactory("GetBits", {
            libraries: {
                BigNumbers: await bigNumbers.getAddress()
            }
        }) as GetBits__factory;
        getBits = await getBitsFactory.deploy();
        const bigFiniteFieldFactory: BigFiniteField__factory = await ethers.getContractFactory("BigFiniteField", {
            libraries: {
                BigNumbers: await bigNumbers.getAddress()
            }
        }) as BigFiniteField__factory;
        bigFiniteField = await bigFiniteFieldFactory.deploy(toBigNumber(await bigNumbers.init__("0x1a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffffffffaaab", false)));
        const pointZpFactory: PointZp__factory = await ethers.getContractFactory("PointZp", {
            libraries: {
                GetBits: await getBits.getAddress()
            }
        }) as PointZp__factory;
        pointZp = await pointZpFactory.deploy(bigFiniteField);
        const quadraticExtensionFactory: QuadraticExtension__factory = await ethers.getContractFactory("QuadraticExtension") as QuadraticExtension__factory;
        quadraticExtension = await quadraticExtensionFactory.deploy(bigFiniteField);
        const SexticExtensionFactory: SexticExtension__factory = (await ethers.getContractFactory("SexticExtension")) as SexticExtension__factory;
        sexticExtension = await SexticExtensionFactory.deploy(quadraticExtension);
        const TwelveExtensionFactory: TwelveExtension__factory = (await ethers.getContractFactory("TwelveExtension", {
            libraries: {
                BigNumbers: await bigNumbers.getAddress(),
                GetBits: await getBits.getAddress()
            }
        })) as TwelveExtension__factory;
        twelveExtension = await TwelveExtensionFactory.deploy(sexticExtension);
        const pointZp_2Factory: PointZp_2__factory = await ethers.getContractFactory("PointZp_2", {
            libraries: {
                GetBits: await getBits.getAddress()
            }
        }) as PointZp_2__factory;
        pointZp_2 = await pointZp_2Factory.deploy(quadraticExtension);
        const pointZp_12Factory: PointZp_12__factory = await ethers.getContractFactory("PointZp_12") as PointZp_12__factory;
        pointZp_12 = await pointZp_12Factory.deploy(twelveExtension);
        const curveFactory: Curve__factory = await ethers.getContractFactory("Curve", {
            libraries: {
                BigNumbers: await bigNumbers.getAddress(),
                GetBits: await getBits.getAddress()
            }
        }) as Curve__factory;
        curve = await curveFactory.deploy();
        g0 = toPoint_ZpStruct(await curve.get_g0());
        g1 = toPoint_Zp_2Struct(await curve.get_g1());
        const g = toPoint_Zp_2Struct(await pointZp_2.double(g1));
        //g12 = toPoint_Zp_12Struct(await curve.untwist(g1));
        return {bigNumbers, getBits, bigFiniteField, quadraticExtension, sexticExtension, twelveExtension, pointZp, pointZp_2, pointZp_12, curve, g0, g1, g};
    }
    
    it("Setup", async function() {
        await loadFixture(deploy);
    })

    /*
    
    it("IsOnCurve check", async function() {
        const {curve, g0} = await loadFixture(deploy);
        console.time();
        await curve.isOnCurve(g0);
        console.timeEnd();
    })

    it("IsOnCurve_Twist check", async function() {
        const {curve, g1} = await loadFixture(deploy);
        console.time();
        await curve.isOnCurveTwist(g1);
        console.timeEnd();
    })
    it("Untwist", async function() {
        const {curve, g1} = await loadFixture(deploy);
        console.time();
        await curve.untwist(g1);
        console.timeEnd();
    })   

    it("IsOnCurve12 check", async function() {
        const {curve, g1} = await loadFixture(deploy);
        const g12 = toPoint_Zp_12Struct(await curve.untwist(g1));
        console.time();
        await curve.isOnCurve_12(g12);
        console.timeEnd();
    })
        
    it("Subgroup0 check", async function() {
        const {curve, g0} = await loadFixture(deploy);
        console.time();
        await curve.Subgroup_0Check(g0);
        console.timeEnd();
    })
    */
    it("DoubleEval", async function() {
        const {curve, g0, g1} = await loadFixture(deploy);
        console.time();
        await curve.doubleEval(g1, g0);
        console.timeEnd();
    })
    
/*
    it("Addeval", async function() {
        const {pointZp_2, curve, g0, g1, g} = await loadFixture(deploy);
        console.time();
        await curve.addEval(g1, g, g0);
        console.timeEnd();
    })
    

    it("Miller loop", async function() {
        const {curve, g0, g1} = await loadFixture(deploy);
        console.time();
        await curve.miller(g0, g1);
        console.timeEnd();
    })

    it("Pairing evaluation", async function() {
        const {curve, g0, g1} = await loadFixture(deploy);
        console.time();
        await curve.pairing(g0, g1);
        console.timeEnd();
    })

    it("Verification", async function() {
        const {curve, g0, g1} = await loadFixture(deploy);
        console.time();
        await curve.verify(g0, g1, g1);
        console.timeEnd();
    })
*/
});
