import { ethers } from "hardhat";
import { expect } from "chai";
import { BigFiniteField, BigFiniteField__factory, BigNumbers, BigNumbers__factory, point } from "../../typechain-types"; // Assicurati che il percorso sia corretto
import { QuadraticExtension, QuadraticExtension__factory } from "../../typechain-types"
import { BigNumberStruct, BigNumberStructOutput } from "../../typechain-types/BigNumber.sol/BigNumbers";
import { ZpStruct, ZpStructOutput } from "../../typechain-types/field/BigFiniteField";
import { Zp_2Struct, Zp_2StructOutput } from "../../typechain-types/field/quadraticExtension.sol/QuadraticExtension";
import { SexticExtension, SexticExtension__factory } from "../../typechain-types";
import { Zp_6Struct, Zp_6StructOutput } from "../../typechain-types/field/sexticExtension.sol/SexticExtension";
import { TwelveExtension, TwelveExtension__factory } from "../../typechain-types";
import { Zp_12Struct, Zp_12StructOutput } from "../../typechain-types/field/twelveExtension.sol/TwelveExtension";
import { PointZp_2, PointZp_2__factory } from "../../typechain-types";
import { Point_Zp_2Struct, Point_Zp_2StructOutput } from "../../typechain-types/point/pointZp_2.sol/PointZp_2";
import { PointZp_12, PointZp_12__factory } from "../../typechain-types";
import { Point_Zp_12Struct, Point_Zp_12StructOutput } from "../../typechain-types/curve.sol/Curve";


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

function toPoint_Zp_12Struct(output: Point_Zp_12StructOutput): Point_Zp_12Struct {
    return {pointType: output.pointType, x: toZp_12Struct(output.x), y: toZp_12Struct(output.y)};
}

