import UsersRepository from "../repository/users.repository.js";
import UsersDAO from "../dao/users.dao.js";
import SessionsService from "../services/sessions.service.js";
import UsersService from "../services/users.service.js";

const sessionsService = new SessionsService(
  new UsersRepository(new UsersDAO())
);

const usersService = new UsersService(new UsersRepository(new UsersDAO()));

// REGISTER
const register = async (req, res) => {
  try {
    const { first_name, last_name, email, password } = req.body;

    if (!first_name || !last_name || !email || !password) {
      req.logger.warn("Campos incompletos en registro");
      return res.status(400).send({ status: "error", error: "Faltan datos" });
    }

    const createdUser = await sessionsService.register({
      first_name,
      last_name,
      email,
      password,
    });

    const rawUser = await usersService.getUserById(createdUser._id);

    req.logger.info(`Usuario registrado con éxito: ${email}`);
    res.send({ status: "success", payload: rawUser });
  } catch (error) {
    req.logger.error(`Error al registrar usuario: ${error.message}`);
    res.status(500).send({ status: "error", error: error.message });
  }
};

// LOGIN
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      req.logger.warn("Login con campos incompletos");
      return res
        .status(400)
        .send({ status: "error", error: "Faltan datos obligatorios" });
    }

    const { token, user } = await sessionsService.login(email, password);

    req.logger.info(`Login exitoso del usuario: ${email}`);
    res.cookie("coderCookie", token, { maxAge: 3600000 }).send({
      status: "success",
      message: "Sesión iniciada correctamente",
      data: { token, user },
    });
  } catch (error) {
    req.logger.error(`Error en login: ${error.message}`);
    res.status(400).send({ status: "error", error: error.message });
  }
};

// CURRENT
const current = async (req, res) => {
  try {
    const cookie = req.cookies["coderCookie"];
    const user = sessionsService.verifyToken(cookie);
    res.send({ status: "success", payload: user });
  } catch (error) {
    req.logger.error(`Error al obtener usuario actual: ${error.message}`);
    res
      .status(401)
      .send({ status: "error", error: "Token inválido o expirado" });
  }
};

// UNPROTECTED LOGIN
const unprotectedLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      req.logger.warn("Unprotected login con campos incompletos");
      return res
        .status(400)
        .send({ status: "error", error: "Valores incompletos" });
    }

    const { token } = await sessionsService.login(email, password);
    req.logger.info(`Usuario logueado sin protección: ${email}`);
    res
      .cookie("unprotectedCookie", token, { maxAge: 3600000 })
      .send({ status: "success", message: "Unprotected Logged in" });
  } catch (error) {
    req.logger.error(`Error en unprotected login: ${error.message}`);
    res.status(400).send({ status: "error", error: error.message });
  }
};

// UNPROTECTED CURRENT
const unprotectedCurrent = async (req, res) => {
  try {
    const cookie = req.cookies["unprotectedCookie"];
    const user = sessionsService.verifyToken(cookie);
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
  register,
  login,
  current,
  unprotectedLogin,
  unprotectedCurrent,
};
