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
    if (!user) throw new Error("El usuario no existe");

    const isValidPassword = await passwordValidation(password, user.password);
    if (!isValidPassword) throw new Error("Contraseña incorrecta");

    const tokenPayload = {
      _id: user._id,
      name: `${user.first_name} ${user.last_name}`,
      role: user.role,
      email: user.email,
    };
    const token = jwt.sign(tokenPayload, "tokenSecretJWT", { expiresIn: "1h" });

    return { token, user };
  }

  verifyToken(token) {
    return jwt.verify(token, "tokenSecretJWT");
  }
}

export default SessionsService;
