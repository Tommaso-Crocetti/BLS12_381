"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hardhat_1 = require("hardhat"); // Importa ethers da Hardhat
const chai_1 = require("chai"); // Per i test con Chai
function toZpStruct(output) {
    return { value: output.value }; // Restituisce un oggetto con la proprietà value
}
describe("FiniteField Contract", function () {
    let finiteField;
    beforeEach(async function () {
        const FiniteFieldFactory = await hardhat_1.ethers.getContractFactory("FiniteField");
        finiteField = await FiniteFieldFactory.deploy(7);
    });
    it("should create field elements correctly", async function () {
        const elementA = await finiteField.createElement(3);
        const elementB = await finiteField.createElement(5);
        (0, chai_1.expect)(elementA.value).to.equal(3);
        (0, chai_1.expect)(elementB.value).to.equal(5);
    });
    it("should add elements correctly", async function () {
        const elementA = await finiteField.createElement(3);
        const elementB = await finiteField.createElement(5);
        const sum = await finiteField.sum(toZpStruct(elementA), toZpStruct(elementB));
        (0, chai_1.expect)(sum.value).to.equal(1); // (3 + 5) mod 7 = 1
    });
    it("should subtract elements correctly", async function () {
        const elementA = await finiteField.createElement(3);
        const elementB = await finiteField.createElement(5);
        const diff = await finiteField.sub(toZpStruct(elementA), toZpStruct(elementB));
        (0, chai_1.expect)(diff.value).to.equal(5); // (3 - 5 + 7) mod 7 = 5
    });
    it("should multiply elements correctly", async function () {
        const elementA = await finiteField.createElement(3);
        const elementB = await finiteField.createElement(5);
        const prod = await finiteField.mul(toZpStruct(elementA), toZpStruct(elementB));
        (0, chai_1.expect)(prod.value).to.equal(1); // (3 * 5) mod 7 = 15 mod 7 = 1
    });
    it("should calculate the inverse correctly", async function () {
        const elementA = await finiteField.createElement(3);
        const inv = await finiteField.inverse(toZpStruct(elementA));
        (0, chai_1.expect)(inv.value).to.equal(5);
    });
    it("should divide elements correctly", async function () {
        const elementA = await finiteField.createElement(3);
        const elementB = await finiteField.createElement(5);
        const div = await finiteField.div(toZpStruct(elementA), toZpStruct(elementB));
        (0, chai_1.expect)(div.value).to.equal(2); // 3 / 5 = 3 * inv(5) mod 7 => inv(5) = 3 => (3 * 3) mod 7 = 9 mod 7 = 2
    });
    it("should revert on division by zero", async function () {
        const elementA = await finiteField.createElement(3);
        const elementB = await finiteField.createElement(0);
        await (0, chai_1.expect)(finiteField.div(toZpStruct(elementA), toZpStruct(elementB))).to.be.revertedWith("Divisione per zero non permessa.");
    });
});
