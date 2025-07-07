import chai from "chai";
import UserRepository from "../../src/repository/users.repository.js";
import { userWithPets } from "../mocks/mock.user.test.js";

const expect = chai.expect;

describe("Testing User Repository", () => {
  const mockUser = userWithPets;
  let mockRepository;
  let userRepository;

  beforeEach(function () {
    mockRepository = {
      get: async () => [userWithPets],
      getBy: async (query) => {
        if (
          query._id === userWithPets._id ||
          query.email === userWithPets.email
        ) {
          return userWithPets;
        }
        return null;
      },
      save: async (data) => data,
      update: async (id, data) =>
        id === userWithPets._id ? { ...userWithPets, ...data } : null,
      delete: async (id) => (id === userWithPets._id ? userWithPets : null),
    };

    userRepository = new UserRepository(mockRepository);
  });

  it("Debe obtener todos los usuarios", async function () {
    const result = await userRepository.getAll();
    expect(result).to.be.an("array").with.length(1);
  });

  it("Debe obtener un usuario por ID", async function () {
    const result = await userRepository.getUserById(userWithPets._id);
    expect(result.email).to.equal(userWithPets.email);
  });

  it("Debe devolver null si el ID no existe", async function () {
    const result = await userRepository.getUserById("000");
    expect(result).to.be.null;
  });

  it("Debe crear un usuario correctamente", async function () {
    const result = await userRepository.create(userWithPets);
    expect(result.first_name).to.equal("Paula");
  });

  it("Debe actualizar un usuario", async function () {
    const result = await userRepository.update(userWithPets._id, {
      first_name: "Actualizada",
    });
    expect(result.first_name).to.equal("Actualizada");
  });

  it("Debe eliminar un usuario", async function () {
    const result = await userRepository.delete(userWithPets._id);
    expect(result.email).to.equal(userWithPets.email);
  });
});
