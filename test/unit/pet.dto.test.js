import chai from "chai";
import PetsDTO from "../../src/dto/pets.dto.js";

const expect = chai.expect;

describe("Testing Pets DTO", function () {
  it("El DTO transforma correctamente la mascota", async function () {
    const input = {
      name: "Luna",
      specie: "Perro",
      breed: "Labrador",
      color: "Negro",
      ageYears: "3",
      ageMonths: "6",
      image: "imagen.jpg",
    };

    const result = PetsDTO.getPetInputFrom(input);

    expect(result).to.eql({
      name: "Luna",
      specie: "Perro",
      breed: "Labrador",
      color: "Negro",
      age: { years: 3, months: 6 },
      image: "imagen.jpg",
      adopted: false,
    });
  });

  it("El DTO Asigna valores por defecto si faltan datos", async function () {
    const input = {};
    const result = PetsDTO.getPetInputFrom(input);

    expect(result).to.eql({
      name: "",
      specie: "",
      breed: "",
      color: "",
      age: { years: 0, months: 0 },
      image: "",
      adopted: false,
    });
  });
});
