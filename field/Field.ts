import { ethers } from "hardhat"; // Importa ethers da Hardhat
import { expect } from "chai"; // Per i test con Chai
import { BigFiniteField, BigFiniteField__factory, BigNumbers, BigNumbers__factory } from "../typechain-types"; // Assicurati che il percorso sia corretto
import { QuadraticExtension, QuadraticExtension__factory } from "../typechain-types"
import { BigNumberStruct, BigNumberStructOutput } from "../typechain-types/BigNumber.sol/BigNumbers";
import { ZpStruct, ZpStructOutput } from "../typechain-types/field/BigFiniteField";
import { Zp_2Struct, Zp_2StructOutput } from "../typechain-types/field/quadraticExtension.sol/QuadraticExtension";
import { SexticExtension, SexticExtension__factory } from "../typechain-types";
import { Zp_6Struct, Zp_6StructOutput } from "../typechain-types/field/sexticExtension.sol/SexticExtension";
import { TwelveExtension, TwelveExtension__factory } from "../typechain-types";
import { Zp_12Struct, Zp_12StructOutput } from "../typechain-types/field/twelveExtension.sol/TwelveExtension";
import { GetBits, GetBits__factory } from "../typechain-types";
import {
    loadFixture
  } from "@nomicfoundation/hardhat-toolbox/network-helpers";

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