describe("Gas Point_Zp_12", function () {
    let bigNumbers: BigNumbers;
    let bigFiniteField: BigFiniteField;
    let quadraticExtension: QuadraticExtension;
    let sexticExtension: SexticExtension;
    let twelveExtension: TwelveExtension;
    let pointZp_12: PointZp_12;
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
        const SexticExtensionFactory: SexticExtension__factory = (await ethers.getContractFactory("SexticExtension")) as SexticExtension__factory;
        sexticExtension = await SexticExtensionFactory.deploy(quadraticExtension);
        const TwelveExtension__factory: TwelveExtension__factory = (await ethers.getContractFactory("TwelveExtension")) as TwelveExtension__factory;
        twelveExtension = await TwelveExtension__factory.deploy(sexticExtension);
        const point_Zp_12__factory: PointZp_12__factory = await ethers.getContractFactory("PointZp_12") as PointZp_12__factory;
        pointZp_12 = await point_Zp_12__factory.deploy(twelveExtension);
    });
    
    it("gas usage", async function() {
        const a = toPoint_Zp_12Struct(await pointZp_12.newPoint(
            toZp_12Struct(await twelveExtension.createElement(
                toZp_6Struct(await sexticExtension.createElement(
                    toZp_2Struct(await quadraticExtension.createElement(
                        toZpStruct(await bigFiniteField.createElement(
                            toBigNumber(await bigNumbers.init__("0x024aa2b2f08f0a91260805272dc51051c6e47ad4fa403b02b4510b647ae3d1770bac0326a805bbefd48056c8c121bdb8", false))
                        )),
                        toZpStruct(await bigFiniteField.createElement(
                            toBigNumber(await bigNumbers.init__("0x024aa2b2f08f0a91260805272dc51051c6e47ad4fa403b02b4510b647ae3d1770bac0326a805bbefd48056c8c121bdb8", false))
                        ))
                    )),
                    toZp_2Struct(await quadraticExtension.createElement(
                        toZpStruct(await bigFiniteField.createElement(
                            toBigNumber(await bigNumbers.init__("0x024aa2b2f08f0a91260805272dc51051c6e47ad4fa403b02b4510b647ae3d1770bac0326a805bbefd48056c8c121bdb8", false))
                        )),
                        toZpStruct(await bigFiniteField.createElement(
                            toBigNumber(await bigNumbers.init__("0x024aa2b2f08f0a91260805272dc51051c6e47ad4fa403b02b4510b647ae3d1770bac0326a805bbefd48056c8c121bdb8", false))
                        ))
                    )),
                    toZp_2Struct(await quadraticExtension.createElement(
                        toZpStruct(await bigFiniteField.createElement(
                            toBigNumber(await bigNumbers.init__("0x024aa2b2f08f0a91260805272dc51051c6e47ad4fa403b02b4510b647ae3d1770bac0326a805bbefd48056c8c121bdb8", false))
                        )),
                        toZpStruct(await bigFiniteField.createElement(
                            toBigNumber(await bigNumbers.init__("0x024aa2b2f08f0a91260805272dc51051c6e47ad4fa403b02b4510b647ae3d1770bac0326a805bbefd48056c8c121bdb8", false))
                        ))
                    ))
                )),
                toZp_6Struct(await sexticExtension.createElement(
                    toZp_2Struct(await quadraticExtension.createElement(
                        toZpStruct(await bigFiniteField.createElement(
                            toBigNumber(await bigNumbers.init__("0x024aa2b2f08f0a91260805272dc51051c6e47ad4fa403b02b4510b647ae3d1770bac0326a805bbefd48056c8c121bdb8", false))
                        )),
                        toZpStruct(await bigFiniteField.createElement(
                            toBigNumber(await bigNumbers.init__("0x024aa2b2f08f0a91260805272dc51051c6e47ad4fa403b02b4510b647ae3d1770bac0326a805bbefd48056c8c121bdb8", false))
                        ))
                    )),
                    toZp_2Struct(await quadraticExtension.createElement(
                        toZpStruct(await bigFiniteField.createElement(
                            toBigNumber(await bigNumbers.init__("0x024aa2b2f08f0a91260805272dc51051c6e47ad4fa403b02b4510b647ae3d1770bac0326a805bbefd48056c8c121bdb8", false))
                        )),
                        toZpStruct(await bigFiniteField.createElement(
                            toBigNumber(await bigNumbers.init__("0x024aa2b2f08f0a91260805272dc51051c6e47ad4fa403b02b4510b647ae3d1770bac0326a805bbefd48056c8c121bdb8", false))
                        ))
                    )),
                    toZp_2Struct(await quadraticExtension.createElement(
                        toZpStruct(await bigFiniteField.createElement(
                            toBigNumber(await bigNumbers.init__("0x024aa2b2f08f0a91260805272dc51051c6e47ad4fa403b02b4510b647ae3d1770bac0326a805bbefd48056c8c121bdb8", false))
                        )),
                        toZpStruct(await bigFiniteField.createElement(
                            toBigNumber(await bigNumbers.init__("0x024aa2b2f08f0a91260805272dc51051c6e47ad4fa403b02b4510b647ae3d1770bac0326a805bbefd48056c8c121bdb8", false))
                        ))
                    ))
                ))
            )),
            toZp_12Struct(await twelveExtension.createElement(
                toZp_6Struct(await sexticExtension.createElement(
                    toZp_2Struct(await quadraticExtension.createElement(
                        toZpStruct(await bigFiniteField.createElement(
                            toBigNumber(await bigNumbers.init__("0x024aa2b2f08f0a91260805272dc51051c6e47ad4fa403b02b4510b647ae3d1770bac0326a805bbefd48056c8c121bdb8", false))
                        )),
                        toZpStruct(await bigFiniteField.createElement(
                            toBigNumber(await bigNumbers.init__("0x024aa2b2f08f0a91260805272dc51051c6e47ad4fa403b02b4510b647ae3d1770bac0326a805bbefd48056c8c121bdb8", false))
                        ))
                    )),
                    toZp_2Struct(await quadraticExtension.createElement(
                        toZpStruct(await bigFiniteField.createElement(
                            toBigNumber(await bigNumbers.init__("0x024aa2b2f08f0a91260805272dc51051c6e47ad4fa403b02b4510b647ae3d1770bac0326a805bbefd48056c8c121bdb8", false))
                        )),
                        toZpStruct(await bigFiniteField.createElement(
                            toBigNumber(await bigNumbers.init__("0x024aa2b2f08f0a91260805272dc51051c6e47ad4fa403b02b4510b647ae3d1770bac0326a805bbefd48056c8c121bdb8", false))
                        ))
                    )),
                    toZp_2Struct(await quadraticExtension.createElement(
                        toZpStruct(await bigFiniteField.createElement(
                            toBigNumber(await bigNumbers.init__("0x024aa2b2f08f0a91260805272dc51051c6e47ad4fa403b02b4510b647ae3d1770bac0326a805bbefd48056c8c121bdb8", false))
                        )),
                        toZpStruct(await bigFiniteField.createElement(
                            toBigNumber(await bigNumbers.init__("0x024aa2b2f08f0a91260805272dc51051c6e47ad4fa403b02b4510b647ae3d1770bac0326a805bbefd48056c8c121bdb8", false))
                        ))
                    ))
                )),
                toZp_6Struct(await sexticExtension.createElement(
                    toZp_2Struct(await quadraticExtension.createElement(
                        toZpStruct(await bigFiniteField.createElement(
                            toBigNumber(await bigNumbers.init__("0x024aa2b2f08f0a91260805272dc51051c6e47ad4fa403b02b4510b647ae3d1770bac0326a805bbefd48056c8c121bdb8", false))
                        )),
                        toZpStruct(await bigFiniteField.createElement(
                            toBigNumber(await bigNumbers.init__("0x024aa2b2f08f0a91260805272dc51051c6e47ad4fa403b02b4510b647ae3d1770bac0326a805bbefd48056c8c121bdb8", false))
                        ))
                    )),
                    toZp_2Struct(await quadraticExtension.createElement(
                        toZpStruct(await bigFiniteField.createElement(
                            toBigNumber(await bigNumbers.init__("0x024aa2b2f08f0a91260805272dc51051c6e47ad4fa403b02b4510b647ae3d1770bac0326a805bbefd48056c8c121bdb8", false))
                        )),
                        toZpStruct(await bigFiniteField.createElement(
                            toBigNumber(await bigNumbers.init__("0x024aa2b2f08f0a91260805272dc51051c6e47ad4fa403b02b4510b647ae3d1770bac0326a805bbefd48056c8c121bdb8", false))
                        ))
                    )),
                    toZp_2Struct(await quadraticExtension.createElement(
                        toZpStruct(await bigFiniteField.createElement(
                            toBigNumber(await bigNumbers.init__("0x024aa2b2f08f0a91260805272dc51051c6e47ad4fa403b02b4510b647ae3d1770bac0326a805bbefd48056c8c121bdb8", false))
                        )),
                        toZpStruct(await bigFiniteField.createElement(
                            toBigNumber(await bigNumbers.init__("0x024aa2b2f08f0a91260805272dc51051c6e47ad4fa403b02b4510b647ae3d1770bac0326a805bbefd48056c8c121bdb8", false))
                        ))
                    ))
                ))
            ))
        ));
        await pointZp_12.point_at_infinity();
    })
});