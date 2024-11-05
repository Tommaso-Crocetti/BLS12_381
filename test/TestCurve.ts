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

describe("Curve Contract", function () {
    let bigNumbers: BigNumbers;
    let bigFiniteField: BigFiniteField;
    let quadraticExtension: QuadraticExtension;
    let twelveExtension: TwelveExtension;
    let pointZp: PointZp;
    let pointZp_2: PointZp_2;
    let pointZp_12: PointZp_12;
    let curve: Curve;
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
        let sexticExtension = await SexticExtensionFactory.deploy(quadraticExtension);

        const TwelveExtensionFactory: TwelveExtension__factory = (await ethers.getContractFactory("TwelveExtension")) as TwelveExtension__factory;
        twelveExtension = await TwelveExtensionFactory.deploy(sexticExtension);
        const pointZp_2Factory: PointZp_2__factory = await ethers.getContractFactory("PointZp_2", {
            libraries: {
                BigNumbers: await bigNumbers.getAddress()
              }
        }) as PointZp_2__factory;
        pointZp_2 = await pointZp_2Factory.deploy(quadraticExtension);
        const pointZp_12Factory: PointZp_12__factory = await ethers.getContractFactory("PointZp_12", {
            libraries: {
                BigNumbers: await bigNumbers.getAddress()
              }
        }) as PointZp_12__factory;
        pointZp_12 = await pointZp_12Factory.deploy(twelveExtension);
        const curveFactory: Curve__factory = await ethers.getContractFactory("Curve", {
        libraries: {
            BigNumbers: await bigNumbers.getAddress()
        }
    }) as Curve__factory;
      curve = await curveFactory.deploy();
    });

    it("should calculate the miller loop", async function() {
        const g0: Point_ZpStruct = toPoint_ZpStruct(await curve.get_g0());
        const g1: Point_Zp_2Struct = toPoint_Zp_2Struct(await curve.get_g1());
        const result: Zp_12Struct = toZp_12Struct(await curve.miller(g0, g1));
        expect(result).to.equal(true);
       })
  
    it("should setup the curve contract correctly", async function () {
        const g0: Point_ZpStruct = toPoint_ZpStruct(await curve.get_g0());
        const g1: Point_Zp_2Struct = toPoint_Zp_2Struct(await curve.get_g1());
    });

    it("should have g_0 in the curve", async function() {
        const g0: Point_ZpStruct = toPoint_ZpStruct(await curve.get_g0());
        const point: Point_ZpStruct = toPoint_ZpStruct(await pointZp.double(g0));
        expect(await curve.isOnCurve(g0)).to.equal(true);
        expect(await curve.isOnCurve(point)).to.equal(true);
        expect(await curve.isOnCurve(toPoint_ZpStruct(await pointZp.add(g0, point))));
    });

    it("should have g_1 in the curve", async function() {
        const g1: Point_Zp_2Struct = toPoint_Zp_2Struct(await curve.get_g1());
        const point: Point_Zp_2Struct = toPoint_Zp_2Struct(await pointZp_2.double(g1));
        expect(await curve.isOnCurveTwist(g1)).to.equal(true);
        expect(await curve.isOnCurveTwist(point)).to.equal(true);
        expect(await curve.isOnCurveTwist(toPoint_Zp_2Struct(await pointZp_2.add(g1, point)))).to.equal(true);
    });

    it("should have g_12 in the curve", async function() {
        const g12: Point_Zp_12Struct = toPoint_Zp_12Struct(await curve.untwist(toPoint_Zp_2Struct(await curve.get_g1())));
        expect(await curve.isOnCurve_12(g12)).to.equal(true);
    });
    /*
    it("should have g_0 in the right subgroup", async function() {
        const g0: Point_ZpStruct = toPoint_ZpStruct(await curve.get_g0());
        expect(await curve.Subgroup_0Check(g0)).to.equal(true);
    });
    */
   it("should compute addEval correctly", async function() {
    const g0: Point_ZpStruct = toPoint_ZpStruct(await curve.get_g0());
    const g1: Point_Zp_2Struct = toPoint_Zp_2Struct(await curve.get_g1());
    const result: Zp_12Struct = toZp_12Struct(await curve.addEval(g1, toPoint_Zp_2Struct(await pointZp_2.double(g1)), g0));
    expect(await quadraticExtension.equals(result.a.a, toZp_2Struct(await quadraticExtension.createElement(
        toZpStruct(await bigFiniteField.createElement(toBigNumber(await bigNumbers.init__("0x0000000000000000000000000000000008b3f481e3aaa0f1a09e30ed741d8ae4fcf5e095d5d00af600db18cb2c04b3edd03cc744a2888ae40caa232946c5e7e1", false))))
        , toZpStruct(await bigFiniteField.zero()))))).to.equal(true)
    expect(await quadraticExtension.equals(result.a.b, toZp_2Struct(await quadraticExtension.createElement(
        toZpStruct(await bigFiniteField.zero())
        , toZpStruct(await bigFiniteField.zero()))))).to.equal(true)
    expect(await quadraticExtension.equals(result.a.c, toZp_2Struct(await quadraticExtension.createElement(
        toZpStruct(await bigFiniteField.zero())
        , toZpStruct(await bigFiniteField.zero()))))).to.equal(true)
    expect(await quadraticExtension.equals(result.b.a, toZp_2Struct(await quadraticExtension.createElement(
        toZpStruct(await bigFiniteField.zero())
        , toZpStruct(await bigFiniteField.zero()))))).to.equal(true)
    expect(await quadraticExtension.equals(result.b.b, toZp_2Struct(await quadraticExtension.createElement(
        toZpStruct(await bigFiniteField.createElement(toBigNumber(await bigNumbers.init__("0x000000000000000000000000000000000b9815bc2ca396ab2d857b02d5e593f3d43cf139a1457ac5fb5f715054af73afbb0acd63922b1c2c2f9029edda8a3e34", false))))
        , toZpStruct(await bigFiniteField.createElement(toBigNumber(await bigNumbers.init__("0x000000000000000000000000000000000a92313bed4812388c4c9af6d80002e9c0672d114ca6a6d0ac653db15f5d9ab8693037a8c61d5da5e15b06d1fbc74ebe", false)))))))).to.equal(true)
    expect(await quadraticExtension.equals(result.b.c, toZp_2Struct(await quadraticExtension.createElement(
        toZpStruct(await bigFiniteField.createElement(toBigNumber(await bigNumbers.init__("0x0000000000000000000000000000000007a215921b919d5ddf6787135a14b99c07f058519ac6b86a8746a6ecb6b2177fbcc50c8eb736ecc90ccf752d4460c9ef", false))))
        , toZpStruct(await bigFiniteField.createElement(toBigNumber(await bigNumbers.init__("0x0000000000000000000000000000000006bcaad7d6f48da26b40f10ceaeb958d981841801fec6ff8556c3d5fca3be3e522edb5070eead1681bd219ec832a4eaf", false)))))))).to.equal(true)
   })

   it("should compute doubleEval correctly", async function() {
    const g0: Point_ZpStruct = toPoint_ZpStruct(await curve.get_g0());
    const g1: Point_Zp_2Struct = toPoint_Zp_2Struct(await curve.get_g1());
    const result: Zp_12Struct = toZp_12Struct(await curve.doubleEval(g1, g0));
    expect(await quadraticExtension.equals(result.a.a, toZp_2Struct(await quadraticExtension.createElement(
        toZpStruct(await bigFiniteField.createElement(toBigNumber(await bigNumbers.init__("0x0000000000000000000000000000000008b3f481e3aaa0f1a09e30ed741d8ae4fcf5e095d5d00af600db18cb2c04b3edd03cc744a2888ae40caa232946c5e7e1", false))))
        , toZpStruct(await bigFiniteField.zero()))))).to.equal(true)
    expect(await quadraticExtension.equals(result.a.b, toZp_2Struct(await quadraticExtension.createElement(
        toZpStruct(await bigFiniteField.zero())
        , toZpStruct(await bigFiniteField.zero()))))).to.equal(true)
    expect(await quadraticExtension.equals(result.a.c, toZp_2Struct(await quadraticExtension.createElement(
        toZpStruct(await bigFiniteField.zero())
        , toZpStruct(await bigFiniteField.zero()))))).to.equal(true)
    expect(await quadraticExtension.equals(result.b.a, toZp_2Struct(await quadraticExtension.createElement(
        toZpStruct(await bigFiniteField.zero())
        , toZpStruct(await bigFiniteField.zero()))))).to.equal(true)
    expect(await quadraticExtension.equals(result.b.b, toZp_2Struct(await quadraticExtension.createElement(
        toZpStruct(await bigFiniteField.createElement(toBigNumber(await bigNumbers.init__("0x0000000000000000000000000000000005046996dbbc019e108c1bffa9a580bd3da2758e6747676a1f8f6f5a6c4581551282557c8309fe23619b9904d6964759", false))))
        , toZpStruct(await bigFiniteField.createElement(toBigNumber(await bigNumbers.init__("0x00000000000000000000000000000000004260d928bbf824e952dd69723d7729acfe7bb8e56ee4e9aeabddf333f73c576310e5d7e5a14d656d69f60fa50c8650", false)))))))).to.equal(true)
    expect(await quadraticExtension.equals(result.b.c, toZp_2Struct(await quadraticExtension.createElement(
        toZpStruct(await bigFiniteField.createElement(toBigNumber(await bigNumbers.init__("0x0000000000000000000000000000000005c7e861d7591b70faf54aaf571a1cdd67d510230f2e521a2bc1efc3c4aeb6be2c29d241dadcd3476b70fd12d4253412", false))))
        , toZpStruct(await bigFiniteField.createElement(toBigNumber(await bigNumbers.init__("0x000000000000000000000000000000000e09125087b55528cc0a5fde862293598dee4dd0137ae385cd379a8b97bbce06df363580bc0e2a5b9431d4f851153221", false)))))))).to.equal(true)
   })


});
