    import { ethers } from "hardhat"; // Importa ethers da Hardhat
    import { expect } from "chai"; // Per i test con Chai
    import { FiniteField, FiniteField__factory} from "../typechain-types/"; // Assicurati che il percorso sia corretto
    import { QuadraticExtension, QuadraticExtension__factory } from "../typechain-types/"

    function toZpStruct(output: FiniteField.ZpStructOutput): FiniteField.ZpStruct {
        return { value: output.value }; // Restituisce un oggetto con la proprietà value
    }

    function toZp_2Struct(output: QuadraticExtension.Zp_2StructOutput): QuadraticExtension.Zp_2Struct {
        return { a: toZpStruct(output.a), b: toZpStruct(output.b) }; // Restituisce un oggetto con la proprietà value
    }

    describe("Quadratic Extension Contract", function () {
        let finiteField: FiniteField;
        let quadraticExtension: QuadraticExtension;
        let x: QuadraticExtension.Zp_2StructOutput;
        let y: QuadraticExtension.Zp_2StructOutput;

    beforeEach(async function () {
        const FiniteFieldFactory: FiniteField__factory = await ethers.getContractFactory("FiniteField") as FiniteField__factory;
        finiteField = await FiniteFieldFactory.deploy(7);
        const quadraticExtensionFactory: QuadraticExtension__factory = await ethers.getContractFactory("QuadraticExtension") as QuadraticExtension__factory;
        quadraticExtension = await quadraticExtensionFactory.deploy(finiteField);
        const a: FiniteField.ZpStructOutput = await finiteField.createElement(3);
        const b: FiniteField.ZpStructOutput = await finiteField.createElement(5);
        x = await quadraticExtension.createElement(toZpStruct(a), toZpStruct(b));
        const c: FiniteField.ZpStructOutput = await finiteField.createElement(4);
        const d: FiniteField.ZpStructOutput = await finiteField.createElement(2);
        y = await quadraticExtension.createElement(toZpStruct(c), toZpStruct(d));
    });

    it("should create field elements correctly", async function () {
        const elementA: FiniteField.ZpStruct = await finiteField.createElement(3);
        const elementB: FiniteField.ZpStruct = await finiteField.createElement(5);

        expect(elementA.value).to.equal(3);
        expect(elementB.value).to.equal(5);
    });

    it("should add elements correctly", async function () {

        const sum: QuadraticExtension.Zp_2StructOutput = await quadraticExtension.sum(toZp_2Struct(x), toZp_2Struct(y));
        expect(sum.a.value).to.equal(0);
        expect(sum.b.value).to.equal(0);
    });
    it("should substract elements correctly", async function () {

        const diff: QuadraticExtension.Zp_2StructOutput = await quadraticExtension.sub(toZp_2Struct(x), toZp_2Struct(y));
        expect(diff.a.value).to.equal(6);
        expect(diff.b.value).to.equal(3);
    })
    it("should multiply elements correctly", async function () {

        const mul: QuadraticExtension.Zp_2StructOutput = await quadraticExtension.mul(toZp_2Struct(x), toZp_2Struct(y));
        expect(mul.a.value).to.equal(2);
        expect(mul.b.value).to.equal(5);
    })
    it("should calculate the inverse correctly", async function () {
        const c: FiniteField.ZpStructOutput = await finiteField.createElement(4);
        const d: FiniteField.ZpStructOutput = await finiteField.createElement(2);
        const y: QuadraticExtension.Zp_2StructOutput = await quadraticExtension.createElement(toZpStruct(c), toZpStruct(d));
        const inv: QuadraticExtension.Zp_2StructOutput = await quadraticExtension.inverse(toZp_2Struct(y));
        expect(inv.a.value).to.equal(3);
        expect(inv.b.value).to.equal(2);
    })
    it("should divide elements correctly", async function () {

        const div: QuadraticExtension.Zp_2StructOutput = await quadraticExtension.div(toZp_2Struct(x), toZp_2Struct(y));
        expect(div.a.value).to.equal(6);
        expect(div.b.value).to.equal(0);
    })
    it("should revert on division by zero", async function () {
        await expect(quadraticExtension.div(toZp_2Struct(x), toZp_2Struct(await quadraticExtension.createElement(toZpStruct(await finiteField.createElement(0)), toZpStruct(await finiteField.createElement(0)))))).to.be.revertedWith("Divisione per zero non permessa.");
    })
    });
