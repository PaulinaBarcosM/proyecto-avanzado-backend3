import UsersRepository from "../repository/users.repository.js";
import UsersDAO from "../dao/users.dao.js";
import SessionsService from "../services/sessions.services.js";

const sessionsService = new SessionsService(
  new UsersRepository(new UsersDAO())
);

const register = async (req, res) => {
  try {
    const { first_name, last_name, email, password } = req.body;

    if (!first_name || !last_name || !email || !password) {
      req.logger.warn("Campos incompletos en registro");
      return res.status(400).send({ status: "error", error: "Faltan datos" });
    }

    const newUser = await sessionsService.register({
      first_name,
      last_name,
      email,
      password,
    });

    req.logger.info(`Usuario registrado con éxito: ${email}`);
    res.send({ status: "success", payload: newUser._id });
  } catch (error) {
    req.logger.error(`Error al registrar usuario: ${error.message}`);
    res.status(400).send({ status: "error", error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      req.logger.warn("Login con campos incompletos");
      return res
        .status(400)
        .send({ status: "error", error: "Faltan datos obligatorios" });
    }

    const token = await sessionsService.login(email, password);

    req.logger.info(`Login exitoso del usuario: ${email}`);
    res
      .cookie("coderCookie", token, { maxAge: 3600000 })
      .send({ status: "success", message: "Sesión iniciada correctamente" });
  } catch (error) {
    req.logger.error(`Error en login: ${error.message}`);
    res.status(400).send({ status: "error", error: error.message });
  }
};

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

export default {
  register,
  login,
  current,
};
