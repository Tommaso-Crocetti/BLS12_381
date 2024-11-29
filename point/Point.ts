import { ethers } from "hardhat";
import { expect } from "chai";
import { BigFiniteField, BigFiniteField__factory, BigNumbers, BigNumbers__factory, GetBits, GetBits__factory, point, PointZp_2, PointZp_2__factory, QuadraticExtension, QuadraticExtension__factory } from "../typechain-types"; // Assicurati che il percorso sia corretto
import { BigNumberStruct, BigNumberStructOutput } from "../typechain-types/BigNumber.sol/BigNumbers";
import { ZpStruct, ZpStructOutput } from "../typechain-types/field/BigFiniteField";
import { PointZp, PointZp__factory } from "../typechain-types";
import { Point_ZpStruct, Point_ZpStructOutput } from "../typechain-types/point/pointZp.sol/PointZp";
import {
    loadFixture
  } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { Zp_2StructOutput } from "../typechain-types/field/quadraticExtension.sol/QuadraticExtension";
import { Point_Zp_2Struct, Point_Zp_2StructOutput, Zp_2Struct } from "../typechain-types/point/pointZp_2.sol/PointZp_2";

function toBigNumber(input: BigNumberStructOutput): BigNumberStruct {
    return {val: input.val, neg: input.neg, bitlen: input.bitlen };
}

function toZpStruct(output: ZpStructOutput): ZpStruct {
    return { value: toBigNumber(output.value) }; // Restituisce un oggetto con la proprietà value
}

function toPoint_ZpStruct(input: Point_ZpStructOutput): Point_ZpStruct {
    return {pointType: input.pointType, x: toZpStruct(input.x), y: toZpStruct(input.y)};
}

function toZp_2Struct(output: Zp_2StructOutput): Zp_2Struct {
    return { a: toZpStruct(output.a), b: toZpStruct(output.b) }; // Restituisce un oggetto con la proprietà value
}

function toPoint_Zp_2Struct(input: Point_Zp_2StructOutput): Point_Zp_2Struct {
    return {pointType: input.pointType, x: toZp_2Struct(input.x), y: toZp_2Struct(input.y)};
}

