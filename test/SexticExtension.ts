import { ethers } from "hardhat";
import { expect } from "chai";
import { BigFiniteField, BigFiniteField__factory, BigNumbers, BigNumbers__factory } from "../typechain-types"; // Assicurati che il percorso sia corretto
import { QuadraticExtension, QuadraticExtension__factory } from "../typechain-types/"
import { SexticExtension, SexticExtension__factory } from "../typechain-types";
import { BigNumberStruct, BigNumberStructOutput } from "../typechain-types/BigNumber.sol/BigNumbers";
import { ZpStruct, ZpStructOutput } from "../typechain-types/field/BigFiniteField";
import { Zp_2Struct, Zp_2StructOutput } from "../typechain-types/field/quadraticExtension.sol/QuadraticExtension";
import { Zp_6Struct, Zp_6StructOutput } from "../typechain-types/field/sexticExtension.sol/SexticExtension";

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

describe("Sextic Extension Contract", function () {
    let bigNumbers: BigNumbers;
    let bigFiniteField: BigFiniteField;
    let quadraticExtension: QuadraticExtension;
    let sexticExtension: SexticExtension;
    let x: Zp_6StructOutput;
    let y: Zp_6StructOutput;

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

        const SexticExtensionFactory: SexticExtension__factory = (await ethers.getContractFactory("SexticExtension")) as SexticExtension__factory;
        sexticExtension = await SexticExtensionFactory.deploy(quadraticExtension);

        const a: ZpStructOutput = await bigFiniteField.createElement(toBigNumber(await bigNumbers.init(3, false)));
        const b: ZpStructOutput = await bigFiniteField.createElement(toBigNumber(await bigNumbers.init(5, false)));
        const x_2: Zp_2StructOutput = await quadraticExtension.createElement(toZpStruct(a), toZpStruct(b));

        const c: ZpStructOutput = await bigFiniteField.createElement(toBigNumber(await bigNumbers.init(1, false)));
        const d: ZpStructOutput = await bigFiniteField.createElement(toBigNumber(await bigNumbers.init(2, false)));
        const y_2: Zp_2StructOutput = await quadraticExtension.createElement(toZpStruct(c), toZpStruct(d));

        x = await sexticExtension.createElement(toZp_2Struct(x_2), toZp_2Struct(y_2), toZp_2Struct(x_2));
        y = await sexticExtension.createElement(toZp_2Struct(y_2), toZp_2Struct(x_2), toZp_2Struct(y_2));
    });

    it("should create sextic field elements correctly", async function () {
        expect(x.a.a.value.val).to.equal("0x0000000000000000000000000000000000000000000000000000000000000003");
        expect(x.b.a.value.val).to.equal("0x0000000000000000000000000000000000000000000000000000000000000001");
        expect(x.c.a.value.val).to.equal("0x0000000000000000000000000000000000000000000000000000000000000003");
    });

    it("should add sextic elements correctly", async function () {
        const sum: Zp_6StructOutput = await sexticExtension.sum(toZp_6Struct(x), toZp_6Struct(y));
        const resultA_A = await bigNumbers.init(4, false);
        const resultB_A = await bigNumbers.init(4, false);
        const resultC_A = await bigNumbers.init(4, false);
        const resultA_B = await bigNumbers.zero();
        const resultB_B = await bigNumbers.zero();
        const resultC_B = await bigNumbers.zero();
        expect(sum.a.a.value.val).to.equal(resultA_A.val);
        expect(sum.b.a.value.val).to.equal(resultB_A.val);
        expect(sum.c.a.value.val).to.equal(resultC_A.val);
        expect(sum.a.b.value.val).to.equal(resultA_B.val);
        expect(sum.b.b.value.val).to.equal(resultB_B.val);
        expect(sum.c.b.value.val).to.equal(resultC_B.val);
    });

    it("should subtract sextic elements correctly", async function () {
        const sub: Zp_6StructOutput = await sexticExtension.sub(toZp_6Struct(x), toZp_6Struct(y));
        const resultA_A = await bigNumbers.init(2, false);
        const resultB_A = await bigNumbers.init(5, false);
        const resultC_A = await bigNumbers.init(2, false);
        const resultA_B = await bigNumbers.init(3, false);
        const resultB_B = await bigNumbers.init(4, false);
        const resultC_B = await bigNumbers.init(3, false);
        expect(sub.a.a.value.val).to.equal(resultA_A.val);
        expect(sub.b.a.value.val).to.equal(resultB_A.val);
        expect(sub.c.a.value.val).to.equal(resultC_A.val);
        expect(sub.a.b.value.val).to.equal(resultA_B.val);
        expect(sub.b.b.value.val).to.equal(resultB_B.val);
        expect(sub.c.b.value.val).to.equal(resultC_B.val);
    });

    it("should multiply elements in Zp_6 correctly", async function () {
        const mul = await sexticExtension.mul(toZp_6Struct(x), toZp_6Struct(y));
        const resultA_A = await bigNumbers.init(1, false);
        const resultB_A = await bigNumbers.init(6, false);
        const resultC_A = await bigNumbers.init(0, false);
        const resultA_B = await bigNumbers.init(0, false);
        const resultB_B = await bigNumbers.init(2, false);
        const resultC_B = await bigNumbers.init(5, false);
        expect(mul.a.a.value.val).to.equal(resultA_A.val);
        expect(mul.b.a.value.val).to.equal(resultB_A.val);
        expect(mul.c.a.value.val).to.equal(resultC_A.val);
        expect(mul.a.b.value.val).to.equal(resultA_B.val);
        expect(mul.b.b.value.val).to.equal(resultB_B.val);
        expect(mul.c.b.value.val).to.equal(resultC_B.val);
    });
});