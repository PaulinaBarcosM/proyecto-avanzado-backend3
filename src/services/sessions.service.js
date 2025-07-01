import UsersDTO from "../dto/users.dto.js";
import { createHash, passwordValidation } from "../utils/index.js";
import jwt from "jsonwebtoken";

class SessionsService {
  constructor(repository) {
    this.repository = repository;
  }

  async register(userData) {
    const existingUser = await this.repository.getByEmail(userData.email);
    if (existingUser) {
      throw new Error("El usuario ya existe");
    }

    const hashedPassword = await createHash(userData.password);
    const userToCreate = { ...userData, password: hashedPassword };
    const createdUser = await this.repository.crete(userToCreate);
    return createdUser;
  }

  async login(email, password) {
    const user = await this.repository.getByEmail(email);
    if (!user) throw new Error("El usuario no existe");

    const isValidPassword = await passwordValidation(user, password);
    if (!isValidPassword) throw new Error("Contraseña incorrecta");

    const userDto = UsersDTO.getUserTokenFrom(user);
    const token = jwt.sign(userDto, "tokenSecretJWT", { expiresIn: "1h" });
    return token;
  }

  verifyToken(token) {
    return jwt.verify(token, "tokenSecretJWT");
  }
}

export default SessionsService;
