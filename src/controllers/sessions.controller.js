import { usersService } from "../services/index.js";
import { createHash, passwordValidation } from "../utils/index.js";
import jwt from "jsonwebtoken";
import UserDTO from "../dto/User.dto.js";

const register = async (req, res) => {
  try {
    const { first_name, last_name, email, password } = req.body;
    if (!first_name || !last_name || !email || !password) {
      req.logger.warn("Campos incompletos en registro");
      return res
        .status(400)
        .send({ status: "error", error: "Incomplete values" });
    }

    const exists = await usersService.getUserByEmail(email);
    if (exists) {
      req.logger.warn(`Intento de registrar un usuario ya existente: ${email}`);
      return res
        .status(400)
        .send({ status: "error", error: "User already exists" });
    }

    const hashedPassword = await createHash(password);
    const user = {
      first_name,
      last_name,
      email,
      password: hashedPassword,
    };
    const result = await usersService.create(user);

    req.logger.info(`Usuario registrado: ${email}`);
    res.send({ status: "success", payload: result._id });
  } catch (error) {
    req.logger.error(`Error al registrar usuario: ${error.message}`);
    res
      .status(500)
      .send({ status: "error", error: "Error interno del servidor" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      req.logger.warn("Login con campos incompletos");
      return res
        .status(400)
        .send({ status: "error", error: "Incomplete values" });
    }

    const user = await usersService.getUserByEmail(email);
    if (!user) {
      req.logger.warn(`Login fallido: usuario no existe (${email})`);
      return res
        .status(404)
        .send({ status: "error", error: "User doesn't exist" });
    }

    const isValidPassword = await passwordValidation(user, password);
    if (!isValidPassword) {
      req.logger.warn(`Login fallido: contraseña incorrecta (${email})`);
      return res
        .status(400)
        .send({ status: "error", error: "Incorrect password" });
    }

    const userDto = UserDTO.getUserTokenFrom(user);
    const token = jwt.sign(userDto, "tokenSecretJWT", { expiresIn: "1h" });

    req.logger.info(`Usuario logueado: ${email}`);
    res
      .cookie("coderCookie", token, { maxAge: 3600000 })
      .send({ status: "success", message: "Logged in" });
  } catch (error) {
    req.logger.error(`Error en login: ${error.message}`);
    res
      .status(500)
      .send({ status: "error", error: "Error interno del servidor" });
  }
};

const current = async (req, res) => {
  try {
    const cookie = req.cookies["coderCookie"];
    const user = jwt.verify(cookie, "tokenSecretJWT");
    res.send({ status: "success", payload: user });
  } catch (error) {
    req.logger.error(`Error al verificar usuario actual: ${error.message}`);
    res
      .status(401)
      .send({ status: "error", error: "Token inválido o expirado" });
  }
};

const unprotectedLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      req.logger.warn("Unprotected login con campos incompletos");
      return res
        .status(400)
        .send({ status: "error", error: "Incomplete values" });
    }

    const user = await usersService.getUserByEmail(email);
    if (!user) {
      req.logger.warn(`Unprotected login: usuario no encontrado (${email})`);
      return res
        .status(404)
        .send({ status: "error", error: "User doesn't exist" });
    }

    const isValidPassword = await passwordValidation(user, password);
    if (!isValidPassword) {
      req.logger.warn(`Unprotected login: contraseña incorrecta (${email})`);
      return res
        .status(400)
        .send({ status: "error", error: "Incorrect password" });
    }

    const token = jwt.sign(user, "tokenSecretJWT", { expiresIn: "1h" });

    req.logger.info(`Usuario logueado sin protección: ${email}`);
    res
      .cookie("unprotectedCookie", token, { maxAge: 3600000 })
      .send({ status: "success", message: "Unprotected Logged in" });
  } catch (error) {
    req.logger.error(`Error en unprotected login: ${error.message}`);
    res
      .status(500)
      .send({ status: "error", error: "Error interno del servidor" });
  }
};

const unprotectedCurrent = async (req, res) => {
  try {
    const cookie = req.cookies["unprotectedCookie"];
    const user = jwt.verify(cookie, "tokenSecretJWT");
    res.send({ status: "success", payload: user });
  } catch (error) {
    req.logger.error(
      `Error al verificar unprotected current: ${error.message}`
    );
    res
      .status(401)
      .send({ status: "error", error: "Token inválido o expirado" });
  }
};

export default {
  current,
  login,
  register,
  current,
  unprotectedLogin,
  unprotectedCurrent,
};
