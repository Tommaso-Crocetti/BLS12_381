import { ethers } from "hardhat";
import { expect } from "chai";
import { BigFiniteField, BigFiniteField__factory, BigNumbers, BigNumbers__factory, point } from "../../typechain-types"; // Assicurati che il percorso sia corretto
import { BigNumberStruct, BigNumberStructOutput } from "../../typechain-types/BigNumber.sol/BigNumbers";
import { ZpStruct, ZpStructOutput } from "../../typechain-types/field/BigFiniteField";
import { PointZp, PointZp__factory } from "../../typechain-types";
import { Point_ZpStruct, Point_ZpStructOutput } from "../../typechain-types/point/pointZp.sol/PointZp";

function toBigNumber(input: BigNumberStructOutput): BigNumberStruct {
    return {val: input.val, neg: input.neg, bitlen: input.bitlen };
}

function toZpStruct(output: ZpStructOutput): ZpStruct {
    return { value: toBigNumber(output.value) }; // Restituisce un oggetto con la proprietà value
}

function toPoint_ZpStruct(input: Point_ZpStructOutput): Point_ZpStruct {
    return {pointType: input.pointType, x: toZpStruct(input.x), y: toZpStruct(input.y)};
}

describe("Gas Point_Zp", function () {
    let bigNumbers: BigNumbers;
    let bigFiniteField: BigFiniteField;
    let pointZp: PointZp;
    beforeEach(async function () {
        const bigNumbersFactory: BigNumbers__factory = await ethers.getContractFactory("BigNumbers") as BigNumbers__factory;
        bigNumbers = await bigNumbersFactory.deploy();
        const bigFiniteFieldFactory: BigFiniteField__factory = await ethers.getContractFactory("BigFiniteField", {
            libraries: {
                BigNumbers: await bigNumbers.getAddress()
              }
        }) as BigFiniteField__factory;
        bigFiniteField = await bigFiniteFieldFactory.deploy(toBigNumber(await bigNumbers.init__("0x1a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffffffffaaab", false)));
        const pointZpFactory: PointZp__factory = await ethers.getContractFactory("PointZp", {
            libraries: {
                BigNumbers: await bigNumbers.getAddress()
              }
        }) as PointZp__factory;
        pointZp = await pointZpFactory.deploy(bigFiniteField);
    });
    
    it("gas usage", async function() {
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
        await pointZp.point_at_infinity();
        await pointZp.add(a, b);
        await pointZp.double(a);
        await pointZp.multiply(toBigNumber(await bigNumbers.init(2, false)), a)
        await pointZp.compare(a, b);
    }) 
});