import { ethers } from "hardhat"; // Importa ethers da Hardhat
import { expect } from "chai"; // Per i test con Chai
import { BigFiniteField, BigFiniteField__factory, BigNumbers, BigNumbers__factory } from "../../typechain-types"; // Assicurati che il percorso sia corretto
import { QuadraticExtension, QuadraticExtension__factory } from "../../typechain-types"
import { BigNumberStruct, BigNumberStructOutput } from "../../typechain-types/BigNumber.sol/BigNumbers";
import { ZpStruct, ZpStructOutput } from "../../typechain-types/field/BigFiniteField";
import { Zp_2Struct, Zp_2StructOutput } from "../../typechain-types/field/quadraticExtension.sol/QuadraticExtension";
import { SexticExtension, SexticExtension__factory } from "../../typechain-types";
import { Zp_6Struct, Zp_6StructOutput } from "../../typechain-types/field/sexticExtension.sol/SexticExtension";
import { TwelveExtension, TwelveExtension__factory } from "../../typechain-types";
import { Zp_12Struct, Zp_12StructOutput } from "../../typechain-types/field/twelveExtension.sol/TwelveExtension";


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
    return { a: toZp_6Struct(output.a), b: toZp_6Struct(output.b) }; // Restituisce un oggetto con la proprietà value
}

describe("Gas TwelveExtension", function () {
    let bigFiniteField: BigFiniteField;
    let bigNumbers: BigNumbers;
    let quadraticExtension: QuadraticExtension;
    let sexticExtension: SexticExtension;
    let twelveExtension: TwelveExtension;
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
        const quadraticExtensionFactory: QuadraticExtension__factory = await ethers.getContractFactory("QuadraticExtension") as QuadraticExtension__factory;
        quadraticExtension = await quadraticExtensionFactory.deploy(bigFiniteField);
        const SexticExtensionFactory: SexticExtension__factory = (await ethers.getContractFactory("SexticExtension")) as SexticExtension__factory;
        sexticExtension = await SexticExtensionFactory.deploy(quadraticExtension);
        const TwelveExtension__factory: TwelveExtension__factory = (await ethers.getContractFactory("TwelveExtension")) as TwelveExtension__factory;
        twelveExtension = await TwelveExtension__factory.deploy(sexticExtension);
    });

    it("gas usage", async function() {
        const valueA = toZpStruct(await bigFiniteField.createElement(toBigNumber(await bigNumbers.init__("0x144ABB1A97A3D65527F2A479175A569855EEDA1A0E616CFDC258BDB1C8B9FA096AD09965FD55F9801343D28E92E6640B".toLowerCase(), false))));
        const valueB = toZpStruct(await bigFiniteField.createElement(toBigNumber(await bigNumbers.init__("0x13413BD2925A9E1B08112F7F4E35D5813C459301AFD9B9FBC9764FA22AA315CC2DCE1B336FAFF13A4D7F97B73A87A737".toLowerCase(), false))));
        const vA = toZp_2Struct(await quadraticExtension.createElement(valueA, valueB));
        const vB = toZp_2Struct(await quadraticExtension.createElement(valueB, valueA));
        const v1 = toZp_6Struct(await sexticExtension.createElement(vA, vB, vA));
        const v2 = toZp_6Struct(await sexticExtension.createElement(vB, vA, vB));
        const value = toZp_12Struct(await twelveExtension.createElement(v1, v2));
        await twelveExtension.sum(value, value);
        await twelveExtension.sub(value, value);
        await twelveExtension.mul(value, value);
        await twelveExtension.div(value, value);
        await twelveExtension.inverse(value);
        await twelveExtension.equals(value, value);
        await twelveExtension.zero();
        await twelveExtension.one();
        await twelveExtension.two();
        await twelveExtension.three();
        await twelveExtension.four();
      })

});
