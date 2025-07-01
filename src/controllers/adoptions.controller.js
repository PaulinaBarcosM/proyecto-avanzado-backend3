import mongoose from "mongoose";
import AdoptionDAO from "../dao/adoption.dao.js";
import AdoptionRepository from "../repository/adoption.repository.js";
import AdoptionService from "../services/adoption.service.js";
import PetsService from "../services/pets.service.js";
import UserService from "../services/users.service.js";

const adoptionService = new AdoptionService(
  new AdoptionRepository(new AdoptionDAO())
);

const getAllAdoptions = async (req, res) => {
  try {
    const result = await adoptionService.getAll();
    req.logger.info("Se obtuvieron todas las adopciones");
    res.send({ status: "success", payload: result });
  } catch (error) {
    req.logger.error(`Error al obtener adopciones: ${error.message}`);
    res
      .status(500)
      .send({ status: "error", error: "Error interno del servidor" });
  }
};

const getAdoption = async (req, res) => {
  try {
    const adoptionId = req.params.aid;

    if (!mongoose.Types.ObjectId.isValid(adoptionId)) {
      req.logger.warn(`ID de adopción inválido: ${adoptionId}`);
      return res.status(400).send({ status: "error", error: "ID inválido" });
    }

    const adoption = await adoptionService.getBy({ _id: adoptionId });
    if (!adoption) {
      req.logger.warn(`Adopción no encontrada: ID ${adoptionId}`);
      return res
        .status(404)
        .send({ status: "error", error: "Adoption not found" });
    }

    req.logger.info(`Adopción obtenida: ID ${adoptionId}`);
    res.send({ status: "success", payload: adoption });
  } catch (error) {
    req.logger.error(
      `Error al obtener adopción ${req.params.aid}: ${error.message}`
    );
    res
      .status(500)
      .send({ status: "error", error: "Error interno del servidor" });
  }
};

const createAdoption = async (req, res) => {
  try {
    const { uid, pid } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(uid) ||
      !mongoose.Types.ObjectId.isValid(pid)
    ) {
      req.logger.warn(
        `ID de usuario o mascota inválido. UID: ${uid} | PID: ${pid}`
      );
      return res.status(400).send({ status: "error", error: "ID inválido" });
    }

    const user = await usersService.getUserById(uid);
    if (!pet) {
      req.logger.warn(`Mascota no encontrada: ID ${pid}`);
      return res.status(404).send({ status: "error", error: "Pet not found" });
    }

    if (pet.adopted) {
      req.logger.warn(`Mascota ya adoptada: ID ${pid}`);
      return res
        .status(400)
        .send({ status: "error", error: "Pet is already adopted" });
    }

    user.pets.push(pet._id);
    await UserService.update(user._id, { pets: user.pets });
    await PetsService.update(pet._id, { adopted: true, owner: user._id });
    await AdoptionService.create({ owner: user._id, pet: pet._id });

    req.logger.info(`Mascota adoptada: Pet ${pet._id} por User ${user._id}`);
    res.send({ status: "success", message: "Pet adopted" });
  } catch (error) {
    req.logger.error(`Error al crear adopción: ${error.message}`);
    res
      .status(500)
      .send({ status: "error", error: "Error interno del servidor" });
  }
};

export default {
  createAdoption,
  getAllAdoptions,
  getAdoption,
};
