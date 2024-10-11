import { ethers } from "hardhat"; // Importa ethers da Hardhat
import { expect } from "chai"; // Per i test con Chai
import { BigFiniteField, BigFiniteField__factory, BigNumbers, BigNumbers__factory } from "../typechain-types"; // Assicurati che il percorso sia corretto
import { QuadraticExtension, QuadraticExtension__factory } from "../typechain-types/"
import { BigNumberStruct, BigNumberStructOutput } from "../typechain-types/BigNumber.sol/BigNumbers";
import { ZpStruct, ZpStructOutput } from "../typechain-types/field/BigFiniteField";
import { Zp_2Struct, Zp_2StructOutput } from "../typechain-types/field/quadraticExtension.sol/QuadraticExtension";

function toBigNumber(input: BigNumberStructOutput): BigNumberStruct {
    return {val: input.val, neg: input.neg, bitlen: input.bitlen };
}

function toZpStruct(output: ZpStructOutput): ZpStruct {
    return { value: toBigNumber(output.value) }; // Restituisce un oggetto con la proprietà value
}

function toZp_2Struct(output: Zp_2StructOutput): Zp_2Struct {
    return { a: toZpStruct(output.a), b: toZpStruct(output.b) }; // Restituisce un oggetto con la proprietà value
}

describe("Quadratic Extension Contract", function () {
    let bigFiniteField: BigFiniteField;
    let bigNumbers: BigNumbers;
    let quadraticExtension: QuadraticExtension;
    let x: Zp_2StructOutput;
    let y: Zp_2StructOutput;

    beforeEach(async function () {
        const bigNumbersFactory: BigNumbers__factory = await ethers.getContractFactory("BigNumbers") as BigNumbers__factory;
        bigNumbers = await bigNumbersFactory.deploy();
        const bigFiniteFieldFactory: BigFiniteField__factory = await ethers.getContractFactory("BigFiniteField", {
            libraries: {
                BigNumbers: await bigNumbers.getAddress()
            }
        }) as BigFiniteField__factory;
        const value = 7;
        bigFiniteField = await bigFiniteFieldFactory.deploy(ethers.toBeHex(value.toString()));
        const quadraticExtensionFactory: QuadraticExtension__factory = await ethers.getContractFactory("QuadraticExtension") as QuadraticExtension__factory;
        quadraticExtension = await quadraticExtensionFactory.deploy(bigFiniteField);
        const valueA: BigNumberStructOutput = await bigNumbers.init(3, false);
        const valueB: BigNumberStructOutput = await bigNumbers.init(5, false);
        const a: ZpStructOutput = await bigFiniteField.createElement(toBigNumber(valueA));
        const b: ZpStructOutput = await bigFiniteField.createElement(toBigNumber(valueB));
        x = await quadraticExtension.createElement(toZpStruct(a), toZpStruct(b));
        const valueC: BigNumberStructOutput = await bigNumbers.init(4, false);
        const valueD: BigNumberStructOutput = await bigNumbers.init(2, false);
        const c: ZpStructOutput = await bigFiniteField.createElement(toBigNumber(valueC));
        const d: ZpStructOutput = await bigFiniteField.createElement(toBigNumber(valueD));
        y = await quadraticExtension.createElement(toZpStruct(c), toZpStruct(d));
    });

    it("should create field elements correctly", async function () {
        expect(x.a.value.val).to.equal("0x0000000000000000000000000000000000000000000000000000000000000003");
        expect(y.b.value.val).to.equal("0x0000000000000000000000000000000000000000000000000000000000000002");
    });

    it("should add elements correctly", async function () {
        const sum: Zp_2StructOutput = await quadraticExtension.sum(toZp_2Struct(x), toZp_2Struct(y));
        const resultA = await bigNumbers.init(0, false);
        const resultB = await bigNumbers.init(0, false);
        expect(sum.a.value.val).to.equal(resultA.val);
        expect(sum.b.value.val).to.equal(resultB.val);
    });

    it("should substract elements correctly", async function () {
        const diff: Zp_2StructOutput = await quadraticExtension.sub(toZp_2Struct(x), toZp_2Struct(y));
        const resultA = await bigNumbers.init(6, false);
        const resultB = await bigNumbers.init(3, false);
        expect(diff.a.value.val).to.equal(resultA.val);
        expect(diff.b.value.val).to.equal(resultB.val);
    });

    it("should multiply elements correctly", async function () {
        const mul: Zp_2StructOutput = await quadraticExtension.mul(toZp_2Struct(x), toZp_2Struct(y));
        const resultA = await bigNumbers.init(2, false);
        const resultB = await bigNumbers.init(5, false);
        expect(mul.a.value.val).to.equal(resultA.val);
        expect(mul.b.value.val).to.equal(resultB.val);
    });

    it("should calculate the inverse correctly", async function () {
        const inv: Zp_2StructOutput = await quadraticExtension.inverse(toZp_2Struct(y));
        const resultA = await bigNumbers.init(3, false);
        const resultB = await bigNumbers.init(2, false);
        expect(inv.a.value.val).to.equal(resultA.val);
        expect(inv.b.value.val).to.equal(resultB.val);
    });

    it("should divide elements correctly", async function () {
        const div: Zp_2StructOutput = await quadraticExtension.div(toZp_2Struct(x), toZp_2Struct(y));
        const resultA = await bigNumbers.init(6, false);
        const resultB = await bigNumbers.init(0, false);
        expect(div.a.value.val).to.equal(resultA.val);
        expect(div.b.value.val).to.equal(resultB.val);
    });

    it("should revert on division by zero", async function () {
        const a: ZpStructOutput = await bigFiniteField.zero();
        const b: ZpStructOutput = await bigFiniteField.zero();
        y = await quadraticExtension.createElement(toZpStruct(a), toZpStruct(b));
        await expect(quadraticExtension.div(toZp_2Struct(x), toZp_2Struct(y))).to.be.revertedWith("Inverso di zero non definito.");
    });
});
