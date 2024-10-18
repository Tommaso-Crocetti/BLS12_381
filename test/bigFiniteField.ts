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
  let bigFiniteFieldFactory: BigFiniteField__factory;
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
        const prime = toBigNumber(await bigNumbers.init(7, false));
        //bigFiniteField = await bigFiniteFieldFactory.deploy(prime);
        bigFiniteField = await bigFiniteFieldFactory.deploy(toBigNumber(await bigNumbers.init__("0x1a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffffffffaaab", false)));
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
    await expect(bigFiniteField.div(toZpStruct(elementA), toZpStruct(elementB))).to.be.revertedWith("Inverso di zero non definito.");
  });

  it("test", async function() {
    const x: ZpStruct = toZpStruct(await bigFiniteField.createElement(toBigNumber(await bigNumbers.init__("0x17f1d3a73197d7942695638c4fa9ac0fc3688c4f9774b905a14e3a3f171bac586c55e83ff97a1aeffb3af00adb22c6bb", false))));
    const y: ZpStruct = toZpStruct(await bigFiniteField.createElement(toBigNumber(await bigNumbers.init__("0x08b3f481e3aaa0f1a09e30ed741d8ae4fcf5e095d5d00af600db18cb2c04b3edd03cc744a2888ae40caa232946c5e7e1", false))));
    const l: ZpStruct = toZpStruct(await bigFiniteField.mul(y, y));
    console.log(l.value.val);
    const r: ZpStruct = toZpStruct(await bigFiniteField.sum(toZpStruct(await bigFiniteField.mul(x, toZpStruct(await bigFiniteField.mul(x, x)))), toZpStruct(await bigFiniteField.mul_nonres(toZpStruct(await bigFiniteField.four())))));
    console.log(r.value.val);
    expect(await bigFiniteField.equals(l, r)).to.equal(true);
  })
});
