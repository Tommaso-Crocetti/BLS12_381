import { ethers } from "hardhat"; // Importa ethers da Hardhat
import { expect } from "chai"; // Per i test con Chai
import { BigFiniteField, BigFiniteField__factory, BigNumbers, BigNumbers__factory } from "../typechain-types"; // Assicurati che il percorso sia corretto
import { ZpStruct, ZpStructOutput } from "../typechain-types/field/BigFiniteField";
import { BigNumberStruct, BigNumberStructOutput } from "../typechain-types/BigNumber.sol/BigNumbers";

function toBigNumber(input: BigNumberStructOutput): BigNumberStruct {
    return {val: input.val, neg: input.neg, bitlen: input.bitlen };
}

function toZpStruct(output: ZpStructOutput): ZpStruct {
    return { value: toBigNumber(output.value) }; // Restituisce un oggetto con la proprietà value
}

describe("BigFiniteField Contract", function () {
  let bigFiniteField: BigFiniteField;
  let bigNumbers: BigNumbers;
  let elementA: ZpStructOutput;
  let elementB: ZpStructOutput;

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
    const valueA: BigNumberStructOutput = await bigNumbers.init(3, false);
    const valueB: BigNumberStructOutput = await bigNumbers.init(5, false);
    elementA = await bigFiniteField.createElement(toBigNumber(valueA));
    elementB = await bigFiniteField.createElement(toBigNumber(valueB));
  });

  it("should create field elements correctly", async function () {

    expect(elementA.value.val).to.equal("0x0000000000000000000000000000000000000000000000000000000000000003");
    expect(elementB.value.val).to.equal("0x0000000000000000000000000000000000000000000000000000000000000005");
  });

  it("should add elements correctly", async function () {

    const sum: ZpStructOutput = await bigFiniteField.sum(toZpStruct(elementA), toZpStruct(elementB));
    const result = await bigNumbers.init(1, false);
    expect(sum.value.val).to.equal(result.val);
  });

  it("should subtract elements correctly", async function () {

    const diff: ZpStructOutput = await bigFiniteField.sub(toZpStruct(elementA), toZpStruct(elementB));
    const result = await bigNumbers.init(5, false);
    expect(diff.value.val).to.equal(result.val); // (3 - 5 + 7) mod 7 = 5
  });

  it("should multiply elements correctly", async function () {
    const prod: ZpStructOutput = await bigFiniteField.mul(toZpStruct(elementA), toZpStruct(elementB));
    const result = await bigNumbers.init(1, false);
    expect(prod.value.val).to.equal(result.val);
  });

  it("should calculate the inverse correctly", async function () {
    const inv: ZpStructOutput = await bigFiniteField.inverse(toZpStruct(elementA));
    const result = await bigNumbers.init(5, false);
    expect(inv.value.val).to.equal(result.val);
  })

  it("should divide elements correctly", async function () {
    const div: ZpStructOutput = await bigFiniteField.div(toZpStruct(elementA), toZpStruct(elementB));
    const result = await bigNumbers.init(2, false);
    expect(div.value.val).to.equal(result.val); // 3 / 5 = 3 * inv(5) mod 7 => inv(5) = 3 => (3 * 3) mod 7 = 9 mod 7 = 2
  });

  it("should revert on division by zero", async function () {
    const elementA: ZpStructOutput = await bigFiniteField.createElement(toBigNumber(await bigNumbers.init(3, false)));
    const elementB: ZpStructOutput = await bigFiniteField.createElement(toBigNumber(await bigNumbers.zero()));
    await expect(bigFiniteField.div(toZpStruct(elementA), toZpStruct(elementB))).to.be.revertedWith("Inverso per zero non definito.");
  });
});
