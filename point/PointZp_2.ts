import { ethers } from "hardhat";
import { expect } from "chai";
import { BigFiniteField, BigFiniteField__factory, BigNumbers, BigNumbers__factory, point } from "../../typechain-types"; // Assicurati che il percorso sia corretto
import { QuadraticExtension, QuadraticExtension__factory } from "../../typechain-types"
import { BigNumberStruct, BigNumberStructOutput } from "../../typechain-types/BigNumber.sol/BigNumbers";
import { ZpStruct, ZpStructOutput } from "../../typechain-types/field/BigFiniteField";
import { Zp_2Struct, Zp_2StructOutput } from "../../typechain-types/field/quadraticExtension.sol/QuadraticExtension";
import { PointZp_2, PointZp_2__factory } from "../../typechain-types";
import { Point_Zp_2Struct, Point_Zp_2StructOutput } from "../../typechain-types/point/pointZp_2.sol/PointZp_2";

function toBigNumber(input: BigNumberStructOutput): BigNumberStruct {
    return {val: input.val, neg: input.neg, bitlen: input.bitlen };
}

function toZpStruct(output: ZpStructOutput): ZpStruct {
    return { value: toBigNumber(output.value) }; // Restituisce un oggetto con la proprietà value
}

function toZp_2Struct(output: Zp_2StructOutput): Zp_2Struct {
    return { a: toZpStruct(output.a), b: toZpStruct(output.b) }; // Restituisce un oggetto con la proprietà value
}

function toPoint_Zp_2Struct(input: Point_Zp_2StructOutput): Point_Zp_2Struct {
    return {pointType: input.pointType, x: toZp_2Struct(input.x), y: toZp_2Struct(input.y)};
}

describe("Gas PointZp_2", function () {
    let bigNumbers: BigNumbers;
    let bigFiniteField: BigFiniteField;
    let quadraticExtension: QuadraticExtension;
    let pointZp_2: PointZp_2;
    beforeEach(async function () {
        const bigNumbersFactory: BigNumbers__factory = await ethers.getContractFactory("BigNumbers") as BigNumbers__factory;
        bigNumbers = await bigNumbersFactory.deploy();
        const bigFiniteFieldFactory: BigFiniteField__factory = await ethers.getContractFactory("BigFiniteField", {
            libraries: {
                BigNumbers: await bigNumbers.getAddress()
              }
        }) as BigFiniteField__factory;
        bigFiniteField = await bigFiniteFieldFactory.deploy(toBigNumber(await bigNumbers.init__("0x1a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffffffffaaab", false)));
        const quadraticExtensionFactory: QuadraticExtension__factory = await ethers.getContractFactory("QuadraticExtension") as QuadraticExtension__factory;
        quadraticExtension = await quadraticExtensionFactory.deploy(bigFiniteField);
        const pointZp_2Factory: PointZp_2__factory = await ethers.getContractFactory("PointZp_2", {
            libraries: {
                BigNumbers: await bigNumbers.getAddress()
              }
        }) as PointZp_2__factory;
        pointZp_2 = await pointZp_2Factory.deploy(quadraticExtension);
    });
    
    it("gas usage", async function() {
        const a = toPoint_Zp_2Struct(await pointZp_2.newPoint(
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
        const b = toPoint_Zp_2Struct(await pointZp_2.newPoint(
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
        await pointZp_2.point_at_infinity();
        await pointZp_2.add(a, b);
        await pointZp_2.double(a);
        await pointZp_2.multiply(toBigNumber(await bigNumbers.init(2, false)), a)
        await pointZp_2.compare(a, b);
    })
    
    
});