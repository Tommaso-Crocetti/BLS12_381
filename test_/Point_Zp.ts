//errore, codice di inizializzazione troppo grande:
//Trying to send a deployment transaction whose init code length is 105475. 
//The max length allowed by EIP-3860 is 49152.
//Enable the 'allowUnlimitedContractSize' option to allow init codes of any length.

import { ethers } from "hardhat";
import { expect } from "chai";
import { BigFiniteField, BigFiniteField__factory, BigNumbers, BigNumbers__factory, GetBits__factory, GetBits } from "../typechain-types"; // Assicurati che il percorso sia corretto
import { BigNumberStruct, BigNumberStructOutput } from "../typechain-types/BigNumber.sol/BigNumbers";
import { ZpStruct, ZpStructOutput } from "../typechain-types/field/BigFiniteField";
import { PointZp, PointZp__factory } from "../typechain-types";
import { Point_ZpStruct, Point_ZpStructOutput } from "../typechain-types/point/pointZp.sol/PointZp";
import { Curve, Curve__factory } from "../typechain-types"

function toBigNumber(input: BigNumberStructOutput): BigNumberStruct {
    return {val: input.val, neg: input.neg, bitlen: input.bitlen };
}

function toZpStruct(output: ZpStructOutput): ZpStruct {
    return { value: toBigNumber(output.value) }; // Restituisce un oggetto con la proprietà value
}

function toPoint_ZpStruct(input: Point_ZpStructOutput): Point_ZpStruct {
    return {pointType: input.pointType, x: toZpStruct(input.x), y: toZpStruct(input.y)};
}

describe("Point_Zp Contract", function () {
    let bigNumbers: BigNumbers;
    let getBits: GetBits;
    let bigFiniteField: BigFiniteField;
    let pointZp: PointZp;
    let curve: Curve;
    let a: Point_ZpStruct;
    let b: Point_ZpStruct;
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
        pointZp = await pointZpFactory.deploy(bigFiniteField);
        const curveFactory: Curve__factory = await ethers.getContractFactory("Curve", {
            libraries: {
                BigNumbers: await bigNumbers.getAddress(),
                GetBits: await getBits.getAddress()
            }
        }) as Curve__factory;
        curve = await curveFactory.deploy();
        a = toPoint_ZpStruct(await curve.get_g0());
        b = toPoint_ZpStruct(await pointZp.multiply(toBigNumber(await bigNumbers.two()), toPoint_ZpStruct(await curve.get_g0())));
    });

    it("should create points correctly", async function() {
        const result = toPoint_ZpStruct(await pointZp.newPoint(a.x, a.y));
        expect(await pointZp.compare(result, a)).to.equal(true);
    })

    it("should add points correctly", async function() {
        const result = toPoint_ZpStruct(await pointZp.add(a, b));
        expect(await pointZp.compare(result, toPoint_ZpStruct(await pointZp.newPoint(
            toZpStruct(await bigFiniteField.createElement(toBigNumber(await bigNumbers.init__("0x09ECE308F9D1F0131765212DECA99697B112D61F9BE9A5F1F3780A51335B3FF981747A0B2CA2179B96D2C0C9024E5224".toLowerCase(), false)))),
            toZpStruct(await bigFiniteField.createElement(toBigNumber(await bigNumbers.init__("0x032B80D3A6F5B09F8A84623389C5F80CA69A0CDDABC3097F9D9C27310FD43BE6E745256C634AF45CA3473B0590AE30D1".toLowerCase(), false)))))))).to.equal(true);
    })

    it("should double points correctly", async function() {
        const result = toPoint_ZpStruct(await pointZp.double(a));
        expect(await pointZp.compare(result, b)).to.equal(true);
    })

    it("should multiply points correctly", async function() {
        const resultA = toPoint_ZpStruct(await pointZp.multiply(toBigNumber(await bigNumbers.init(6, false)),a ));
        const resultB = toPoint_ZpStruct(await pointZp.multiply(toBigNumber(await bigNumbers.three()), b));
        expect(await pointZp.compare(resultA, resultB)).to.equal(true);
    })
});