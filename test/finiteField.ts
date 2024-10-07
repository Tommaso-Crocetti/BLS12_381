import { ethers } from "hardhat"; // Importa ethers da Hardhat
import { expect } from "chai"; // Per i test con Chai
import { FiniteField, FiniteField__factory} from "../typechain-types/"; // Assicurati che il percorso sia corretto

function toZpStruct(output: FiniteField.ZpStructOutput): FiniteField.ZpStruct {
    return { value: output.value }; // Restituisce un oggetto con la proprietà value
}


describe("FiniteField Contract", function () {
  let finiteField: FiniteField;
  let elementA: FiniteField.ZpStructOutput;
  let elementB: FiniteField.ZpStructOutput;

  beforeEach(async function () {
    const FiniteFieldFactory: FiniteField__factory = await ethers.getContractFactory("FiniteField") as FiniteField__factory;
    finiteField = await FiniteFieldFactory.deploy(7);
    elementA = await finiteField.createElement(3);
    elementB = await finiteField.createElement(5);
  });

  it("should create field elements correctly", async function () {

    expect(elementA.value).to.equal(3);
    expect(elementB.value).to.equal(5);
  });

  it("should add elements correctly", async function () {

    const sum: FiniteField.ZpStructOutput = await finiteField.sum(toZpStruct(elementA), toZpStruct(elementB));
    expect(sum.value).to.equal(1); // (3 + 5) mod 7 = 1
  });

  it("should subtract elements correctly", async function () {

    const diff: FiniteField.ZpStructOutput = await finiteField.sub(toZpStruct(elementA), toZpStruct(elementB));
    expect(diff.value).to.equal(5); // (3 - 5 + 7) mod 7 = 5
  });

  it("should multiply elements correctly", async function () {

    const prod: FiniteField.ZpStructOutput = await finiteField.mul(toZpStruct(elementA), toZpStruct(elementB));
    expect(prod.value).to.equal(1); // (3 * 5) mod 7 = 15 mod 7 = 1
  });
  it("should calculate the inverse correctly", async function () {
    const elementA: FiniteField.ZpStructOutput = await finiteField.createElement(3);
    const inv: FiniteField.ZpStructOutput = await finiteField.inverse(toZpStruct(elementA));
    expect(inv.value).to.equal(5);
  })

  it("should divide elements correctly", async function () {

    const div: FiniteField.ZpStructOutput = await finiteField.div(toZpStruct(elementA), toZpStruct(elementB));
    expect(div.value).to.equal(2); // 3 / 5 = 3 * inv(5) mod 7 => inv(5) = 3 => (3 * 3) mod 7 = 9 mod 7 = 2
  });

  it("should revert on division by zero", async function () {
    const elementA: FiniteField.ZpStructOutput = await finiteField.createElement(3);
    const elementB: FiniteField.ZpStructOutput = await finiteField.createElement(0);
    await expect(finiteField.div(toZpStruct(elementA), toZpStruct(elementB))).to.be.revertedWith("Divisione per zero non permessa.");
  });
});
