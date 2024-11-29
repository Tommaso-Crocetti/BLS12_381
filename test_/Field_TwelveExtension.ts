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
import { secureHeapUsed } from "crypto";


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

describe("Twelve Extension Contract", function () {
    let bigNumbers: BigNumbers;
    let getBits: GetBits;
    let bigFiniteField: BigFiniteField;
    let quadraticExtension: QuadraticExtension;
    let sexticExtension: SexticExtension;
    let twelveExtension: TwelveExtension;
    let x: Zp_6StructOutput;
    let y: Zp_6StructOutput;
    let a: Zp_12Struct;
    let b: Zp_12Struct;

    beforeEach(async function () {
        const bigNumbersFactory: BigNumbers__factory = await ethers.getContractFactory("BigNumbers") as BigNumbers__factory;
        bigNumbers = await bigNumbersFactory.deploy();
        const getBitsFactory: GetBits__factory = await ethers.getContractFactory("GetBits", {
            libraries: {
                BigNumbers: await bigNumbers.getAddress()
            }
        }) as GetBits__factory;
        getBits = await getBitsFactory.deploy()
        const bigFiniteFieldFactory: BigFiniteField__factory = await ethers.getContractFactory("BigFiniteField", {
            libraries: {
                BigNumbers: await bigNumbers.getAddress()
            }
        }) as BigFiniteField__factory;
        const prime = toBigNumber(await bigNumbers.init(7, false));
        bigFiniteField = await bigFiniteFieldFactory.deploy(prime);
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

        const a1: ZpStructOutput = await bigFiniteField.createElement(toBigNumber(await bigNumbers.init(3, false)));
        const b1: ZpStructOutput = await bigFiniteField.createElement(toBigNumber(await bigNumbers.init(5, false)));
        const x_2: Zp_2StructOutput = await quadraticExtension.createElement(toZpStruct(a1), toZpStruct(b1));

        const c: ZpStructOutput = await bigFiniteField.createElement(toBigNumber(await bigNumbers.init(1, false)));
        const d: ZpStructOutput = await bigFiniteField.createElement(toBigNumber(await bigNumbers.init(2, false)));
        const y_2: Zp_2StructOutput = await quadraticExtension.createElement(toZpStruct(c), toZpStruct(d));

        x = await sexticExtension.createElement(toZp_2Struct(x_2), toZp_2Struct(y_2), toZp_2Struct(x_2));
        y = await sexticExtension.createElement(toZp_2Struct(y_2), toZp_2Struct(x_2), toZp_2Struct(y_2));

        a = toZp_12Struct(await twelveExtension.createElement(toZp_6Struct(x), toZp_6Struct(y)));
        b = toZp_12Struct(await twelveExtension.createElement(toZp_6Struct(y), toZp_6Struct(x)));
    });
    
    it("Should add elements correctly", async function() {
        const c = toZp_2Struct(await quadraticExtension.createElement(toZpStruct(await bigFiniteField.four()), toZpStruct(await bigFiniteField.zero())))
        const c1 = toZp_6Struct(await sexticExtension.createElement(c, c, c));
        const result = toZp_12Struct(await twelveExtension.createElement(c1, c1));
        expect(await twelveExtension.equals(toZp_12Struct(await twelveExtension.sum(a,b)), result)).to.equal(true)
    })

    it("Should subtract elements correctly", async function() {
        const c1 = toZp_2Struct(await quadraticExtension.createElement(toZpStruct(await bigFiniteField.two()), toZpStruct(await bigFiniteField.three())))
        const c2 = toZp_2Struct(await quadraticExtension.createElement(toZpStruct(await bigFiniteField.createElement(toBigNumber(await bigNumbers.init(5, false)))), toZpStruct(await bigFiniteField.four())))
        const c01 = toZp_6Struct(await sexticExtension.createElement(c1, c2, c1));
        const c02 = toZp_6Struct(await sexticExtension.createElement(c2, c1, c2));
        const result = toZp_12Struct(await twelveExtension.createElement(c01, c02));
        expect(await twelveExtension.equals(toZp_12Struct(await twelveExtension.sub(a,b)), result)).to.equal(true)
    })

    it("Should multiply elements correctly", async function() {
        const resultx_A_A = await bigNumbers.init(5, false);
        const resultx_B_A = await bigNumbers.init(1, false);
        const resultx_C_A = await bigNumbers.init(5, false);
        const resultx_A_B = await bigNumbers.init(3, false);
        const resultx_B_B = await bigNumbers.init(1, false);
        const resultx_C_B = await bigNumbers.init(1, false);
        const resulty_A_A = await bigNumbers.init(0, false);
        const resulty_B_A = await bigNumbers.init(3, false);
        const resulty_C_A = await bigNumbers.init(6, false);
        const resulty_A_B = await bigNumbers.init(1, false);
        const resulty_B_B = await bigNumbers.init(3, false);
        const resulty_C_B = await bigNumbers.init(4, false);
        const mul = toZp_12Struct(await twelveExtension.mul(a, b))
        expect(mul.a.a.a.value.val).to.equal(resultx_A_A.val);
        expect(mul.a.b.a.value.val).to.equal(resultx_B_A.val);
        expect(mul.a.c.a.value.val).to.equal(resultx_C_A.val);
        expect(mul.a.a.b.value.val).to.equal(resultx_A_B.val);
        expect(mul.a.b.b.value.val).to.equal(resultx_B_B.val);
        expect(mul.a.c.b.value.val).to.equal(resultx_C_B.val);
        expect(mul.b.a.a.value.val).to.equal(resulty_A_A.val);
        expect(mul.b.b.a.value.val).to.equal(resulty_B_A.val);
        expect(mul.b.c.a.value.val).to.equal(resulty_C_A.val);
        expect(mul.b.a.b.value.val).to.equal(resulty_A_B.val);
        expect(mul.b.b.b.value.val).to.equal(resulty_B_B.val);
        expect(mul.b.c.b.value.val).to.equal(resulty_C_B.val);
    })

    it("Should calculate the inverse correctly", async function() {
        const resultx_A_A = await bigNumbers.init(2, false);
        const resultx_B_A = await bigNumbers.init(1, false);
        const resultx_C_A = await bigNumbers.init(1, false);
        const resultx_A_B = await bigNumbers.init(3, false);
        const resultx_B_B = await bigNumbers.init(2, false);
        const resultx_C_B = await bigNumbers.init(2, false);
        const resulty_A_A = await bigNumbers.init(0, false);
        const resulty_B_A = await bigNumbers.init(6, false);
        const resulty_C_A = await bigNumbers.init(1, false);
        const resulty_A_B = await bigNumbers.init(3, false);
        const resulty_B_B = await bigNumbers.init(1, false);
        const resulty_C_B = await bigNumbers.init(5, false);
        const inverse = toZp_12Struct(await twelveExtension.inverse(b))
        expect(inverse.a.a.a.value.val).to.equal(resultx_A_A.val);
        expect(inverse.a.b.a.value.val).to.equal(resultx_B_A.val);
        expect(inverse.a.c.a.value.val).to.equal(resultx_C_A.val);
        expect(inverse.a.a.b.value.val).to.equal(resultx_A_B.val);
        expect(inverse.a.b.b.value.val).to.equal(resultx_B_B.val);
        expect(inverse.a.c.b.value.val).to.equal(resultx_C_B.val);
        expect(inverse.b.a.a.value.val).to.equal(resulty_A_A.val);
        expect(inverse.b.b.a.value.val).to.equal(resulty_B_A.val);
        expect(inverse.b.c.a.value.val).to.equal(resulty_C_A.val);
        expect(inverse.b.a.b.value.val).to.equal(resulty_A_B.val);
        expect(inverse.b.b.b.value.val).to.equal(resulty_B_B.val);
        expect(inverse.b.c.b.value.val).to.equal(resulty_C_B.val);
    })

    it("Should divide elements correctly", async function() {
        const resultx_A_A = await bigNumbers.init(5, false);
        const resultx_B_A = await bigNumbers.init(5, false);
        const resultx_C_A = await bigNumbers.init(3, false);
        const resultx_A_B = await bigNumbers.init(2, false);
        const resultx_B_B = await bigNumbers.init(5, false);
        const resultx_C_B = await bigNumbers.init(5, false);
        const resulty_A_A = await bigNumbers.init(4, false);
        const resulty_B_A = await bigNumbers.init(2, false);
        const resulty_C_A = await bigNumbers.init(2, false);
        const resulty_A_B = await bigNumbers.init(2, false);
        const resulty_B_B = await bigNumbers.init(2, false);
        const resulty_C_B = await bigNumbers.init(1, false);
        const div = toZp_12Struct(await twelveExtension.div(a, b))
        expect(div.a.a.a.value.val).to.equal(resultx_A_A.val);
        expect(div.a.b.a.value.val).to.equal(resultx_B_A.val);
        expect(div.a.c.a.value.val).to.equal(resultx_C_A.val);
        expect(div.a.a.b.value.val).to.equal(resultx_A_B.val);
        expect(div.a.b.b.value.val).to.equal(resultx_B_B.val);
        expect(div.a.c.b.value.val).to.equal(resultx_C_B.val);
        expect(div.b.a.a.value.val).to.equal(resulty_A_A.val);
        expect(div.b.b.a.value.val).to.equal(resulty_B_A.val);
        expect(div.b.c.a.value.val).to.equal(resulty_C_A.val);
        expect(div.b.a.b.value.val).to.equal(resulty_A_B.val);
        expect(div.b.b.b.value.val).to.equal(resulty_B_B.val);
        expect(div.b.c.b.value.val).to.equal(resulty_C_B.val);
    })
});