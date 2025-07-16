import chai from "chai";
import PetsRepository from "../../src/repository/pets.repository.js";
import { mockPetTwo, mockPetUpdate } from "../mocks/mock.adoption.test.js";

const expect = chai.expect;

describe("Testing Pets Repository", function () {
  const mockPet = mockPetTwo;
  const _id = mockPet._id;
  let mockRepository;
  let petsRepository;

  beforeEach(async function () {
    mockRepository = {
      get: async () => [mockPet],
      getBy: async (params) => (params._id === _id ? mockPet : null),
      save: async (doc) => ({ ...doc, _id }),
      update: async (id, doc) => (id === _id ? { ...mockPet, ...doc } : null),
      delete: async (id) => (id === _id ? mockPet : null),
    };

    petsRepository = new PetsRepository(mockRepository);
  });

  it("getAll devuelve un array de mascotas", async function () {
    const result = await petsRepository.getAll();
    expect(result).to.be.an("array").that.includes(mockPet);
  });

  it("getByID devuelve la mascota correcta", async function () {
    const result = await petsRepository.getById(_id);
    expect(result).to.eql(mockPet);
  });

  it("create guarda una nueva mascota", async function () {
    const result = await petsRepository.create(mockPet);
    expect(result).to.have.property("_id");
  });

  it("update debe actualizar una mascota existente", async function () {
    const result = await petsRepository.update(_id, mockPetUpdate);
    expect(result.name).to.equal(mockPetUpdate.name);
  });

  it("delete elimina una mascota existente", async function () {
    const result = await petsRepository.delete(_id);
    expect(result).to.eql(mockPet);
  });
});
