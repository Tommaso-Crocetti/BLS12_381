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
  let elementA: ZpStruct;
  let elementB: ZpStruct;
  
  beforeEach(async function () {
      const bigNumbersFactory: BigNumbers__factory = await ethers.getContractFactory("BigNumbers") as BigNumbers__factory;
      bigNumbers = await bigNumbersFactory.deploy();
      const bigFiniteFieldFactory: BigFiniteField__factory = await ethers.getContractFactory("BigFiniteField", {
          libraries: {
              BigNumbers: await bigNumbers.getAddress()
            }
        }) as BigFiniteField__factory;
        const prime = toBigNumber(await bigNumbers.init__("0x1a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffffffffaaab", false));
        bigFiniteField = await bigFiniteFieldFactory.deploy(prime);
        const valueA: BigNumberStructOutput = await bigNumbers.init__("0x17f1d3a73197d7942695638c4fa9ac0fc3688c4f9774b905a14e3a3f171bac586c55e83ff97a1aeffb3af00adb22c6bb", false);
        const valueB: BigNumberStructOutput = await bigNumbers.init__("0x08b3f481e3aaa0f1a09e30ed741d8ae4fcf5e095d5d00af600db18cb2c04b3edd03cc744a2888ae40caa232946c5e7e1", false);
        elementA = toZpStruct(await bigFiniteField.createElement(toBigNumber(valueA)));
        elementB = toZpStruct(await bigFiniteField.createElement(toBigNumber(valueB)));
  });

    it("should create field elements correctly", async function () {
        elementA = await bigFiniteField.createElement(toBigNumber(await bigNumbers.init__("0x17f1d3a73197d7942695638c4fa9ac0fc3688c4f9774b905a14e3a3f171bac586c55e83ff97a1aeffb3af00adb22c6bb", false)));
    });

  it("should add elements correctly", async function () {
    await bigFiniteField.sum(elementA, elementB);
  });

  it("should subtract elements correctly", async function () {
    await bigFiniteField.sub(elementA, elementB);
  });

  it("should multiply elements correctly", async function () {
    await bigFiniteField.mul(elementA, elementB);
   });

  it("should calculate the inverse correctly", async function () {
    await bigFiniteField.inverse(elementA);
  })

  it("should divide elements correctly", async function () {
    await bigFiniteField.div(elementA, elementB)
  });
});
