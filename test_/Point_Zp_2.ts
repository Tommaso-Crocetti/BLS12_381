//errore, codice di inizializzazione troppo grande:
//Trying to send a deployment transaction whose init code length is 105475. 
//The max length allowed by EIP-3860 is 49152.
//Enable the 'allowUnlimitedContractSize' option to allow init codes of any length.

import { ethers } from "hardhat";
import { expect } from "chai";
import { BigFiniteField, BigFiniteField__factory, BigNumbers, BigNumbers__factory, GetBits__factory, GetBits, QuadraticExtension, QuadraticExtension__factory, PointZp_2__factory } from "../typechain-types"; // Assicurati che il percorso sia corretto
import { BigNumberStruct, BigNumberStructOutput } from "../typechain-types/BigNumber.sol/BigNumbers";
import { ZpStruct, ZpStructOutput } from "../typechain-types/field/BigFiniteField";
import { PointZp, PointZp__factory } from "../typechain-types";
import { Point_ZpStruct, Point_ZpStructOutput } from "../typechain-types/point/pointZp.sol/PointZp";
import { Curve, Curve__factory } from "../typechain-types"
import { Point_Zp_2Struct, Point_Zp_2StructOutput, PointZp_2, Zp_2Struct, Zp_2StructOutput } from "../typechain-types/point/pointZp_2.sol/PointZp_2";

function toBigNumber(input: BigNumberStructOutput): BigNumberStruct {
    return {val: input.val, neg: input.neg, bitlen: input.bitlen };
}

function toZpStruct(output: ZpStructOutput): ZpStruct {
    return { value: toBigNumber(output.value) }; // Restituisce un oggetto con la proprietà value
}

function toPoint_ZpStruct(input: Point_ZpStructOutput): Point_ZpStruct {
    return {pointType: input.pointType, x: toZpStruct(input.x), y: toZpStruct(input.y)};
}

function toZp_2Struct(output: Zp_2StructOutput): Zp_2Struct {
    return { a: toZpStruct(output.a), b: toZpStruct(output.b) }; // Restituisce un oggetto con la proprietà value
}

function toPoint_Zp_2Struct(input: Point_Zp_2StructOutput): Point_Zp_2Struct {
    return {pointType: input.pointType, x: toZp_2Struct(input.x), y: toZp_2Struct(input.y)};
}

describe("Point_Zp Contract", function () {
    let bigNumbers: BigNumbers;
    let getBits: GetBits;
    let bigFiniteField: BigFiniteField;
    let quadraticExtension: QuadraticExtension;
    let pointZp_2: PointZp_2;
    let curve: Curve;
    let a: Point_Zp_2Struct;
    let b: Point_Zp_2Struct;
    beforeEach(async function () {
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
        const quadraticExtensionFactory: QuadraticExtension__factory = await ethers.getContractFactory("QuadraticExtension") as QuadraticExtension__factory;
        quadraticExtension = await quadraticExtensionFactory.deploy(bigFiniteField);
        const pointZp_2Factory: PointZp_2__factory = await ethers.getContractFactory("PointZp_2", {
            libraries: {
                GetBits: await getBits.getAddress()
              }
        }) as PointZp_2__factory;
        pointZp_2 = await pointZp_2Factory.deploy(quadraticExtension);
        const curveFactory: Curve__factory = await ethers.getContractFactory("Curve", {
            libraries: {
                BigNumbers: await bigNumbers.getAddress(),
                GetBits: await getBits.getAddress()
            }
        }) as Curve__factory;
        curve = await curveFactory.deploy();
        a = toPoint_Zp_2Struct(await curve.get_g1());
        b = toPoint_Zp_2Struct(await pointZp_2.multiply(toBigNumber(await bigNumbers.two()), toPoint_Zp_2Struct(await curve.get_g1())));
    });

    it("should create points correctly", async function() {
        const result = toPoint_Zp_2Struct(await pointZp_2.newPoint(a.x, a.y));
        expect(await pointZp_2.compare(result, a)).to.equal(true);
    })

    it("should add points correctly", async function() {
        const result = toPoint_Zp_2Struct(await pointZp_2.add(a, b));
        expect(await pointZp_2.compare(result, toPoint_Zp_2Struct(await pointZp_2.newPoint(
            toZp_2Struct(await quadraticExtension.createElement(toZpStruct(await bigFiniteField.createElement(toBigNumber(await bigNumbers.init__("0x122915C824A0857E2EE414A3DCCB23AE691AE54329781315A0C75DF1C04D6D7A50A030FC866F09D516020EF82324AFAE".toLowerCase(), false)))),
            toZpStruct(await bigFiniteField.createElement(toBigNumber(await bigNumbers.init__("0x09380275BBC8E5DCEA7DC4DD7E0550FF2AC480905396EDA55062650F8D251C96EB480673937CC6D9D6A44AAA56CA66DC".toLowerCase(), false)))))),
            toZp_2Struct(await quadraticExtension.createElement(toZpStruct(await bigFiniteField.createElement(toBigNumber(await bigNumbers.init__("0x0B21DA7955969E61010C7A1ABC1A6F0136961D1E3B20B1A7326AC738FEF5C721479DFD948B52FDF2455E44813ECFD892".toLowerCase(), false)))),
            toZpStruct(await bigFiniteField.createElement(toBigNumber(await bigNumbers.init__("0x08F239BA329B3967FE48D718A36CFE5F62A7E42E0BF1C1ED714150A166BFBD6BCF6B3B58B975B9EDEA56D53F23A0E849".toLowerCase(), false)))))))))).to.equal(true);
    })

    it("should double points correctly", async function() {
        const result = toPoint_Zp_2Struct(await pointZp_2.double(a));
        expect(await pointZp_2.compare(result, b)).to.equal(true);
    })

    it("should multiply points correctly", async function() {
        const resultA = toPoint_Zp_2Struct(await pointZp_2.multiply(toBigNumber(await bigNumbers.init(6, false)),a ));
        const resultB = toPoint_Zp_2Struct(await pointZp_2.multiply(toBigNumber(await bigNumbers.three()), b));
        expect(await pointZp_2.compare(resultA, resultB)).to.equal(true);
    })
});