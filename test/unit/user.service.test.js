import chai from "chai";
import UserService from "../../src/services/users.service.js";
import UsersDTO from "../../src/dto/users.dto.js";
import { userWithPets, userUpdateService } from "../mocks/mock.user.test.js";

const expect = chai.expect;

describe("Testing User Service", function () {
  const mockUser = userWithPets;
  const _id = mockUser._id;
  let mockRepository;
  let userService;

  beforeEach(function () {
    mockRepository = {
      getAll: async () => [mockUser],
      getUserById: async (id) => (id === _id ? mockUser : null),
      getUserByEmail: async (email) =>
        email === mockUser.email ? mockUser : null,
      getRawUserByEmail: async () => mockUser,
      create: async () => mockUser,
      update: async (id) =>
        id === _id ? { ...mockUser, ...userUpdateService } : null,
      delete: async (id) => (id === _id ? mockUser : null),
    };

    userService = new UserService(mockRepository);
  });

  it("Debe retornar todos los usuarios como DTO", async function () {
    const result = await userService.getAll();
    expect(result).to.be.an("array").with.length(1);
    expect(result[0]).to.have.property("email", "paula@correo.com");
  });

  it("Debe obtener un usuario por ID como DTO", async function () {
    const result = await userService.getUserById(_id);
    expect(result).to.have.property("email", "paula@correo.com");
  });

  it("Debe devolver null si el usuario por ID no existe", async function () {
    const result = await userService.getUserById("00000");
    expect(result).to.be.null;
  });

  it("Debe obtener un usuario por email com DTO", async function () {
    const result = await userService.getUserByEmail("paula@correo.com");
    expect(result).to.have.property("email", "paula@correo.com");
  });

  it("Debe devolver null si el usuario por email no existe", async function () {
    const result = await userService.getUserByEmail("otra@correo.com");
    expect(result).to.be.null;
  });

  it("Debe obtener usuario crudo por email", async function () {
    const result = await userService.getRawUserByEmail("paula@correo.com");
    expect(result).to.have.property("email", "paula@correo.com");
  });

  it("Debe crear un nuevo usuario y devolver DTO", async function () {
    const result = await userService.createUser(userWithPets);
    expect(result).to.have.property("email", "paula@correo.com");
  });

  it("Debe crear un nuevo usuario y devolver DTO", async function () {
    const result = await userService.updateUser(_id, userUpdateService);
    expect(result).to.have.property("email", "nueva@correo.com");
    expect(result.name).to.equal("Actualizada Barcos");
  });

  it("Debe lanzar error si no se puede actualizar el usuario", async function () {
    try {
      await userService.updateUser("00000", userUpdateService);
    } catch (error) {
      expect(error.message).to.equal("User not found");
    }
  });

  it("Debe eliminar un usuario y devolverlo", async function () {
    const result = await userService.deleteUser(_id);
    expect(result).to.have.property("email", "paula@correo.com");
  });

  it("Debe lanzar error si no se puede eliminar el usuario", async function () {
    try {
      await userService.deleteUser("00000");
    } catch (error) {
      expect(error.message).to.equal("User not found");
    }
  });

  it("Debe devolver los datos del token desde el DTO", async function () {
    const result = userService.getUserTokenData(userWithPets);
    expect(result).to.deep.equal({
      _id: "abc123",
      name: "Paula Barcos",
      role: "user",
      email: "paula@correo.com",
    });
  });
});
