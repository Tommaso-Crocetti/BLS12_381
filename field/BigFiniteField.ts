import { ethers } from "hardhat"; // Importa ethers da Hardhat
import { expect } from "chai"; // Per i test con Chai
import { BigFiniteField, BigFiniteField__factory, BigNumbers, BigNumbers__factory } from "../../typechain-types"; // Assicurati che il percorso sia corretto
import { ZpStruct, ZpStructOutput } from "../../typechain-types/field/BigFiniteField";
import { BigNumberStruct, BigNumberStructOutput } from "../../typechain-types/BigNumber.sol/BigNumbers";

function toBigNumber(input: BigNumberStructOutput): BigNumberStruct {
    return {val: input.val, neg: input.neg, bitlen: input.bitlen };
}

function toZpStruct(output: ZpStructOutput): ZpStruct {
    return { value: toBigNumber(output.value) }; // Restituisce un oggetto con la proprietà value
}

describe("Gas BigFiniteField", function () {
  let bigFiniteField: BigFiniteField;
  let bigNumbers: BigNumbers;
  
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
  });

  it("gas usage", async function() {
    const value = toZpStruct(await bigFiniteField.createElement(toBigNumber(await bigNumbers.init__("0x144ABB1A97A3D65527F2A479175A569855EEDA1A0E616CFDC258BDB1C8B9FA096AD09965FD55F9801343D28E92E6640B".toLowerCase(), false))));
    await bigFiniteField.sum(value, value);
    await bigFiniteField.sub(value, value);
    await bigFiniteField.mul(value, value);
    await bigFiniteField.div(value, value);
    await bigFiniteField.inverse(value);
    await bigFiniteField.mul_nonres(value);
    await bigFiniteField.equals(value, value);
    await bigFiniteField.zero();
    await bigFiniteField.one();
    await bigFiniteField.two();
    await bigFiniteField.three();
    await bigFiniteField.four();
    await bigFiniteField.get_p();
  })
});
