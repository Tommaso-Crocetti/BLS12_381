//errore, codice di inizializzazione troppo grande:
//Trying to send a deployment transaction whose init code length is 105475. 
//The max length allowed by EIP-3860 is 49152.
//Enable the 'allowUnlimitedContractSize' option to allow init codes of any length.

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
import { PointZp, PointZp__factory } from "../typechain-types";
import { PointZp_2, PointZp_2__factory } from "../typechain-types";
import { PointZp_12, PointZp_12__factory } from "../typechain-types";
import { Point_ZpStruct, Point_ZpStructOutput } from "../typechain-types/point/pointZp.sol/PointZp";
import { Point_Zp_2Struct, Point_Zp_2StructOutput } from "../typechain-types/point/pointZp_2.sol/PointZp_2";
import { Point_Zp_12Struct, Point_Zp_12StructOutput } from "../typechain-types/point/pointZp_12.sol/PointZp_12";
import { Curve, Curve__factory } from "../typechain-types"


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

function toPoint_ZpStruct(input: Point_ZpStructOutput): Point_ZpStruct {
    return {pointType: input.pointType, x: toZpStruct(input.x), y: toZpStruct(input.y)};
}

function toPoint_Zp_2Struct(input: Point_Zp_2StructOutput): Point_Zp_2Struct {
    return {pointType: input.pointType, x: toZp_2Struct(input.x), y: toZp_2Struct(input.y)};
}

function toPoint_Zp_12Struct(input: Point_Zp_12StructOutput): Point_Zp_12Struct {
    return {pointType: input.pointType, x: toZp_12Struct(input.x), y: toZp_12Struct(input.y)};
}

