"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hardhat_1 = require("hardhat");
const chai_1 = require("chai");
// Utility functions to convert structs
function toZpStruct(output) {
    return { value: output.value };
}
function toZp_2Struct(output) {
    return { a: toZpStruct(output.a), b: toZpStruct(output.b) };
}
function toZp_6Struct(output) {
    return {
        a: toZp_2Struct(output.a),
        b: toZp_2Struct(output.b),
        c: toZp_2Struct(output.c),
    };
}
describe("Sextic Extension Contract", function () {
    let finiteField;
    let quadraticExtension;
    let sexticExtension;
    let element6x;
    let element6y;
    beforeEach(async function () {
        const FiniteFieldFactory = (await hardhat_1.ethers.getContractFactory("FiniteField"));
        finiteField = await FiniteFieldFactory.deploy(7);
        const QuadraticExtensionFactory = (await hardhat_1.ethers.getContractFactory("QuadraticExtension"));
        quadraticExtension = await QuadraticExtensionFactory.deploy(7);
        const SexticExtensionFactory = (await hardhat_1.ethers.getContractFactory("SexticExtension"));
        sexticExtension = await SexticExtensionFactory.deploy(7);
        const a = await finiteField.createElement(3);
        const b = await finiteField.createElement(5);
        const x = await quadraticExtension.createElement_2(toZpStruct(a), toZpStruct(b));
        const c = await finiteField.createElement(1);
        const d = await finiteField.createElement(2);
        const y = await quadraticExtension.createElement_2(toZpStruct(c), toZpStruct(d));
        const element6x = await sexticExtension.createElement_6(toZp_2Struct(x), toZp_2Struct(y), toZp_2Struct(x));
        const element6y = await sexticExtension.createElement_6(toZp_2Struct(y), toZp_2Struct(x), toZp_2Struct(y));
    });
    it("should create sextic field elements correctly", async function () {
        const a = await finiteField.createElement(3);
        const b = await finiteField.createElement(5);
        const x = await quadraticExtension.createElement_2(toZpStruct(a), toZpStruct(b));
        const c = await finiteField.createElement(1);
        const d = await finiteField.createElement(2);
        const y = await quadraticExtension.createElement_2(toZpStruct(c), toZpStruct(d));
        const element6 = await sexticExtension.createElement_6(toZp_2Struct(x), toZp_2Struct(y), toZp_2Struct(x));
        (0, chai_1.expect)(element6.a.a.value).to.equal(3);
        (0, chai_1.expect)(element6.b.a.value).to.equal(1);
        (0, chai_1.expect)(element6.c.a.value).to.equal(3);
    });
    it("should add sextic elements correctly", async function () {
        const sum = await sexticExtension.sum_6(toZp_6Struct(element6x), toZp_6Struct(element6y));
        (0, chai_1.expect)(sum.a.a.value).to.equal(4);
        (0, chai_1.expect)(sum.b.a.value).to.equal(4);
        (0, chai_1.expect)(sum.c.a.value).to.equal(4);
        (0, chai_1.expect)(sum.c.a.value).to.equal(4);
        (0, chai_1.expect)(sum.c.a.value).to.equal(4);
        (0, chai_1.expect)(sum.c.a.value).to.equal(4);
    });
    it("should subtract sextic elements correctly", async function () {
        const sub = await sexticExtension.sub_6(toZp_6Struct(element6x), toZp_6Struct(element6y));
        (0, chai_1.expect)(sub.a.a.value).to.equal(2);
        (0, chai_1.expect)(sub.b.a.value).to.equal(5);
        (0, chai_1.expect)(sub.c.a.value).to.equal(2);
        (0, chai_1.expect)(sub.a.b.value).to.equal(3);
        (0, chai_1.expect)(sub.b.b.value).to.equal(4);
        (0, chai_1.expect)(sub.c.b.value).to.equal(3);
    });
    it("should multiply sextic elements correctly", async function () {
        const a = await finiteField.createElement(3);
        const b = await finiteField.createElement(5);
        const x = await quadraticExtension.createElement_2(toZpStruct(a), toZpStruct(b));
        const c = await finiteField.createElement(1);
        const d = await finiteField.createElement(2);
        const y = await quadraticExtension.createElement_2(toZpStruct(c), toZpStruct(d));
        const element6x = await sexticExtension.createElement_6(toZp_2Struct(x), toZp_2Struct(y), toZp_2Struct(x));
        const element6y = await sexticExtension.createElement_6(toZp_2Struct(y), toZp_2Struct(x), toZp_2Struct(y));
        const mul = await sexticExtension.mul_6(toZp_6Struct(element6x), toZp_6Struct(element6y));
        (0, chai_1.expect)(mul.a.a.value).to.equal(2); // Example value; adjust based on actual field arithmetic
        (0, chai_1.expect)(mul.b.a.value).to.equal(6);
    });
    it("should calculate the inverse of sextic elements correctly", async function () {
        const a = await finiteField.createElement(3);
        const b = await finiteField.createElement(5);
        const x = await quadraticExtension.createElement_2(toZpStruct(a), toZpStruct(b));
        const element6x = await sexticExtension.createElement_6(toZp_2Struct(x), toZp_2Struct(x), toZp_2Struct(x));
        const inv = await sexticExtension.inverse_6(toZp_6Struct(element6x));
        (0, chai_1.expect)(inv.a.a.value).to.equal(1); // Example value; adjust based on field inversion logic
    });
});
