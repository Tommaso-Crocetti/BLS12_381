//errore, codice di inizializzazione troppo grande:
//Trying to send a deployment transaction whose init code length is 105475. 
//The max length allowed by EIP-3860 is 49152.
//Enable the 'allowUnlimitedContractSize' option to allow init codes of any length.

import { ethers } from "hardhat";
import { expect } from "chai";
import { BigFiniteField, BigFiniteField__factory, BigNumbers, BigNumbers__factory, point } from "../typechain-types"; // Assicurati che il percorso sia corretto
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
    let bigFiniteField: BigFiniteField;
    let pointZp: PointZp;
    let curve: Curve;
    let a: Point_ZpStruct;
    let b: Point_ZpStruct;
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
        const curveFactory: Curve__factory = await ethers.getContractFactory("Curve", {
            libraries: {
                BigNumbers: await bigNumbers.getAddress()
            }
        }) as Curve__factory;
        curve = await curveFactory.deploy();
        a = toPoint_ZpStruct(await curve.get_g0());
        b = toPoint_ZpStruct(await curve.get_g0());
    });

    it("should create points correctly", async function() {
        const result = toPoint_ZpStruct(await pointZp.newPoint(a.x, a.y));
        expect(await pointZp.compare(result, a)).to.equal(true);
    })

    it("should add points correctly", async function() {
        const result = toPoint_ZpStruct(await pointZp.add(a, b));
        expect(await pointZp.compare(result, toPoint_ZpStruct(await pointZp.newPoint(
            toZpStruct(await bigFiniteField.createElement(toBigNumber(await bigNumbers.init__("0x000000000000000000000000000000000572cbea904d67468808c8eb50a9450c9721db309128012543902d0ac358a62ae28f75bb8f1c7c42c39a8c5529bf0f4e", false)))),
            toZpStruct(await bigFiniteField.createElement(toBigNumber(await bigNumbers.init__("0x00000000000000000000000000000000166a9d8cabc673a322fda673779d8e3822ba3ecb8670e461f73bb9021d5fd76a4c56d9d4cd16bd1bba86881979749d28", false)))))))).to.equal(true);
    })

    it("should double points correctly", async function() {
        const result = toPoint_ZpStruct(await pointZp.double(a));
        expect(await pointZp.compare(result, toPoint_ZpStruct(await pointZp.newPoint(
            toZpStruct(await bigFiniteField.createElement(toBigNumber(await bigNumbers.init__("0x000000000000000000000000000000000572cbea904d67468808c8eb50a9450c9721db309128012543902d0ac358a62ae28f75bb8f1c7c42c39a8c5529bf0f4e", false)))),
            toZpStruct(await bigFiniteField.createElement(toBigNumber(await bigNumbers.init__("0x00000000000000000000000000000000166a9d8cabc673a322fda673779d8e3822ba3ecb8670e461f73bb9021d5fd76a4c56d9d4cd16bd1bba86881979749d28", false)))))))).to.equal(true);       
    })

    
});