describe("Gas Curve", function () {
    let bigNumbers: BigNumbers;
    let getBits: GetBits;
    let bigFiniteField: BigFiniteField;
    let quadraticExtension: QuadraticExtension;
    let sexticExtension: SexticExtension;
    let twelveExtension: TwelveExtension;
    let pointZp: PointZp;
    let pointZp_2: PointZp_2;
    let pointZp_12: PointZp_12;
    let curve: Curve;
    let g0: Point_ZpStruct;
    let g1: Point_Zp_2Struct;
    let g12: Point_Zp_12Struct;
    beforeEach(async function () {
        const bigNumbersFactory: BigNumbers__factory = await ethers.getContractFactory("BigNumbers") as BigNumbers__factory;
        bigNumbers = await bigNumbersFactory.deploy();
        const getBitsFactory: GetBits__factory = await ethers.getContractFactory("GetBits", {
            libraries: {
                BigNumbers: await bigNumbers.getAddress()
            }
        }) as GetBits__factory;
        getBits = await getBitsFactory.deploy();
        const bigFiniteFieldFactory: BigFiniteField__factory = await ethers.getContractFactory("BigFiniteField", {
            libraries: {
                BigNumbers: await bigNumbers.getAddress()
              }
        }) as BigFiniteField__factory;
        bigFiniteField = await bigFiniteFieldFactory.deploy(toBigNumber(await bigNumbers.init__("0x1a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffffffffaaab", false)));
        const pointZpFactory: PointZp__factory = await ethers.getContractFactory("PointZp", {
            libraries: {
                GetBits: await getBits.getAddress()
              }
        }) as PointZp__factory;
        pointZp = await pointZpFactory.deploy(bigFiniteField);
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
        const pointZp_2Factory: PointZp_2__factory = await ethers.getContractFactory("PointZp_2", {
            libraries: {
                GetBits: await getBits.getAddress()
            }
        }) as PointZp_2__factory;
        pointZp_2 = await pointZp_2Factory.deploy(quadraticExtension);
        const pointZp_12Factory: PointZp_12__factory = await ethers.getContractFactory("PointZp_12") as PointZp_12__factory;
        pointZp_12 = await pointZp_12Factory.deploy(twelveExtension);
        const curveFactory: Curve__factory = await ethers.getContractFactory("Curve", {
        libraries: {
            BigNumbers: await bigNumbers.getAddress(),
            GetBits: await getBits.getAddress()
        }
    }) as Curve__factory;
        curve = await curveFactory.deploy();
        g0 = toPoint_ZpStruct(await curve.get_g0());
        g1 = toPoint_Zp_2Struct(await curve.get_g1());
        //g12 = await curve.untwist(g1);
    });

    it("should evaluate the exponentiation", async function() {
        const t0 = toZp_2Struct(await quadraticExtension.createElement(toZpStruct(await bigFiniteField.createElement(toBigNumber(await bigNumbers.init__("0x144ABB1A97A3D65527F2A479175A569855EEDA1A0E616CFDC258BDB1C8B9FA096AD09965FD55F9801343D28E92E6640B".toLowerCase(), false)))),
        toZpStruct(await bigFiniteField.createElement(toBigNumber(await bigNumbers.init__("0x13413BD2925A9E1B08112F7F4E35D5813C459301AFD9B9FBC9764FA22AA315CC2DCE1B336FAFF13A4D7F97B73A87A737".toLowerCase(), false))))));
        const t1 = toZp_2Struct(await quadraticExtension.createElement(toZpStruct(await bigFiniteField.createElement(toBigNumber(await bigNumbers.init__("0x1061BED179B9D8D27CCB35AEB12E95B39E524F50FA674DB41C90542FFA28C661A2F75846365765403354400CA26E00F2".toLowerCase(), false)))),
        toZpStruct(await bigFiniteField.createElement(toBigNumber(await bigNumbers.init__("0x1927491641E856FB775DE263F806A58DB114870FE05A58C85EDFCE0B8378C53C486244480D13FEE441EBBE35DDE4520E".toLowerCase(), false))))));  
        const t2 = toZp_2Struct(await quadraticExtension.createElement(toZpStruct(await bigFiniteField.createElement(toBigNumber(await bigNumbers.init__("0x01A542DE4684F6373E2A21D822117173950BFF0915EB782C284B2AFA32C9FFED3A168C2AC29C427E095A2F06F209DB39".toLowerCase(), false)))),
        toZpStruct(await bigFiniteField.createElement(toBigNumber(await bigNumbers.init__("0x170E1174852D019B09B0DA3C14841D6CDD4B79171B9E3E6A1E7EFBD5D2A6DE5E2CD8853E4F98D0E32156C3319C9F3191".toLowerCase(), false))))));
        const t3 = toZp_2Struct(await quadraticExtension.createElement(toZpStruct(await bigFiniteField.createElement(toBigNumber(await bigNumbers.init__("0x111758FD4779B9D7EDA010F36CAABFEA0C08B6703F38849ACF110661C09AA1D870D747518E310505F3342294588FB886".toLowerCase(), false)))),
        toZpStruct(await bigFiniteField.createElement(toBigNumber(await bigNumbers.init__("0x13DD0D23FE6B205AFC16BD7F54193917ADB5A1FAFF0B2F7ED7F786357F5AE1EACE5BD97858230CC0352B88C97BBEF640".toLowerCase(), false))))));  
        const t4 = toZp_2Struct(await quadraticExtension.createElement(toZpStruct(await bigFiniteField.createElement(toBigNumber(await bigNumbers.init__("0x0315D01B5D309E53BC4B7533C57146890A33C101CCA9D8675FC099F9B80A6F8E25C61610C25299EA9AB42C9EA16EABB0".toLowerCase(), false)))),
        toZpStruct(await bigFiniteField.createElement(toBigNumber(await bigNumbers.init__("0x0CBCCF94F2A6BCC12D54395AD34D72E308D2B753ADCE82CD21E864D7BDBC5DFDD093CAA671BABA5189CEB2764A4664FF".toLowerCase(), false))))));  
        const t5 = toZp_2Struct(await quadraticExtension.createElement(toZpStruct(await bigFiniteField.createElement(toBigNumber(await bigNumbers.init__("0x0CED20608AA7112C205EE7A703C2E77F96D1AEF6FD865CAAFCB4A363D2F9DE8ECC3ACF61F888C8EEDB1483397BA6438B".toLowerCase(), false)))),
        toZpStruct(await bigFiniteField.createElement(toBigNumber(await bigNumbers.init__("0x10C839FD7D6519131E14836B595789B7121BA39388491A972B713F92F9C75D3612A4758FE5614D7877CDAF2292B7DCF2".toLowerCase(), false))))));  
        const s0 = toZp_6Struct(await sexticExtension.createElement(t0, t1, t2));
        const s1 = toZp_6Struct(await sexticExtension.createElement(t3, t4, t5));
        const value = toZp_12Struct(await twelveExtension.createElement(s0, s1));
        const result = toPoint_ZpStruct(await pointZp.multiply(toBigNumber(await bigNumbers.init(5, false)), g0));
        console.log(result);
    })
    
    it("gas usage", async function() {
        await curve.get_prime();
        await curve.get_order();
        await curve.isOnCurve(g0);
        await curve.isOnCurveTwist(g1);
    })

    it("gas usage", async function() {
        g12 = toPoint_Zp_12Struct(await curve.untwist(g1));
        await curve.isOnCurve_12(g12);
    })
});
