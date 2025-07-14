import UsersDTO from "../dto/users.dto.js";
import { createHash, passwordValidation } from "../utils/index.js";
import jwt from "jsonwebtoken";

class SessionsService {
  constructor(repository) {
    this.repository = repository;
  }

  async register(userData) {
    const existingUser = await this.repository.getUserByEmail(userData.email);
    if (existingUser) {
      throw new Error("El usuario ya existe");
    }

    const hashedPassword = await createHash(userData.password);
    const userToCreate = { ...userData, password: hashedPassword };
    const createdUser = await this.repository.create(userToCreate);
    return createdUser;
  }

  async login(email, password) {
    const user = await this.repository.getUserByEmail(email);
    console.log("Usuario encontrado en login:", user);
    if (!user) throw new Error("El usuario no existe");

    console.log("Password guardado en DB:", user.password);
    const isValidPassword = await passwordValidation(user.password, password);
    console.log("Validación de contraseña:", isValidPassword);
    if (!isValidPassword) throw new Error("Contraseña incorrecta");

    const userDto = UsersDTO.getUserTokenFrom(user);
    const token = jwt.sign(userDto, "tokenSecretJWT", { expiresIn: "1h" });
    return { token, user: userDto };
  }

  verifyToken(token) {
    return jwt.verify(token, "tokenSecretJWT");
  }
}

export default SessionsService;
