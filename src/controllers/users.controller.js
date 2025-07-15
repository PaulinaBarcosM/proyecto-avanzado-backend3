import mongoose from "mongoose";
import UsersDAO from "../dao/users.dao.js";
import UsersRepository from "../repository/users.repository.js";
import UserService from "../services/users.service.js";

const usersService = new UserService(new UsersRepository(new UsersDAO()));

// GET /api/users
const getAllUsers = async (req, res) => {
  try {
    const users = await usersService.getAll();
    req.logger.info("Se obtuvieron todos los usuarios");
    res.send({ status: "success", payload: users });
  } catch (error) {
    req.logger.error(`Error al obtener todos los usuarios: ${error.message}`);
    res
      .status(500)
      .send({ status: "error", error: "Error interno del servidor" });
  }
};

// GET /api/users/:uid
const getUser = async (req, res) => {
  try {
    const userId = req.params.uid;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      req.logger.warn(`ID inválido recibido: ${userId}`);
      return res.status(400).send({ status: "error", error: "ID inválido" });
    }

    const user = await usersService.getUserById(userId);
    if (!user) {
      req.logger.warn(`Usuario no encontrado: ID ${userId}`);
      return res.status(404).send({ status: "error", error: "User not found" });
    }
    req.logger.info(`Usuario obtenido: ID ${userId}`);
    res.send({ status: "success", payload: user });
  } catch (error) {
    req.logger.error(
      `Error al obtener usuario ${req.params.uid}: ${error.message}`
    );
    res
      .status(500)
      .send({ status: "error", error: "Error interno del servidor" });
  }
};

// PUT /api/users/:uid
const updateUser = async (req, res) => {
  try {
    const updateBody = req.body;
    const userId = req.params.uid;

    if (!updateBody.first_name || !updateBody.last_name || !updateBody.email) {
      req.logger.warn(
        `Faltan campos obligatorios para actualizar usuario: ${JSON.stringify(
          updateBody
        )}`
      );
      return res.status(400).send({
        status: "error",
        error: "Faltan campos obligatorios: first_name, last_name y email",
      });
    }

    const user = await usersService.getUserById(userId);
    if (!user) {
      req.logger.warn(
        `Intento de actualizar usuario inexistente: ID ${userId}`
      );
      return res.status(404).send({ status: "error", error: "User not found" });
    }
    const result = await usersService.updateUser(userId, updateBody);
    req.logger.info(`Usuario actualizado: ID ${userId}`);
    res.send({ status: "success", message: "User updated" });
  } catch (error) {
    req.logger.error(
      `Error al actualizar usuario ${req.params.uid}: ${error.message}`
    );
    res
      .status(500)
      .send({ status: "error", error: "Error interno del servidor" });
  }
};

// DELETE /api/users/:uid
const deleteUser = async (req, res) => {
  try {
    const userId = req.params.uid;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      req.logger.warn(`ID inválido recibido para delete: ${userId}`);
      return res.status(400).send({ status: "error", error: "ID inválido" });
    }

    const user = await usersService.getUserById(userId);
    if (!user) {
      req.logger.warn(`Intento de eliminar usuario inexistente: ID ${userId}`);
      return res.status(404).send({});
    }
    await usersService.deleteUser(userId);
    req.logger.info(`Usuario eliminado: ID ${userId}`);
    res.send({ status: "success", message: "User deleted" });
  } catch (error) {
    req.logger.error(
      `Error al eliminar usuario ${req.params.uid}: ${error.message}`
    );
    res
      .status(500)
      .send({ status: "error", error: "Error interno del servidor" });
  }
};

export default {
  deleteUser,
  getAllUsers,
  getUser,
  updateUser,
};