describe("Time and gas usage", function () {
    async function deploy() {
        let bigNumbers: BigNumbers;
        let getBits: GetBits;
        let bigFiniteField: BigFiniteField;
        let quadraticExtension: QuadraticExtension;
        let sexticExtension: SexticExtension;
        let twelveExtension: TwelveExtension;
        const bigNumbersFactory: BigNumbers__factory = await ethers.getContractFactory("BigNumbers") as BigNumbers__factory;
        bigNumbers = await bigNumbersFactory.deploy();
        const bigFiniteFieldFactory: BigFiniteField__factory = await ethers.getContractFactory("BigFiniteField", {
            libraries: {
                BigNumbers: await bigNumbers.getAddress()
            }
        }) as BigFiniteField__factory;
        const GetBitsFactory: GetBits__factory = await ethers.getContractFactory("GetBits", {
            libraries: {
                BigNumbers: await bigNumbers.getAddress()
            }
        }) as GetBits__factory;
        getBits = await GetBitsFactory.deploy();
        const prime = toBigNumber(await bigNumbers.init__("0x1a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffffffffaaab", false));
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
        const value = toZpStruct(await bigFiniteField.createElement(toBigNumber(await bigNumbers.init__("0x144ABB1A97A3D65527F2A479175A569855EEDA1A0E616CFDC258BDB1C8B9FA096AD09965FD55F9801343D28E92E6640B".toLowerCase(), false))));
        const valueB = toZpStruct(await bigFiniteField.createElement(toBigNumber(await bigNumbers.init__("0x13413BD2925A9E1B08112F7F4E35D5813C459301AFD9B9FBC9764FA22AA315CC2DCE1B336FAFF13A4D7F97B73A87A737".toLowerCase(), false))));
        const qValue = toZp_2Struct(await quadraticExtension.createElement(value, valueB));
        const vB = toZp_2Struct(await quadraticExtension.createElement(valueB, value));
        const sValue = toZp_6Struct(await sexticExtension.createElement(qValue, vB, qValue));
        const a = toZp_6Struct(await sexticExtension.createElement(vB, qValue, vB));
        const tValue = toZp_12Struct(await twelveExtension.createElement(sValue, a));
        return {bigNumbers, getBits, bigFiniteField, quadraticExtension, sexticExtension, twelveExtension, prime, value, valueB, qValue, sValue, tValue};    
    }
    
    it("Setup", async function() {
        console.time();
        await loadFixture(deploy);
        console.timeEnd()
    })

    it("Creation of a Zp element", async function() {
        console.time()
        const {bigNumbers, bigFiniteField} = await loadFixture(deploy);
        const value = toZpStruct(await bigFiniteField.createElement(toBigNumber(await bigNumbers.init__("0x144ABB1A97A3D65527F2A479175A569855EEDA1A0E616CFDC258BDB1C8B9FA096AD09965FD55F9801343D28E92E6640B".toLowerCase(), false))));
        console.timeEnd()
    })

    it("Sum of Zp elements", async function() {
        console.time()
        const {bigNumbers, bigFiniteField, value} = await loadFixture(deploy);
        await bigFiniteField.sum(value, value);       
        console.timeEnd()
    })

    it("Subtraction of Zp elements", async function() {
        console.time()
        const {bigNumbers, bigFiniteField, value} = await loadFixture(deploy);
        await bigFiniteField.sub(value, value);
        console.timeEnd()
    })

    it("Multiplication of Zp elements", async function() {
        console.time()
        const {bigNumbers, bigFiniteField, value} = await loadFixture(deploy);
        await bigFiniteField.mul(value, value);
        console.timeEnd()
    })

    it("Division of Zp elements", async function() {
        console.time()
        const {bigNumbers, bigFiniteField, value} = await loadFixture(deploy);
        await bigFiniteField.div(value, value);
        console.timeEnd()
    })

    it("Inversion of Zp element", async function() {
        console.time()
        const {bigNumbers, bigFiniteField, value} = await loadFixture(deploy);
        await bigFiniteField.inverse(value);
        console.timeEnd()
    })

    it("Equality between Zp elements", async function() {
        console.time()
        const {bigNumbers, bigFiniteField, value} = await loadFixture(deploy);
        await bigFiniteField.equals(value, value);
        console.timeEnd()
    })

    it("Returns element 0 of Zp", async function() {
        console.time()
        const {bigNumbers, bigFiniteField, value} = await loadFixture(deploy);
        await bigFiniteField.zero();
        console.timeEnd()
    })

    it("Returns element 1 of Zp", async function() {
        console.time()
        const {bigNumbers, bigFiniteField, value} = await loadFixture(deploy);
        await bigFiniteField.one();
        console.timeEnd()
    })

    it("Returns element 2 of Zp", async function() {
        console.time()
        const {bigNumbers, bigFiniteField, value} = await loadFixture(deploy);
        await bigFiniteField.two();
        console.timeEnd()
    })

    it("Returns element 3 of Zp", async function() {
        console.time()
        const {bigNumbers, bigFiniteField, value} = await loadFixture(deploy);
        await bigFiniteField.three();
        console.timeEnd()
    })

    it("Returns element 4 of Zp", async function() {
        console.time()
        const {bigNumbers, bigFiniteField, value} = await loadFixture(deploy);
        await bigFiniteField.four();
        console.timeEnd()
    })

    it("Returns the prime module of Zp", async function() {
        console.time()
        const {bigNumbers, bigFiniteField, value} = await loadFixture(deploy);
        await bigFiniteField.get_p();
        console.timeEnd()
    })

    it("Creation of a Zp_2 element", async function() {
        console.time()
        const {bigNumbers, bigFiniteField, quadraticExtension} = await loadFixture(deploy);
        const value = toZpStruct(await bigFiniteField.createElement(toBigNumber(await bigNumbers.init__("0x144ABB1A97A3D65527F2A479175A569855EEDA1A0E616CFDC258BDB1C8B9FA096AD09965FD55F9801343D28E92E6640B".toLowerCase(), false))));
        const valueB = toZpStruct(await bigFiniteField.createElement(toBigNumber(await bigNumbers.init__("0x13413BD2925A9E1B08112F7F4E35D5813C459301AFD9B9FBC9764FA22AA315CC2DCE1B336FAFF13A4D7F97B73A87A737".toLowerCase(), false))));
        await quadraticExtension.createElement(value, valueB);
        console.timeEnd()
    })

    it("Sum of Zp_2 elements", async function() {
        console.time()
        const {bigNumbers, quadraticExtension, qValue} = await loadFixture(deploy);
        await quadraticExtension.sum(qValue, qValue);       
        console.timeEnd()
    })

    it("Subtraction of Zp_2 elements", async function() {
        console.time()
        const {bigNumbers, quadraticExtension, qValue} = await loadFixture(deploy);
        await quadraticExtension.sub(qValue, qValue);
        console.timeEnd()
    })

    it("Multiplication of Zp_2 elements", async function() {
        console.time()
        const {bigNumbers, quadraticExtension, qValue} = await loadFixture(deploy);
        await quadraticExtension.mul(qValue, qValue);
        console.timeEnd()
    })

    it("Inversion of Zp_2 element", async function() {
        console.time()
        const {bigNumbers, quadraticExtension, qValue} = await loadFixture(deploy);
        await quadraticExtension.inverse(qValue);
        console.timeEnd()
    })

    it("Division of Zp_2 elements", async function() {
        console.time()
        const {bigNumbers, quadraticExtension, qValue} = await loadFixture(deploy);
        await quadraticExtension.div(qValue, qValue);
        console.timeEnd()
    })

    it("Multiplication with a non quadratic residue of Zp_2", async function() {
        console.time()
        const {bigNumbers, quadraticExtension, qValue} = await loadFixture(deploy);
        await quadraticExtension.mul_nonres(qValue);
        console.timeEnd()
    })

    it("Equality between Zp_2 elements", async function() {
        console.time()
        const {bigNumbers, quadraticExtension, qValue} = await loadFixture(deploy);
        await quadraticExtension.equals(qValue, qValue);
        console.timeEnd()
    })

    it("Returns element 0 of Zp_2", async function() {
        console.time()
        const {bigNumbers, quadraticExtension, qValue} = await loadFixture(deploy);
        await quadraticExtension.zero();
        console.timeEnd()
    })

    it("Returns element 1 of Zp_2", async function() {
        console.time()
        const {bigNumbers, quadraticExtension, qValue} = await loadFixture(deploy);
        await quadraticExtension.one();
        console.timeEnd()
    })

    it("Returns element 2 of Zp_2", async function() {
        console.time()
        const {bigNumbers, quadraticExtension, qValue} = await loadFixture(deploy);
        await quadraticExtension.two();
        console.timeEnd()
    })

    it("Returns element 3 of Zp_2", async function() {
        console.time()
        const {bigNumbers, quadraticExtension, qValue} = await loadFixture(deploy);
        await quadraticExtension.three();
        console.timeEnd()
    })

    it("Returns element 4 of Zp_2", async function() {
        console.time()
        const {bigNumbers, quadraticExtension, qValue} = await loadFixture(deploy);
        await quadraticExtension.four();
        console.timeEnd()
    })
    
    it("Creation of a Zp_6 element", async function() {
        console.time()
        const {bigNumbers, bigFiniteField, quadraticExtension, sexticExtension} = await loadFixture(deploy);
        const value = toZpStruct(await bigFiniteField.createElement(toBigNumber(await bigNumbers.init__("0x144ABB1A97A3D65527F2A479175A569855EEDA1A0E616CFDC258BDB1C8B9FA096AD09965FD55F9801343D28E92E6640B".toLowerCase(), false))));
        const valueB = toZpStruct(await bigFiniteField.createElement(toBigNumber(await bigNumbers.init__("0x13413BD2925A9E1B08112F7F4E35D5813C459301AFD9B9FBC9764FA22AA315CC2DCE1B336FAFF13A4D7F97B73A87A737".toLowerCase(), false))));
        const a = toZp_2Struct(await quadraticExtension.createElement(value, valueB));
        const b = toZp_2Struct(await quadraticExtension.createElement(valueB, value))   ;
        const sValue = await sexticExtension.createElement(a, b, a);
        console.timeEnd()
    })
    
    it("Sum of Zp_6 elements", async function() {
        console.time()
        const {bigNumbers, sexticExtension, sValue} = await loadFixture(deploy);
        await sexticExtension.sum(sValue, sValue);       
        console.timeEnd()
    })
    
    it("Subtraction of Zp_6 elements", async function() {
        console.time()
        const {bigNumbers, sexticExtension, sValue} = await loadFixture(deploy);
        await sexticExtension.sub(sValue, sValue);
        console.timeEnd()
    })
    
    it("Multiplication of Zp_6 elements", async function() {
        console.time()
        const {bigNumbers, sexticExtension, sValue} = await loadFixture(deploy);
        await sexticExtension.mul(sValue, sValue);
        console.timeEnd()
    })
    
    it("Inversion of Zp_6 element", async function() {
        console.time()
        const {bigNumbers, sexticExtension, sValue} = await loadFixture(deploy);
        await sexticExtension.inverse(sValue);
        console.timeEnd()
    })
    
    it("Division of Zp_6 elements", async function() {
        console.time()
        const {bigNumbers, sexticExtension, sValue} = await loadFixture(deploy);
        await sexticExtension.div(sValue, sValue);
        console.timeEnd()
    })
    
    it("Multiplication with a non quadratic residue of Zp_6", async function() {
        console.time()
        const {bigNumbers, sexticExtension, sValue} = await loadFixture(deploy);
        await sexticExtension.mul_nonres(sValue);
        console.timeEnd()
    })
    it("Equality between Zp_6 elements", async function() {
        console.time()
        const {bigNumbers, sexticExtension, sValue} = await loadFixture(deploy);
        await sexticExtension.equals(sValue, sValue);
        console.timeEnd()
    })

    it("Returns element 0 of Zp_6", async function() {
        console.time()
        const {bigNumbers, sexticExtension, sValue} = await loadFixture(deploy);
        await sexticExtension.zero();
        console.timeEnd()
    })
    
    it("Returns element 1 of Zp_6", async function() {
        console.time()
        const {bigNumbers, sexticExtension, sValue} = await loadFixture(deploy);
        await sexticExtension.one();
        console.timeEnd()
    })
    
    it("Returns element 2 of Zp_6", async function() {
        console.time()
        const {bigNumbers, sexticExtension, sValue} = await loadFixture(deploy);
        await sexticExtension.two();
        console.timeEnd()
    })
    
    it("Returns element 3 of Zp_6", async function() {
        console.time()
        const {bigNumbers, sexticExtension, sValue} = await loadFixture(deploy);
        await sexticExtension.three();
        console.timeEnd()
    })
    
    it("Returns element 4 of Zp_6", async function() {
        console.time()
        const {bigNumbers, sexticExtension, sValue} = await loadFixture(deploy);
        await sexticExtension.four();
        console.timeEnd()
    })

    it("Creation of a Zp_12 element", async function() {
        console.time()
        const {bigNumbers, bigFiniteField, quadraticExtension, sexticExtension, twelveExtension} = await loadFixture(deploy);
        const value = toZpStruct(await bigFiniteField.createElement(toBigNumber(await bigNumbers.init__("0x144ABB1A97A3D65527F2A479175A569855EEDA1A0E616CFDC258BDB1C8B9FA096AD09965FD55F9801343D28E92E6640B".toLowerCase(), false))));
        const valueB = toZpStruct(await bigFiniteField.createElement(toBigNumber(await bigNumbers.init__("0x13413BD2925A9E1B08112F7F4E35D5813C459301AFD9B9FBC9764FA22AA315CC2DCE1B336FAFF13A4D7F97B73A87A737".toLowerCase(), false))));
        const a = toZp_2Struct(await quadraticExtension.createElement(value, valueB));
        const b = toZp_2Struct(await quadraticExtension.createElement(valueB, value));
        const sValue = toZp_6Struct(await sexticExtension.createElement(a, b, a));
        const aValue = toZp_6Struct(await sexticExtension.createElement(b, a, b));
        const tValue = toZp_12Struct(await twelveExtension.createElement(sValue, aValue));
        console.timeEnd()
    })

    it("Sum of Zp_12 elements", async function() {
        console.time()
        const {bigNumbers, twelveExtension, tValue} = await loadFixture(deploy);
        await twelveExtension.sum(tValue, tValue);       
        console.timeEnd()
    })

    it("Subtraction of Zp_12 elements", async function() {
        console.time()
        const {bigNumbers, twelveExtension, tValue} = await loadFixture(deploy);
        await twelveExtension.sub(tValue, tValue);
        console.timeEnd()
    })

    it("Multiplication of Zp_12 elements", async function() {
        console.time()
        const {bigNumbers, twelveExtension, tValue} = await loadFixture(deploy);
        await twelveExtension.mul(tValue, tValue);
        console.timeEnd()
    })
/*  
    it("Exponentiation of an element of Zp_12", async function() {
        console.time()
        const {bigNumbers, twelveExtension, tValue} = await loadFixture(deploy);
        await twelveExtension.exp(tValue, toBigNumber(await bigNumbers.init__("0x1111", false)));
        console.timeEnd()
    })
*/
    it("Inversion of Zp_12 element", async function() {
        console.time()
        const {bigNumbers, twelveExtension, tValue} = await loadFixture(deploy);
        await twelveExtension.inverse(tValue);
        console.timeEnd()
    })
    
    it("Division of Zp_12 elements", async function() {
        console.time()
        const {bigNumbers, twelveExtension, tValue} = await loadFixture(deploy);
        await twelveExtension.div(tValue, tValue);
        console.timeEnd()
    })


    it("Equality between Zp_12 elements", async function() {
        console.time()
        const {bigNumbers, twelveExtension, tValue} = await loadFixture(deploy);
        await twelveExtension.equals(tValue, tValue);
        console.timeEnd()
    })

    it("Returns element 0 of Zp_12", async function() {
        console.time()
        const {bigNumbers, twelveExtension, tValue} = await loadFixture(deploy);
        await twelveExtension.zero();
        console.timeEnd()
    })

    it("Returns element 1 of Zp_12", async function() {
        console.time()
        const {bigNumbers, twelveExtension, tValue} = await loadFixture(deploy);
        await twelveExtension.one();
        console.timeEnd()
    })

    it("Returns element 2 of Zp_12", async function() {
        console.time()
        const {bigNumbers, twelveExtension, tValue} = await loadFixture(deploy);
        await twelveExtension.two();
        console.timeEnd()
    })

    it("Returns element 3 of Zp_12", async function() {
        console.time()
        const {bigNumbers, twelveExtension, tValue} = await loadFixture(deploy);
        await twelveExtension.three();
        console.timeEnd()
    })

    it("Returns element 4 of Zp_12", async function() {
        console.time()
        const {bigNumbers, twelveExtension, tValue} = await loadFixture(deploy);
        await twelveExtension.four();
        console.timeEnd()
    })

});