import { ethers } from "hardhat";
import { expect } from "chai";
import { FiniteField, FiniteField__factory } from "../typechain-types";
import { QuadraticExtension, QuadraticExtension__factory } from "../typechain-types";
import { SexticExtension, SexticExtension__factory } from "../typechain-types";

// Utility functions to convert structs
function toZpStruct(output: FiniteField.ZpStructOutput): FiniteField.ZpStruct {
  return { value: output.value };
}

function toZp_2Struct(output: QuadraticExtension.Zp_2StructOutput): QuadraticExtension.Zp_2Struct {
  return { a: toZpStruct(output.a), b: toZpStruct(output.b) };
}

function toZp_6Struct(output: SexticExtension.Zp_6StructOutput): SexticExtension.Zp_6Struct {
  return {
    a: toZp_2Struct(output.a),
    b: toZp_2Struct(output.b),
    c: toZp_2Struct(output.c),
  };
}

describe("Sextic Extension Contract", function () {
    let finiteField: FiniteField;
    let quadraticExtension: QuadraticExtension;
    let sexticExtension: SexticExtension;
    let element6x: SexticExtension.Zp_6StructOutput;
    let element6y: SexticExtension.Zp_6StructOutput;

    beforeEach(async function () {
        const FiniteFieldFactory: FiniteField__factory = (await ethers.getContractFactory("FiniteField")) as FiniteField__factory;
        finiteField = await FiniteFieldFactory.deploy(7);

        const QuadraticExtensionFactory: QuadraticExtension__factory = (await ethers.getContractFactory("QuadraticExtension")) as QuadraticExtension__factory;
        quadraticExtension = await QuadraticExtensionFactory.deploy(finiteField);

        const SexticExtensionFactory: SexticExtension__factory = (await ethers.getContractFactory("SexticExtension")) as SexticExtension__factory;
        sexticExtension = await SexticExtensionFactory.deploy(quadraticExtension);

        const a: FiniteField.ZpStructOutput = await finiteField.createElement(3);
        const b: FiniteField.ZpStructOutput = await finiteField.createElement(5);
        const x: QuadraticExtension.Zp_2StructOutput = await quadraticExtension.createElement(toZpStruct(a), toZpStruct(b));

        const c: FiniteField.ZpStructOutput = await finiteField.createElement(1);
        const d: FiniteField.ZpStructOutput = await finiteField.createElement(2);
        const y: QuadraticExtension.Zp_2StructOutput = await quadraticExtension.createElement(toZpStruct(c), toZpStruct(d));

        element6x = await sexticExtension.createElement(toZp_2Struct(x), toZp_2Struct(y), toZp_2Struct(x));
        element6y = await sexticExtension.createElement(toZp_2Struct(y), toZp_2Struct(x), toZp_2Struct(y));
    });

    it("should create sextic field elements correctly", async function () {
        const a: FiniteField.ZpStructOutput = await finiteField.createElement(3);
        const b: FiniteField.ZpStructOutput = await finiteField.createElement(5);
        const x: QuadraticExtension.Zp_2StructOutput = await quadraticExtension.createElement(toZpStruct(a), toZpStruct(b));

        const c: FiniteField.ZpStructOutput = await finiteField.createElement(1);
        const d: FiniteField.ZpStructOutput = await finiteField.createElement(2);
        const y: QuadraticExtension.Zp_2StructOutput = await quadraticExtension.createElement(toZpStruct(c), toZpStruct(d));

        const element6: SexticExtension.Zp_6StructOutput = await sexticExtension.createElement(toZp_2Struct(x), toZp_2Struct(y), toZp_2Struct(x));
        expect(element6.a.a.value).to.equal(3);
        expect(element6.b.a.value).to.equal(1);
        expect(element6.c.a.value).to.equal(3);
    });

    it("should add sextic elements correctly", async function () {
        const sum: SexticExtension.Zp_6StructOutput = await sexticExtension.sum(toZp_6Struct(element6x), toZp_6Struct(element6y));

        expect(sum.a.a.value).to.equal(4);
        expect(sum.b.a.value).to.equal(4);
        expect(sum.c.a.value).to.equal(4);
        expect(sum.a.b.value).to.equal(0);
        expect(sum.b.b.value).to.equal(0);
        expect(sum.c.b.value).to.equal(0);
    });

    it("should subtract sextic elements correctly", async function () {

        const sub: SexticExtension.Zp_6StructOutput = await sexticExtension.sub(toZp_6Struct(element6x), toZp_6Struct(element6y));

        expect(sub.a.a.value).to.equal(2);
        expect(sub.b.a.value).to.equal(5);
        expect(sub.c.a.value).to.equal(2);
        expect(sub.a.b.value).to.equal(3);
        expect(sub.b.b.value).to.equal(4);
        expect(sub.c.b.value).to.equal(3);

    });

    it("should multiply elements in Zp_6 correctly", async function () {
        // Creazione degli elementi Zp_2 per l'elemento x in Zp_6
        const x_a: QuadraticExtension.Zp_2StructOutput = await quadraticExtension.createElement(
            { value: 3 }, { value: 5 }
        );
        const x_b: QuadraticExtension.Zp_2StructOutput = await quadraticExtension.createElement(
            { value: 1 }, { value: 2 }
        );
        const x_c: QuadraticExtension.Zp_2StructOutput = await quadraticExtension.createElement(
            { value: 4 }, { value: 0 }
        );
        const x = await sexticExtension.createElement(
            toZp_2Struct(x_a), toZp_2Struct(x_b), toZp_2Struct(x_c)
        );

        // Creazione degli elementi Zp_2 per l'elemento y in Zp_6
        const y_a: QuadraticExtension.Zp_2StructOutput = await quadraticExtension.createElement(
            { value: 2 }, { value: 6 }
        );
        const y_b: QuadraticExtension.Zp_2StructOutput = await quadraticExtension.createElement(
            { value: 1 }, { value: 3 }
        );
        const y_c: QuadraticExtension.Zp_2StructOutput = await quadraticExtension.createElement(
            { value: 0 }, { value: 1 }
        );
        const y = await sexticExtension.createElement(
            toZp_2Struct(y_a), toZp_2Struct(y_b), toZp_2Struct(y_c)
        );

        // Moltiplicazione tra x e y
        const result = await sexticExtension.mul(toZp_6Struct(x), toZp_6Struct(y));

        // Risultati attesi
        const expected_a = await quadraticExtension.createElement({ value: 2 }, { value: 5 });
        const expected_b = await quadraticExtension.createElement({ value: 3 }, { value: 3 });
        const expected_c = await quadraticExtension.createElement({ value: 6 }, { value: 0 });

        // Assert: Verifica se il risultato della moltiplicazione è corretto
        expect(result.a.a.value).to.equal(expected_a.a.value);
        expect(result.a.b.value).to.equal(expected_a.b.value);

        expect(result.b.a.value).to.equal(expected_b.a.value);
        expect(result.b.b.value).to.equal(expected_b.b.value);

        expect(result.c.a.value).to.equal(expected_c.a.value);
        expect(result.c.b.value).to.equal(expected_c.b.value);
    });
});