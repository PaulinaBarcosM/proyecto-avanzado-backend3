import UsersDTO from "../../src/dto/users.dto.js";
import { createHash, passwordValidation } from "../../src/utils/index.js";
import chai from "chai";
import {
  userForDTO,
  alteredUser,
  userWithPets,
} from "../mocks/mock.user.test.js";

const expect = chai.expect;

describe("Testing de utilidades y DTO de usuarios", () => {
  describe("Testing de contraseñas", () => {
    //aca quiero comparar la contraseña original con la que deberia ser
    it("Debe comparar la contraseña hasheada con la original", async function () {
      const mockUser = userForDTO;
      const hashedPassword = await createHash(mockUser.password);

      const user = { ...mockUser, password: hashedPassword };
      //que la contraeña hasheada de arriba sea igual a la contraseña hasheada que va a estar en la base de datos:
      const match = await passwordValidation(user, mockUser.password);
      expect(match).to.be.true; //yo voy a esperar que este match sea true
    });

    it("Debe fallar si la contraseña hasheada fue alterada", async function () {
      const mockUser = alteredUser;
      const hashedPassword = await createHash(mockUser.password);
      const alteredPassword = hashedPassword.slice(0, -1) + "X";

      const user = { ...mockUser, password: alteredPassword };

      const match = await passwordValidation(user, hashedPassword);
      expect(match).to.be.false;
    });
  });

  describe("Manejo de propiedades", () => {
    const mockUser = userWithPets;

    it("Debe cear instancia con propiedades correctas", async function () {
      const dto = new UsersDTO(mockUser);

      expect(dto.id).to.equal(mockUser._id);
      expect(dto.name).to.equal("Paula Barcos");
      expect(dto.email).to.equal(mockUser.email);
      expect(dto.role).to.equal(mockUser.role);
      expect(dto.pets).to.deep.equal(mockUser.pets);
    });

    it("Debe manejar cuando no vienen mascotas", async function () {
      const userWithoutPets = { ...mockUser, pets: undefined };
      const dto = new UsersDTO(userWithoutPets);

      expect(dto.pets).to.be.an("array").that.is.empty;
    });

    it("Debe devolver objeto con name, role y email", async function () {
      const tokenData = UsersDTO.getUserTokenFrom(mockUser);

      expect(tokenData).to.deep.equal({
        name: "Paula Barcos",
        role: "user",
        email: "paula@correo.com",
      });
    });
  });
});