describe("Time and gas usage", function () {
    async function deploy() {

        let bigNumbers: BigNumbers;
        let bigFiniteField: BigFiniteField;
        let quadraticExtension: QuadraticExtension;
        let pointZp: PointZp;
        let pointZp_2: PointZp_2;
        let getBits: GetBits;
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
            bigFiniteField = await bigFiniteFieldFactory.deploy(toBigNumber(await bigNumbers.init__("0x1a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffffffffaaab", false)));
            const pointZpFactory: PointZp__factory = await ethers.getContractFactory("PointZp", {
                libraries: {
                    GetBits: await getBits.getAddress()
                }
            }) as PointZp__factory;
            pointZp = await pointZpFactory.deploy(bigFiniteField);
            const quadraticExtensionFactory: QuadraticExtension__factory = await ethers.getContractFactory("QuadraticExtension") as QuadraticExtension__factory;
            quadraticExtension = await quadraticExtensionFactory.deploy(bigFiniteField);
            const pointZp_2Factory: PointZp_2__factory = await ethers.getContractFactory("PointZp_2", {
                libraries: {
                    GetBits: await getBits.getAddress()
                  }
            }) as PointZp_2__factory;
            pointZp_2 = await pointZp_2Factory.deploy(quadraticExtension);
            const a = toPoint_ZpStruct(await pointZp.newPoint(
                toZpStruct(await bigFiniteField.createElement(
                    toBigNumber(await bigNumbers.init__(
                        "0x17f1d3a73197d7942695638c4fa9ac0fc3688c4f9774b905a14e3a3f171bac586c55e83ff97a1aeffb3af00adb22c6bb",
                        false
                    ))
                )),
                toZpStruct(await bigFiniteField.createElement(
                    toBigNumber(await bigNumbers.init__(
                        "0x08b3f481e3aaa0f1a09e30ed741d8ae4fcf5e095d5d00af600db18cb2c04b3edd03cc744a2888ae40caa232946c5e7e1",
                        false
                    ))
                ))
            ));
            const b = toPoint_ZpStruct(await pointZp.newPoint(
                toZpStruct(await bigFiniteField.createElement(
                    toBigNumber(await bigNumbers.init__(
                        "0x08b3f481e3aaa0f1a09e30ed741d8ae4fcf5e095d5d00af600db18cb2c04b3edd03cc744a2888ae40caa232946c5e7e1",
                        false
                    ))
                )),
                toZpStruct(await bigFiniteField.createElement(
                    toBigNumber(await bigNumbers.init__(
                        "0x17f1d3a73197d7942695638c4fa9ac0fc3688c4f9774b905a14e3a3f171bac586c55e83ff97a1aeffb3af00adb22c6bb",
                        false
                    ))
                ))
            ));
            const a2 = toPoint_Zp_2Struct(await pointZp_2.newPoint(
                toZp_2Struct(await quadraticExtension.createElement(toZpStruct(
                    await bigFiniteField.createElement(toBigNumber(
                        await bigNumbers.init__(
                            "0x024aa2b2f08f0a91260805272dc51051c6e47ad4fa403b02b4510b647ae3d1770bac0326a805bbefd48056c8c121bdb8",
                            false
                        ))
                    )),
                    toZpStruct(await bigFiniteField.createElement(
                        toBigNumber(await bigNumbers.init__(
                            "0x13e02b6052719f607dacd3a088274f65596bd0d09920b61ab5da61bbdc7f5049334cf11213945d57e5ac7d055d042b7e",
                            false
                        ))
                    ))
                )),
                toZp_2Struct(await quadraticExtension.createElement(toZpStruct(
                    await bigFiniteField.createElement(toBigNumber(
                        await bigNumbers.init__(
                            "0x0ce5d527727d6e118cc9cdc6da2e351aadfd9baa8cbdd3a76d429a695160d12c923ac9cc3baca289e193548608b82801",
                            false
                        ))
                    )),
                    toZpStruct(await bigFiniteField.createElement(toBigNumber(
                        await bigNumbers.init__(
                            "0x0606c4a02ea734cc32acd2b02bc28b99cb3e287e85a763af267492ab572e99ab3f370d275cec1da1aaa9075ff05f79be",
                            false
                        ))
                    ))
                ))
            ));
            const b2 = toPoint_Zp_2Struct(await pointZp_2.newPoint(
                toZp_2Struct(await quadraticExtension.createElement(toZpStruct(
                    await bigFiniteField.createElement(toBigNumber(
                        await bigNumbers.init__(
                            "0x0ce5d527727d6e118cc9cdc6da2e351aadfd9baa8cbdd3a76d429a695160d12c923ac9cc3baca289e193548608b82801",
                            false
                        ))
                    )),
                    toZpStruct(await bigFiniteField.createElement(toBigNumber(
                        await bigNumbers.init__(
                            "0x0606c4a02ea734cc32acd2b02bc28b99cb3e287e85a763af267492ab572e99ab3f370d275cec1da1aaa9075ff05f79be",
                            false
                        ))
                    ))
                )),
                toZp_2Struct(await quadraticExtension.createElement(toZpStruct(
                    await bigFiniteField.createElement(toBigNumber(
                        await bigNumbers.init__(
                            "0x024aa2b2f08f0a91260805272dc51051c6e47ad4fa403b02b4510b647ae3d1770bac0326a805bbefd48056c8c121bdb8",
                            false
                        ))
                    )),
                    toZpStruct(await bigFiniteField.createElement(
                        toBigNumber(await bigNumbers.init__(
                            "0x13e02b6052719f607dacd3a088274f65596bd0d09920b61ab5da61bbdc7f5049334cf11213945d57e5ac7d055d042b7e",
                            false
                        ))
                    ))
                ))
            ));
        return {bigNumbers, bigFiniteField, quadraticExtension, pointZp, pointZp_2, a, b, a2, b2};
    }
    
    it("setup", async function() {
        await loadFixture(deploy);
    })

    it("Creation of a Point_Zp", async function() {
        const {bigNumbers, bigFiniteField, pointZp} = await loadFixture(deploy);
        console.time();
        const a = toPoint_ZpStruct(await pointZp.newPoint(
            toZpStruct(await bigFiniteField.createElement(
                toBigNumber(await bigNumbers.init__(
                    "0x17f1d3a73197d7942695638c4fa9ac0fc3688c4f9774b905a14e3a3f171bac586c55e83ff97a1aeffb3af00adb22c6bb",
                    false
                ))
            )),
            toZpStruct(await bigFiniteField.createElement(
                toBigNumber(await bigNumbers.init__(
                    "0x08b3f481e3aaa0f1a09e30ed741d8ae4fcf5e095d5d00af600db18cb2c04b3edd03cc744a2888ae40caa232946c5e7e1",
                    false
                ))
            ))
        ));
        console.timeEnd();
    })
    
    it("Addition of Point_Zp", async function() {
        const {bigNumbers, bigFiniteField, pointZp, a, b} = await loadFixture(deploy);
        console.time();
        await pointZp.add(a, b);
        console.timeEnd();
    })

    it("Double of a Point_Zp", async function() {
        const {bigNumbers, bigFiniteField, pointZp, a} = await loadFixture(deploy);
        console.time();
        await pointZp.double(a);
        console.timeEnd();
    })

    it("Scalar mutiplication of a Point_Zp", async function() {
        const {bigNumbers, bigFiniteField, pointZp, a} = await loadFixture(deploy);
        const k = toBigNumber(await bigNumbers.init__("0x1111", false));
        console.time();
        await pointZp.multiply(k, a);
        console.timeEnd();
    })

    it("Comparison between Point_Zp", async function() {
        const {pointZp, a, b} = await loadFixture(deploy);
        console.time();
        await pointZp.compare(a, b);
        console.timeEnd();
    })

    it("Creation of a Point_Zp_2", async function() {
        const {bigNumbers, quadraticExtension, bigFiniteField, pointZp_2} = await loadFixture(deploy);
        console.time();
        const a2 = toPoint_Zp_2Struct(await pointZp_2.newPoint(
            toZp_2Struct(await quadraticExtension.createElement(toZpStruct(
                await bigFiniteField.createElement(toBigNumber(
                    await bigNumbers.init__(
                        "0x024aa2b2f08f0a91260805272dc51051c6e47ad4fa403b02b4510b647ae3d1770bac0326a805bbefd48056c8c121bdb8",
                        false
                    ))
                )),
                toZpStruct(await bigFiniteField.createElement(
                    toBigNumber(await bigNumbers.init__(
                        "0x13e02b6052719f607dacd3a088274f65596bd0d09920b61ab5da61bbdc7f5049334cf11213945d57e5ac7d055d042b7e",
                        false
                    ))
                ))
            )),
            toZp_2Struct(await quadraticExtension.createElement(toZpStruct(
                await bigFiniteField.createElement(toBigNumber(
                    await bigNumbers.init__(
                        "0x0ce5d527727d6e118cc9cdc6da2e351aadfd9baa8cbdd3a76d429a695160d12c923ac9cc3baca289e193548608b82801",
                        false
                    ))
                )),
                toZpStruct(await bigFiniteField.createElement(toBigNumber(
                    await bigNumbers.init__(
                        "0x0606c4a02ea734cc32acd2b02bc28b99cb3e287e85a763af267492ab572e99ab3f370d275cec1da1aaa9075ff05f79be",
                        false
                    ))
                ))
            ))
        ));
        console.timeEnd();
    })

    it("Addition of Point_Zp_2", async function() {
        const {bigNumbers, bigFiniteField, pointZp_2, a2, b2} = await loadFixture(deploy);
        console.time();
        await pointZp_2.add(a2, b2);
        console.timeEnd();
    })

    it("Double of a Point_Zp", async function() {
        const {bigNumbers, bigFiniteField, pointZp_2, a2} = await loadFixture(deploy);
        console.time();
        await pointZp_2.double(a2);
        console.timeEnd();
    })

    it("Scalar mutiplication of a Point_Zp", async function() {
        const {bigNumbers, bigFiniteField, pointZp_2, a2} = await loadFixture(deploy);
        const k = toBigNumber(await bigNumbers.init__("0x1111", false));
        console.time();
        await pointZp_2.multiply(k, a2);
        console.timeEnd();
    })

    it("Comparison between Point_Zp", async function() {
        const {pointZp_2, a2, b2} = await loadFixture(deploy);
        console.time();
        await pointZp_2.compare(a2, b2);
        console.timeEnd();
    })

});