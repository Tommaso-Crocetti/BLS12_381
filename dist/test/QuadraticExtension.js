"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hardhat_1 = require("hardhat"); // Importa ethers da Hardhat
const chai_1 = require("chai"); // Per i test con Chai
function toZpStruct(output) {
    return { value: output.value }; // Restituisce un oggetto con la proprietà value
}
function toZp_2Struct(output) {
    return { a: toZpStruct(output.a), b: toZpStruct(output.b) }; // Restituisce un oggetto con la proprietà value
}
describe("Quadratic Extension Contract", function () {
    let finiteField;
    let quadraticExtension;
    beforeEach(async function () {
        const FiniteFieldFactory = await hardhat_1.ethers.getContractFactory("FiniteField");
        finiteField = await FiniteFieldFactory.deploy(7);
        const quadraticExtensionFactory = await hardhat_1.ethers.getContractFactory("QuadraticExtension");
        quadraticExtension = await quadraticExtensionFactory.deploy(7);
    });
    it("should create field elements correctly", async function () {
        const elementA = await finiteField.createElement(3);
        const elementB = await finiteField.createElement(5);
        (0, chai_1.expect)(elementA.value).to.equal(3);
        (0, chai_1.expect)(elementB.value).to.equal(5);
    });
    it("should add elements correctly", async function () {
        const a = await finiteField.createElement(3);
        const b = await finiteField.createElement(5);
        const x = await quadraticExtension.createElement_2(toZpStruct(a), toZpStruct(b));
        const c = await finiteField.createElement(4);
        const d = await finiteField.createElement(2);
        const y = await quadraticExtension.createElement_2(toZpStruct(c), toZpStruct(d));
        const sum = await quadraticExtension.sum_2(toZp_2Struct(x), toZp_2Struct(y));
        (0, chai_1.expect)(sum.a.value).to.equal(0);
        (0, chai_1.expect)(sum.b.value).to.equal(0);
    });
    it("should substract elements correctly", async function () {
        const a = await finiteField.createElement(3);
        const b = await finiteField.createElement(5);
        const x = await quadraticExtension.createElement_2(toZpStruct(a), toZpStruct(b));
        const c = await finiteField.createElement(4);
        const d = await finiteField.createElement(2);
        const y = await quadraticExtension.createElement_2(toZpStruct(c), toZpStruct(d));
        const diff = await quadraticExtension.sub_2(toZp_2Struct(x), toZp_2Struct(y));
        (0, chai_1.expect)(diff.a.value).to.equal(6);
        (0, chai_1.expect)(diff.b.value).to.equal(3);
    });
    it("should multiply elements correctly", async function () {
        const a = await finiteField.createElement(3);
        const b = await finiteField.createElement(5);
        const x = await quadraticExtension.createElement_2(toZpStruct(a), toZpStruct(b));
        const c = await finiteField.createElement(4);
        const d = await finiteField.createElement(2);
        const y = await quadraticExtension.createElement_2(toZpStruct(c), toZpStruct(d));
        const mul = await quadraticExtension.mul_2(toZp_2Struct(x), toZp_2Struct(y));
        (0, chai_1.expect)(mul.a.value).to.equal(2);
        (0, chai_1.expect)(mul.b.value).to.equal(5);
    });
    it("should calculate the inverse correctly", async function () {
        const c = await finiteField.createElement(4);
        const d = await finiteField.createElement(2);
        const y = await quadraticExtension.createElement_2(toZpStruct(c), toZpStruct(d));
        const inv = await quadraticExtension.inverse_2(toZp_2Struct(y));
        (0, chai_1.expect)(inv.a.value).to.equal(3);
        (0, chai_1.expect)(inv.b.value).to.equal(2);
    });
    it("should divide elements correctly", async function () {
        const a = await finiteField.createElement(3);
        const b = await finiteField.createElement(5);
        const x = await quadraticExtension.createElement_2(toZpStruct(a), toZpStruct(b));
        const c = await finiteField.createElement(4);
        const d = await finiteField.createElement(2);
        const y = await quadraticExtension.createElement_2(toZpStruct(c), toZpStruct(d));
        const div = await quadraticExtension.div_2(toZp_2Struct(x), toZp_2Struct(y));
        (0, chai_1.expect)(div.a.value).to.equal(6);
        (0, chai_1.expect)(div.b.value).to.equal(0);
    });
    it("should revert on division by zero", async function () {
        const a = await finiteField.createElement(3);
        const b = await finiteField.createElement(5);
        const x = await quadraticExtension.createElement_2(toZpStruct(a), toZpStruct(b));
        await (0, chai_1.expect)(quadraticExtension.div_2(toZp_2Struct(x), toZp_2Struct(await quadraticExtension.createElement_2(toZpStruct(await finiteField.createElement(0)), toZpStruct(await finiteField.createElement(0)))))).to.be.revertedWith("Divisione per zero non permessa.");
    });
});
