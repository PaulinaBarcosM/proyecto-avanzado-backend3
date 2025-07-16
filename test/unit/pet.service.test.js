import chai from "chai";
import PetService from "../../src/services/pets.service.js";
import { mockPetTwo, mockPetUpdate } from "../mocks/mock.adoption.test.js";

const expect = chai.expect;

describe("Testing Pet Service", function () {
  const mockPet = mockPetTwo;
  const _id = mockPet._id;
  let mockRepository;
  let petsService;

  beforeEach(async function () {
    mockRepository = {
      getAll: async () => [mockPet],
      getById: async (id) => (id === _id ? mockPet : null),
      create: async (data) => ({ ...data, _id }),
      update: async (id, data) => (id === _id ? { ...mockPet, ...data } : null),
      delete: async (id) => (id === _id ? mockPet : null),
    };

    petsService = new PetService(mockRepository);
  });

  it("getAll debe devolver todas las mascotas", async function () {
    const result = await petsService.getAll();
    expect(result).to.be.an("array").that.includes(mockPet);
  });

  it("getById debe devolver mascosta con id válido", async function () {
    const result = await petsService.getById(_id);
    expect(result).to.eql(mockPet);
  });

  it("getById debe tirar error si el id es inválido", async function () {
    try {
      await petsService.getById("0000");
    } catch (error) {
      expect(error.message).to.equal("ID inválido");
    }
  });

  it("create debe crear una mascota", async function () {
    const result = await petsService.create(mockPet);
    expect(result).to.have.property("_id");
  });

  it("update debe actualizar mascota correctamente", async function () {
    const result = await petsService.update(_id, mockPetUpdate);
    expect(result.name).to.equal(mockPetUpdate.name);
  });

  it("update debe tirar error si el id es inválido", async function () {
    try {
      await petsService.update("0000", mockPetUpdate);
    } catch (error) {
      expect(error.message).to.equal("ID inválido");
    }
  });

  it("delete debe eliminar mascota correctamente", async function () {
    const result = await petsService.delete(_id);
    expect(result).to.eql(mockPet);
  });

  it("delete debe tirar error si el id es inválido", async function () {
    try {
      await petsService.delete("0000");
    } catch (error) {
      expect(error.message).to.equal("ID inválido");
    }
  });
});
