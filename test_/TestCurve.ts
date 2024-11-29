//errore, codice di inizializzazione troppo grande:
//Trying to send a deployment transaction whose init code length is 105475. 
//The max length allowed by EIP-3860 is 49152.
//Enable the 'allowUnlimitedContractSize' option to allow init codes of any length.

import { ethers } from "hardhat";
import { expect } from "chai";
import {
    loadFixture,
  } from "@nomicfoundation/hardhat-toolbox/network-helpers";
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

describe("Curve Contract", function () {
    async function deploy() {
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
        const bigNumbersFactory: BigNumbers__factory = await ethers.getContractFactory("BigNumbers") as BigNumbers__factory;
        bigNumbers = await bigNumbersFactory.deploy();
        const getBitsFactory: GetBits__factory = await ethers.getContractFactory("GetBits", {
            libraries: {
                BigNumbers: await bigNumbers.getAddress()
            }
        })
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
        return {bigNumbers, getBits, bigFiniteField, quadraticExtension, sexticExtension, twelveExtension, pointZp, pointZp_2, pointZp_12, curve}
    };


it("should setup the curve contract correctly", async function () {
    const {curve} = await loadFixture(deploy);
    const g0: Point_ZpStruct = toPoint_ZpStruct(await curve.get_g0());
    const g1: Point_Zp_2Struct = toPoint_Zp_2Struct(await curve.get_g1());
    console.log(await curve.Subgroup_0Check(g0));
});


it("should have g_0 in the curve", async function() {
    const {pointZp, curve} = await loadFixture(deploy);
    const g0: Point_ZpStruct = toPoint_ZpStruct(await curve.get_g0());
    const point: Point_ZpStruct = toPoint_ZpStruct(await pointZp.double(g0));
    expect(await curve.isOnCurve(g0)).to.equal(true);
    expect(await curve.isOnCurve(point)).to.equal(true);
    expect(await curve.isOnCurve(toPoint_ZpStruct(await pointZp.add(g0, point))));
});

it("should have g_1 in the curve", async function() {
    const {pointZp_2, curve} = await loadFixture(deploy);
    const g1: Point_Zp_2Struct = toPoint_Zp_2Struct(await curve.get_g1());
    const point: Point_Zp_2Struct = toPoint_Zp_2Struct(await pointZp_2.double(g1));
    expect(await curve.isOnCurveTwist(g1)).to.equal(true);
    expect(await curve.isOnCurveTwist(point)).to.equal(true);
    expect(await curve.isOnCurveTwist(toPoint_Zp_2Struct(await pointZp_2.add(g1, point)))).to.equal(true);
});

it("should have g_12 in the curve", async function() {
    const {curve} = await loadFixture(deploy);
    const g1: Point_Zp_2Struct = toPoint_Zp_2Struct(await curve.get_g1());
    const g12: Point_Zp_12Struct = toPoint_Zp_12Struct(await curve.untwist(g1));
    const result = await curve.isOnCurve_12(g12)
});

it("should unwist correctly", async function() {
    const {curve, twelveExtension, sexticExtension, quadraticExtension, bigFiniteField, bigNumbers, pointZp_12 } = await loadFixture(deploy);

    const g12: Point_Zp_12Struct = toPoint_Zp_12Struct(await curve.untwist(toPoint_Zp_2Struct(await curve.get_g1())));
    const resultx = toZp_12Struct(await twelveExtension.createElement(
        toZp_6Struct(await sexticExtension.createElement(
            toZp_2Struct(await quadraticExtension.createElement(
                toZpStruct(await bigFiniteField.createElement(toBigNumber(await bigNumbers.init(0, false)))),
                toZpStruct(await bigFiniteField.createElement(toBigNumber(await bigNumbers.init(0, false))))
            )),
            toZp_2Struct(await quadraticExtension.createElement(
                toZpStruct(await bigFiniteField.createElement(toBigNumber(await bigNumbers.init(0, false)))),
                toZpStruct(await bigFiniteField.createElement(toBigNumber(await bigNumbers.init(0, false))))
            )),
            toZp_2Struct(await quadraticExtension.createElement(
                toZpStruct(await bigFiniteField.createElement(toBigNumber(await bigNumbers.init__("0x000000000000000000000000000000000b156709a18054f8d1da6c63daf62fdb902825d2c9b0788eb515b6902bb190e01f7c7a1c5dcd0ca3dd1669e70f12f49b", false)))),
                toZpStruct(await bigFiniteField.createElement(toBigNumber(await bigNumbers.init__("0x0000000000000000000000000000000008cac456b0f14a67abd2673cad311f89c943aafdcf703d8c00c4ab2bb0cdbf6913d076f5b5c750b40896131e4df136e3", false))))
            ))
        )),
        toZp_6Struct(await sexticExtension.createElement(
            toZp_2Struct(await quadraticExtension.createElement(
                toZpStruct(await bigFiniteField.createElement(toBigNumber(await bigNumbers.init(0, false)))),
                toZpStruct(await bigFiniteField.createElement(toBigNumber(await bigNumbers.init(0, false))))
            )),
            toZp_2Struct(await quadraticExtension.createElement(
                toZpStruct(await bigFiniteField.createElement(toBigNumber(await bigNumbers.init(0, false)))),
                toZpStruct(await bigFiniteField.createElement(toBigNumber(await bigNumbers.init(0, false))))
            )),
            toZp_2Struct(await quadraticExtension.createElement(
                toZpStruct(await bigFiniteField.createElement(toBigNumber(await bigNumbers.init(0, false)))),
                toZpStruct(await bigFiniteField.createElement(toBigNumber(await bigNumbers.init(0, false))))
            ))
        )),
    ))
    const resulty = toZp_12Struct(await twelveExtension.createElement(
        toZp_6Struct(await sexticExtension.createElement(
            toZp_2Struct(await quadraticExtension.createElement(
                toZpStruct(await bigFiniteField.createElement(toBigNumber(await bigNumbers.init(0, false)))),
                toZpStruct(await bigFiniteField.createElement(toBigNumber(await bigNumbers.init(0, false))))
            )),
            toZp_2Struct(await quadraticExtension.createElement(
                toZpStruct(await bigFiniteField.createElement(toBigNumber(await bigNumbers.init(0, false)))),
                toZpStruct(await bigFiniteField.createElement(toBigNumber(await bigNumbers.init(0, false))))
            )),
            toZp_2Struct(await quadraticExtension.createElement(
                toZpStruct(await bigFiniteField.createElement(toBigNumber(await bigNumbers.init(0, false)))),
                toZpStruct(await bigFiniteField.createElement(toBigNumber(await bigNumbers.init(0, false))))
            ))
        )),
        toZp_6Struct(await sexticExtension.createElement(
            toZp_2Struct(await quadraticExtension.createElement(
                toZpStruct(await bigFiniteField.createElement(toBigNumber(await bigNumbers.init(0, false)))),
                toZpStruct(await bigFiniteField.createElement(toBigNumber(await bigNumbers.init(0, false))))
            )),
            toZp_2Struct(await quadraticExtension.createElement(
                toZpStruct(await bigFiniteField.createElement(toBigNumber(await bigNumbers.init__("0x000000000000000000000000000000001676d5d8ed5244bc05492416a49e36c5eed987d702f5250afd73ffdacfa0307df80eeb7924f66015a31dadf2fc8ba635", false)))),
                toZpStruct(await bigFiniteField.createElement(toBigNumber(await bigNumbers.init__("0x00000000000000000000000000000000099100b17ad4d6aa787f564fca7001ab40dbec2c76375163903165717e3f5f5165d421ace949bd8bc18a596cf3d37e34", false))))
            )),
            toZp_2Struct(await quadraticExtension.createElement(
                toZpStruct(await bigFiniteField.createElement(toBigNumber(await bigNumbers.init(0, false)))),
                toZpStruct(await bigFiniteField.createElement(toBigNumber(await bigNumbers.init(0, false))))
            ))
        )),
    ))
    const result = toPoint_Zp_12Struct(await pointZp_12.newPoint(resultx, resulty))
    expect(await pointZp_12.compare(g12, result)).to.equal(true);
});


it("should compute addEval correctly", async function() {
    const {curve, twelveExtension, sexticExtension, quadraticExtension, bigFiniteField, bigNumbers} = await loadFixture(deploy);
    const g0: Point_ZpStruct = toPoint_ZpStruct(await curve.get_g0());
    const g1: Point_Zp_2Struct = toPoint_Zp_2Struct(await curve.get_g1());
    const result: Zp_12Struct = toZp_12Struct(await curve.addEval(g1, toPoint_Zp_2Struct(await pointZp_2.double(g1)), g0));
    expect(await quadraticExtension.equals(result.a.a, toZp_2Struct(await quadraticExtension.createElement(
        toZpStruct(await bigFiniteField.createElement(toBigNumber(await bigNumbers.init__("0x0000000000000000000000000000000008b3f481e3aaa0f1a09e30ed741d8ae4fcf5e095d5d00af600db18cb2c04b3edd03cc744a2888ae40caa232946c5e7e1", false))))
        , toZpStruct(await bigFiniteField.zero()))))).to.equal(true)
        expect(await quadraticExtension.equals(result.a.b, toZp_2Struct(await quadraticExtension.createElement(
            toZpStruct(await bigFiniteField.zero())
            , toZpStruct(await bigFiniteField.zero()))))).to.equal(true)
            expect(await quadraticExtension.equals(result.a.c, toZp_2Struct(await quadraticExtension.createElement(
                toZpStruct(await bigFiniteField.zero())
, toZpStruct(await bigFiniteField.zero()))))).to.equal(true)
expect(await quadraticExtension.equals(result.b.a, toZp_2Struct(await quadraticExtension.createElement(
toZpStruct(await bigFiniteField.zero())
, toZpStruct(await bigFiniteField.zero()))))).to.equal(true)
expect(await quadraticExtension.equals(result.b.b, toZp_2Struct(await quadraticExtension.createElement(
    toZpStruct(await bigFiniteField.createElement(toBigNumber(await bigNumbers.init__("0x000000000000000000000000000000000b9815bc2ca396ab2d857b02d5e593f3d43cf139a1457ac5fb5f715054af73afbb0acd63922b1c2c2f9029edda8a3e34", false))))
    , toZpStruct(await bigFiniteField.createElement(toBigNumber(await bigNumbers.init__("0x000000000000000000000000000000000a92313bed4812388c4c9af6d80002e9c0672d114ca6a6d0ac653db15f5d9ab8693037a8c61d5da5e15b06d1fbc74ebe", false)))))))).to.equal(true)
    expect(await quadraticExtension.equals(result.b.c, toZp_2Struct(await quadraticExtension.createElement(
        toZpStruct(await bigFiniteField.createElement(toBigNumber(await bigNumbers.init__("0x0000000000000000000000000000000007a215921b919d5ddf6787135a14b99c07f058519ac6b86a8746a6ecb6b2177fbcc50c8eb736ecc90ccf752d4460c9ef", false))))
        , toZpStruct(await bigFiniteField.createElement(toBigNumber(await bigNumbers.init__("0x0000000000000000000000000000000006bcaad7d6f48da26b40f10ceaeb958d981841801fec6ff8556c3d5fca3be3e522edb5070eead1681bd219ec832a4eaf", false)))))))).to.equal(true)
})
                    
it("should compute doubleEval correctly", async function() {
    const {curve, twelveExtension, sexticExtension, quadraticExtension, bigFiniteField, bigNumbers} = await loadFixture(deploy);
    const g0: Point_ZpStruct = toPoint_ZpStruct(await curve.get_g0());
    const g1: Point_Zp_2Struct = toPoint_Zp_2Struct(await curve.get_g1());
    const result: Zp_12Struct = toZp_12Struct(await curve.doubleEval(g1, g0));
    expect(await quadraticExtension.equals(result.a.a, toZp_2Struct(await quadraticExtension.createElement(
        toZpStruct(await bigFiniteField.createElement(toBigNumber(await bigNumbers.init__("0x0000000000000000000000000000000008b3f481e3aaa0f1a09e30ed741d8ae4fcf5e095d5d00af600db18cb2c04b3edd03cc744a2888ae40caa232946c5e7e1", false))))
        , toZpStruct(await bigFiniteField.zero()))))).to.equal(true)
        expect(await quadraticExtension.equals(result.a.b, toZp_2Struct(await quadraticExtension.createElement(
toZpStruct(await bigFiniteField.zero())
, toZpStruct(await bigFiniteField.zero()))))).to.equal(true)
expect(await quadraticExtension.equals(result.a.c, toZp_2Struct(await quadraticExtension.createElement(
toZpStruct(await bigFiniteField.zero())
, toZpStruct(await bigFiniteField.zero()))))).to.equal(true)
expect(await quadraticExtension.equals(result.b.a, toZp_2Struct(await quadraticExtension.createElement(
toZpStruct(await bigFiniteField.zero())
, toZpStruct(await bigFiniteField.zero()))))).to.equal(true)
expect(await quadraticExtension.equals(result.b.b, toZp_2Struct(await quadraticExtension.createElement(
    toZpStruct(await bigFiniteField.createElement(toBigNumber(await bigNumbers.init__("0x0000000000000000000000000000000005046996dbbc019e108c1bffa9a580bd3da2758e6747676a1f8f6f5a6c4581551282557c8309fe23619b9904d6964759", false))))
    , toZpStruct(await bigFiniteField.createElement(toBigNumber(await bigNumbers.init__("0x00000000000000000000000000000000004260d928bbf824e952dd69723d7729acfe7bb8e56ee4e9aeabddf333f73c576310e5d7e5a14d656d69f60fa50c8650", false)))))))).to.equal(true)
    expect(await quadraticExtension.equals(result.b.c, toZp_2Struct(await quadraticExtension.createElement(
        toZpStruct(await bigFiniteField.createElement(toBigNumber(await bigNumbers.init__("0x0000000000000000000000000000000005c7e861d7591b70faf54aaf571a1cdd67d510230f2e521a2bc1efc3c4aeb6be2c29d241dadcd3476b70fd12d4253412", false))))
        , toZpStruct(await bigFiniteField.createElement(toBigNumber(await bigNumbers.init__("0x000000000000000000000000000000000e09125087b55528cc0a5fde862293598dee4dd0137ae385cd379a8b97bbce06df363580bc0e2a5b9431d4f851153221", false)))))))).to.equal(true)
});

/*
it("should do the last step correctly", async function() {
    const t0 = toZp_2Struct(await quadraticExtension.createElement(toZpStruct(await bigFiniteField.createElement(toBigNumber(await bigNumbers.init__("0x144ABB1A97A3D65527F2A479175A569855EEDA1A0E616CFDC258BDB1C8B9FA096AD09965FD55F9801343D28E92E6640B".toLowerCase(), false)))),
    toZpStruct(await bigFiniteField.createElement(toBigNumber(await bigNumbers.init__("0x13413BD2925A9E1B08112F7F4E35D5813C459301AFD9B9FBC9764FA22AA315CC2DCE1B336FAFF13A4D7F97B73A87A737".toLowerCase(), false))))));
    const t1 = toZp_2Struct(await quadraticExtension.createElement(toZpStruct(await bigFiniteField.createElement(toBigNumber(await bigNumbers.init__("0x1061BED179B9D8D27CCB35AEB12E95B39E524F50FA674DB41C90542FFA28C661A2F75846365765403354400CA26E00F2".toLowerCase(), false)))),
    toZpStruct(await bigFiniteField.createElement(toBigNumber(await bigNumbers.init__("0x1927491641E856FB775DE263F806A58DB114870FE05A58C85EDFCE0B8378C53C486244480D13FEE441EBBE35DDE4520E".toLowerCase(), false))))));  
    const t2 = toZp_2Struct(await quadraticExtension.createElement(toZpStruct(await bigFiniteField.createElement(toBigNumber(await bigNumbers.init__("0x09C92CF02F3CD3D2F9D34BC44EEE0DD50314ED44CA5D30CE6A9EC0539BE7A86B121EDC61839CCC908C4BDDE256CD6048".toLowerCase(), false)))),
    toZpStruct(await bigFiniteField.createElement(toBigNumber(await bigNumbers.init__("0x170E1174852D019B09B0DA3C14841D6CDD4B79171B9E3E6A1E7EFBD5D2A6DE5E2CD8853E4F98D0E32156C3319C9F3191".toLowerCase(), false))))));
    const t3 = toZp_2Struct(await quadraticExtension.createElement(toZpStruct(await bigFiniteField.createElement(toBigNumber(await bigNumbers.init__("0x111758FD4779B9D7EDA010F36CAABFEA0C08B6703F38849ACF110661C09AA1D870D747518E310505F3342294588FB886".toLowerCase(), false)))),
    toZpStruct(await bigFiniteField.createElement(toBigNumber(await bigNumbers.init__("0x13DD0D23FE6B205AFC16BD7F54193917ADB5A1FAFF0B2F7ED7F786357F5AE1EACE5BD97858230CC0352B88C97BBEF640".toLowerCase(), false))))));  
    const t4 = toZp_2Struct(await quadraticExtension.createElement(toZpStruct(await bigFiniteField.createElement(toBigNumber(await bigNumbers.init__("0x0315D01B5D309E53BC4B7533C57146890A33C101CCA9D8675FC099F9B80A6F8E25C61610C25299EA9AB42C9EA16EABB0".toLowerCase(), false)))),
    toZpStruct(await bigFiniteField.createElement(toBigNumber(await bigNumbers.init__("0x01960487212641177315088279828825469758443483813376857441645254973735951339928020637978628064174372638541437360039167".toLowerCase(), false))))));  
    const t5 = toZp_2Struct(await quadraticExtension.createElement(toZpStruct(await bigFiniteField.createElement(toBigNumber(await bigNumbers.init__("0x0CED20608AA7112C205EE7A703C2E77F96D1AEF6FD865CAAFCB4A363D2F9DE8ECC3ACF61F888C8EEDB1483397BA6438B".toLowerCase(), false)))),
    toZpStruct(await bigFiniteField.createElement(toBigNumber(await bigNumbers.init__("0x10C839FD7D6519131E14836B595789B7121BA39388491A972B713F92F9C75D3612A4758FE5614D7877CDAF2292B7DCF2".toLowerCase(), false))))));  
    const s0 = toZp_6Struct(await sexticExtension.createElement(t0, t1, t2));
    const s1 = toZp_6Struct(await sexticExtension.createElement(t3, t4, t5));
    const value = toZp_12Struct(await twelveExtension.createElement(s0, s1));
    console.log(await curve.try_pairing(value));
})






/*
it("should evaluate the exponentiation", async function() {
    const t0 = toZp_2Struct(await quadraticExtension.createElement(toZpStruct(await bigFiniteField.createElement(toBigNumber(await bigNumbers.init__("0x144ABB1A97A3D65527F2A479175A569855EEDA1A0E616CFDC258BDB1C8B9FA096AD09965FD55F9801343D28E92E6640B".toLowerCase(), false)))),
    toZpStruct(await bigFiniteField.createElement(toBigNumber(await bigNumbers.init__("0x13413BD2925A9E1B08112F7F4E35D5813C459301AFD9B9FBC9764FA22AA315CC2DCE1B336FAFF13A4D7F97B73A87A737".toLowerCase(), false))))));
    const t1 = toZp_2Struct(await quadraticExtension.createElement(toZpStruct(await bigFiniteField.createElement(toBigNumber(await bigNumbers.init__("0x1061BED179B9D8D27CCB35AEB12E95B39E524F50FA674DB41C90542FFA28C661A2F75846365765403354400CA26E00F2".toLowerCase(), false)))),
    toZpStruct(await bigFiniteField.createElement(toBigNumber(await bigNumbers.init__("0x1927491641E856FB775DE263F806A58DB114870FE05A58C85EDFCE0B8378C53C486244480D13FEE441EBBE35DDE4520E".toLowerCase(), false))))));  
    const t2 = toZp_2Struct(await quadraticExtension.createElement(toZpStruct(await bigFiniteField.createElement(toBigNumber(await bigNumbers.init__("0x09C92CF02F3CD3D2F9D34BC44EEE0DD50314ED44CA5D30CE6A9EC0539BE7A86B121EDC61839CCC908C4BDDE256CD6048".toLowerCase(), false)))),
    toZpStruct(await bigFiniteField.createElement(toBigNumber(await bigNumbers.init__("0x170E1174852D019B09B0DA3C14841D6CDD4B79171B9E3E6A1E7EFBD5D2A6DE5E2CD8853E4F98D0E32156C3319C9F3191".toLowerCase(), false))))));
    const t3 = toZp_2Struct(await quadraticExtension.createElement(toZpStruct(await bigFiniteField.createElement(toBigNumber(await bigNumbers.init__("0x111758FD4779B9D7EDA010F36CAABFEA0C08B6703F38849ACF110661C09AA1D870D747518E310505F3342294588FB886".toLowerCase(), false)))),
    toZpStruct(await bigFiniteField.createElement(toBigNumber(await bigNumbers.init__("0x13DD0D23FE6B205AFC16BD7F54193917ADB5A1FAFF0B2F7ED7F786357F5AE1EACE5BD97858230CC0352B88C97BBEF640".toLowerCase(), false))))));  
    const t4 = toZp_2Struct(await quadraticExtension.createElement(toZpStruct(await bigFiniteField.createElement(toBigNumber(await bigNumbers.init__("0x0315D01B5D309E53BC4B7533C57146890A33C101CCA9D8675FC099F9B80A6F8E25C61610C25299EA9AB42C9EA16EABB0".toLowerCase(), false)))),
    toZpStruct(await bigFiniteField.createElement(toBigNumber(await bigNumbers.init__("0x01960487212641177315088279828825469758443483813376857441645254973735951339928020637978628064174372638541437360039167".toLowerCase(), false))))));  
    const t5 = toZp_2Struct(await quadraticExtension.createElement(toZpStruct(await bigFiniteField.createElement(toBigNumber(await bigNumbers.init__("0x0CED20608AA7112C205EE7A703C2E77F96D1AEF6FD865CAAFCB4A363D2F9DE8ECC3ACF61F888C8EEDB1483397BA6438B".toLowerCase(), false)))),
    toZpStruct(await bigFiniteField.createElement(toBigNumber(await bigNumbers.init__("0x10C839FD7D6519131E14836B595789B7121BA39388491A972B713F92F9C75D3612A4758FE5614D7877CDAF2292B7DCF2".toLowerCase(), false))))));  
    const s0 = toZp_6Struct(await sexticExtension.createElement(t0, t1, t2));
    const s1 = toZp_6Struct(await sexticExtension.createElement(t3, t4, t5));
    const value = toZp_12Struct(await twelveExtension.createElement(s0, s1));
    const result = toZp_12Struct(await twelveExtension.exp(value, toBigNumber(await bigNumbers.init(2, false))))
    const v = toZp_12Struct(await twelveExtension.mul(value, value));
    console.log(v.a.a);
    console.log(result.a.a);
    console.log(v.a.b);
    console.log(result.a.b);
    console.log(v.a.c);
    console.log(result.a.c);
    console.log(v.b.a);
    console.log(result.b.a);
    console.log(v.b.b);
    console.log(result.b.b);
    console.log(v.b.c);
    console.log(result.b.c);
})        

        /*
   
    /*
    it("should evaluate the exponentiation", async function() {
        const t0 = toZp_2Struct(await quadraticExtension.createElement(toZpStruct(await bigFiniteField.createElement(toBigNumber(await bigNumbers.init__("0x144ABB1A97A3D65527F2A479175A569855EEDA1A0E616CFDC258BDB1C8B9FA096AD09965FD55F9801343D28E92E6640B".toLowerCase(), false)))),
        toZpStruct(await bigFiniteField.createElement(toBigNumber(await bigNumbers.init__("0x13413BD2925A9E1B08112F7F4E35D5813C459301AFD9B9FBC9764FA22AA315CC2DCE1B336FAFF13A4D7F97B73A87A737".toLowerCase(), false))))));
        const t1 = toZp_2Struct(await quadraticExtension.createElement(toZpStruct(await bigFiniteField.createElement(toBigNumber(await bigNumbers.init__("0x1061BED179B9D8D27CCB35AEB12E95B39E524F50FA674DB41C90542FFA28C661A2F75846365765403354400CA26E00F2".toLowerCase(), false)))),
        toZpStruct(await bigFiniteField.createElement(toBigNumber(await bigNumbers.init__("0x1927491641E856FB775DE263F806A58DB114870FE05A58C85EDFCE0B8378C53C486244480D13FEE441EBBE35DDE4520E".toLowerCase(), false))))));  
        const t2 = toZp_2Struct(await quadraticExtension.createElement(toZpStruct(await bigFiniteField.createElement(toBigNumber(await bigNumbers.init__("0x09C92CF02F3CD3D2F9D34BC44EEE0DD50314ED44CA5D30CE6A9EC0539BE7A86B121EDC61839CCC908C4BDDE256CD6048".toLowerCase(), false)))),
        toZpStruct(await bigFiniteField.createElement(toBigNumber(await bigNumbers.init__("0x170E1174852D019B09B0DA3C14841D6CDD4B79171B9E3E6A1E7EFBD5D2A6DE5E2CD8853E4F98D0E32156C3319C9F3191".toLowerCase(), false))))));
        const t3 = toZp_2Struct(await quadraticExtension.createElement(toZpStruct(await bigFiniteField.createElement(toBigNumber(await bigNumbers.init__("0x111758FD4779B9D7EDA010F36CAABFEA0C08B6703F38849ACF110661C09AA1D870D747518E310505F3342294588FB886".toLowerCase(), false)))),
        toZpStruct(await bigFiniteField.createElement(toBigNumber(await bigNumbers.init__("0x13DD0D23FE6B205AFC16BD7F54193917ADB5A1FAFF0B2F7ED7F786357F5AE1EACE5BD97858230CC0352B88C97BBEF640".toLowerCase(), false))))));  
        const t4 = toZp_2Struct(await quadraticExtension.createElement(toZpStruct(await bigFiniteField.createElement(toBigNumber(await bigNumbers.init__("0x0315D01B5D309E53BC4B7533C57146890A33C101CCA9D8675FC099F9B80A6F8E25C61610C25299EA9AB42C9EA16EABB0".toLowerCase(), false)))),
        toZpStruct(await bigFiniteField.createElement(toBigNumber(await bigNumbers.init__("0x01960487212641177315088279828825469758443483813376857441645254973735951339928020637978628064174372638541437360039167".toLowerCase(), false))))));  
        const t5 = toZp_2Struct(await quadraticExtension.createElement(toZpStruct(await bigFiniteField.createElement(toBigNumber(await bigNumbers.init__("0x0CED20608AA7112C205EE7A703C2E77F96D1AEF6FD865CAAFCB4A363D2F9DE8ECC3ACF61F888C8EEDB1483397BA6438B".toLowerCase(), false)))),
        toZpStruct(await bigFiniteField.createElement(toBigNumber(await bigNumbers.init__("0x10C839FD7D6519131E14836B595789B7121BA39388491A972B713F92F9C75D3612A4758FE5614D7877CDAF2292B7DCF2".toLowerCase(), false))))));  
        const s0 = toZp_6Struct(await sexticExtension.createElement(t0, t1, t2));
        const s1 = toZp_6Struct(await sexticExtension.createElement(t3, t4, t5));
        const value = toZp_12Struct(await twelveExtension.createElement(s0, s1));
        const result = toZp_12Struct(await twelveExtension.exp(value, toBigNumber(await bigNumbers.init(2, false))))
        const v = toZp_12Struct(await twelveExtension.mul(value, value));
        console.log(v.a.a);
        console.log(v.a.b);
        console.log(v.a.c);
        console.log(v.b.a);
        console.log(v.b.b);
        console.log(v.b.c);
        console.log(result.a.a);
        console.log(result.a.b);
        console.log(result.a.c);
        console.log(result.b.a);
        console.log(result.b.b);
        console.log(result.b.c);
        console.log(await getBits.getBits(toBigNumber(await bigNumbers.init(2, false))))
    })

    it("should calculate the miller loop", async function() {
        const g0: Point_ZpStruct = toPoint_ZpStruct(await curve.get_g0());
        const g1: Point_Zp_2Struct = toPoint_Zp_2Struct(await curve.get_g1());
        const result: Zp_12Struct = toZp_12Struct(await curve.miller(g0, g1));
        expect(result).to.equal(true);
        })
*/
    });
